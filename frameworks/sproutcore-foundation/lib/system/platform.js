// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global jQuery*/

require('sproutcore-foundation/system/browser');
require('sproutcore-foundation/system/ready');

/**
  A constant indicating an unsupported method, property or other.

  @static
  @constant
*/
SC.UNSUPPORTED = '_sc_unsupported';


/** @class

  This platform object allows you to conditionally support certain HTML5
  features.

  Rather than relying on the user agent, it detects whether the given elements
  and events are supported by the browser, allowing you to create much more
  robust apps.
*/
SC.Platform = SC.Object.extend({
  browser: null,

  setup: function () {
    this.touch = (!SC.none(window.ontouchstart) || this.browser.name === SC.BROWSER.android || 'ontouchstart' in document.documentElement) && SC.none(window._phantom),
    this.bounceOnScroll = this.browser.os === SC.OS.ios;
    this.pinchToZoom = this.browser.os === SC.OS.ios;
    this.cssPrefix = this.browser.cssPrefix;
    this.domCSSPrefix = this.browser.domPrefix;
    this.supportsCSSAnimations = this.browser.experimentalStyleNameFor('animation') !== SC.UNSUPPORTED;
    this.supportsCSSTransitions = this.browser.experimentalStyleNameFor('transition') !== SC.UNSUPPORTED;
    this.supportsCSSTransforms = this.browser.experimentalStyleNameFor('transform') !== SC.UNSUPPORTED;
    this.supportsCSS3DTransforms = this.browser.experimentalStyleNameFor('perspective') !== SC.UNSUPPORTED;
    this.standalone = !!navigator.standalone;
    this.supportsApplicationCache = ('applicationCache' in window);
    this.supportsHashChange = ('onhashchange' in window) && (document.documentMode === undefined || document.documentMode > 7);
    this.supportsHistory = !!(window.history && window.history.pushState);
    this.supportsIndexedDB = !!(window.indexedDB || window[this.browser.domPrefix + 'IndexedDB']);
    this.supportsCanvas = !!document.createElement('canvas').getContext;
    this.supportsXHR2ProgressEvent = ('ProgressEvent' in window);
    this.supportsXHR2FormData = ('FormData' in window);
    this.supportsXHR2LoadEndEven = (new XMLHttpRequest).onloadend === null;
    this.supportsOrientationChange = ('onorientationchange' in window);
    this.supportsWebSQL = ('openDatabase' in window);
    this.windowSizeDeterminesOrientation = this.browser.os === SC.OS.ios || !('onorientationchange' in window),
    this.cordova = (typeof window.cordova !== "undefined")
  }.on('init'),

  runTests: function () {
    var browser = this.browser;
    var platform = this;

    var executeTest = function (el, standardEventName, capitalizedEventName, cleanUpFunc) {
      var domPrefix = browser.domPrefix,
        lowerDomPrefix = domPrefix.toLowerCase(),
        eventNameKey = standardEventName + 'EventName',
        callback = function (evt) {
          var domPrefix = browser.domPrefix,
            lowerDomPrefix = domPrefix.toLowerCase(),
            eventNameKey = standardEventName + 'EventName';

          // Remove all the event listeners.
          el.removeEventListener(standardEventName, callback, NO);
          el.removeEventListener(lowerDomPrefix + standardEventName, callback, NO);
          el.removeEventListener(lowerDomPrefix + capitalizedEventName, callback, NO);
          el.removeEventListener(domPrefix + capitalizedEventName, callback, NO);

          // The cleanup timer re-uses this function and doesn't pass evt.
          if (evt) {
            platform[eventNameKey] = evt.type;

            // Don't allow the event to bubble, because SC.RootResponder will be
            // adding event listeners as soon as the testing is complete.  It is
            // important that SC.RootResponder's listeners don't catch the last
            // test event.
            evt.stopPropagation();
          }

          // Call the clean up function, pass in success state.
          if (cleanUpFunc) { cleanUpFunc(!!evt); }
        };

      // Set the initial value as unsupported.
      platform[eventNameKey] = SC.UNSUPPORTED;

      // Try the various implementations.
      // ex. transitionend, webkittransitionend, webkitTransitionEnd, WebkitTransitionEnd
      el.addEventListener(standardEventName, callback, NO);
      el.addEventListener(lowerDomPrefix + standardEventName, callback, NO);
      el.addEventListener(lowerDomPrefix + capitalizedEventName, callback, NO);
      el.addEventListener(domPrefix + capitalizedEventName, callback, NO);
    };

    // Set up and execute the transition event test.
    if (platform.supportsCSSTransitions) {
      var transitionEl = document.createElement('div'),
        transitionStyleName = browser.experimentalStyleNameFor('transition', 'all 1ms linear');

      transitionEl.style[transitionStyleName] = 'all 1ms linear';

      // Test transition events.
      executeTest(transitionEl, 'transitionend', 'TransitionEnd', function (success) {
        // If an end event never fired, we can't really support CSS transitions in SproutCore.
        if (success) {
          // Set up the SC transition event listener. TODO: do this on initialize instead
          // SC.RootResponder.responder.cleanUpTransitionListeners();
        } else {
          platform.supportsCSSTransitions = NO;
        }

        transitionEl.parentNode.removeChild(transitionEl);
        transitionEl = null;
      });

      // Append the test element.
      document.documentElement.appendChild(transitionEl);

      // Break execution to allow the browser to update the DOM before altering the style.
      setTimeout(function () {
        transitionEl.style.opacity = '0';
      });

      // Set up and execute the animation event test.
      if (platform.supportsCSSAnimations) {
        var animationEl = document.createElement('div'),
          keyframes,
          prefixedKeyframes;

        // Generate both the regular and prefixed version of the style.
        keyframes = '@keyframes _sc_animation_test { from { opacity: 1; } to { opacity: 0; } }';
        prefixedKeyframes = '@' + browser.cssPrefix + 'keyframes _sc_prefixed_animation_test { from { opacity: 1; } to { opacity: 0; } }';

        // Add test animation styles.
        animationEl.innerHTML = '<style>' + keyframes + '\n' + prefixedKeyframes + '</style>';

        // Set up and execute the animation event test.
        animationEl.style.animation = '_sc_animation_test 1ms linear';
        animationEl.style[browser.domPrefix + 'Animation'] = '_sc_prefixed_animation_test 5ms linear';

        // NOTE: We could test start, but it's extra work and easier just to test the end
        // and infer the start event name from it.  Keeping this code for example.
        // executeTest(animationEl, 'animationstart', 'AnimationStart', function (success) {
        //   // If an iteration start never fired, we can't really support CSS transitions in SproutCore.
        //   if (!success) {
        //     SC.platform.supportsCSSAnimations = NO;
        //   }
        // });

        // NOTE: Testing iteration event support proves very problematic.  Many
        // browsers can't iterate less than several milliseconds which means we
        // have to wait too long to find out this event name.  Instead we test
        // the end only and infer the iteration event name from it. Keeping this
        // code for example, but it wont' work reliably unless the animation style
        // is something like '_sc_animation_test 30ms linear' (i.e. ~60ms wait time)
        // executeTest(animationEl, 'animationiteration', 'AnimationIteration', function (success) {
        //   // If an iteration event never fired, we can't really support CSS transitions in SproutCore.
        //   if (!success) {
        //     SC.platform.supportsCSSAnimations = NO;
        //   }
        // });

        // Test animation events.
        executeTest(animationEl, 'animationend', 'AnimationEnd', function (success) {
          // If an end event never fired, we can't really support CSS animations in SproutCore.
          if (success) {
            // Infer the start and iteration event names based on the success of the end event.
            var domPrefix = browser.domPrefix,
              lowerDomPrefix = domPrefix.toLowerCase(),
              endEventName = platform.animationendEventName;

            switch (endEventName) {
            case lowerDomPrefix + 'animationend':
              platform.animationstartEventName = lowerDomPrefix + 'animationstart';
              platform.animationiterationEventName = lowerDomPrefix + 'animationiteration';
              break;
            case lowerDomPrefix + 'AnimationEnd':
              platform.animationstartEventName = lowerDomPrefix + 'AnimationStart';
              platform.animationiterationEventName = lowerDomPrefix + 'AnimationIteration';
              break;
            case domPrefix + 'AnimationEnd':
              platform.animationstartEventName = domPrefix + 'AnimationStart';
              platform.animationiterationEventName = domPrefix + 'AnimationIteration';
              break;
            default:
              platform.animationstartEventName = 'animationstart';
              platform.animationiterationEventName = 'animationiteration';
            }

            // Set up the SC animation event listeners. TODO: do this on initialize instead
            // SC.RootResponder.responder.cleanUpAnimationListeners();
          } else {
            platform.supportsCSSAnimations = NO;
          }

          // Clean up.
          animationEl.parentNode.removeChild(animationEl);
          animationEl = null;
        });

        // Break execution to allow the browser to update the DOM before altering the style.
        document.documentElement.appendChild(animationEl);
      }
    }
  }.on('init'),

  /**
    The size of scrollbars in this browser.

    @type Number
  */

  scrollbarSize: function () {
    var tester = document.createElement("DIV"),
        child;
    tester.innerHTML = "<div style='height:1px;'></div>";
    tester.style.cssText = "position:absolute;width:100px;height:100px;overflow-y:visible;";

    child = tester.childNodes[0];
    document.body.appendChild(tester);
    var noScroller = child.innerWidth || child.clientWidth;
    tester.style.overflowY = 'scroll';
    var withScroller = child.innerWidth || child.clientWidth;
    document.body.removeChild(tester);

    return noScroller - withScroller;
  }.property().cacheable(),


  /*
    NOTES
     - Chrome would incorrectly indicate support for touch events.  This has been fixed:
       http://code.google.com/p/chromium/issues/detail?id=36415
     - Android is assumed to support touch, but incorrectly reports that it does not.
     - See: https://github.com/Modernizr/Modernizr/issues/84 for a discussion on detecting
       touch capability.
     - See: https://github.com/highslide-software/highcharts.com/issues/1331 for a discussion
       about why we need to check if ontouchstart is null in addition to check if it's defined
     - The test for window._phantom provides support for phantomjs, the headless WebKit browser
       used in Travis-CI, and which incorredtly (see above) identifies itself as a touch browser.
       For more information on CI see https://github.com/sproutcore/sproutcore/pull/1025
       For discussion of the phantomjs touch issue see https://github.com/ariya/phantomjs/issues/10375
  */

  /**
    A hash that contains properties that indicate support for new HTML5
    input attributes.

    For example, to test to see if the placeholder attribute is supported,
    you would verify that SC.platform.input.placeholder is YES.

    @type Array
  */
  input: function (attributes) {
    var ret = {},
        len = attributes.length,
        elem = document.createElement('input'),
        attr, idx;

    for (idx = 0; idx < len; idx++) {
      attr = attributes[idx];

      ret[attr] = !!(attr in elem);
    }

    return ret;
  }(['autocomplete', 'readonly', 'list', 'size', 'required', 'multiple', 'maxlength',
        'pattern', 'min', 'max', 'step', 'placeholder',
        'selectionStart', 'selectionEnd', 'selectionDirection']),

  /**
    YES if the application is currently running as a standalone application.

    For example, if the user has saved your web application to their home
    screen on an iPhone OS-based device, this property will be true.

    @type Boolean
  */

});

/** @private
  Test the transition and animation event names of this platform.  We could hard
  code event names into the framework, but at some point things would change and
  we would get it wrong.  Instead we perform actual tests to find out the proper
  names and only add the proper listeners.

  Once the tests are completed the RootResponder is notified in order to clean up
  unnecessary transition and animation event listeners.
*/
