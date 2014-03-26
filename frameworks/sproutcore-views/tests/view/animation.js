// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ========================================================================
// View Animation Unit Tests
// ========================================================================
/*global module, test, ok, equals, stop, start, expect*/


/* These unit tests verify:  animate(). */
var view, pane, originalSupportsTransitions = SC.Platform.create({browser: SC.browser}).supportsCSSTransitions;

function styleFor(view) {
  return view.get('layer').style;
}

function transitionFor(view) {
  return styleFor(view)[SC.browser.experimentalStyleNameFor('transition')];
}

var commonSetup = {
  setup: function (q, wantsAcceleratedLayer) {
    SC.run(function () {
      pane = SC.Pane.create({
        rootResponder: rootResponder(),
        backgroundColor: '#ccc',
        layout: { top: 0, right: 0, width: 200, height: 200, zIndex: 100 }
      });
      pane.append();

      view = SC.View.create({
        backgroundColor: '#888',
        layout: { left: 0, top: 0, height: 100, width: 100 },
        wantsAcceleratedLayer: wantsAcceleratedLayer === true || NO
      });

      pane.appendChild(view);
    });
  },

  teardown: function () {
    pane.remove();
    pane.destroy();
  }
};

if (SC.Platform.create({browser: SC.browser}).supportsCSSTransitions) {

  module("ANIMATION", commonSetup);

  asyncTest("should work", function () {
    expect(2);

    setTimeout(function () {
      equal(transitionFor(view), 'left 1s ease 0s', 'add transition');
      equal(100, view.get('layout').left, 'left is 100');

      start();
    }, 50);

    SC.run(function () {
      view.animate('left', 100, { duration: 1 });
    });
  });

  asyncTest("animate + adjust: no conflict", function () {
    expect(8);

    setTimeout(function () {
      equal(view.get('layout').left, 100, 'left is');
      equal(view.get('layout').top, 100, 'top is');
      equal(view.get('layout').right, 100, 'right is');
      equal(view.get('layout').width, undefined, 'width is');

      setTimeout(function () {
        equal(view.get('layout').left, 0, 'left is');
        equal(view.get('layout').top, 200, 'top is');
        equal(view.get('layout').right, undefined, 'right is');
        equal(view.get('layout').width, 100, 'width is');

        start();
      }, 200);

      SC.run(function () {
        view.animate('top', 200, { duration: 0.1 });
        view.adjust('left', 0);
        view.adjust({ 'width': 100, 'right': null });
      });
    }, 200);

    SC.run(function () {
      view.animate('left', 100, { duration: 0.1 });
      view.adjust('top', 100);
      view.adjust({ 'width': null, 'right': 100 });
    });
  });

  asyncTest("animate + adjust: conflict", function () {
    expect(2);

    setTimeout(function () {
      equal(view.get('layout').left, 200, 'left is');

      SC.run(function () {
        view.animate('top', 200, { duration: 0.1 });
        // Adjust back to current value should still cancel the animation.
        view.adjust('top', 0);
      });

      setTimeout(function () {
        equal(view.get('layout').top, 0, 'top is');

        start();
      }, 200);
    }, 200);

    SC.run(function () {
      view.animate('left', 100, { duration: 0.1 });
      view.adjust('left', 200);
    });
  });

  // asyncTest("callbacks work in general", function () {
  //   expect(2);
  //
  //   SC.run(function () {
  //     view.animate('left', 100, { duration: 0.5 }, function testCallback () {
  //       ok(true, "Callback was called.");
  //       ok(view == this, "`this` should be the view");
  //       start();
  //     });
  //   });
  // });

  // asyncTest("callbacks work in general with target method", function () {
  //   expect(2);
  //
  //   var ob = SC.Object.createWithMixins({
  //     callback: function () {
  //       ok(true, "Callback was called.");
  //       equal(ob, this, "`this` should be the target object");
  //
  //       start();
  //     }
  //   });
  //
  //   SC.run(function () {
  //     view.animate('left', 100, { duration: 0.5 }, ob, 'callback');
  //   });
  // });
  //
  // asyncTest("callbacks should have appropriate data", function () {
  //   // stop(2000);
  //   expect(3)
  //
  //   SC.run(function () {
  //     view.animate('left', 100, { duration: 0.5 }, function (data) {
  //       // TODO: Test this better
  //       ok(data.event, "has event");
  //       equal(data.view, view, "view is correct");
  //       equal(data.isCancelled, false, "animation is not cancelled");
  //
  //       start();
  //     });
  //   });
  // });

  asyncTest("handles delay function string", function () {
    // stop(2000);

    SC.run(function () {
      view.animate('left', 100, { duration: 1, delay: 1 });
    });

    setTimeout(function () {
      equal(transitionFor(view), 'left 1s ease 1s', 'uses delay');

      start();
    }, 5);
  });

  asyncTest("handles timing function string", function () {
    // stop(2000);

    SC.run(function () {
      view.animate('left', 100, { duration: 1, timing: 'ease-in' });
    });

    setTimeout(function () {
      equal(transitionFor(view), 'left 1s ease-in 0s', 'uses ease-in timing');

      start();
    }, 5);
  });

  asyncTest("handles timing function array", function () {
    // stop(2000);

    SC.run(function () {
      view.animate('left', 100, { duration: 1, timing: [0.1, 0.2, 0.3, 0.4] });
    });

    setTimeout(function () {
      equal(transitionFor(view), 'left 1s cubic-bezier(0.1, 0.2, 0.3, 0.4) 0s', 'uses cubic-bezier timing');

      start();
    }, 5);
  });

  asyncTest("should allow multiple keys to be set at once", function () {
    // stop(2000);

    SC.run(function () {
      view.animate({ top: 100, left: 100 }, { duration: 1 });
    });

    setTimeout(function () {
      equal(transitionFor(view), 'top 1s ease 0s, left 1s ease 0s', 'should add transition');
      equal(100, view.get('layout').top, 'top is 100');
      equal(100, view.get('layout').left, 'left is 100');

      start();
    }, 5);
  });

  asyncTest("should not animate any keys that don't change", function () {
    // stop(2000);

    SC.run(function () {
      view.animate({ top: 0, left: 100 }, { duration: 1 });
    });

    setTimeout(function () {
      equal(transitionFor(view), 'left 1s ease 0s', 'should only add left transition');
      equal(0, view.get('layout').top, 'top is 0');
      equal(100, view.get('layout').left, 'left is 100');

      start();
    }, 5);
  });

  asyncTest("animating height with a centerY layout should also animate margin-top", function () {
    expect(3);

    setTimeout(function () {
      equal(transitionFor(view), 'height 1s ease 0s, margin-top 1s ease 0s', 'should add height and margin-top transitions');
      equal(view.get('layout').height, 10, 'height');
      equal(view.get('layout').centerY, 0, 'centerY');

      start();
    }, 50);

    SC.run(function () {
      view.adjust({ top: null, centerY: 0 });
      view.animate({ height: 10 }, { duration: 1 });
    });
  });

  asyncTest("animating width with a centerX layout should also animate margin-left", function () {
    // stop(2000);

    SC.run(function () {
      view.adjust({ left: null, centerX: 0 });
      view.animate({ width: 10 }, { duration: 1 });
    });

    setTimeout(function () {
      equal(transitionFor(view), 'width 1s ease 0s, margin-left 1s ease 0s', 'should add width and margin-left transitions');
      equal(view.get('layout').width, 10, 'width');
      equal(view.get('layout').centerX, 0, 'centerX');

      start();
    }, 5);
  });

  // Pretty sure this does the job
  // asyncTest("callbacks should be called only once for a grouped animation", function () {
  //   // stop(2000);
  //   var stopped = true;
  //
  //   expect(1);
  //
  //   SC.run(function () {
  //     view.animate({ top: 100, left: 100, width: 400 }, { duration: 0.5 }, function () {
  //       ok(stopped, 'callback called back');
  //       if (stopped) {
  //         stopped = false;
  //         // Continue on in a short moment.  Before the test times out, but after
  //         // enough time for a second callback to possibly come in.
  //         setTimeout(function () {
  //           start();
  //         }, 200);
  //       }
  //     });
  //   });
  // });

  // This behavior should be up for debate.  Does the callback call immediately, or does it wait until the end of
  // the specified animation period?  Currently we're calling it immediately.
  asyncTest("callback should be called immediately when a property is animated to its current value.", function () {
    // stop(2000);

    expect(1);

    SC.run(function () {
      view.animate('top', view.get('layout.top'), { duration: 0.5 }, function () {
        ok(true, 'callback called back');

        start();
      });
    });
  });

  asyncTest("callback should be called when a property is animated with a duration of zero.", function () {
    // stop(2000);

    expect(1);

    SC.run(function () {
      view.animate('top', 20, { duration: 0 }, function () {
        ok(true, 'callback called back');
        start();
      });
    });
  });

  // asyncTest("multiple animations should be able to run simultaneously", function () {
  //   // stop(2000);
  //
  //   expect(2);
  //
  //   SC.run(function () {
  //     view.animate('top', 100, { duration: 0.25 }, function () {
  //       console.log('NUMERO UNO')
  //       ok(true, 'top finished');
  //     });
  //
  //     view.animate('left', 100, { duration: 0.5 }, function () {
  //       ok(true, 'left finished');
  //       start();
  //     });
  //   });
  // });

  // asyncTest("altering existing animation should call callback as cancelled", function () {
  //   // stop(2000);
  //
  //   var order = 0;
  //   expect(6);
  //
  //   SC.run(function () {
  //     view.animate('top', 100, { duration: 0.5 }, function (data) {
  //       // Test the order to ensure that this is the proper callback that is used.
  //       equal(order, 0, 'should be called first');
  //       order = 1;
  //       equal(data.isCancelled, true, 'first cancelled');
  //     });
  //
  //     // Test calling animate twice in the same run loop.
  //     view.animate('top', 100, { duration: 0.75 }, function (data) {
  //       // Test the order to ensure that this is the proper callback that is used.
  //       equal(order, 1, 'should be called second');
  //       order = 2;
  //       equal(data.isCancelled, true, 'second cancelled');
  //     });
  //   });
  //
  //   setTimeout(function () {
  //     SC.run(function () {
  //       view.animate('top', 0, { duration: 0.75 }, function (data) {
  //         // Test the order to ensure that this is the proper callback that is used.
  //         equal(order, 2, 'should be called third');
  //         equal(data.isCancelled, false, 'third not cancelled');
  //         start();
  //       });
  //     });
  //   }, 100);
  // });

  asyncTest("should not cancel callback when value hasn't changed", function () {
    expect(3);
    var callbacks = 0, wasCancelled = null, check = 0;

    setTimeout(function () {
      // capture the callbacks value
      check = callbacks;
    }, 250);

    setTimeout(function () {
      equal(check, 0, "the callback should not have been cancelled initially");
      equal(callbacks, 1, "the callback should have been fired");
      equal(wasCancelled, NO, "the callback should not have been cancelled");

      start();
    }, 1000);

    SC.run(function () {
      // this triggers the initial layoutStyle code
      view.animate('left', 79, { duration: 0.5 }, function (data) {
        callbacks++;
        wasCancelled = data.isCancelled;
      });

      // this triggers a re-render, re-running the layoutStyle code
      view.displayDidChange();
    });
  });

  // There was a bug in animation that once one property was animated, a null
  // version of it existed in _activeAnimations, such that when another property
  // was animated it would throw an exception iterating through _activeAnimations
  // and not expecting a null value.
  asyncTest("animating different attributes at different times should not throw an error", function () {
    // Run test.
    // stop(2000);

    expect(2);

    // Override and wrap the problematic method to capture the error.
    view.transitionDidEnd = function () {
      try {
        SC.View.prototype.transitionDidEnd.apply(this, arguments);
        ok(true);
      } catch (ex) {
        ok(false);
      }
    };

    SC.run(function () {
      view.animate('left', 75, { duration: 0.2 });
    });

    setTimeout(function () {
      SC.run(function () {
        view.animate('top', 50, { duration: 0.2 });
      });
    }, 400);

    setTimeout(function () {
      start();
    }, 1000);
  });

  asyncTest("should handle transform attributes", function () {
    // stop(2000);

    SC.run(function () {
      view.animate('rotateX', 45, { duration: 1 });
    });

    setTimeout(function () {
      equal(transitionFor(view), SC.browser.experimentalCSSNameFor('transform') + ' 1s ease 0s', 'add transition');
      equal(styleFor(view)[SC.browser.experimentalStyleNameFor('transform')], 'rotateX(45deg)', 'has both transforms');
      equal(45, view.get('layout').rotateX, 'rotateX is 45deg');

      start();
    }, 50);
  });

  asyncTest("should handle conflicting transform animations", function () {
    /*global console*/
    // stop(2000);

    var originalConsoleWarn = console.warn;
    console.warn = function (warning) {
      equal(warning, "Developer Warning: Can't animate transforms with different durations, timings or delays! Using the first options specified.", "proper warning");
    };

    SC.run(function () {
      view.animate('rotateX', 45, { duration: 1 }).animate('scale', 2, { duration: 2 });
    });

    setTimeout(function () {
      expect(5);

      equal(transitionFor(view), SC.browser.experimentalCSSNameFor('transform') + ' 1s ease 0s', 'use duration of first');
      equal(styleFor(view)[SC.browser.experimentalStyleNameFor('transform')], 'rotateX(45deg) scale(2)');
      equal(45, view.get('layout').rotateX, 'rotateX is 45deg');
      equal(2, view.get('layout').scale, 'scale is 2');

      console.warn = originalConsoleWarn;

      start();
    }, 25);
  });

  asyncTest("removes animation property when done", function () {
    // stop(2000);

    SC.run(function () {
      view.animate({ top: 100, scale: 2 }, { duration: 0.5 });
    });

    setTimeout(function () {
      equal(view.get('layout').animateTop, undefined, "animateTop is undefined");
      equal(view.get('layout').animateScale, undefined, "animateScale is undefined");

      start();
    }, 1000);
  });

  asyncTest("Test that cancelAnimation() removes the animation style and fires the callback with isCancelled set.", function () {
    expect(7);

    setTimeout(function () {
      setTimeout(function () {
        var style = styleFor(view);

        equal(style.left, '100px', 'Tests the left style after cancel');
        equal(style.top, '0px', 'Tests the top style after cancel');
        equal(transitionFor(view), '', 'Tests the CSS transition property');
        start();
      }, 50);

      SC.run(function () {
        var style = styleFor(view);

        equal(style.left, '100px', 'Tests the left style after animate');
        equal(style.top, '0px', 'Tests the top style after animate');
        equal(transitionFor(view), 'left 0.5s ease 0s', 'Tests the CSS transition property');
        view.cancelAnimation();
      });
    }, 5);

    SC.run(function () {
      view.animate({ left: 100 }, { duration: 0.5 }, function (data) {
        ok(data.isCancelled, "The isCancelled property of the data should be true.");
      });
    });
  });

  asyncTest("Test that cancelAnimation(SC.LayoutState.CURRENT) removes the animation style, stops at the current position and fires the callback with isCancelled set.", function () {
    // stop(2000);

    expect(9);

    SC.run(function () {
      view.animate({ left: 100, top: 100, width: 400 }, { duration: 0.5 }, function (data) {
        ok(data.isCancelled, "The isCancelled property of the data should be true.");
      });
    });

    setTimeout(function () {
      SC.run(function () {
        var style = styleFor(view);

        equal(style.left, '100px', 'Tests the left style after animate');
        equal(style.top, '100px', 'Tests the top style after animate');
        equal(style.width, '400px', 'Tests the width style after animate');
        equal(transitionFor(view), 'left 0.5s ease 0s, top 0.5s ease 0s, width 0.5s ease 0s', 'Tests the CSS transition property');
        view.cancelAnimation(SC.LayoutState.CURRENT);
      });
    }, 100);

    setTimeout(function () {
      var style = styleFor(view);

      ok((parseInt(style.left, 10) > 0) && (parseInt(style.left, 10) < 100), 'style.left (%@) should be between 10 and 100 exclusive'.fmt(style.left));
      ok((parseInt(style.top, 10) > 0) && (parseInt(style.top, 10) < 100), 'style.top (%@) should be between 10 and 100 exclusive'.fmt(style.top));
      ok((parseInt(style.width, 10) > 100) && (parseInt(style.width, 10) < 400), 'style.width (%@) should be between 100 and 400 exclusive'.fmt(style.width));
      equal(transitionFor(view), '', 'the css transition (%@) should be empty'.fmt(transitionFor(view)));
      start();
    }, 200);
  });

  asyncTest("Test that cancelAnimation(SC.LayoutState.START) removes the animation style, returns to the start position and fires the callback with isCancelled set.", function () {
    // stop(2000);

    expect(9);

    SC.run(function () {
      view.animate({ left: 100, top: 100, width: 400 }, { duration: 0.5 }, function (data) {
        ok(data.isCancelled, "The isCancelled property of the data should be true.");
      });
    });

    setTimeout(function () {
      SC.run(function () {
        var style = styleFor(view);

        equal(style.left, '100px', 'Tests the left style after animate');
        equal(style.top, '100px', 'Tests the top style after animate');
        equal(style.width, '400px', 'Tests the width style after animate');
        equal(transitionFor(view), 'left 0.5s ease 0s, top 0.5s ease 0s, width 0.5s ease 0s', 'Tests the CSS transition property');
        view.cancelAnimation(SC.LayoutState.START);
      });
    }, 100);

    setTimeout(function () {
      var style = styleFor(view);

      equal(style.left, '0px', 'Tests the left style after cancel');
      equal(style.top, '0px', 'Tests the top style after cancel');
      equal(style.width, '100px', 'Tests the width style after animate');
      equal(transitionFor(view), '', 'Tests the CSS transition property');
      start();
    }, 200);
  });

  if (SC.Platform.create({browser: SC.browser}).supportsCSS3DTransforms) {
    module("ANIMATION WITH ACCELERATED LAYER", {
      setup: function () {
        commonSetup.setup(null, YES);
      },

      teardown: commonSetup.teardown
    });

    asyncTest("handles acceleration when appropriate", function () {
      // stop(2000);

      SC.run(function () {
        view.animate('top', 100, { duration: 1 });
      });

      setTimeout(function () {
        equal(transitionFor(view), SC.browser.experimentalCSSNameFor('transform') + ' 1s ease 0s', 'transition is on transform');

        start();
      }, 5);
    });

    asyncTest("doesn't use acceleration when not appropriate", function () {
      // stop(1000);

      SC.run(function () {
        view.adjust({ height: null, bottom: 0 });
        view.animate('top', 100, { duration: 1 });
      });

      setTimeout(function () {
        equal(transitionFor(view), 'top 1s ease 0s', 'transition is not on transform');

        start();
      }, 5);
    });

    asyncTest("combines accelerated layer animation with compatible transform animations", function () {
      // stop(1000);

      SC.run(function () {
        view.animate('top', 100, { duration: 1 }).animate('rotateX', 45, { duration: 1 });
      });

      setTimeout(function () {
        var transform = styleFor(view)[SC.browser.experimentalStyleNameFor('transform')];

        // We need to check these separately because in some cases we'll also have translateZ, this way we don't have to worry about it
        ok(transform.match(/translateX\(0px\) translateY\(100px\)/), 'has translate');
        ok(transform.match(/rotateX\(45deg\)/), 'has rotateX');

        start();
      }, 5);
    });

    asyncTest("should not use accelerated layer if other transforms are being animated at different speeds", function () {
      // stop(1000);
      SC.run(function () {
        view.animate('rotateX', 45, { duration: 2 }).animate('top', 100, { duration: 1 });
      });

      setTimeout(function () {
        var style = styleFor(view);

        equal(style[SC.browser.experimentalStyleNameFor('transform')], 'rotateX(45deg)', 'transform should only have rotateX');
        equal(style.top, '100px', 'should not accelerate top');

        start();
      }, 5);
    });

    // asyncTest("callbacks should work properly with acceleration", function () {
    //   // stop(1000);
    //   expect(1);
    //
    //   SC.run(function () {
    //     view.animate({ top: 100, left: 100, scale: 2 }, { duration: 0.25 }, function () {
    //       ok(true);
    //
    //       start();
    //     });
    //   });
    // });

    asyncTest("should not add animation for properties that have the same value as existing layout", function () {
      var callbacks = 0;

      SC.run(function () {
        // we set width to the same value, but we change height
        view.animate({width: 100, height: 50}, { duration: 0.5 }, function () { callbacks++; });
      });

      ok(callbacks === 0, "precond - callback should not have been run yet");

      // stop(2000);

      // we need to test changing the width at a later time
      setTimeout(function () {
        start();

        equal(callbacks, 1, "callback should have been run once, for height change");

        SC.run(function () {
          view.animate('width', 50, { duration: 0.5 });
        });

        equal(callbacks, 1, "callback should still have only been called once, even though width has now been animated");
      }, 1000);
    });

    asyncTest("Test that cancelAnimation() removes the animation style and fires the callback with isCancelled set.", function () {
      // start();
      // stop(2000);

      SC.run(function () {
        view.animate({ left: 100, top: 100, width: 400 }, { duration: 0.5 }, function (data) {
          ok(data.isCancelled, "The isCancelled property of the data should be true.");
        });
      });

      setTimeout(function () {
        SC.run(function () {
          var style = styleFor(view),
          transform = style[SC.browser.experimentalStyleNameFor('transform')];
          transform = transform.match(/\d+/g);

          // We need to check these separately because in some cases we'll also have translateZ, this way we don't have to worry about it
          equal(transform[0], '100',  "Test translateX after animate.");
          equal(transform[1], '100',  "Test translateY after animate.");

          equal(transitionFor(view), SC.browser.experimentalCSSNameFor('transform') + ' 0.5s ease 0s, width 0.5s ease 0s', 'Tests the CSS transition property');

          equal(style.left, '0px', 'Tests the left style after animate');
          equal(style.top, '0px', 'Tests the top style after animate');
          equal(style.width, '400px', 'Tests the width style after animate');

          view.cancelAnimation();
        });
      }, 250);

      setTimeout(function () {
        var style = styleFor(view);
        equal(style.width, '400px', 'Tests the width style after cancel');

        var transform = style[SC.browser.experimentalStyleNameFor('transform')];
        transform = transform.match(/\d+/g);

        equal(transform[0], '100',  "Test translateX after cancel.");
        equal(transform[1], '100',  "Test translateY after cancel.");

        equal(transitionFor(view), '', 'Tests that there is no CSS transition property after cancel');

        start();
      }, 350);
    });

    asyncTest("Test that cancelAnimation(SC.LayoutState.CURRENT) removes the animation style, stops at the current position and fires the callback with isCancelled set.", function () {
      // stop(2000);


      SC.run(function () {
        view.animate({ left: 200, top: 200, width: 400 }, { duration: 1 }, function (data) {
          ok(data.isCancelled, "The isCancelled property of the data should be true.");
        });
      });

      setTimeout(function () {
        SC.run(function () {
          var style = styleFor(view),
          transform = style[SC.browser.experimentalStyleNameFor('transform')];
          transform = transform.match(/\d+/g);

          // We need to check these separately because in some cases we'll also have translateZ, this way we don't have to worry about it
          equal(transform[0], '200',  "Test translateX after animate.");
          equal(transform[1], '200',  "Test translateY after animate.");
          equal(transitionFor(view), SC.browser.experimentalCSSNameFor('transform') + ' 1s ease 0s, width 1s ease 0s', 'Tests the CSS transition property');

          equal(style.left, '0px', 'Tests the left style after animate');
          equal(style.top, '0px', 'Tests the top style after animate');
          equal(style.width, '400px', 'Tests the width style after animate');

          view.cancelAnimation(SC.LayoutState.CURRENT);
        });
      }, 250);

      setTimeout(function () {
        var style = styleFor(view),
          layout = view.get('layout');

        equal(transitionFor(view), '', 'Tests that there is no CSS transition property after cancel');

        // We need to check these separately because in some cases we'll also have translateZ, this way we don't have to worry about it
        ok((layout.left > 0) && (layout.left < 200), 'Tests the left style, %@, after cancel is greater than 0 and less than 200'.fmt(style.left));
        ok((layout.top > 0) && (layout.top < 200), 'Tests the top style, %@, after cancel is greater than 0 and less than 200'.fmt(style.top));
        ok((parseInt(style.width, 10) > 100) && (parseInt(style.width, 10) < 400), 'Tests the width style, %@, after cancel is greater than 100 and less than 400'.fmt(style.width));
        start();
      }, 750);
    });

    asyncTest("Test that cancelAnimation(SC.LayoutState.START) removes the animation style, goes back to the start position and fires the callback with isCancelled set.", function () {
      // stop(2000);

      // expect(12);

      SC.run(function () {
        view.animate({ left: 100, top: 100, width: 400 }, { duration: 0.5 }, function (data) {
          ok(data.isCancelled, "The isCancelled property of the data should be true.");
        });
      });

      setTimeout(function () {
        SC.run(function () {
          var style = styleFor(view),
          transform = style[SC.browser.experimentalStyleNameFor('transform')];
          equal(style.left, '0px', 'Tests the left style after animate');
          equal(style.top, '0px', 'Tests the top style after animate');
          equal(style.width, '400px', 'Tests the width style after animate');

          transform = transform.match(/\d+/g);

          // We need to check these separately because in some cases we'll also have translateZ, this way we don't have to worry about it
          equal(transform[0], '100',  "Test translateX after animate.");
          equal(transform[1], '100',  "Test translateY after animate.");

          equal(transitionFor(view), SC.browser.experimentalCSSNameFor('transform') + ' 0.5s ease 0s, width 0.5s ease 0s', 'Tests the CSS transition property');
          view.cancelAnimation(SC.LayoutState.START);
        });
      }, 250);

      setTimeout(function () {
        var style = styleFor(view);

        var transform = style[SC.browser.experimentalStyleNameFor('transform')];
        transform = transform.match(/\d+/g);

        equal(transitionFor(view), '', 'Tests that there is no CSS transition property after cancel');

        // We need to check these separately because in some cases we'll also have translateZ, this way we don't have to worry about it
        equal(transform[0], '0',  "Test translateX after cancel.");
        equal(transform[1], '0',  "Test translateY after cancel.");
        equal(style.width, '100px', 'Tests the width style after cancel');
        start();
      }, 350);
    });
  } else {
    test("This platform appears to not support CSS 3D transforms.", function () {});
  }
} else {
  test("This platform appears not to support CSS transitions.", function () {});
}
//
// module("ANIMATION WITHOUT TRANSITIONS", {
//   setup: function () {
//     commonSetup.setup();
//     SC.platform.supportsCSSTransitions = NO;
//   },
//
//   teardown: function () {
//     commonSetup.teardown();
//     SC.platform.supportsCSSTransitions = originalSupportsTransitions;
//   }
// });
//
// asyncTest("should update layout", function () {
//   // stop(2000);
//   SC.run(function () {
//     view.animate('left', 100, { duration: 1 });
//   });
//
//   setTimeout(function () {
//     equal(view.get('layout').left, 100, 'left is 100');
//     start();
//   }, 5);
// });
//
// // asyncTest("should still run callback", function () {
// //   // stop(2000);
// //
// //   expect(1);
// //
// //   SC.run(function () {
// //     view.animate({ top: 200, left: 100 }, { duration: 1 }, function () {
// //       ok(true, "callback called");
// //       start();
// //     });
// //   });
// // });
//
// module("Animating in the next run loop", commonSetup);
//
// asyncTest("Calling animate while flusing the invokeNext queue should not throw an exception", function () {
//   try {
//     SC.run(function () {
//       SC.run.scheduleOnce('afterRender', view, function () {
//         this.animate({ top: 250 }, { duration: 1 });
//       });
//
//       view.animate({ top: 200 }, { duration: 1 });
//     });
//
//     SC.run(function () {
//       // The first call to _animate and the function with animate in it run.
//     });
//
//     SC.run(function () {
//       // The second call to _animate from the function with animate in it.
//     });
//   } catch (ex) {
//     ok(false, "failure");
//   }
//
//   ok(true, "success");
// });
