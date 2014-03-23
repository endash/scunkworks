minispade.register('sproutcore-views/~tests/main_pane', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ========================================================================
// MainPane Unit Tests
// ========================================================================
/*globals module test ok isObj equals expects */

// ..........................................................
// BASE TESTS
//
// These tests exercise the API.  See below for tests that cover edge
// conditions.  If you find a bug, we recommend that you add a test in the
// edge case section.

(function() {
  var FRAME = { x: 10, y: 10, width: 30, height: 30 } ;

  var pane, view ; // test globals

  module('SC.MainPane', {
    setup: function() {
      pane = SC.MainPane.create();
    },

    teardown: function() {
      pane.remove();
      pane.destroy();
    }
  });

  test("should not be attached before calling append()", function() {
    equal(pane.get('isPaneAttached'), NO) ;
  });

  test("should attach when calling append()", function() {
    pane.append() ;
    equal(pane.get('isPaneAttached'), YES) ;
  });

  test("appending should make pane main & key", function() {
    pane.append();
    var r = pane.get('rootResponder');
    equal(r.get('mainPane'), pane, 'should become mainPane');
    equal(r.get('keyPane'), pane, 'should become keyPane');
  });
})();

});minispade.register('sproutcore-views/~tests/mixins/action_support', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module test equals context ok same */

(function() {
  var target, pane, sendActionSpy, view;

  module("SC.ActionSupport", {
    setup: function() {
      target = SC.Object.create({
        mainAction: function() {},
        someAction: function() {}
      });

      var rootResponder = {sendAction: function(){} };
      sendActionSpy = CoreTest.spyOn(rootResponder, 'sendAction');

      pane = SC.Object.create({
        rootResponder: rootResponder
      });

      view = SC.View.createWithMixins(SC.ActionSupport, {
        action: null,
        zomgAction: null,
        pane: pane,

        someEvent: function() {
          return this.fireAction(this.get('zomgAction'));
        }
      });
    },

    teardown: function() {
      target = pane = sendActionSpy = view = null;
    }
  });


  // ..........................................................
  // No Parameters
  //

  test("no paramaters - only action set", function() {
    var expectedAction = 'someAction';

    view.set('action', expectedAction);
    view.fireAction();

    ok(sendActionSpy.wasCalledWith(expectedAction, null, view, pane, null, view), 'triggers the action');
  });

  test("no paramaters - action and target set", function() {
    var expectedAction = 'someAction';

    view.set('target', target);
    view.set('action', expectedAction);
    view.fireAction();

    ok(sendActionSpy.wasCalledWith(expectedAction, target, view, pane, null, view), 'triggers the action');
  });


  // ..........................................................
  // Actions Parameter
  //

  test("action parameter - only action set", function() {
    var expectedAction = 'someAction';

    view.set('zomgAction', expectedAction);
    view.someEvent();

    ok(sendActionSpy.wasCalledWith(expectedAction, null, view, pane, null, view), 'triggers the action');
  });

  test("action parameter - action and target set", function() {
    var expectedAction = 'someAction';

    view.set('target', target);
    view.set('zomgAction', expectedAction);
    view.someEvent();

    ok(sendActionSpy.wasCalledWith(expectedAction, target, view, pane, null, view), 'triggers the action');
  });


  // ..........................................................
  // Action Context
  //

  test("context", function() {
    var expectedAction = 'someAction';
    var context = {zomg: "context"};

    view.set('action', expectedAction);
    view.set('actionContext', context)
    view.fireAction();

    ok(sendActionSpy.wasCalledWith(expectedAction, null, view, pane, context, view), 'triggers the action');
  });

})();
});minispade.register('sproutcore-views/~tests/pane/append_remove', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ htmlbody */

// ..........................................................
// appendTo()
//
module("SC.Pane#appendTo", {
  setup: function(){
    htmlbody('<div id="appendtest"></div>');
  },
  teardown: function(){
    clearHtmlbody()
  }
});

test("adding to document for first time - appendTo(elem)", function() {
  var pane = SC.Pane.create();
  ok(!pane.get('layer'), 'precond - does not yet have layer');
  ok(!pane.get('isVisibleInWindow'), 'precond - isVisibleInWindow = NO');

  var elem = $('body').get(0);
  ok(elem, 'precond - found element to add to');

  // now add
  pane.appendTo(elem);
  var layer = pane.get('layer');
  ok(layer, 'should create layer');
  equal(layer.parentNode, elem, 'layer should belong to parent');
  ok(pane.get('isVisibleInWindow'), 'isVisibleInWindow should  = YES');
  ok(pane.rootResponder, 'should have rootResponder');

  // Clean up.
  pane.destroy();
});

test("adding to document for first time - appendTo(string)", function() {
  var pane = SC.Pane.create();
  ok(!pane.get('layer'), 'precond - does not yet have layer');
  ok(!pane.get('isVisibleInWindow'), 'precond - isVisibleInWindow = NO');

  // now add
  pane.appendTo("#appendtest");
  var layer = pane.get('layer');
  ok(layer, 'should create layer');
  equal(layer.parentNode, jQuery("#appendtest")[0], 'layer should belong to parent');
  ok(pane.get('isVisibleInWindow'), 'isVisibleInWindow should  = YES');
  ok(pane.rootResponder, 'should have rootResponder');

  // Clean up.
  pane.destroy();
});

test("adding to document for first time - appendTo(jquery)", function() {
  var pane = SC.Pane.create();
  ok(!pane.get('layer'), 'precond - does not yet have layer');
  ok(!pane.get('isVisibleInWindow'), 'precond - isVisibleInWindow = NO');

  // now add
  pane.appendTo(jQuery("#appendtest"));
  var layer = pane.get('layer');
  ok(layer, 'should create layer');
  equal(layer.parentNode, jQuery("#appendtest")[0], 'layer should belong to parent');
  ok(pane.get('isVisibleInWindow'), 'isVisibleInWindow should  = YES');
  ok(pane.rootResponder, 'should have rootResponder');

  // Clean up.
  pane.destroy();
});

test("adding to document for first time - prependTo(elem)", function() {
  var pane = SC.Pane.create();
  ok(!pane.get('layer'), 'precond - does not yet have layer');
  ok(!pane.get('isVisibleInWindow'), 'precond - isVisibleInWindow = NO');

  var elem = $('body').get(0);
  ok(elem, 'precond - found element to add to');

  // now add
  pane.prependTo(elem);
  var layer = pane.get('layer');
  ok(layer, 'should create layer');
  equal(layer.parentNode, elem, 'layer should belong to parent');
  ok(pane.get('isVisibleInWindow'), 'isVisibleInWindow should  = YES');
  ok(pane.rootResponder, 'should have rootResponder');

  // Clean up.
  pane.destroy();
});

test("adding to document for first time - prependTo(string)", function() {
  var pane = SC.Pane.create();
  ok(!pane.get('layer'), 'precond - does not yet have layer');
  ok(!pane.get('isVisibleInWindow'), 'precond - isVisibleInWindow = NO');

  // now add
  pane.prependTo("#appendtest");
  var layer = pane.get('layer');
  ok(layer, 'should create layer');
  equal(layer.parentNode, jQuery("#appendtest")[0], 'layer should belong to parent');
  ok(pane.get('isVisibleInWindow'), 'isVisibleInWindow should  = YES');
  ok(pane.rootResponder, 'should have rootResponder');

  // Clean up.
  pane.destroy();
});

test("adding to document for first time - prependTo(jquery)", function() {
  var pane = SC.Pane.create();
  ok(!pane.get('layer'), 'precond - does not yet have layer');
  ok(!pane.get('isVisibleInWindow'), 'precond - isVisibleInWindow = NO');

  // now add
  pane.prependTo(jQuery("#appendtest"));
  var layer = pane.get('layer');
  ok(layer, 'should create layer');
  equal(layer.parentNode, jQuery("#appendtest")[0], 'layer should belong to parent');
  ok(pane.get('isVisibleInWindow'), 'isVisibleInWindow should  = YES');
  ok(pane.rootResponder, 'should have rootResponder');

  // Clean up.
  pane.destroy();
});


test("adding a pane twice should have no effect", function() {
  var cnt = 0;
  var pane = SC.Pane.create();
  pane._tmp_paneDidAttach = pane.paneDidAttach;
  pane.paneDidAttach = function() {
    cnt++;
    return this._tmp_paneDidAttach.apply(this, arguments);
  };

  pane.append();
  pane.append();
  equal(cnt, 1, 'should only append once');

  // Clean up.
  pane.destroy();
});

test("adding/remove/adding pane", function() {
  var pane = SC.Pane.create();
  var elem1 = $('body').get(0), elem2 = $('#appendtest').get(0);
  ok(elem1 && elem2, 'precond - has elem1 && elem2');

  pane.appendTo(elem1);
  var layer = pane.get('layer');
  ok(layer, 'has layer');
  equal(layer.parentNode, elem1, 'layer belongs to parent');
  ok(pane.get('isVisibleInWindow'), 'isVisibleInWindow is YES before remove');
  pane.remove();
  ok(!pane.get('isVisibleInWindow'), 'isVisibleInWindow is NO');

  pane.appendTo(elem2);
  layer = pane.get('layer');
  equal(layer.parentNode, elem2, 'layer moved to new parent');
  ok(pane.get('isVisibleInWindow'), 'isVisibleInWindow should  = YES');
  ok(pane.rootResponder, 'should have rootResponder');

  // Clean up.
  pane.destroy();
});

test("removeFromParent throws an exception", function() {
  var pane, exceptionCaught = false;

  try {
    pane = SC.Pane.create();
    pane.append();
    pane.removeFromParent();
  } catch(e) {
    exceptionCaught = (e instanceof SC.Error);
  } finally {
    pane.remove();
  }

  ok(exceptionCaught, "trying to call removeFromParent on a pane throws an exception");

  // Clean up.
  pane.destroy();
});

// ..........................................................
// remove()
//
module("SC.Pane#remove");

test("removes pane from DOM", function() {
  var pane = SC.Pane.create();
  var elem = $('body').get(0);
  var layer;

  pane.appendTo(elem);
  layer = pane.get('layer');
  ok(elem, 'precond - found element to add to');

  pane.remove();
  ok(layer.parentNode !== elem, 'layer no longer belongs to parent');
  ok(!pane.get('isVisibleInWindow'), 'isVisibleInWindow is NO');

  // Clean up.
  pane.destroy();
});


// ..........................................................
// SPECIAL CASES
//

test("updates frame and clippingFrame when loading MainPane", function() {

  // needs a fixed layout size to make sure the sizes stay constant
  var pane = SC.MainPane.create();
  var w = SC.RootResponder.responder.computeWindowSize().width;

  // add the pane to the main window.  should resize the frames
  SC.run(function() {
    pane.append();
  });

  // should equal window size
  equal(pane.get('frame').width, w, 'frame width should have changed');
  equal(pane.get('clippingFrame').width, w, 'clippingFrame width should have changed');

  // Clean up.
  pane.destroy();
});


});minispade.register('sproutcore-views/~tests/pane/child_view', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global ok, equals, expect, test, module*/


module("SC.Pane - childViews");

test("SC.Pane should not attempt to recompute visibility on child views that do not have visibility support", function () {
  var pane = SC.Pane.create({
    childViews: ['noVisibility'],

    noVisibility: SC.CoreView
  });

  // tomdale insists on slowing down the tests with extra scope chain traversals
  var errored = NO;

  try {
    pane.append();
  } catch (e) {
    errored = YES;
  }

  ok(!errored, "appending a pane with child views without visibility does not result in an error");
  pane.remove();

  // Clean up.
  pane.destroy();
});

test("SC.Pane should only render once when appended.", function () {
  var pane = SC.Pane.create({
    childViews: ['child'],

    paneValue: null,

    render: function () {
      ok(true, 'Render was called once on pane.');
    },

    child: SC.View.extend({
      childValueBinding: SC.Binding.oneWay('.pane.paneValue').transform(
        function (paneValue) {
          equal(paneValue, 'bar', "Bound value should be set once to 'bar'");

          return paneValue;
        }),
      render: function () {
        ok(true, 'Render was called once on child.');
      }
    })
  });

  SC.run(function () {
    pane.append();

    pane.set('paneValue', 'foo');
    pane.set('paneValue', 'bar');
  });

  pane.remove();

  expect(3);

  // Clean up.
  pane.destroy();
});

});minispade.register('sproutcore-views/~tests/pane/design_mode_test', function() {// ==========================================================================
// Project:   SproutCore
// Copyright: @2012 7x7 Software, Inc.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals CoreTest, module, test, equals, same*/


var pane, view1, view2, view3, view4, view5;


// Localized layout.
SC.metricsFor('English', {
  'Medium.left': 0.25,
  'Medium.right': 0.25,
});

var largeLayout = { top: 0, bottom: 0, centerX: 0, width: 100 },
  mediumLayout = { top: 0, bottom: 0, left: 0.25, right: 0.25 },
  normalLayout = { top: 0, bottom: 0, left: 0, right: 0 },
  smallLayout = { top: 0, bottom: 0, left: 10, right: 10 };

var DesignModeTestView = SC.View.extend({

  modeAdjust: {
    s: { layout: { left: 10, right: 10 } },
    m: { layout: "Medium".locLayout() },
    l: { layout: { left: null, right: null, centerX: 0, width: 100 } }
  },

  init: function () {
    this._super();

    // Stub the set method.
    this.set = CoreTest.stub('setDesignMode', {
      action: SC.View.prototype.set,
      expect: function (callCount) {
        var i, setDesignModeCount = 0;

        for (i = this.history.length - 1; i >= 0; i--) {
          if (this.history[i][1] === 'designMode') {
            setDesignModeCount++;
          }
        }

        equal(setDesignModeCount, callCount, "set('designMode', ...) should have been called %@ times.".fmt(callCount));
      }
    });
  }
});

module("SC.View/SC.Pane Design Mode Support", {
  setup: function () {

    view4 = DesignModeTestView.create({});

    view3 = DesignModeTestView.create({
      childViews: [view4],

      // Override - no large design layout.
      modeAdjust: {
        s: { layout: { left: 10, right: 10 } },
        m: { layout: "Medium".locLayout() }
      }
    });

    view2 = DesignModeTestView.create({});

    view1 = DesignModeTestView.create({
      childViews: [view2, view3]
    });

    view5 = DesignModeTestView.create({});

    pane = SC.Pane.extend({
      childViews: [view1]
    });
  },

  teardown: function () {
    if (pane.remove) { pane.remove(); }

    pane = view1 = view2 = view3 = view4 = view5 = null;

    SC.RootResponder.responder.set('designModes', null);
  }

});


test("When RootResponder has no designModes, it doesn't set designMode on its panes or their childViews", function () {
  pane = pane.create();

  // designMode should not be set
  view1.set.expect(0);
  view2.set.expect(0);
  view3.set.expect(0);
  view4.set.expect(0);

  SC.run(function () {
    pane.append();
  });

  // designMode should not be set
  view1.set.expect(0);
  view2.set.expect(0);
  view3.set.expect(0);
  view4.set.expect(0);

  equal(view1.get('designMode'), undefined, "view1 designMode should be");
  equal(view2.get('designMode'), undefined, "view2 designMode should be");
  equal(view3.get('designMode'), undefined, "view3 designMode should be");
  equal(view4.get('designMode'), undefined, "view4 designMode should be");

  deepEqual(view1.get('layout'), normalLayout, "view1 layout should be");
  deepEqual(view2.get('layout'), normalLayout, "view2 layout should be");
  deepEqual(view3.get('layout'), normalLayout, "view3 layout should be");
  deepEqual(view4.get('layout'), normalLayout, "view4 layout should be");

  deepEqual(view1.get('classNames'), ['sc-view'], "view1 classNames should be");
  deepEqual(view2.get('classNames'), ['sc-view'], "view2 classNames should be");
  deepEqual(view3.get('classNames'), ['sc-view'], "view3 classNames should be");
  deepEqual(view4.get('classNames'), ['sc-view'], "view4 classNames should be");
});

test("When RootResponder has no designModes, and you add a view to a pane, it doesn't set designMode on the new view.", function () {
  pane = pane.create();

  SC.run(function () {
    pane.append();
    pane.appendChild(view5);
  });

  // adjustDesign() shouldn't be called
  view5.set.expect(0);

  equal(view5.get('designMode'), undefined, "designMode should be");

  deepEqual(view5.get('layout'), normalLayout, "layout should be");

  deepEqual(view5.get('classNames'), ['sc-view'], "classNames should be");
});

test("When RootResponder has designModes, it sets designMode on its panes and their childViews", function () {
  var windowSize,
    responder = SC.RootResponder.responder,
    orientation = SC.device.orientation;

  windowSize = responder.get('currentWindowSize');
  responder.set('designModes', { s: ((windowSize.width - 10) * (windowSize.height - 10)) / window.devicePixelRatio, l: Infinity });

  pane = pane.create();

  // designMode should not be set
  view1.set.expect(0);
  view2.set.expect(0);
  view3.set.expect(0);
  view4.set.expect(0);

  SC.run(function () {
    pane.append();
  });

  // designMode should be set (for initialization)
  view1.set.expect(1);
  view2.set.expect(1);
  view3.set.expect(1);
  view4.set.expect(1);

  var modeName = orientation === SC.PORTRAIT_ORIENTATION ? 'l_p' : 'l_l';
  equal(view1.get('designMode'), modeName, "view1 designMode should be");
  equal(view2.get('designMode'), modeName, "view2 designMode should be");
  equal(view3.get('designMode'), modeName, "view3 designMode should be");
  equal(view4.get('designMode'), modeName, "view4 designMode should be");

  deepEqual(view1.get('layout'), largeLayout, "view1 layout should be");
  deepEqual(view2.get('layout'), largeLayout, "view2 layout should be");
  deepEqual(view3.get('layout'), normalLayout, "view3 layout should be");
  deepEqual(view4.get('layout'), largeLayout, "view4 layout should be");

  deepEqual(view1.get('classNames'), ['sc-view', 'sc-large'], "view1 classNames should be");
  deepEqual(view2.get('classNames'), ['sc-view', 'sc-large'], "view2 classNames should be");
  deepEqual(view3.get('classNames'), ['sc-view', 'sc-large'], "view3 classNames should be");
  deepEqual(view4.get('classNames'), ['sc-view', 'sc-large'], "view4 classNames should be");
});

test("When updateDesignMode() is called on a pane, it sets designMode properly on itself and its childViews.", function () {
  var windowSize,
    responder = SC.RootResponder.responder,
    orientation = SC.device.orientation;

  windowSize = responder.get('currentWindowSize');
  responder.set('designModes', { s: ((windowSize.width - 10) * (windowSize.height - 10)) / window.devicePixelRatio, l: Infinity });

  SC.run(function () {
    pane = pane.create().append();
  });

  // designMode should be set (for initialization)
  view1.set.expect(1);
  view2.set.expect(1);
  view3.set.expect(1);
  view4.set.expect(1);

  var modeName = orientation === SC.PORTRAIT_ORIENTATION ? 'l_p' : 'l_l';
  equal(view1.get('designMode'), modeName, "view1 designMode should be");
  equal(view2.get('designMode'), modeName, "view2 designMode should be");
  equal(view3.get('designMode'), modeName, "view3 designMode should be");
  equal(view4.get('designMode'), modeName, "view4 designMode should be");

  deepEqual(view1.get('layout'), largeLayout,  "layout of view1 should be");
  deepEqual(view2.get('layout'), largeLayout,  "layout of view2 should be");
  deepEqual(view3.get('layout'), normalLayout, "layout of view3 should be");
  deepEqual(view4.get('layout'), largeLayout,  "layout of view4 should be");

  deepEqual(view1.get('classNames'), ['sc-view', 'sc-large'], "classNames of view1 should be");
  deepEqual(view2.get('classNames'), ['sc-view', 'sc-large'], "classNames of view2 should be");
  deepEqual(view3.get('classNames'), ['sc-view', 'sc-large'], "classNames of view3 should be");
  deepEqual(view4.get('classNames'), ['sc-view', 'sc-large'], "classNames of view4 should be");

  var newModeName = orientation === SC.PORTRAIT_ORIENTATION ? 's_p' : 's_l';

  SC.run(function () {
    pane.updateDesignMode(modeName, newModeName);
  });

  // designMode should be set (crossed threshold)
  view1.set.expect(2);
  view2.set.expect(2);
  view3.set.expect(2);
  view4.set.expect(2);

  equal(view1.get('designMode'), newModeName, "view1 designMode should be");
  equal(view2.get('designMode'), newModeName, "view2 designMode should be");
  equal(view3.get('designMode'), newModeName, "view3 designMode should be");
  equal(view4.get('designMode'), newModeName, "view4 designMode should be");

  deepEqual(view1.get('layout'), smallLayout, "layout of view1 should be");
  deepEqual(view2.get('layout'), smallLayout, "layout of view2 should be");
  deepEqual(view3.get('layout'), smallLayout, "layout of view3 should be");
  deepEqual(view4.get('layout'), smallLayout, "layout of view4 should be");

  deepEqual(view1.get('classNames'), ['sc-view', 'sc-small'], "classNames of view1 should be");
  deepEqual(view2.get('classNames'), ['sc-view', 'sc-small'], "classNames of view2 should be");
  deepEqual(view3.get('classNames'), ['sc-view', 'sc-small'], "classNames of view3 should be");
  deepEqual(view4.get('classNames'), ['sc-view', 'sc-small'], "classNames of view4 should be");
});

test("When RootResponder has designModes, and you add a view to a pane, it sets designMode on the new view.", function () {
  var windowSize,
    responder = SC.RootResponder.responder,
    orientation = SC.device.orientation;

  windowSize = responder.get('currentWindowSize');
  responder.set('designModes', { s: ((windowSize.width - 10) * (windowSize.height - 10)) / window.devicePixelRatio, l: Infinity });

  SC.run(function () {
    pane = pane.create().append();
    pane.appendChild(view5);
  });

  // designMode should be set
  view5.set.expect(1);
  var modeName = orientation === SC.PORTRAIT_ORIENTATION ? 'l_p' : 'l_l';
  equal(view5.get('designMode'), modeName, "designMode of view5 should be");

  deepEqual(view5.get('classNames'), ['sc-view', 'sc-large'], "classNames of view5 should be");
});

test("When you set designModes on RootResponder, it sets designMode on its panes and their childViews.", function () {
  var windowSize,
    responder = SC.RootResponder.responder,
    orientation = SC.device.orientation;

  SC.run(function () {
    pane = pane.create().append();
  });

  // designMode should not be set
  view1.set.expect(0);
  view2.set.expect(0);
  view3.set.expect(0);
  view4.set.expect(0);

  windowSize = responder.get('currentWindowSize');
  responder.set('designModes', { s: ((windowSize.width - 10) * (windowSize.height - 10)) / window.devicePixelRatio, l: Infinity });

  // designMode should be set (for initialization)
  view1.set.expect(1);
  view2.set.expect(1);
  view3.set.expect(1);
  view4.set.expect(1);

  var modeName = orientation === SC.PORTRAIT_ORIENTATION ? 'l_p' : 'l_l';
  equal(view1.get('designMode'), modeName, "view1 designMode should be");
  equal(view2.get('designMode'), modeName, "view2 designMode should be");
  equal(view3.get('designMode'), modeName, "view3 designMode should be");
  equal(view4.get('designMode'), modeName, "view4 designMode should be");

  deepEqual(view1.get('layout'), largeLayout, "layout of view1 should be");
  deepEqual(view2.get('layout'), largeLayout, "layout of view2 should be");
  deepEqual(view3.get('layout'), normalLayout, "layout of view3 should be");
  deepEqual(view4.get('layout'), largeLayout, "layout of view4 should be");

  deepEqual(view1.get('classNames'), ['sc-view', 'sc-large'], "classNames of view1 should be");
  deepEqual(view2.get('classNames'), ['sc-view', 'sc-large'], "classNames of view2 should be");
  deepEqual(view3.get('classNames'), ['sc-view', 'sc-large'], "classNames of view3 should be");
  deepEqual(view4.get('classNames'), ['sc-view', 'sc-large'], "classNames of view4 should be");
});

test("When you change designModes on RootResponder, it sets designMode on the pane and its childViews if the design mode has changed.", function () {
  var windowSize,
    responder = SC.RootResponder.responder,
    orientation = SC.device.orientation;

  windowSize = responder.get('currentWindowSize');
  responder.set('designModes', { s: ((windowSize.width - 10) * (windowSize.height - 10)) / window.devicePixelRatio, l: Infinity });

  SC.run(function () {
    pane = pane.create().append();
  });

  // designMode should be set (for initialization)
  view1.set.expect(1);
  view2.set.expect(1);
  view3.set.expect(1);
  view4.set.expect(1);

  var modeName = orientation === SC.PORTRAIT_ORIENTATION ? 'l_p' : 'l_l';
  equal(view1.get('designMode'), modeName, "view1 designMode should be");
  equal(view2.get('designMode'), modeName, "view2 designMode should be");
  equal(view3.get('designMode'), modeName, "view3 designMode should be");
  equal(view4.get('designMode'), modeName, "view4 designMode should be");

  deepEqual(view1.get('layout'), largeLayout, "layout for view1 should be");
  deepEqual(view2.get('layout'), largeLayout, "layout for view2 should be");
  deepEqual(view3.get('layout'), normalLayout, "layout for view3 should be");
  deepEqual(view4.get('layout'), largeLayout, "layout for view4 should be");

  deepEqual(view1.get('classNames'), ['sc-view', 'sc-large'], "classNames for view1 should be");
  deepEqual(view2.get('classNames'), ['sc-view', 'sc-large'], "classNames for view2 should be");
  deepEqual(view3.get('classNames'), ['sc-view', 'sc-large'], "classNames for view3 should be");
  deepEqual(view4.get('classNames'), ['sc-view', 'sc-large'], "classNames for view4 should be");

  // Change the small threshold
  responder.set('designModes', { s: ((windowSize.width + 10) * (windowSize.height + 10)) / window.devicePixelRatio, l: Infinity });

  // designMode should be set
  view1.set.expect(2);
  view2.set.expect(2);
  view3.set.expect(2);
  view4.set.expect(2);

  var newModeName = orientation === SC.PORTRAIT_ORIENTATION ? 's_p' : 's_l';
  equal(view1.get('designMode'), newModeName, "view1 designMode should be");
  equal(view2.get('designMode'), newModeName, "view2 designMode should be");
  equal(view3.get('designMode'), newModeName, "view3 designMode should be");
  equal(view4.get('designMode'), newModeName, "view4 designMode should be");

  deepEqual(view1.get('layout'), smallLayout, "layout for view1 should be");
  deepEqual(view2.get('layout'), smallLayout, "layout for view2 should be");
  deepEqual(view3.get('layout'), smallLayout, "layout for view3 should be");
  deepEqual(view4.get('layout'), smallLayout, "layout for view4 should be");

  deepEqual(view1.get('classNames'), ['sc-view', 'sc-small'], "classNames for view1 should be");
  deepEqual(view2.get('classNames'), ['sc-view', 'sc-small'], "classNames for view2 should be");
  deepEqual(view3.get('classNames'), ['sc-view', 'sc-small'], "classNames for view3 should be");
  deepEqual(view4.get('classNames'), ['sc-view', 'sc-small'], "classNames for view4 should be");

  // Add a medium threshold
  responder.set('designModes', {
    s: ((windowSize.width - 10) * (windowSize.height - 10)) / window.devicePixelRatio,
    m: ((windowSize.width + 10) * (windowSize.height + 10)) / window.devicePixelRatio,
    l: Infinity
  });

  // designMode should be set
  view1.set.expect(3);
  view2.set.expect(3);
  view3.set.expect(3);
  view4.set.expect(3);

  modeName = orientation === SC.PORTRAIT_ORIENTATION ? 'm_p' : 'm_l';
  equal(view1.get('designMode'), modeName, "view1 designMode should be");
  equal(view2.get('designMode'), modeName, "view2 designMode should be");
  equal(view3.get('designMode'), modeName, "view3 designMode should be");
  equal(view4.get('designMode'), modeName, "view4 designMode should be");

  deepEqual(view1.get('layout'), mediumLayout, "layout for view1 should be");
  deepEqual(view2.get('layout'), mediumLayout, "layout for view2 should be");
  deepEqual(view3.get('layout'), mediumLayout, "layout for view3 should be");
  deepEqual(view4.get('layout'), mediumLayout, "layout for view4 should be");

  deepEqual(view1.get('classNames'), ['sc-view', 'sc-medium'], "classNames for view1 should be");
  deepEqual(view2.get('classNames'), ['sc-view', 'sc-medium'], "classNames for view2 should be");
  deepEqual(view3.get('classNames'), ['sc-view', 'sc-medium'], "classNames for view3 should be");
  deepEqual(view4.get('classNames'), ['sc-view', 'sc-medium'], "classNames for view4 should be");
});

test("When you unset designModes on RootResponder, it clears designMode on its panes and their childViews.", function () {
  var windowSize,
    responder = SC.RootResponder.responder,
    orientation = SC.device.orientation;

  windowSize = responder.get('currentWindowSize');
  responder.set('designModes', { s: ((windowSize.width - 10) * (windowSize.height - 10)) / window.devicePixelRatio, l: Infinity });

  SC.run(function () {
    pane = pane.create().append();
  });

  // designMode should be set (for initialization)
  view1.set.expect(1);
  view2.set.expect(1);
  view3.set.expect(1);
  view4.set.expect(1);

  var modeName = orientation === SC.PORTRAIT_ORIENTATION ? 'l_p' : 'l_l';
  equal(view1.get('designMode'), modeName, "view1 designMode should be");
  equal(view2.get('designMode'), modeName, "view2 designMode should be");
  equal(view3.get('designMode'), modeName, "view3 designMode should be");
  equal(view4.get('designMode'), modeName, "view4 designMode should be");

  deepEqual(view1.get('layout'), largeLayout, "layout of view1 should be");
  deepEqual(view2.get('layout'), largeLayout, "layout of view2 should be");
  deepEqual(view3.get('layout'), normalLayout, "layout of view3 should be");
  deepEqual(view4.get('layout'), largeLayout, "layout of view4 should be");

  deepEqual(view1.get('classNames'), ['sc-view', 'sc-large'], "classNames of view1 should be");
  deepEqual(view2.get('classNames'), ['sc-view', 'sc-large'], "classNames of view2 should be");
  deepEqual(view3.get('classNames'), ['sc-view', 'sc-large'], "classNames of view3 should be");
  deepEqual(view4.get('classNames'), ['sc-view', 'sc-large'], "classNames of view4 should be");

  // Unset designModes
  responder.set('designModes', null);

  // designMode should be set
  view1.set.expect(2);
  view2.set.expect(2);
  view3.set.expect(2);
  view4.set.expect(2);

  equal(view1.get('designMode'), null, "designMode of view1 should be");
  equal(view2.get('designMode'), null, "designMode of view2 should be");
  equal(view3.get('designMode'), null, "designMode of view3 should be");
  equal(view4.get('designMode'), null, "designMode of view4 should be");

  deepEqual(view1.get('layout'), normalLayout, "layout of view1 should be");
  deepEqual(view2.get('layout'), normalLayout, "layout of view2 should be");
  deepEqual(view3.get('layout'), normalLayout, "layout of view3 should be");
  deepEqual(view4.get('layout'), normalLayout, "layout of view4 should be");

  deepEqual(view1.get('classNames'), ['sc-view'], "classNames of view1 should be");
  deepEqual(view2.get('classNames'), ['sc-view'], "classNames of view2 should be");
  deepEqual(view3.get('classNames'), ['sc-view'], "classNames of view3 should be");
  deepEqual(view4.get('classNames'), ['sc-view'], "classNames of view4 should be");
});

});minispade.register('sproutcore-views/~tests/pane/firstResponder', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ CommonSetup */

var pane, r, view0, view1 ;
CommonSetup = {
  setup: function() {
    pane = SC.Pane.create({
      childViews: [SC.View, SC.View]
    });
    view0 = pane.childViews[0];
    view1 = pane.childViews[1];

    pane.append(); // make visible so it will have root responder
    r = pane.get('rootResponder');
    ok(r, 'has root responder');
  },
  teardown: function() {
    pane.remove();
    pane.destroy();
    pane = r = view0 = view1 = null ;
  }
};

// ..........................................................
// makeFirstResponder()
//
module("SC.Pane#makeFirstResponder", CommonSetup);

test("make firstResponder from null, not keyPane", function() {
  var okCount = 0, badCount = 0;
  view0.didBecomeFirstResponder = function() { okCount ++; };

  view0.willBecomeKeyResponderFrom = view0.didBecomeKeyResponderFrom =
    function() { badCount ++; };

  pane.makeFirstResponder(view0);
  equal(okCount, 1, 'should invoke didBecomeFirstResponder callbacks');
  equal(badCount, 0, 'should not invoke ..BecomeKeyResponder callbacks');

  equal(pane.get('firstResponder'), view0, 'should set firstResponder to view');

  ok(view0.get('isFirstResponder'), 'should set view.isFirstResponder to YES');
  ok(!view0.get('isKeyResponder'), 'should not set view.isKeyResponder');
});


test("make firstResponder from null, is keyPane", function() {
  var okCount = 0 ;
  view0.didBecomeFirstResponder =
  view0.willBecomeKeyResponderFrom = view0.didBecomeKeyResponderFrom =
    function() { okCount++; };

  pane.becomeKeyPane();
  pane.makeFirstResponder(view0);
  equal(okCount, 3, 'should invoke didBecomeFirstResponder + KeyResponder callbacks');

  equal(pane.get('firstResponder'), view0, 'should set firstResponder to view');

  ok(view0.get('isFirstResponder'), 'should set view.isFirstResponder to YES');
  ok(view0.get('isKeyResponder'), 'should set view.isKeyResponder');
});


test("make firstResponder from other view, not keyPane", function() {

  // preliminary setup
  pane.makeFirstResponder(view1);
  equal(pane.get('firstResponder'), view1, 'precond - view1 is firstResponder');

  var okCount = 0, badCount = 0;
  view0.didBecomeFirstResponder = function() { okCount ++; };
  view1.willLoseFirstResponder = function() { okCount ++; };

  view0.willBecomeKeyResponderFrom = view0.didBecomeKeyResponderFrom =
    function() { badCount ++; };
  view1.willLoseKeyResponderTo = view0.didLoseKeyResponderTo =
    function() { badCount ++; };

  pane.makeFirstResponder(view0);
  equal(okCount, 2, 'should invoke ..BecomeFirstResponder callbacks');
  equal(badCount, 0, 'should not invoke ..BecomeKeyResponder callbacks');

  equal(pane.get('firstResponder'), view0, 'should set firstResponder to view');

  ok(view0.get('isFirstResponder'), 'should set view.isFirstResponder to YES');
  ok(!view0.get('isKeyResponder'), 'should not set view.isKeyResponder');

  ok(!view1.get('isFirstResponder'), 'view1.isFirstResponder should now be set to NO');

});


test("make firstResponder from other view, as keyPane", function() {

  // preliminary setup
  pane.becomeKeyPane();
  pane.makeFirstResponder(view1);
  equal(pane.get('firstResponder'), view1, 'precond - view1 is firstResponder');
  ok(view1.get('isFirstResponder'), 'precond - view1.isFirstResponder should be YES');
  ok(view1.get('isKeyResponder'), 'precond - view1.isFirstResponder should be YES');

  var okCount = 0 ;
  view0.didBecomeFirstResponder = view1.willLoseFirstResponder =
  view0.willBecomeKeyResponderFrom = view0.didBecomeKeyResponderFrom =
  view1.willLoseKeyResponderTo = view1.didLoseKeyResponderTo =
    function() { okCount ++; };

  pane.makeFirstResponder(view0);
  equal(okCount, 6, 'should invoke FirstResponder + KeyResponder callbacks on both views');

  equal(pane.get('firstResponder'), view0, 'should set firstResponder to view');

  ok(view0.get('isFirstResponder'), 'should set view.isFirstResponder to YES');
  ok(view0.get('isKeyResponder'), 'should set view.isKeyResponder');

  ok(!view1.get('isFirstResponder'), 'view1.isFirstResponder should now be set to NO');
  ok(!view1.get('isKeyResponder'), 'view1.isFirstResponder should now be set to NO');

});


test("makeFirstResponder(view) when view is already first responder", function() {

  // preliminary setup
  pane.becomeKeyPane();
  pane.makeFirstResponder(view0);
  equal(pane.get('firstResponder'), view0, 'precond - view0 is firstResponder');
  ok(view0.get('isFirstResponder'), 'precond - view0.isFirstResponder should be YES');
  ok(view0.get('isKeyResponder'), 'precond - view0.isFirstResponder should be YES');

  var callCount = 0 ;
  view0.didBecomeFirstResponder = view0.willLoseFirstResponder =
  view0.willBecomeKeyResponderFrom = view0.didBecomeKeyResponderFrom =
  view0.willLoseKeyResponderTo = view0.didLoseKeyResponderTo =
    function() { callCount ++; };

  pane.makeFirstResponder(view0);
  equal(callCount, 0, 'should invoke no FirstResponder + KeyResponder callbacks on view');

  equal(pane.get('firstResponder'), view0, 'should keep firstResponder to view');
  ok(view0.get('isFirstResponder'), 'should keep view.isFirstResponder to YES');
  ok(view0.get('isKeyResponder'), 'should keep view.isKeyResponder');

});

});minispade.register('sproutcore-views/~tests/pane/keyPane', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ CommonSetup */

var pane, r, view ;
CommonSetup = {
  setup: function() {
    pane = SC.Pane.create({
      childViews: [SC.View]
    });
    view = pane.childViews[0];
    pane.makeFirstResponder(view);

    pane.append(); // make visible so it will have root responder
    r = pane.get('rootResponder');
    ok(r, 'has root responder');
  },
  teardown: function() {
    pane.remove();
    pane.destroy();
    pane = r = view = null ;
  }
};

// ..........................................................
// becomeKeyPane()
//
module("SC.Pane#becomeKeyPane", CommonSetup);

test("should become keyPane if not already keyPane", function() {
  ok(r.get('keyPane') !== pane, 'precond - pane is not currently key');

  pane.becomeKeyPane();
  equal(r.get('keyPane'), pane, 'pane should be keyPane');
  equal(pane.get('isKeyPane'), YES, 'isKeyPane should be set to YES');
});

test("should do nothing if acceptsKeyPane is NO", function() {
  ok(r.get('keyPane') !== pane, 'precond - pane is not currently key');

  pane.acceptsKeyPane = NO ;
  pane.becomeKeyPane();
  ok(r.get('keyPane') !== pane, 'pane should not be keyPane');
  equal(pane.get('isKeyPane'), NO, 'isKeyPane should be NO');
});

test("should invoke willBecomeKeyPane & didBecomeKeyPane", function() {
  var callCount = 0 ;
  pane.willBecomeKeyPaneFrom = pane.didBecomeKeyPaneFrom = function() {
    callCount++;
  };

  pane.becomeKeyPane();
  equal(callCount, 2, 'should invoke both callbacks');

  callCount = 0;
  pane.becomeKeyPane();
  equal(callCount, 0, 'should not invoke callbacks if already key pane');
});

test("should invoke callbacks and update isKeyResponder state on firstResponder", function() {
  var callCount = 0;
  view.willBecomeKeyResponderFrom = view.didBecomeKeyResponderFrom =
    function() { callCount++; };

  equal(view.get('isKeyResponder'), NO, 'precond - view is not keyResponder');
  equal(view.get('isFirstResponder'), YES, 'precond - view is firstResponder');

  pane.becomeKeyPane();
  equal(callCount, 2, 'should invoke both callbacks');
  equal(view.get('isKeyResponder'), YES, 'should be keyResponder');
});

// ..........................................................
// resignKeyPane()
//
module("SC.Pane#resignKeyPane", CommonSetup);

test("should resign keyPane if keyPane", function() {
  pane.becomeKeyPane();
  ok(r.get('keyPane') === pane, 'precond - pane is currently key');

  pane.resignKeyPane();
  ok(r.get('keyPane') !== pane, 'pane should NOT be keyPane');
  equal(pane.get('isKeyPane'), NO, 'isKeyPane should be set to NO');
});

// technically this shouldn't happen, but someone could screw up and change
// acceptsKeyPane to NO once the pane has already become key
test("should still resign if acceptsKeyPane is NO", function() {
  pane.becomeKeyPane();
  ok(r.get('keyPane') === pane, 'precond - pane is currently key');

  pane.acceptsKeyPane = NO ;
  pane.resignKeyPane();
  ok(r.get('keyPane') !== pane, 'pane should NOT be keyPane');
  equal(pane.get('isKeyPane'), NO, 'isKeyPane should be set to NO');
});

test("should invoke willLoseKeyPaneTo & didLoseKeyPaneTo", function() {
  pane.becomeKeyPane();
  ok(r.get('keyPane') === pane, 'precond - pane is currently key');

  var callCount = 0 ;
  pane.willLoseKeyPaneTo = pane.didLoseKeyPaneTo = function() {
    callCount++;
  };

  pane.resignKeyPane();
  equal(callCount, 2, 'should invoke both callbacks');

  callCount = 0;
  pane.resignKeyPane();
  equal(callCount, 0, 'should not invoke callbacks if already key pane');
});

test("should invoke callbacks and update isKeyResponder state on firstResponder", function() {
  var callCount = 0;
  view.willLoseKeyResponderTo = view.didLoseKeyResponderTo =
    function() { callCount++; };

  pane.becomeKeyPane();
  equal(view.get('isKeyResponder'), YES, 'precond - view is keyResponder');
  equal(view.get('isFirstResponder'), YES, 'precond - view is firstResponder');

  pane.resignKeyPane();
  equal(callCount, 2, 'should invoke both callbacks');
  equal(view.get('isKeyResponder'), NO, 'should be keyResponder');
});


});minispade.register('sproutcore-views/~tests/pane/layout', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ htmlbody */

var pane;

module("SC.Pane#layout", {
  setup: function() {
    pane = SC.Pane.create({
      layout: { top: 0, left: 0, width: 1, height: 1}
    });
    pane.append();
  },

  teardown: function() {
    pane.remove();
    pane.destroy();
  }
});

test("make sure that a call to adjust actually adjusts the view's size", function() {
  SC.RunLoop.begin();
  pane.adjust({ width: 100, height: 50 });
  SC.RunLoop.end();

  equal(pane.$()[0].style.width, '100px', 'width should have been adjusted');
  equal(pane.$()[0].style.height, '50px', 'height should have been adjusted');
});

});minispade.register('sproutcore-views/~tests/pane/sendEvent', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ htmlbody */
var pane, fooView, barView, defaultResponder, evt, callCount ;
module("SC.Pane#dispatchEvent", {
  setup: function() {

    callCount = 0;
    var handler = function(theEvent) {
      callCount++ ;
      equal(theEvent, evt, 'should pass event');
    };

    defaultResponder = SC.Object.create({ defaultEvent: handler });
    pane = SC.Pane.create({
      defaultResponder: defaultResponder,
      paneEvent: handler,
      childViews: [SC.View.extend({
        fooEvent: handler,
        childViews: [SC.View.extend({
          barEvent: handler
        })]
      })]
    });
    fooView = pane.childViews[0];
    ok(fooView.fooEvent, 'has fooEvent handler');

    barView = fooView.childViews[0];
    ok(barView.barEvent, 'has barEvent handler');

    evt = SC.Object.create(); // mock
  },

  teardown: function() {
    pane.destroy();
    pane = fooView = barView = defaultResponder = evt = null ;
  }
});

test("when invoked with target = nested view", function() {
  var handler ;

  // test event handler on target
  callCount = 0;
  handler = pane.dispatchEvent('barEvent', evt, barView);
  equal(callCount, 1, 'should invoke handler');
  equal(handler, barView, 'should return view that handled event');

  // test event handler on target parent
  callCount = 0;
  handler = pane.dispatchEvent('fooEvent', evt, barView);
  equal(callCount, 1, 'should invoke handler');
  equal(handler, fooView, 'should return responder that handled event');

  // test event handler on default responder
  callCount = 0;
  handler = pane.dispatchEvent('defaultEvent', evt, barView);
  equal(callCount, 1, 'should invoke handler');
  equal(handler, defaultResponder, 'should return responder that handled event');

  // test unhandled event handler
  callCount = 0;
  handler = pane.dispatchEvent('imaginary', evt, barView);
  equal(callCount, 0, 'should not invoke handler');
  equal(handler, null, 'should return no responder');

});



test("when invoked with target = middle view", function() {
  var handler ;

  // test event handler on child view of target
  callCount = 0;
  handler = pane.dispatchEvent('barEvent', evt, fooView);
  equal(callCount, 0, 'should not invoke handler');
  equal(handler, null, 'should return no responder');

  // test event handler on target
  callCount = 0;
  handler = pane.dispatchEvent('fooEvent', evt, fooView);
  equal(callCount, 1, 'should invoke handler');
  equal(handler, fooView, 'should return responder that handled event');

  // test event handler on default responder
  callCount = 0;
  handler = pane.dispatchEvent('defaultEvent', evt, fooView);
  equal(callCount, 1, 'should invoke handler');
  equal(handler, defaultResponder, 'should return responder that handled event');

  // test unhandled event handler
  callCount = 0;
  handler = pane.dispatchEvent('imaginary', evt, fooView);
  equal(callCount, 0, 'should not invoke handler');
  equal(handler, null, 'should return no responder');

});



test("when invoked with target = pane", function() {
  var handler ;

  // test event handler on child view of target
  callCount = 0;
  handler = pane.dispatchEvent('barEvent', evt, pane);
  equal(callCount, 0, 'should not invoke handler');
  equal(handler, null, 'should return no responder');

  // test event handler on target
  callCount = 0;
  handler = pane.dispatchEvent('fooEvent', evt, pane);
  equal(callCount, 0, 'should not invoke handler');
  equal(handler, null, 'should return no responder');

  // test event handler on default responder
  callCount = 0;
  handler = pane.dispatchEvent('defaultEvent', evt, pane);
  equal(callCount, 1, 'should invoke handler');
  equal(handler, defaultResponder, 'should return responder that handled event');

  // test unhandled event handler
  callCount = 0;
  handler = pane.dispatchEvent('imaginary', evt, pane);
  equal(callCount, 0, 'should not invoke handler');
  equal(handler, null, 'should return no responder');

});



test("when invoked with target = null", function() {
  var handler ;

  // should start @ first responder
  pane.firstResponder = fooView;

  // test event handler on child view of target
  callCount = 0;
  handler = pane.dispatchEvent('barEvent', evt);
  equal(callCount, 0, 'should not invoke handler');
  equal(handler, null, 'should return no responder');

  // test event handler on target
  callCount = 0;
  handler = pane.dispatchEvent('fooEvent', evt);
  equal(callCount, 1, 'should invoke handler');
  equal(handler, fooView, 'should return responder that handled event');

  // test event handler on default responder
  callCount = 0;
  handler = pane.dispatchEvent('defaultEvent', evt);
  equal(callCount, 1, 'should invoke handler');
  equal(handler, defaultResponder, 'should return responder that handled event');

  // test unhandled event handler
  callCount = 0;
  handler = pane.dispatchEvent('imaginary', evt);
  equal(callCount, 0, 'should not invoke handler');
  equal(handler, null, 'should return no responder');

  // test event handler on pane itself
  callCount = 0;
  handler = pane.dispatchEvent('paneEvent', evt);
  equal(callCount, 1, 'should invoke handler on pane');
  equal(handler, pane, 'should return pane as responder that handled event');

});

test("when invoked with target = null, no default or first responder", function() {
  var handler ;

  // no first or default responder
  pane.set('firstResponder', null);
  pane.set('defaultResponder', null);

  // test event handler on child view of target
  callCount = 0;
  handler = pane.dispatchEvent('barEvent', evt);
  equal(callCount, 0, 'should not invoke handler');
  equal(handler, null, 'should return no responder');

  // test event handler on target
  callCount = 0;
  handler = pane.dispatchEvent('fooEvent', evt);
  equal(callCount, 0, 'should not invoke handler');
  equal(handler, null, 'should return no responder');

  // test unhandled event handler
  callCount = 0;
  handler = pane.dispatchEvent('imaginary', evt);
  equal(callCount, 0, 'should not invoke handler');
  equal(handler, null, 'should return no responder');

  // test event handler on pane itself
  callCount = 0;
  handler = pane.dispatchEvent('paneEvent', evt);
  equal(callCount, 1, 'should invoke handler on pane');
  equal(handler, pane, 'should return pane as responder that handled event');

});


});minispade.register('sproutcore-views/~tests/system/root_responder/design_modes_test', function() {// // ==========================================================================
// // Project:   SproutCore
// // Copyright: @2012 7x7 Software, Inc.
// // License:   Licensed under MIT license (see license.js)
// // ==========================================================================
// /*globals CoreTest, module, test, equals, same*/
//
//
// var pane1, pane2;
//
//
// module("SC.RootResponder Design Mode Support", {
//   setup: function() {
//     pane1 = SC.Pane.create({
//       updateDesignMode: CoreTest.stub('updateDesignMode', SC.Pane.prototype.updateDesignMode)
//     }).append();
//
//     pane2 = SC.Pane.create({
//       updateDesignMode: CoreTest.stub('updateDesignMode', SC.Pane.prototype.updateDesignMode)
//     }).append();
//   },
//
//   teardown: function() {
//     pane1.remove();
//     pane2.remove();
//     pane1 = pane2 = null;
//   }
//
// });
//
// test("When you set designModes on the root responder, it preps internal arrays.", function () {
//   var windowSize,
//     designModes,
//     responder = SC.RootResponder.responder;
//
//   windowSize = responder.get('currentWindowSize');
//
//   equal(responder._designModeNames, undefined, "If no designModes value is set, there should not be any _designModeNames internal array.");
//   equal(responder._designModeThresholds, undefined, "If no designModes value is set, there should not be any _designModeNames internal array.");
//
//   designModes = { small: ((windowSize.width - 10) * (windowSize.height - 10)) / window.devicePixelRatio, large: Infinity };
//
//   responder.set('designModes', designModes);
//   deepEqual(responder._designModeNames, ['small', 'large'], "If designModes value is set, there should be an ordered _designModeNames internal array.");
//   deepEqual(responder._designModeThresholds, [((windowSize.width - 10) * (windowSize.height - 10)) / window.devicePixelRatio, Infinity], "If designModes value is set, there should be an ordered_designModeNames internal array.");
//
//   designModes = { small: ((windowSize.width - 10) * (windowSize.height - 10)) / window.devicePixelRatio, medium: ((windowSize.width + 10) * (windowSize.height + 10)) / window.devicePixelRatio, large: Infinity };
//
//   responder.set('designModes', designModes);
//   deepEqual(responder._designModeNames, ['small', 'medium', 'large'], "If designModes value is set, there should be an ordered _designModeNames internal array.");
//   deepEqual(responder._designModeThresholds, [((windowSize.width - 10) * (windowSize.height - 10)) / window.devicePixelRatio, ((windowSize.width + 10) * (windowSize.height + 10)) / window.devicePixelRatio, Infinity], "If designModes value is set, there should be an ordered_designModeNames internal array.");
//
//   responder.set('designModes', null);
//   equal(responder._designModeNames, undefined, "If no designModes value is set, there should not be any _designModeNames internal array.");
//   equal(responder._designModeThresholds, undefined, "If no designModes value is set, there should not be any _designModeNames internal array.");
// });
//
// test("When you set designModes on the root responder, it calls updateDesignMode on all its panes.", function () {
//   var windowSize,
//     designModes,
//     responder = SC.RootResponder.responder;
//
//   windowSize = responder.get('currentWindowSize');
//
//   pane1.updateDesignMode.expect(1);
//   pane2.updateDesignMode.expect(1);
//
//   designModes = { small: ((windowSize.width - 10) * (windowSize.height - 10)) / window.devicePixelRatio, large: Infinity };
//
//   responder.set('designModes', designModes);
//   pane1.updateDesignMode.expect(2);
//   pane2.updateDesignMode.expect(2);
//
//   designModes = { small: ((windowSize.width - 10) * (windowSize.height - 10)) / window.devicePixelRatio, medium: ((windowSize.width + 10) * (windowSize.height + 10)) / window.devicePixelRatio, large: Infinity };
//
//   responder.set('designModes', designModes);
//   pane1.updateDesignMode.expect(3);
//   pane2.updateDesignMode.expect(3);
//
//   responder.set('designModes', null);
//   pane1.updateDesignMode.expect(4);
//   pane2.updateDesignMode.expect(4);
// });

});minispade.register('sproutcore-views/~tests/system/root_responder/make_key_pane', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ htmlbody */
module("SC.RootResponder#makeKeyPane");

test("returns receiver", function() {
  var p1 = SC.Pane.create(), p2 = SC.Pane.create({ acceptsKeyPane: YES });
  var r = SC.RootResponder.create();
  
  equal(r.makeKeyPane(p1), r, 'returns receiver even if pane does not accept key pane');
  equal(r.makeKeyPane(p2), r, 'returns receiver');
});

test("changes keyPane to new pane if pane accepts key focus", function() {
  var p1 = SC.Pane.create({ acceptsKeyPane: NO }) ;
  var p2 = SC.Pane.create({ acceptsKeyPane: YES });
  var r = SC.RootResponder.create();
  
  r.makeKeyPane(p1);
  ok(r.get('keyPane') !== p1, 'keyPane should not change to view that does not accept key');

  r.makeKeyPane(p2);
  equal(r.get('keyPane'), p2, 'keyPane should change to view that does accept key');
  
});

test("setting nil sets key pane to mainPane if mainPane accepts key focus", function() {
  var main = SC.Pane.create({ acceptsKeyPane: YES });
  var key = SC.Pane.create({ acceptsKeyPane: YES });
  var r = SC.RootResponder.create({ mainPane: main, keyPane: key });
  
  // try to clear keyPane -- mainPane accepts key
  r.makeKeyPane(null);
  equal(r.get('keyPane'), main, 'keyPane should be main pane');
  
  r.makeKeyPane(key); // reset
  main.acceptsKeyPane = NO ;
  r.makeKeyPane(null); // try to clean - mainPane does not accept key
  equal(r.get('keyPane'), null, 'keyPane should be null, not main');
  
  // try another variety.  if keyPane is currently null and we try to set to
  // null do nothing, even if main DOES accept key.
  r.keyPane = null ;
  main.acceptsKeyPane = NO;
  r.makeKeyPane(null);
  equal(r.get('keyPane'), null, 'keyPane should remain null');
});

var p1, p2, r, callCount ;
module("SC.RootResponder#makeKeyPane - testing notifications", {
  setup: function() {
    p1 = SC.Pane.create({ acceptsKeyPane: YES });    
    p2 = SC.Pane.create({ acceptsKeyPane: YES });    
    r = SC.RootResponder.create();
    callCount = 0 ;
  },
  
  teardown: function() { p1 = p2 = r ; }
});

test("should call willLoseKeyPaneTo on current keyPane", function() {
  r.keyPane = p1; //setup test
  p1.willLoseKeyPaneTo = function(pane) {
    equal(pane, p2, 'should pass new pane');
    callCount++;
  };
  
  r.makeKeyPane(p2);
  equal(callCount, 1, 'should invoke');
});

test("should call willBecomeKeyPaneFrom on new keyPane", function() {
  r.keyPane = p1; //setup test
  p2.willBecomeKeyPaneFrom = function(pane) {
    equal(pane, p1, 'should pass old pane');
    callCount++;
  };
  
  r.makeKeyPane(p2);
  equal(callCount, 1, 'should invoke');
});


test("should call didLoseKeyPaneTo on old keyPane", function() {
  r.keyPane = p1; //setup test
  p1.didLoseKeyPaneTo = function(pane) {
    equal(pane, p2, 'should pass new pane');
    callCount++;
  };
  
  r.makeKeyPane(p2);
  equal(callCount, 1, 'should invoke');
});

test("should call didBecomeKeyPaneFrom on new keyPane", function() {
  r.keyPane = p1; //setup test
  p2.didBecomeKeyPaneFrom = function(pane) {
    equal(pane, p1, 'should pass old pane');
    callCount++;
  };
  
  r.makeKeyPane(p2);
  equal(callCount, 1, 'should invoke');
});

test("should not invoke callbacks if setting keyPane to itself", function() {
  r.keyPane = p1; //setup test
  // instrument ...
  p1.didLoseKeyPaneTo = p1.willLoseKeyPaneTo = p1.willBecomeKeyPaneFrom = p1.didBecomeKeyPaneFrom = function() { callCount++; };
  
  r.makeKeyPane(p1);
  equal(callCount, 0, 'did not invoke any callbacks');
});








});minispade.register('sproutcore-views/~tests/system/root_responder/make_main_pane', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ htmlbody */
module("SC.RootResponder#makeMainPane");

test("returns receiver", function() {
  var p1 = SC.Pane.create(), p2 = SC.Pane.create();
  var r = SC.RootResponder.create();
  equal(r.makeMainPane(p1), r, 'returns receiver');
});

test("changes mainPane to new pane", function() {
  var p1 = SC.Pane.create(), p2 = SC.Pane.create();
  var r = SC.RootResponder.create();
  
  r.makeMainPane(p1);
  equal(r.get('mainPane'), p1, 'mainPane should be p1');

  r.makeMainPane(p2);
  equal(r.get('mainPane'), p2, 'mainPane should be p2');
  
});

test("if current mainpane is also keypane, automatically make new main pane key also", function() {
  // acceptsKeyPane is required to allow keyPane to change
  var p1 = SC.Pane.create({ acceptsKeyPane: YES });
  var p2 = SC.Pane.create({ acceptsKeyPane: YES });

  var r= SC.RootResponder.create({ mainPane: p1, keyPane: p1 });
  r.makeMainPane(p2);
  ok(r.get('keyPane') === p2, 'should change keyPane(%@) p1 = %@ - p2 = %@'.fmt(r.get('keyPane'), p1, p2));
});

test("should call blurMainTo() on current pane, passing new pane", function() {
  var callCount = 0;
  var p2 = SC.Pane.create();
  var p1 = SC.Pane.create({ 
    blurMainTo: function(pane) { 
      callCount++ ;
      equal(pane, p2, 'should pass new pane');
    }
  });
  
  var r= SC.RootResponder.create({ mainPane: p1 });
  r.makeMainPane(p2);
  equal(callCount, 1, 'should invoke callback');
});


test("should call focusMainFrom() on new pane, passing old pane", function() {
  var callCount = 0;
  var p1 = SC.Pane.create();
  var p2 = SC.Pane.create({ 
    focusMainFrom: function(pane) { 
      callCount++ ;
      equal(pane, p1, 'should pass old pane');
    }
  });
  
  var r= SC.RootResponder.create({ mainPane: p1 });
  r.makeMainPane(p2);
  equal(callCount, 1, 'should invoke callback');
});


});minispade.register('sproutcore-views/~tests/system/root_responder/make_menu_pane', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ htmlbody */

var responder, menu;

module("SC.RootResponder#makeMenuPane", {
  setup: function() {
    responder = SC.RootResponder.create();
    menu = SC.Pane.create({
      acceptsMenuPane: YES
    });
  },
  
  teardown: function() {
    menu.remove();
    menu = responder = null;
  }
});

test("Returns receiver", function() {
  equal(responder.makeMenuPane(menu), responder, 'returns receiver');
});

test("Sets RootResponder's menuPane", function() {
  equal(responder.get('menuPane'), null, 'precond - menuPane should be null by default');
  responder.makeMenuPane(menu);
  equal(responder.get('menuPane'), menu, 'menuPane should be passed menu');
});

test("menuPane does not affect keyPane", function() {
  var p2 = SC.Pane.create();
  responder.makeKeyPane(p2);
  equal(responder.get('keyPane'), p2, 'precond - pane should be key pane');
  responder.makeMenuPane(menu);
  equal(responder.get('menuPane'), menu, 'menuPane should be set');
  equal(responder.get('keyPane'), p2, 'key pane should not change');
});

test("Pane should not become menu pane if acceptsMenuPane is not YES", function() {
  menu.set('acceptsMenuPane', NO);
  responder.makeMenuPane(menu);
  equal(responder.get('menuPane'), null, 'menuPane should remain null');
});

});minispade.register('sproutcore-views/~tests/system/root_responder/mouse_events', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ htmlbody */

/*
  We call RootResponder's browser event handlers directly with fake browser events. These
  tests are to prove RootResponder's downstream behavior.
  
  Our test pane has a view tree like so:

  pane
   |--view1
   |  |--view1a
   |  |--view1b
   |--view2

  Simulating responder-chain events on view1a allows us to ensure that view1 also receives
  the event, but that view1b and view2 do not.
*/


// If we don't factory it, all the views share the same stub functions ergo the same callCounts.
function viewClassFactory() {
  return SC.View.extend({
    // Mouse
    mouseEntered: CoreTest.stub(),
    mouseMoved: CoreTest.stub(),
    mouseExited: CoreTest.stub(),
    // Click
    mouseDown: CoreTest.stub(),
    mouseUp: CoreTest.stub(),
    click: CoreTest.stub(),
    dblClick: CoreTest.stub(),
    // Touch
    touchDown: CoreTest.stub(),
    touchesMoved: CoreTest.stub(),
    touchUp: CoreTest.stub(),
    // Data
    dataDragEntered: CoreTest.stub(),
    dataDragHovered: CoreTest.stub(),
    dataDragExited: CoreTest.stub(),
    dataDragDropped: CoreTest.stub()
  });  
}

var Pane = SC.MainPane.extend({
  childViews: ['view1', 'view2'],
  view1: viewClassFactory().extend({
    childViews: ['view1a', 'view1b'],
    view1a: viewClassFactory(),
    view1b: viewClassFactory()
  }),
  view2: viewClassFactory()
});

var pane, view1, view1a, view1b, view2, evt1a, evt2;

module("Mouse event handling", {
  setup: function() {
    SC.run(function() {
      pane = Pane.create().append();
    });
    // Populate the variables for easy access.
    view1 = pane.get('view1');
    view1a = view1.get('view1a');
    view1b = view1.get('view1b');
    view2 = pane.get('view2');
    // Create the events.
    evt1a = {
      target: pane.get('view1.view1a.layer'),
      dataTransfer: { types: [] },
      preventDefault: CoreTest.stub(),
      stopPropagation: CoreTest.stub()
    };
    evt2 = {
      target: pane.get('view2.layer'),
      dataTransfer: { types: [] },
      preventDefault: CoreTest.stub(),
      stopPropagation: CoreTest.stub()
    };
  },
  teardown: function() {
    pane.remove();
    pane.destroy();
    pane = null;
    view1 = view1a = view1b = view2 = null;
    evt1a = evt2 = null;
  }
});

test('Mouse movement', function() {
  // Make sure we're all at zero.
  // mouseEntered
  var isGood = YES &&
    view1.mouseEntered.callCount === 0 &&
    view1a.mouseEntered.callCount === 0 &&
    view1b.mouseEntered.callCount === 0 &&
    view2.mouseEntered.callCount === 0;
  ok(isGood, 'PRELIM: mouseEntered has not been called.');
  // mouseMoved
  isGood = YES &&
    view1.mouseMoved.callCount === 0 &&
    view1a.mouseMoved.callCount === 0 &&
    view1b.mouseMoved.callCount === 0 &&
    view2.mouseMoved.callCount === 0;
  ok(isGood, 'PRELIM: mouseMoved has not been called.');
  // mouseExited
  isGood = YES &&
    view1.mouseExited.callCount === 0 &&
    view1a.mouseExited.callCount === 0 &&
    view1b.mouseExited.callCount === 0 &&
    view2.mouseExited.callCount === 0;
  ok(isGood, 'PRELIM: mouseExited has not been called.');


  // Move the mouse over view1a to trigger mouseEntered.
  SC.RootResponder.responder.mousemove(evt1a);

  equal(view1a.mouseEntered.callCount, 1, "The targeted view has received mouseEntered");
  equal(view1.mouseEntered.callCount, 1, "The targeted view's parent has received mouseEntered");
  equal(view1b.mouseEntered.callCount, 0, "The targeted view's sibling has NOT received mouseEntered");
  equal(view2.mouseEntered.callCount, 0, "The targeted view's parent's sibling has NOT received mouseEntered");

  isGood = YES &&
    view1.mouseMoved.callCount === 0 &&
    view1a.mouseMoved.callCount === 0 &&
    view1b.mouseMoved.callCount === 0 &&
    view2.mouseMoved.callCount === 0 &&
    view1.mouseExited.callCount === 0 &&
    view1a.mouseExited.callCount === 0 &&
    view1b.mouseExited.callCount === 0 &&
    view2.mouseExited.callCount === 0;
  ok(isGood, 'No views have received mouseMoved or mouseExited.');


  // Move the mouse over view1a again to trigger mouseMoved.
  SC.RootResponder.responder.mousemove(evt1a);

  equal(view1a.mouseMoved.callCount, 1, "The targeted view has received mouseMoved");
  equal(view1.mouseMoved.callCount, 1, "The targeted view's parent has received mouseMoved");
  equal(view1b.mouseMoved.callCount, 0, "The targeted view's sibling has NOT received mouseMoved");
  equal(view2.mouseMoved.callCount, 0, "The targeted view's parent's sibling has NOT received mouseMoved");

  isGood = YES &&
    view1.mouseEntered.callCount === 1 &&
    view1a.mouseEntered.callCount === 1 &&
    view1b.mouseEntered.callCount === 0 &&
    view2.mouseEntered.callCount === 0;
  ok(isGood, "No views have received duplicate or out-of-place mouseEntered.");
  isGood = YES &&
    view1.mouseExited.callCount === 0 &&
    view1a.mouseExited.callCount === 0 &&
    view1b.mouseExited.callCount === 0 &&
    view2.mouseExited.callCount === 0;
  ok(isGood, 'No views have received mouseExited.');

  // Move the mouse over view2 to trigger mouseExited on the initial responder chain.
  SC.RootResponder.responder.mousemove(evt2);
  equal(view1a.mouseExited.callCount, 1, "The targeted view has received mouseExited");
  equal(view1.mouseExited.callCount, 1, "The targeted view's parent has received mouseExited");
  equal(view1b.mouseExited.callCount, 0, "The targeted view's sibling has NOT received mouseExited");
  equal(view2.mouseExited.callCount, 0, "The targeted view's parent's sibling (the new target) has NOT received mouseExited");
  equal(view2.mouseEntered.callCount, 1, "The new target has received mouseEntered; circle of life");
});

/*
TODO: Mouse clicks.
*/

/*
TODO: Touch.
*/

test('Data dragging', function() {
  // For this test, we also want to test the default responder actions.
  var previousDefaultResponder = SC.RootResponder.responder.defaultResponder;
  var defaultResponder = SC.RootResponder.responder.defaultResponder = SC.Object.create({
    dataDragDidEnter: CoreTest.stub(),
    dataDragDidHover: CoreTest.stub(),
    dataDragDidExit: CoreTest.stub(),
    dataDragDidDrop: CoreTest.stub()
  });

  // Make sure we're all at zero.
  // dataDragEntered
  var isGood = YES &&
    view1.dataDragEntered.callCount === 0 &&
    view1a.dataDragEntered.callCount === 0 &&
    view1b.dataDragEntered.callCount === 0 &&
    view2.dataDragEntered.callCount === 0;
  ok(isGood, 'PRELIM: dataDragEntered has not been called.');
  // dataDragHovered
  isGood = YES &&
    view1.dataDragHovered.callCount === 0 &&
    view1a.dataDragHovered.callCount === 0 &&
    view1b.dataDragHovered.callCount === 0 &&
    view2.dataDragHovered.callCount === 0;
  ok(isGood, 'PRELIM: dataDragHovered has not been called.');
  // dataDragExited
  isGood = YES &&
    view1.dataDragExited.callCount === 0 &&
    view1a.dataDragExited.callCount === 0 &&
    view1b.dataDragExited.callCount === 0 &&
    view2.dataDragExited.callCount === 0;
  ok(isGood, 'PRELIM: dataDragExited has not been called.');


  // Drag the mouse over view1a to trigger mouseEntered.
  evt1a.type = 'dragenter';
  SC.RootResponder.responder.dragenter(evt1a);

  // Test default responder.
  equal(defaultResponder.dataDragDidEnter.callCount, 1, "The default responder was notified that a drag began over the app");
  equal(defaultResponder.dataDragDidHover.callCount, 1, "The default responder received dataDragDidHover immediately after dataDragDidEnter");
  equal(defaultResponder.dataDragDidExit.callCount, 0, "The default responder has NOT received dataDragDidExit");

  // Test the views.
  equal(view1a.dataDragEntered.callCount, 1, "The targeted view has received dataDragEntered");
  equal(view1a.dataDragHovered.callCount, 1, "The targeted view has received initial dataDragHovered");
  equal(view1.dataDragEntered.callCount, 1, "The targeted view's parent has received dataDragEntered");
  equal(view1.dataDragHovered.callCount, 1, "The targeted view's parent has received initial dataDragHovered");
  equal(view1b.dataDragEntered.callCount + view1b.dataDragHovered.callCount, 0, "The targeted view's sibling has NOT received dataDragEntered or dataDragHovered");
  equal(view2.dataDragEntered.callCount + view2.dataDragHovered.callCount, 0, "The targeted view's parent's sibling has NOT received dataDragEntered or dataDragHovered");

  isGood = YES &&
    view1.dataDragExited.callCount === 0 &&
    view1a.dataDragExited.callCount === 0 &&
    view1b.dataDragExited.callCount === 0 &&
    view2.dataDragExited.callCount === 0;
  ok(isGood, 'No views have received dataDragExited.');


  // Hover the drag and make sure only dataDragHovered is called.
  evt1a.type = 'dragover';
  SC.RootResponder.responder.dragover(evt1a);

  // Test the default responder.
  equal(defaultResponder.dataDragDidEnter.callCount, 1, "The default responder did NOT receive additional dataDragDidEnter on hover");
  equal(defaultResponder.dataDragDidHover.callCount, 2, "The default responder received additional dataDragDidHover on hover");
  equal(defaultResponder.dataDragDidExit.callCount, 0, "The default responder has NOT received dataDragDidExit on hover");

  // Test the views.
  equal(view1a.dataDragHovered.callCount, 2, "The targeted view has received another dataDragHovered");
  equal(view1.dataDragHovered.callCount, 2, "The targeted view's parent has received another dataDragHovered");
  equal(view1b.dataDragHovered.callCount, 0, "The targeted view's sibling has NOT received dataDragHovered");
  equal(view2.dataDragHovered.callCount, 0, "The targeted view's parent's sibling has NOT received dataDragHovered");
  equal(view1b.dataDragEntered.callCount + view1b.dataDragHovered.callCount, 0, "The targeted view's sibling has NOT received dataDragEntered or dataDragHovered");
  equal(view2.dataDragEntered.callCount + view2.dataDragHovered.callCount, 0, "The targeted view's parent's sibling has NOT received dataDragEntered or dataDragHovered");

  isGood = YES &&
    view1.dataDragEntered.callCount === 1 &&
    view1a.dataDragEntered.callCount === 1 &&
    view1b.dataDragEntered.callCount === 0 &&
    view2.dataDragEntered.callCount === 0;
  ok(isGood, "No views have received duplicate or out-of-place dataDragEntered.");
  isGood = YES &&
    view1.dataDragExited.callCount === 0 &&
    view1a.dataDragExited.callCount === 0 &&
    view1b.dataDragExited.callCount === 0 &&
    view2.dataDragExited.callCount === 0;
  ok(isGood, 'No views have received dataDragExited.');


  // Leave view1a and enter view2 to trigger dataDragExited on the initial responder chain.
  // Note that browsers call the new dragenter prior to the old dragleave.
  evt2.type = 'dragenter';
  evt1a.type = 'dragleave';
  SC.RootResponder.responder.dragenter(evt2);
  SC.RootResponder.responder.dragleave(evt1a);

  // Check the default responder.
  equal(defaultResponder.dataDragDidEnter.callCount, 1, "The default responder did NOT receive additional dataDragDidEnter on internal events");
  equal(defaultResponder.dataDragDidHover.callCount, 4, "The default responder has received dataDragDidHover for each subsequent drag event");
  equal(defaultResponder.dataDragDidExit.callCount, 0, "The default responder has NOT received dataDragDidExit on internal events");

  // Check the views.
  equal(view1a.dataDragExited.callCount, 1, "The targeted view has received dataDragExited");
  equal(view1.dataDragExited.callCount, 1, "The targeted view's parent has received dataDragExited");
  equal(view1b.dataDragExited.callCount, 0, "The targeted view's sibling has NOT received dataDragExited");
  equal(view2.dataDragExited.callCount, 0, "The targeted view's parent's sibling (the new target) has NOT received dataDragExited");
  equal(view2.dataDragEntered.callCount, 1, "The new target has received dataDragEntered; circle of life");


  // Leave view2 to test document leaving.
  evt2.type = 'dragleave';
  SC.RootResponder.responder.dragleave(evt2);

  // Check the default responder.
  equal(defaultResponder.dataDragDidEnter.callCount, 1, "The default responder did NOT receive additional dataDragDidEnter on document exit");
  equal(defaultResponder.dataDragDidHover.callCount, 5, "The default responder received an additional dataDragDidHover event on document exit");
  equal(defaultResponder.dataDragDidExit.callCount, 1, "The default responder received dataDragDidExit on document exit");

  // Check the views.
  equal(view1a.dataDragExited.callCount, 1, "The previously-targeted view has NOT received additional dataDragExited on document exit");
  equal(view1.dataDragExited.callCount, 1, "The previously-targeted view's parent has received dataDragExited");
  equal(view1b.dataDragExited.callCount, 0, "The previously-targeted view's sibling has NOT received dataDragExited ever basically");
  equal(view2.dataDragEntered.callCount, 1, "The new target has NOT received additional dataDragEntered on document exit");
  equal(view2.dataDragExited.callCount, 1, "The new target has received dataDragExited on document exit");


  // TODO: Test the 300ms timer to make sure the force-drag-leave works for Firefox (et al. probably).


  // Test drop.
  evt1a.type = 'dragenter';
  SC.RootResponder.responder.dragenter(evt1a);
  evt1a.type = 'dragdrop';
  SC.RootResponder.responder.drop(evt1a);

  // Check the default responder.
  equal(defaultResponder.dataDragDidDrop.callCount, 1, "The default responder received a dataDragDidDrop event on drop");

  // Check the views.
  equal(view1a.dataDragDropped.callCount, 1, "The targeted view received a dataDragDropped event");
  equal(view1.dataDragDropped.callCount, 0, "The targeted view's parent did not receive a dataDragDropped event");


  // Clean up our default responder sitch.
  SC.RootResponder.responder.defaultResponder.destroy();
  SC.RootResponder.responder.defaultResponder = previousDefaultResponder;
});

test('Data dragging content types', function() {
  // Drag the event over view 1a with type 'Files' (should cancel).
  evt1a.dataTransfer.types = ['Files'];
  evt1a.dataTransfer.dropEffect = 'copy';
  SC.RootResponder.responder.dragover(evt1a);

  equal(evt1a.preventDefault.callCount, 1, "The default behavior was prevented for a 'Files' drag");
  equal(evt1a.dataTransfer.dropEffect, 'none', "The drop effect was set to 'none' for a 'Files' drag");

  // Drag the event over view 1a with type 'text/uri-list' (should cancel).
  evt1a.dataTransfer.types = ['text/uri-list'];
  evt1a.dataTransfer.dropEffect = 'copy';
  SC.RootResponder.responder.dragover(evt1a);

  equal(evt1a.preventDefault.callCount, 2, "The default behavior was prevented for a 'text/uri-list' drag");
  equal(evt1a.dataTransfer.dropEffect, 'none', "The drop effect was set to 'none' for a 'text/uri-list' drag");

  // Drag the event over view 1a with type 'text/plain' (should not cancel).
  evt1a.dataTransfer.types = ['text/plain'];
  evt1a.dataTransfer.dropEffect = 'copy';
  SC.RootResponder.responder.dragover(evt1a);

  equal(evt1a.preventDefault.callCount, 2, "The default behavior was NOT prevented for a 'text/plain' drag");
  equal(evt1a.dataTransfer.dropEffect, 'copy', "The drop effect was NOT changed for a 'text/plain' drag");

});

});minispade.register('sproutcore-views/~tests/system/root_responder/root_responder', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// ========================================================================
// RootResponder Tests
// ========================================================================
/*globals module test ok isObj equals expect */

var sub, newPane, oldPane, lightPane, darkPane, myPane, responder;


module("SC.RootResponder", {
	setup: function() {		
		sub = SC.Object.create({
			action: function() { var objectA = "hello"; }
		});
		
		newPane = SC.Pane.create({ owner: this});
		oldPane = SC.Pane.create({ owner: this});
		lightPane = SC.Pane.create({ owner: this});
		darkPane = SC.Pane.create({ owner: this});
		myPane = SC.Pane.create();
		responder = SC.RootResponder.create({});
	},
	
	teardown: function() {
		delete sub;
	}
	
	// var objectA, submit = document.createElement('pane');
	// 
	//   triggerMe: function() {
	//     SC.Event.trigger(submit, 'click');
	//   }
	//   
});

test("Basic requirements", function() {
  expect(2);
  ok(SC.RootResponder, "SC.RootResponder");
  ok(SC.RootResponder.responder, "SC.RootResponder.responder");
});

test("root_responder.makeMainPane() : Should change the new Pane to key view", function() {
	responder.makeMainPane(newPane);
	//Checking the mainPane property
	equal(responder.get('mainPane'),newPane);
	equal(responder.get('keyPane'), newPane);
});

test("root_responder.makeMainPane() : Should notify other panes about the changes", function() {
	responder.makeMainPane(newPane);
		
	//Notify other panes about the changes
	equal(newPane.get('isMainPane'),YES);
	equal(oldPane.get('isMainPane'),NO);
	
});

test("root_responder.makeKeyPane() : Should make the passed pane as the key pane", function() {
 responder.makeMainPane(oldPane);
 equal(responder.get('keyPane'), oldPane);
 
 responder.makeKeyPane(lightPane);
 equal(responder.get('keyPane'),lightPane);
}); 

test("root_responder.makeKeyPane() : Should make the main pane as the key pane if null is passed", function() {
 responder.makeMainPane(lightPane);
 responder.makeKeyPane(oldPane);
 // newPane is set as the Main pane
 equal(responder.get('mainPane'),lightPane);
 // KeyPane is null as it is not set yet 
 equal(responder.get('keyPane'), oldPane);
 
 responder.makeKeyPane();
 // KeyPane is set as the mainPane as null is passed 
 equal(responder.get('keyPane'),lightPane);
});

test("root_responder.ignoreTouchHandle() : Should ignore TEXTAREA, INPUT, A, and SELECT elements", function () {
 var wasMobileSafari = SC.browser.isMobileSafari;
 SC.browser.isMobileSafari = YES;

 ["A", "INPUT", "TEXTAREA", "SELECT"].forEach(function (tag) {
   ok(responder.ignoreTouchHandle({
     target: { tagName: tag },
     allowDefault: SC.K
   }), "should pass touch events through to &lt;" + tag + "&gt;s");
 });

 ["AUDIO", "B", "Q", "BR", "BODY", "BUTTON", "CANVAS", "FORM",
  "IFRAME", "IMG", "OPTION", "P", "PROGRESS", "STRONG",
  "TABLE", "TBODY", "TR", "TH", "TD", "VIDEO"].forEach(function (tag) {
   ok(!responder.ignoreTouchHandle({
     target: { tagName: tag },
     allowDefault: SC.K
   }), "should NOT pass touch events through to &lt;" + tag + "&gt;s");
 });

 SC.browser.isMobileSafari = wasMobileSafari;
});

//// CLEANUP
/// Commenting out this two functions as the methods don't exist
//// confirm with Charles 




/*
test("root_responder.removePane() : Should be able to remove panes to set", function() {
	responder.removePane(darkPane);
		
	//Notify other panes about the changes
	equal(responder.get('mainPane'),null);
});

test("root_responder.addPane() : Should be able to add panes to set", function() {
	responder.addPane(darkPane);
		
	//Notify other panes about the changes
	equal(responder.get('mainPane'),lightPane);
});

*/


});minispade.register('sproutcore-views/~tests/system/root_responder/target_for_action', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ htmlbody Dummy */

var r, r2, sender, pane, pane2, barView, fooView, defaultResponder;
var keyPane, mainPane, globalResponder, globalResponderContext, actionSender ;

var CommonSetup = {
  setup: function() {

    actionSender = null ; // use for sendAction tests
    var action = function(sender) { actionSender = sender; } ;

    sender = SC.Object.create();

    // default responder for each pane
    defaultResponder = SC.Object.create({
      defaultAction: action
    });

    // global default responder set on RootResponder
    globalResponder = SC.Object.create({
      globalAction: action
    });

    // global default responder as a responder context
    // set on RootResponder
    globalResponderContext = SC.Object.createWithMixins(SC.ResponderContext, {
      globalAction: action
    });

    // explicit pane
    pane = SC.Pane.create({
      acceptsKeyPane: YES,
      defaultResponder: defaultResponder,
      childViews: [SC.View.extend({
        bar: action,  // implement bar action
        childViews: [SC.View.extend({
          foo: action // implement foo action
        })]
      })],

      paneAction: action

    });

    pane2 = SC.Pane.create({
      acceptsKeyPane: YES,
      defaultResponder: defaultResponder,
      childViews: [SC.View.extend({
        bar: action,  // implement bar action
        childViews: [SC.View.extend({
          foo: action // implement foo action
        })]
      })],

      paneAction: action,

      keyAction: action,
      mainAction: action,
      globalAction: action
    });

    keyPane = SC.Pane.create({
      acceptsKeyPane: YES,
      keyAction: action
    });
    keyPane.firstResponder = keyPane ;

    mainPane = SC.Pane.create({
      acceptsKeyPane: YES,
      mainAction: action
    });
    mainPane.firstResponder = mainPane ;

    r = SC.RootResponder.create({
      mainPane: mainPane,
      keyPane:  keyPane,
      defaultResponder: globalResponder
    });

    r2 = SC.RootResponder.create({
      mainPane: mainPane,
      keyPane: keyPane,
      defaultResponder: globalResponderContext
    });

    barView = pane.childViews[0];
    ok(barView.bar, 'barView should implement bar');

    fooView = barView.childViews[0];
    ok(fooView.foo, 'fooView should implement foo');

    // setup dummy namespace
    window.Dummy = {
      object: SC.Object.create({ foo: action }),
      hash: { foo: action }
    };

  },

  teardown: function() {
    r = r2 = sender = pane = window.Dummy = barView = fooView = null;
    defaultResponder = keyPane = mainPane = globalResponder = null;
    globalResponderContext = null;
  }
};

// ..........................................................
// targetForAction()
//
module("SC.RootResponder#targetForAction", CommonSetup);


test("pass property path string as target", function() {
  var result = r.targetForAction('foo', 'Dummy.object');

  equal(result, Dummy.object, 'should find DummyNamespace.object if it implements the action');

  equal(r.targetForAction("foo", "Dummy.hash"), Dummy.hash, 'should return if object found at path and it has function, even if it does not use respondsTo');

  equal(r.targetForAction('bar', 'Dummy.object'), null, 'should return null if found DummyNamepace.object but does not implement action');

  equal(r.targetForAction('foo', 'Dummy.imaginary.item'), null, 'should return null if property path could not resolve');
});

test("pass real object as target", function() {
  equal(r.targetForAction('foo', Dummy.object), Dummy.object, 'returns target if respondsTo() action');
  equal(r.targetForAction('foo', Dummy.hash), Dummy.hash, 'returns target if targets does not implement respondsTo() but does have action');
  equal(r.targetForAction('bar', Dummy.object), null, 'returns null of target does not implement action name');
});

test("no target, explicit pane, nested firstResponder", function() {

  pane.set('firstResponder', fooView) ;
  equal(r.targetForAction('foo', null, null, pane), fooView,
    'should return firstResponder if implementation action');

  equal(r.targetForAction('bar', null, null, pane), barView,
    'should return parent of firstResponder');

  equal(r.targetForAction('paneAction', null, null, pane), pane,
    'should return pane action');

  equal(r.targetForAction('defaultAction', null, null, pane),
    defaultResponder, 'should return defaultResponder');

  equal(r.targetForAction('imaginaryAction', null, null, pane), null,
    'should return null for not-found action');
});


test("no target, explicit pane, top-level firstResponder", function() {

  pane.set('firstResponder', barView) ; // fooView is child...

  equal(r.targetForAction('foo', null, null, pane), null,
    'should NOT return child of firstResponder');

  equal(r.targetForAction('bar', null, null, pane), barView,
    'should return firstResponder');

  equal(r.targetForAction('paneAction', null, null, pane), pane,
    'should return pane action');

  equal(r.targetForAction('defaultAction', null, null, pane),
    defaultResponder, 'should return defaultResponder');

  equal(r.targetForAction('imaginaryAction', null, null, pane), null,
    'should return null for not-found action');
});

test("no target, explicit pane, pane is first responder", function() {

  pane.set('firstResponder', pane) ;

  equal(r.targetForAction('foo', null, null, pane), null,
    'should NOT return child view');

  equal(r.targetForAction('bar', null, null, pane), null,
    'should NOT return child view');

  equal(r.targetForAction('paneAction', null, null, pane), pane,
    'should return pane action');

  equal(r.targetForAction('defaultAction', null, null, pane),
    defaultResponder, 'should return defaultResponder');

  equal(r.targetForAction('imaginaryAction', null, null, pane), null,
    'should return null for not-found action');
});

test("no target, explicit pane, no first responder", function() {

  pane.set('firstResponder', null) ;

  equal(r.targetForAction('foo', null, null, pane), null,
    'should NOT return child view');

  equal(r.targetForAction('bar', null, null, pane), null,
    'should NOT return child view');

  equal(r.targetForAction('paneAction', null, null, pane), pane,
    'should return pane');

  equal(r.targetForAction('defaultAction', null, null, pane),
    defaultResponder, 'should return defaultResponder');

  equal(r.targetForAction('imaginaryAction', null, null, pane), null,
    'should return null for not-found action');

});

test("no target, explicit pane, does not implement action", function() {
  equal(r.targetForAction('keyAction', null, null, pane), keyPane,
    'should return keyPane');

  equal(r.targetForAction('mainAction', null, null, pane), mainPane,
    'should return mainPane');

  equal(r.targetForAction('globalAction', null, null, pane), globalResponder,
    'should return global defaultResponder');

  equal(r2.targetForAction('globalAction', null, null, pane), globalResponderContext,
    'should return global defaultResponder');
});

test("no target, explicit pane, does implement action", function() {
  equal(r.targetForAction('keyAction', null, null, pane2), pane2,
    'should return pane');

  equal(r.targetForAction('mainAction', null, null, pane2), pane2,
    'should return pane');

  equal(r.targetForAction('globalAction', null, null, pane2), pane2,
    'should return pane');

  equal(r2.targetForAction('globalAction', null, null, pane2), pane2,
    'should return pane');
});

test("no target, no explicit pane", function() {
  equal(r.targetForAction('keyAction'), keyPane, 'should find keyPane');
  equal(r.targetForAction('mainAction'), mainPane, 'should find mainPane');
  equal(r.targetForAction('globalAction'), globalResponder,
    'should find global defaultResponder');
  equal(r.targetForAction('imaginaryAction'), null, 'should return null for not-found action');
  equal(r2.targetForAction('globalAction'), globalResponderContext,
    'should find global defaultResponder');
});

// ..........................................................
// sendAction()
//
module("SC.RootResponder#sendAction", CommonSetup) ;

test("if pane passed, invokes action on pane if found", function() {
  pane.firstResponder = pane;
  r.sendAction('paneAction', null, sender, pane);
  equal(actionSender, sender, 'action did invoke');

  actionSender = null;
  r.sendAction('imaginaryAction', null, sender, pane);
  equal(actionSender, null, 'action did not invoke');
});

test("searches panes if none passed, invokes action if found", function() {
  r.sendAction('keyAction', null, sender);
  equal(actionSender, sender, 'action did invoke');

  actionSender = null;
  r.sendAction('imaginaryAction', null, sender);
  equal(actionSender, null, 'action did not invoke');
});

test("searches target if passed, invokes action if found", function() {
  r.sendAction('foo', fooView, sender);
  equal(actionSender, sender, 'action did invoke');

  actionSender = null;
  r.sendAction('imaginaryAction', fooView, sender);
  equal(actionSender, null, 'action did not invoke');
});


});minispade.register('sproutcore-views/~tests/system/utils/offset', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ========================================================================
// SC Miscellaneous Utils Tests - documentOffset
// ========================================================================

/*global module test htmlbody clearHtmlbody ok equals same */

var pane, view1, view2, view3, view4;



module("SC.offset", {

  setup: function() {

    htmlbody('<style> .sc-main { height: 2500px; width: 2500px; } </style>');

    SC.RunLoop.begin();

    // Even though a full SC app doesn't really allow the viewport to be scaled or scrolled by default (thus
    // the offset by viewport will always equal offset by document), we simulate an app that uses a
    // scrollable viewport to test the validity of the functions.
    var viewportEl;
    if (SC.browser.isMobileSafari) {
      viewportEl = $("[name='viewport']")[0];

      viewportEl.setAttribute('content','initial-scale=0.8, minimum-scale=0.5, maximum-scale=1.2, user-scalable=yes, width=device-height');
    }

    pane = SC.MainPane.create({
      childViews: [
        SC.View.extend({
          classNames: 'upper'.w(),
          layout: { top: 20, left: 20, width: 100, height: 100 },
          childViews: [
            SC.View.extend({
              classNames: 'upper-inner'.w(),
              layout: { top: 10, left: 10, width: 20, height: 20 }
            })]
        }),
        SC.View.extend({
          classNames: 'lower'.w(),
          layout: { top: 1200, left: 20, width: 100, height: 100 },
          childViews: [
            SC.View.extend({
              classNames: 'lower-inner'.w(),
              layout: { top: 10, left: 10, width: 20, height: 20 }
            })]
        })]

      // Useful for debugging in iOS
      // /** Allow default touch events */
      //  touchStart: function(touch) {
      //    if (SC.browser.isMobileSafari) touch.allowDefault();
      //  },
      //
      //  touchesDragged: function(evt, touches) {
      //    if (SC.browser.isMobileSafari) evt.allowDefault();
      //  },
      //
      //  touchEnd: function(touch) {
      //    if (SC.browser.isMobileSafari) touch.allowDefault();
      //  }
    });
    pane.append();
    SC.RunLoop.end();

    view1 = pane.childViews[0];
    view2 = pane.childViews[1];
    view3 = view1.childViews[0];
    view4 = view2.childViews[0];
  },

  teardown: function() {
    // Useful for debugging in iOS
    // if (!SC.browser.isMobileSafari) {
      pane.remove();
      pane = view1 = view2 = view3 = view4 = null;
    // }

    clearHtmlbody();
  }
});


function checkDocumentOffset(element, top, left) {
  var docOffset = SC.offset(element, 'document');

  equal(docOffset.y, top, '%@ document offset top'.fmt(element[0].className));
  equal(docOffset.x, left, '%@ document offset left'.fmt(element[0].className));
}

function checkViewportOffset(element, top, left) {
  var viewOffset = SC.offset(element, 'viewport');

  equal(viewOffset.y, top, '%@ viewport offset top'.fmt(element[0].className));
  equal(viewOffset.x, left, '%@ viewport offset left'.fmt(element[0].className));
}

function checkParentOffset(element, top, left) {
  var parentOffset = SC.offset(element, 'parent');

  equal(parentOffset.y, top, '%@ parent offset top'.fmt(element[0].className));
  equal(parentOffset.x, left, '%@ parent offset left'.fmt(element[0].className));
}

test("Regular views", function() {
  var element;

  element = view1.$();
  checkDocumentOffset(element, 20, 20);
  checkViewportOffset(element, 20, 20);
  checkParentOffset(element, 20, 20);

  element = view3.$();
  checkDocumentOffset(element, 30, 30);
  checkViewportOffset(element, 30, 30);
  checkParentOffset(element, 10, 10);
});

test("A regular view not visible within the visual viewport", function() {
  var element;

  element = view2.$();
  checkDocumentOffset(element, 1200, 20);
  checkViewportOffset(element, 1200, 20);
  checkParentOffset(element, 1200, 20);

  element = view4.$();
  checkDocumentOffset(element, 1210, 30);
  checkViewportOffset(element, 1210, 30);
  checkParentOffset(element, 10, 10);
});

function testPosition4(element1, element2, element3, element4) {
  window.scrollTo(100, 100);

  checkDocumentOffset(element1, 20, 20);
  checkViewportOffset(element1, -80, -80);
  checkParentOffset(element1, 20, 20);

  checkDocumentOffset(element3, 30, 30);
  checkViewportOffset(element3, -70, -70);
  checkParentOffset(element3, 10, 10);

  checkDocumentOffset(element2, 1200, 20);
  checkViewportOffset(element2, 1100, -80);
  checkParentOffset(element2, 1200, 20);

  checkDocumentOffset(element4, 1210, 30);
  checkViewportOffset(element4, 1110, -70);
  checkParentOffset(element4, 10, 10);

  window.start(); // continue the tests
}

function testPosition3(element1, element2, element3, element4) {
  window.scrollTo(10, 100);

  checkDocumentOffset(element1, 20, 20);
  checkViewportOffset(element1, -80, 10);
  checkParentOffset(element1, 20, 20);

  checkDocumentOffset(element3, 30, 30);
  checkViewportOffset(element3, -70, 20);
  checkParentOffset(element3, 10, 10);

  checkDocumentOffset(element2, 1200, 20);
  checkViewportOffset(element2, 1100, 10);
  checkParentOffset(element2, 1200, 20);

  checkDocumentOffset(element4, 1210, 30);
  checkViewportOffset(element4, 1110, 20);
  checkParentOffset(element4, 10, 10);

  window.start();
}

function testPosition2(element1, element2, element3, element4) {

  window.scrollTo(10, 10);

  checkDocumentOffset(element1, 20, 20);
  checkViewportOffset(element1, 10, 10);
  checkParentOffset(element1, 20, 20);

  checkDocumentOffset(element3, 30, 30);
  checkViewportOffset(element3, 20, 20);
  checkParentOffset(element3, 10, 10);

  checkDocumentOffset(element2, 1200, 20);
  checkViewportOffset(element2, 1190, 10);
  checkParentOffset(element2, 1200, 20);

  checkDocumentOffset(element4, 1210, 30);
  checkViewportOffset(element4, 1200, 20);
  checkParentOffset(element4, 10, 10);

  window.start();
}

function testPosition1(element1, element2, element3, element4) {
  // For some reason, the scroll jumps back to 0,0 if we don't set it here
  window.scrollTo(0, 10);

  checkDocumentOffset(element1, 20, 20);
  checkViewportOffset(element1, 10, 20);
  checkParentOffset(element1, 20, 20);

  checkDocumentOffset(element3, 30, 30);
  checkViewportOffset(element3, 20, 30);
  checkParentOffset(element3, 10, 10);

  checkDocumentOffset(element2, 1200, 20);
  checkViewportOffset(element2, 1190, 20);
  checkParentOffset(element2, 1200, 20);

  checkDocumentOffset(element4, 1210, 30);
  checkViewportOffset(element4, 1200, 30);
  checkParentOffset(element4, 10, 10);

  window.start();
}

test("A regular view with window scroll offset top:10", function() {
  var element1 = view1.$(),
      element2 = view2.$(),
      element3 = view3.$(),
      element4 = view4.$();

  window.stop();

  window.scrollTo(0, 10);
  SC.RunLoop.begin();
  SC.Timer.schedule({ target: this, action: function() { return testPosition1(element1, element2, element3, element4); }, interval: 200 });
  SC.RunLoop.end();
});

test("A regular view with window scroll offset top:10, left: 10", function() {
  var element1 = view1.$(),
      element2 = view2.$(),
      element3 = view3.$(),
      element4 = view4.$();

  window.stop();

  window.scrollTo(10, 10);
  SC.RunLoop.begin();
  SC.Timer.schedule({ target: this, action: function() { return testPosition2(element1, element2, element3, element4); }, interval: 200 });
  SC.RunLoop.end();
});

test("A regular view with window scroll offset top:100, left: 10", function() {
  var element1 = view1.$(),
      element2 = view2.$(),
      element3 = view3.$(),
      element4 = view4.$();

  window.stop();

  window.scrollTo(10, 100);
  SC.RunLoop.begin();
  SC.Timer.schedule({ target: this, action: function() { return testPosition3(element1, element2, element3, element4); }, interval: 200 });
  SC.RunLoop.end();
});

test("A regular view with window scroll offset top:100, left: 100", function() {
  var element1 = view1.$(),
      element2 = view2.$(),
      element3 = view3.$(),
      element4 = view4.$();

  window.stop();

  window.scrollTo(100, 100);
  SC.RunLoop.begin();
  SC.Timer.schedule({ target: this, action: function() { return testPosition4(element1, element2, element3, element4); }, interval: 200 });
  SC.RunLoop.end();
});

});minispade.register('sproutcore-views/~tests/view/animation', function() {// ==========================================================================
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
var view, pane, originalSupportsTransitions = SC.platform.supportsCSSTransitions;

function styleFor(view) {
  if (!view.get('layer')) debugger;
  return view.get('layer').style;
}

function transitionFor(view) {
  return styleFor(view)[SC.browser.experimentalStyleNameFor('transition')];
}

var commonSetup = {
  setup: function (wantsAcceleratedLayer) {
    SC.run(function () {
      pane = SC.Pane.create({
        backgroundColor: '#ccc',
        layout: { top: 0, right: 0, width: 200, height: 200, zIndex: 100 }
      });
      pane.append();

      view = SC.View.create({
        backgroundColor: '#888',
        layout: { left: 0, top: 0, height: 100, width: 100 },
        wantsAcceleratedLayer: wantsAcceleratedLayer || NO
      });
      pane.appendChild(view);
    });
  },

  teardown: function () {
    pane.remove();
    pane.destroy();
  }
};

if (SC.platform.supportsCSSTransitions) {

  module("ANIMATION", commonSetup);

  asyncTest("should work", function () {
    expect(2);

    SC.run(function () {
      view.animate('left', 100, { duration: 1 });
    });

    setTimeout(function () {
      equal(transitionFor(view), 'left 1s ease 0s', 'add transition');
      equal(100, view.get('layout').left, 'left is 100');

      start();
    }, 5);
  });

  asyncTest("animate + adjust: no conflict", function () {
    expect(8);

    SC.run(function () {
      view.animate('left', 100, { duration: 0.1 });
      view.adjust('top', 100);
      view.adjust({ 'width': null, 'right': 100 });
    });

    setTimeout(function () {
      equal(view.get('layout').left, 100, 'left is');
      equal(view.get('layout').top, 100, 'top is');
      equal(view.get('layout').right, 100, 'right is');
      equal(view.get('layout').width, undefined, 'width is');

      SC.run(function () {
        view.animate('top', 200, { duration: 0.1 });
        view.adjust('left', 0);
        view.adjust({ 'width': 100, 'right': null });
      });

      setTimeout(function () {
        equal(view.get('layout').left, 0, 'left is');
        equal(view.get('layout').top, 200, 'top is');
        equal(view.get('layout').right, undefined, 'right is');
        equal(view.get('layout').width, 100, 'width is');

        start();
      }, 200);
    }, 200);
  });

  asyncTest("animate + adjust: conflict", function () {
    expect(2);

    SC.run(function () {
      view.animate('left', 100, { duration: 0.1 });
      view.adjust('left', 200);
    });

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
  });

  asyncTest("callbacks work in general", function () {
    expect(2);

    SC.run(function () {
      view.animate('left', 100, { duration: 0.5 }, function testCallback () {
        ok(true, "Callback was called.");
        equal(view, this, "`this` should be the view");
        start();
      });
    });
  });

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
    // stop(2000);

    SC.run(function () {
      view.adjust({ top: null, centerY: 0 });
      view.animate({ height: 10 }, { duration: 1 });
    });

    setTimeout(function () {
      equal(transitionFor(view), 'height 1s ease 0s, margin-top 1s ease 0s', 'should add height and margin-top transitions');
      equal(view.get('layout').height, 10, 'height');
      equal(view.get('layout').centerY, 0, 'centerY');

      start();
    }, 5);
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
    var callbacks = 0, wasCancelled = NO, check = 0;
    // stop(2000);

    SC.run(function () {
      // this triggers the initial layoutStyle code
      view.animate('left', 79, { duration: 0.5 }, function (data) {
        callbacks++;
        wasCancelled = data.isCancelled;
      });

      // this triggers a re-render, re-running the layoutStyle code
      view.displayDidChange();
    });

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
  });

  // There was a bug in animation that once one property was animated, a null
  // version of it existed in _activeAnimations, such that when another property
  // was animated it would throw an exception iterating through _activeAnimations
  // and not expecting a null value.
  asyncTest("animating different attributes at different times should not throw an error", function () {
    // Run test.
    // stop(2000);

    expect(0);

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
    // stop(2000);

    expect(7);

    SC.run(function () {
      view.animate({ left: 100 }, { duration: 0.5 }, function (data) {
        ok(data.isCancelled, "The isCancelled property of the data should be true.");
      });
    });

    setTimeout(function () {
      SC.run(function () {
        var style = styleFor(view);

        equal(style.left, '100px', 'Tests the left style after animate');
        equal(style.top, '0px', 'Tests the top style after animate');
        equal(transitionFor(view), 'left 0.5s ease 0s', 'Tests the CSS transition property');
        view.cancelAnimation();
      });
    }, 5);

    setTimeout(function () {
      var style = styleFor(view);

      equal(style.left, '100px', 'Tests the left style after cancel');
      equal(style.top, '0px', 'Tests the top style after cancel');
      equal(transitionFor(view), '', 'Tests the CSS transition property');
      start();
    }, 50);
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

      ok((parseInt(style.left, 10) > 0) && (parseInt(style.left, 10) < 100), 'Tests the left style after cancel');
      ok((parseInt(style.top, 10) > 0) && (parseInt(style.top, 10) < 100), 'Tests the top style after cancel');
      ok((parseInt(style.width, 10) > 100) && (parseInt(style.width, 10) < 400), 'Tests the width style after cancel');
      equal(transitionFor(view), '', 'Tests the CSS transition property');
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

//   if (SC.platform.supportsCSS3DTransforms) {
//     module("ANIMATION WITH ACCELERATED LAYER", {
//       setup: function () {
//         commonSetup.setup(YES);
//       },
//
//       teardown: commonSetup.teardown
//     });
//
//     asyncTest("handles acceleration when appropriate", function () {
//       // stop(2000);
//
//       debugger;
//
//       SC.run(function () {
//         view.animate('top', 100, { duration: 1 });
//       });
//
//       setTimeout(function () {
//         equal(transitionFor(view), SC.browser.experimentalCSSNameFor('transform') + ' 1s ease 0s', 'transition is on transform');
//
//         start();
//       }, 5);
//     });
//
//     asyncTest("doesn't use acceleration when not appropriate", function () {
//       // stop(1000);
//
//       SC.run(function () {
//         view.adjust({ height: null, bottom: 0 });
//         view.animate('top', 100, { duration: 1 });
//       });
//
//       setTimeout(function () {
//         equal(transitionFor(view), 'top 1s ease 0s', 'transition is not on transform');
//
//         start();
//       }, 5);
//     });
//
//     asyncTest("combines accelerated layer animation with compatible transform animations", function () {
//       // stop(1000);
//
//       SC.run(function () {
//         view.animate('top', 100, { duration: 1 }).animate('rotateX', 45, { duration: 1 });
//       });
//
//       setTimeout(function () {
//         var transform = styleFor(view)[SC.browser.experimentalStyleNameFor('transform')];
//
//         // We need to check these separately because in some cases we'll also have translateZ, this way we don't have to worry about it
//         ok(transform.match(/translateX\(0px\) translateY\(100px\)/), 'has translate');
//         ok(transform.match(/rotateX\(45deg\)/), 'has rotateX');
//
//         start();
//       }, 5);
//     });
//
//     asyncTest("should not use accelerated layer if other transforms are being animated at different speeds", function () {
//       // stop(1000);
//       SC.run(function () {
//         view.animate('rotateX', 45, { duration: 2 }).animate('top', 100, { duration: 1 });
//       });
//
//       setTimeout(function () {
//         var style = styleFor(view);
//
//         equal(style[SC.browser.experimentalStyleNameFor('transform')], 'rotateX(45deg)', 'transform should only have rotateX');
//         equal(style.top, '100px', 'should not accelerate top');
//
//         start();
//       }, 5);
//     });
//
//     // asyncTest("callbacks should work properly with acceleration", function () {
//     //   // stop(1000);
//     //   expect(1);
//     //
//     //   SC.run(function () {
//     //     view.animate({ top: 100, left: 100, scale: 2 }, { duration: 0.25 }, function () {
//     //       ok(true);
//     //
//     //       start();
//     //     });
//     //   });
//     // });
//
//     asyncTest("should not add animation for properties that have the same value as existing layout", function () {
//       var callbacks = 0;
//
//       SC.run(function () {
//         // we set width to the same value, but we change height
//         view.animate({width: 100, height: 50}, { duration: 0.5 }, function () { callbacks++; });
//       });
//
//       ok(callbacks === 0, "precond - callback should not have been run yet");
//
//       // stop(2000);
//
//       // we need to test changing the width at a later time
//       setTimeout(function () {
//         start();
//
//         equal(callbacks, 1, "callback should have been run once, for height change");
//
//         SC.run(function () {
//           view.animate('width', 50, { duration: 0.5 });
//         });
//
//         equal(callbacks, 1, "callback should still have only been called once, even though width has now been animated");
//       }, 1000);
//     });
//
//     asyncTest("Test that cancelAnimation() removes the animation style and fires the callback with isCancelled set.", function () {
//       // stop(2000);
//
//       SC.run(function () {
//         view.animate({ left: 100, top: 100, width: 400 }, { duration: 0.5 }, function (data) {
//           ok(data.isCancelled, "The isCancelled property of the data should be true.");
//         });
//       });
//
//       setTimeout(function () {
//         SC.run(function () {
//           var style = styleFor(view),
//           transform = style[SC.browser.experimentalStyleNameFor('transform')];
//           transform = transform.match(/\d+/g);
//
//           // We need to check these separately because in some cases we'll also have translateZ, this way we don't have to worry about it
//           equal(transform[0], '100',  "Test translateX after animate.");
//           equal(transform[1], '100',  "Test translateY after animate.");
//
//           equal(transitionFor(view), SC.browser.experimentalCSSNameFor('transform') + ' 0.5s ease 0s, width 0.5s ease 0s', 'Tests the CSS transition property');
//
//           equal(style.left, '0px', 'Tests the left style after animate');
//           equal(style.top, '0px', 'Tests the top style after animate');
//           equal(style.width, '400px', 'Tests the width style after animate');
//
//           view.cancelAnimation();
//         });
//       }, 250);
//
//       setTimeout(function () {
//         var style = styleFor(view);
//         equal(style.width, '400px', 'Tests the width style after cancel');
//
//         var transform = style[SC.browser.experimentalStyleNameFor('transform')];
//         transform = transform.match(/\d+/g);
//
//         equal(transform[0], '100',  "Test translateX after cancel.");
//         equal(transform[1], '100',  "Test translateY after cancel.");
//
//         equal(transitionFor(view), '', 'Tests that there is no CSS transition property after cancel');
//
//         start();
//       }, 350);
//     });
//
//     asyncTest("Test that cancelAnimation(SC.LayoutState.CURRENT) removes the animation style, stops at the current position and fires the callback with isCancelled set.", function () {
//       // stop(2000);
//
//
//       SC.run(function () {
//         view.animate({ left: 200, top: 200, width: 400 }, { duration: 1 }, function (data) {
//           ok(data.isCancelled, "The isCancelled property of the data should be true.");
//         });
//       });
//
//       setTimeout(function () {
//         SC.run(function () {
//           var style = styleFor(view),
//           transform = style[SC.browser.experimentalStyleNameFor('transform')];
//           transform = transform.match(/\d+/g);
//
//           // We need to check these separately because in some cases we'll also have translateZ, this way we don't have to worry about it
//           equal(transform[0], '200',  "Test translateX after animate.");
//           equal(transform[1], '200',  "Test translateY after animate.");
//           equal(transitionFor(view), SC.browser.experimentalCSSNameFor('transform') + ' 1s ease 0s, width 1s ease 0s', 'Tests the CSS transition property');
//
//           equal(style.left, '0px', 'Tests the left style after animate');
//           equal(style.top, '0px', 'Tests the top style after animate');
//           equal(style.width, '400px', 'Tests the width style after animate');
//
//           view.cancelAnimation(SC.LayoutState.CURRENT);
//         });
//       }, 250);
//
//       setTimeout(function () {
//         var style = styleFor(view),
//           layout = view.get('layout');
//
//         equal(transitionFor(view), '', 'Tests that there is no CSS transition property after cancel');
//
//         // We need to check these separately because in some cases we'll also have translateZ, this way we don't have to worry about it
//         ok((layout.left > 0) && (layout.left < 200), 'Tests the left style, %@, after cancel is greater than 0 and less than 200'.fmt(style.left));
//         ok((layout.top > 0) && (layout.top < 200), 'Tests the top style, %@, after cancel is greater than 0 and less than 200'.fmt(style.top));
//         ok((parseInt(style.width, 10) > 100) && (parseInt(style.width, 10) < 400), 'Tests the width style, %@, after cancel is greater than 100 and less than 400'.fmt(style.width));
//         start();
//       }, 750);
//     });
//
//     asyncTest("Test that cancelAnimation(SC.LayoutState.START) removes the animation style, goes back to the start position and fires the callback with isCancelled set.", function () {
//       // stop(2000);
//
//       // expect(12);
//
//       SC.run(function () {
//         view.animate({ left: 100, top: 100, width: 400 }, { duration: 0.5 }, function (data) {
//           ok(data.isCancelled, "The isCancelled property of the data should be true.");
//         });
//       });
//
//       setTimeout(function () {
//         SC.run(function () {
//           var style = styleFor(view),
//           transform = style[SC.browser.experimentalStyleNameFor('transform')];
//           equal(style.left, '0px', 'Tests the left style after animate');
//           equal(style.top, '0px', 'Tests the top style after animate');
//           equal(style.width, '400px', 'Tests the width style after animate');
//
//           transform = transform.match(/\d+/g);
//
//           // We need to check these separately because in some cases we'll also have translateZ, this way we don't have to worry about it
//           equal(transform[0], '100',  "Test translateX after animate.");
//           equal(transform[1], '100',  "Test translateY after animate.");
//
//           equal(transitionFor(view), SC.browser.experimentalCSSNameFor('transform') + ' 0.5s ease 0s, width 0.5s ease 0s', 'Tests the CSS transition property');
//           view.cancelAnimation(SC.LayoutState.START);
//         });
//       }, 250);
//
//       setTimeout(function () {
//         var style = styleFor(view);
//
//         var transform = style[SC.browser.experimentalStyleNameFor('transform')];
//         transform = transform.match(/\d+/g);
//
//         equal(transitionFor(view), '', 'Tests that there is no CSS transition property after cancel');
//
//         // We need to check these separately because in some cases we'll also have translateZ, this way we don't have to worry about it
//         equal(transform[0], '0',  "Test translateX after cancel.");
//         equal(transform[1], '0',  "Test translateY after cancel.");
//         equal(style.width, '100px', 'Tests the width style after cancel');
//         start();
//       }, 350);
//     });
//   } else {
//     test("This platform appears to not support CSS 3D transforms.");
//   }
} else {
  test("This platform appears to not support CSS transitions.");
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

});minispade.register('sproutcore-views/~tests/view/attribute_bindings_test', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module test equals context ok same */

module("SC.CoreView - Attribute Bindings");

test("should render and update attribute bindings", function() {
  var view = SC.View.create({
    classNameBindings: ['priority', 'isUrgent', 'isClassified:classified', 'canIgnore'],
    attributeBindings: ['type', 'exploded', 'destroyed', 'exists', 'explosions'],

    type: 'reset',
    exploded: true,
    destroyed: true,
    exists: false,
    explosions: 15
  });

  view.createLayer();
  equal(view.$().attr('type'), 'reset', "adds type attribute");
  ok(view.$().attr('exploded'), "adds exploded attribute when true");
  ok(view.$().attr('destroyed'), "adds destroyed attribute when true");
  ok(!view.$().attr('exists'), "does not add exists attribute when false");
  equal(view.$().attr('explosions'), "15", "adds integer attributes");

  view.set('type', 'submit');
  view.set('exploded', false);
  view.set('destroyed', false);
  view.set('exists', true);

  equal(view.$().attr('type'), 'submit', "updates type attribute");
  ok(!view.$().attr('exploded'), "removes exploded attribute when false");
  ok(!view.$().attr('destroyed'), "removes destroyed attribute when false");
  ok(view.$().attr('exists'), "adds exists attribute when true");
});

});minispade.register('sproutcore-views/~tests/view/background_color', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

module("SC.View - backgroundColor");

test("Basic use", function() {
  var view = SC.View.create({
    backgroundColor: "red"
  });

  view.createLayer();

  equal(view.get('layer').style.backgroundColor, "red", "backgroundColor sets the CSS background-color value");

});

test("Dynamic use", function() {
  var view = SC.View.create({
    backgroundColor: 'red',
    displayProperties: ['backgroundColor']
  });
  
  view.createLayer();
  view.viewState = SC.View.ATTACHED_SHOWN; // hack to get view properties to update.

  equal(view.get('layer').style.backgroundColor, 'red', "PRELIM: backgroundColor sets the CSS background-color value");

  SC.run(function() {
    view.set('backgroundColor', 'blue');
  });

  equal(view.get('layer').style.backgroundColor, 'blue', "Changing backgroundColor when it is a display property updates the CSS background-color value");

  SC.run(function() {
    view.set('backgroundColor', null);
  });

  ok(!view.get('layer').style.backgroundColor, "Setting backgroundColor to null clears the CSS background-color value");

});

});minispade.register('sproutcore-views/~tests/view/border_frame_test', function() {// ==========================================================================
// Project:   Showcase
// Copyright: ©2012 7x7 Software, Inc.
// License:   Licensed under MIT license
// ==========================================================================
/*global module, test, same*/

var view;
module("SC.View#borderFrame", {
  setup: function () {
    SC.run(function () {
      view = SC.View.create({
        layout: { width: 100, height: 100 }
      });
    });
  },

  teardown: function () {
    view.destroy();
    view = null;
  }
});

test("The borderFrame property of the view should include the borders from the layout.", function () {
  var borderFrame,
    frame;

  // No borders.
  frame = view.get('frame');
  borderFrame = view.get('borderFrame');

  deepEqual(frame, { x: 0, y: 0, width: 100, height: 100 }, "The frame without borders is");
  deepEqual(borderFrame, { x: 0, y: 0, width: 100, height: 100 }, "The borderFrame without borders is");

  // Right 5px border.
  SC.run(function () {
    view.adjust('borderRight', 5);
  });

  frame = view.get('frame');
  borderFrame = view.get('borderFrame');

  deepEqual(frame, { x: 0, y: 0, width: 95, height: 100 }, "The frame with 5px right border is");
  deepEqual(borderFrame, { x: 0, y: 0, width: 100, height: 100 }, "The borderFrame with 5px right border is");

  // Top 10px border.
  SC.run(function () {
    view.adjust('borderTop', 10);
  });

  frame = view.get('frame');
  borderFrame = view.get('borderFrame');

  deepEqual(frame, { x: 0, y: 10, width: 95, height: 90 }, "The frame with 5px right border & 10px top border is");
  deepEqual(borderFrame, { x: 0, y: 0, width: 100, height: 100 }, "The borderFrame with 5px right border & 10px top border is");

  // Left 15px border.
  SC.run(function () {
    view.adjust('borderLeft', 15);
  });

  frame = view.get('frame');
  borderFrame = view.get('borderFrame');

  deepEqual(frame, { x: 15, y: 10, width: 80, height: 90 }, "The frame with 5px right border & 10px top border & 15px left border is");
  deepEqual(borderFrame, { x: 0, y: 0, width: 100, height: 100 }, "The borderFrame with 5px right border & 10px top border & 15px left border is");

  // Bottom 20px border.
  SC.run(function () {
    view.adjust('borderBottom', 20);
  });

  frame = view.get('frame');
  borderFrame = view.get('borderFrame');

  deepEqual(frame, { x: 15, y: 10, width: 80, height: 70 }, "The frame with 5px right border & 10px top border & 15px left border & 20px bottom border is");
  deepEqual(borderFrame, { x: 0, y: 0, width: 100, height: 100 }, "The borderFrame with 5px right border & 10px top border & 15px left border & 20px bottom border is");

  // 25px border.
  SC.run(function () {
    view.set('layout', { width: 100, height: 100, border: 25 });
  });

  frame = view.get('frame');
  borderFrame = view.get('borderFrame');

  deepEqual(frame, { x: 25, y: 25, width: 50, height: 50 }, "The frame with 25px border is");
  deepEqual(borderFrame, { x: 0, y: 0, width: 100, height: 100 }, "The borderFrame with 25px border is");

});


test("The borderFrame property of the view should be correct for view with useStaticLayout.", function () {
  var borderFrame,
    frame,
    pane;

  view.set('useStaticLayout', true);

  frame = view.get('frame');
  borderFrame = view.get('borderFrame');

  deepEqual(frame, null, "The frame with useStaticLayout true is");
  deepEqual(borderFrame, null, "The borderFrame with useStaticLayout true is");

  SC.run(function () {
    pane = SC.Pane.create({
      childViews: [view]
    }).append();
  });

  frame = view.get('frame');
  borderFrame = view.get('borderFrame');

  deepEqual(frame, { x: 0, y: 0, width: 100, height: 100 }, "The frame with useStaticLayout true after rendering is");
  deepEqual(borderFrame, { x: 0, y: 0, width: 100, height: 100 }, "The borderFrame with useStaticLayout true after rendering is");

  // Right 5px border.
  SC.run(function () {
    view.adjust('borderRight', 5);
  });

  frame = view.get('frame');
  borderFrame = view.get('borderFrame');

  deepEqual(frame, { x: 0, y: 0, width: 95, height: 100 }, "The frame with 5px right border is");
  deepEqual(borderFrame, { x: 0, y: 0, width: 100, height: 100 }, "The borderFrame with 5px right border is");

  // Top 10px border.
  SC.run(function () {
    view.adjust('borderTop', 10);
  });

  frame = view.get('frame');
  borderFrame = view.get('borderFrame');

  deepEqual(frame, { x: 0, y: 10, width: 95, height: 90 }, "The frame with 5px right border & 10px top border is");
  deepEqual(borderFrame, { x: 0, y: 0, width: 100, height: 100 }, "The borderFrame with 5px right border & 10px top border is");

  // Left 15px border.
  SC.run(function () {
    view.adjust('borderLeft', 15);
  });

  frame = view.get('frame');
  borderFrame = view.get('borderFrame');

  deepEqual(frame, { x: 15, y: 10, width: 80, height: 90 }, "The frame with 5px right border & 10px top border & 15px left border is");
  deepEqual(borderFrame, { x: 0, y: 0, width: 100, height: 100 }, "The borderFrame with 5px right border & 10px top border & 15px left border is");

  // Bottom 20px border.
  SC.run(function () {
    view.adjust('borderBottom', 20);
  });

  frame = view.get('frame');
  borderFrame = view.get('borderFrame');

  deepEqual(frame, { x: 15, y: 10, width: 80, height: 70 }, "The frame with 5px right border & 10px top border & 15px left border & 20px bottom border is");
  deepEqual(borderFrame, { x: 0, y: 0, width: 100, height: 100 }, "The borderFrame with 5px right border & 10px top border & 15px left border & 20px bottom border is");

  // 25px border.
  SC.run(function () {
    view.set('layout', { width: 100, height: 100, border: 25 });
  });

  frame = view.get('frame');
  borderFrame = view.get('borderFrame');

  deepEqual(frame, { x: 25, y: 25, width: 50, height: 50 }, "The frame with 25px border is");
  deepEqual(borderFrame, { x: 0, y: 0, width: 100, height: 100 }, "The borderFrame with 25px border is");

  pane.destroy();
});

});minispade.register('sproutcore-views/~tests/view/build', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module test ok */

var buildableView, parent;
module('SC.Buildable', {
  setup: function () {
    parent = SC.View.create();
    buildableView = SC.View.create({
      buildIn: function () {
        this.called_any = YES;
        this.called_buildIn = YES;
      },

      resetBuild: function () {
        this.called_any = YES;
        this.called_resetBuild = YES;
      },

      buildOut: function () {
        this.called_any = YES;
        this.called_buildOut = YES;
      },

      buildOutDidCancel: function () {
        this.called_any = YES;
        this.called_buildOutDidCancel = YES;
      },

      buildInDidCancel: function () {
        this.called_any = YES;
        this.called_buildInDidCancel = YES;
      }
    });
  },

  teardown: function () {
    parent.destroy();
    buildableView.destroy();
  }
});

test("resetBuildState calls resetBuild", function (){
  ok(!buildableView.called_any, "Nothing should have happened yet.");
  buildableView.resetBuildState();
  ok(buildableView.called_resetBuild, "reset should have been called");
});

test("changing parent view calls resetBuild", function () {
  ok(!buildableView.called_any, "Nothing should have happened yet.");
  parent.appendChild(buildableView);
  ok(buildableView.called_resetBuild, "reset should have been called");
});

test("buildInToView starts build in", function () {
  buildableView.willBuildInToView(parent);
  ok(!buildableView.isBuildingIn, "Should not be building in yet.");
  buildableView.buildInToView(parent);
  ok(buildableView.isBuildingIn, "Should now be building in.");
  ok(buildableView.called_buildIn, "Build in should have been called.");
});

test("buildOutFromView starts build out", function () {
  buildableView.willBuildInToView(parent);
  buildableView.buildInToView(parent);
  buildableView.buildInDidFinish(); // hack this in here, because our implementations above purposefully don't.

  ok(!buildableView.isBuildingOut, "Should not yet be building out.");
  buildableView.buildOutFromView(parent);
  ok(buildableView.isBuildingOut, "View should now be building out.");
});

test("resetBuildState cancels buildOut", function () {
  buildableView.willBuildInToView(parent);
  buildableView.buildInToView(parent);
  buildableView.buildInDidFinish(); // hack this in here, because our implementations above purposefully don't.

  buildableView.buildOutFromView(parent);
  ok(buildableView.isBuildingOut, "View should now be building out.");

  buildableView.resetBuildState(parent);
  ok(!buildableView.isBuildingOut, "View should no longer be building out.");
  ok(buildableView.called_buildOutDidCancel, "Cancel ought to have been called.");
});

});minispade.register('sproutcore-views/~tests/view/build_children', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module test equals context ok same */

var buildableView, parent;
module('SC.Buildable', {
  setup: function() {
    parent = SC.View.create({
      buildInDidFinishFor: function() {
        this._super();
        this.called_buildInDidFinishFor = YES;
      },
      buildOutDidFinishFor: function() {
        this._super();
        this.called_buildOutDidFinishFor = YES;
      }
    });
    buildableView = SC.View.create({
      buildIn: function() {
        this.called_any = YES;
        this.called_buildIn = YES;
      },
      
      resetBuild: function() {
        this.called_any = YES;
        this.called_resetBuild = YES;
      },
      
      buildOut: function() {
        this.called_any = YES;
        this.called_buildOut = YES;
      },
      
      buildOutDidCancel: function() {
        this.called_any = YES;
        this.called_buildOutDidCancel = YES;
      },
      
      buildInDidCancel: function() {
        this.called_any = YES;
        this.called_buildInDidCancel = YES;
      }
    });
  },
  
  teardown: function() {
  }
});

test("Calling buildInChild adds child and builds it in.", function(){
  var v = buildableView, p = parent;
  p.buildInChild(v);
  
  // check right after build in is called
  ok(v.called_buildIn, "child started build in.");
  ok(v.isBuildingIn, "child is building in.");
  ok(!p.called_buildInDidFinishFor, "child has not finished building in, according to parent.");
  
  // the parent view should be set already
  equal(v.get("parentView"), p, "Parent view should be the parent");
  
  // finish build in
  v.buildInDidFinish();
  
  // now check that the view registered that finish
  ok(p.called_buildInDidFinishFor, "child has finished building in, according to parent.");
});


test("Calling buildOutChild builds out the child, and only removes it when done.", function() {
  var v = buildableView, p = parent;
  p.buildInChild(v);
  v.buildInDidFinish();
  
  p.buildOutChild(v);
  ok(v.called_buildOut, "child started build out.");
  ok(v.isBuildingOut, "child is building out.");
  ok(!p.called_buildOutDidFinishFor, "child has not finished building out, according to parent.");
  equal(v.get("parentView"), p, "Parent view should still be the former parent");
  
  // finish build out
  v.buildOutDidFinish();
  
  ok(p.called_buildOutDidFinishFor, "child has finished building out, according to parent.");
  equal(v.get("parentView"), null, "Parent view is now null");
});

});minispade.register('sproutcore-views/~tests/view/childViewLayout_test', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2013 7x7 Software, Inc.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module, test, equals, ok */

var view;

/** Test the SC.View states. */
module("SC.View:childViewLayout", {

  setup: function () {
    view = SC.View.create();
  },

  teardown: function () {
    view.destroy();
    view = null;
  }

});

test("basic VERTICAL_STACK", function () {
  SC.run(function() {
    view = SC.View.create({

      childViewLayout: SC.View.VERTICAL_STACK,

      childViewLayoutOptions: {
        paddingBefore: 10,
        paddingAfter: 20,
        spacing: 5
      },
      childViews: ['sectionA', 'sectionB', 'sectionC'],
      layout: { left: 10, right: 10, top: 20 },
      sectionA: SC.View.design({
        layout: { height: 100 }
      }),

      sectionB: SC.View.design({
        layout: { border: 1, height: 50 }
      }),

      sectionC: SC.View.design({
        layout: { left: 10, right: 10, height: 120 }
      })

    });
  });

  equal(view.sectionA.layout.top, 10, "sectionA top should be 10");
  equal(view.sectionB.layout.top, 115, "sectionB top should be 115");
  equal(view.sectionC.layout.top, 170, "sectionC top should be 170");
  equal(view.layout.height, 310, "view height should be 310");

});

test("basic HORIZONTAL_STACK", function () {
  SC.run(function() {
    view = SC.View.create({
      childViewLayout: SC.View.HORIZONTAL_STACK,
      childViewLayoutOptions: {
        paddingBefore: 10,
        paddingAfter: 20,
        spacing: 5
      },
      childViews: ['sectionA', 'sectionB', 'sectionC'],
      layout: { left: 10, bottom: 20, top: 20 },

      sectionA: SC.View.design({
        layout: { width: 100 }
      }),

      sectionB: SC.View.design({
        layout: { border: 1, width: 50 }
      }),

      sectionC: SC.View.design({
        layout: { top: 10, bottom: 10, width: 120 }
      })
    });
  });

  equal(view.sectionA.layout.left, 10, "sectionA left should be 10");
  equal(view.sectionB.layout.left, 115, "sectionB left should be 115");
  equal(view.sectionC.layout.left, 170, "sectionC left should be 170");
  equal(view.layout.width, 310, "view width should be 310");

});

});minispade.register('sproutcore-views/~tests/view/class_name_bindings_test', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module test equals context ok same */

module("SC.CoreView - Class Name Bindings");

test("should apply bound class names to the element", function() {
  var view = SC.View.create({
    classNameBindings: ['priority', 'isUrgent', 'isClassified:classified', 'canIgnore'],

    priority: 'high',
    isUrgent: true,
    isClassified: true,
    canIgnore: false
  });

  view.createLayer();
  ok(view.$().hasClass('high'), "adds string values as class name");
  ok(view.$().hasClass('is-urgent'), "adds true Boolean values by dasherizing");
  ok(view.$().hasClass('classified'), "supports customizing class name for Boolean values");
  ok(!view.$().hasClass('can-ignore'), "does not add false Boolean values as class");
});

test("should add, remove, or change class names if changed after element is created", function() {
  var view = SC.View.create({
    classNameBindings: ['priority', 'isUrgent', 'isClassified:classified', 'canIgnore'],

    priority: 'high',
    isUrgent: true,
    isClassified: true,
    canIgnore: false
  });

  view.createLayer();

  view.set('priority', 'orange');
  view.set('isUrgent', false);
  view.set('isClassified', false);
  view.set('canIgnore', true);

  ok(view.$().hasClass('orange'), "updates string values");
  ok(!view.$().hasClass('high'), "removes old string value");

  ok(!view.$().hasClass('is-urgent'), "removes dasherized class when changed from true to false");
  ok(!view.$().hasClass('classified'), "removes customized class name when changed from true to false");
  ok(view.$().hasClass('can-ignore'), "adds dasherized class when changed from false to true");
});

test("should preserve class names applied via classNameBindings when view layer is updated",
function(){
  var view = SC.View.create({
    classNameBindings: ['isUrgent', 'isClassified:classified'],
    isClassified: true,
    isUrgent: false
  });
  view.createLayer();
  ok(!view.$().hasClass('can-ignore'), "does not add false Boolean values as class");
  ok(view.$().hasClass('classified'), "supports customizing class name for Boolean values");
  view.set('isClassified', false);
  view.set('isUrgent', true);
  ok(view.$().hasClass('is-urgent'), "adds dasherized class when changed from false to true");
  ok(!view.$().hasClass('classified'), "removes customized class name when changed from true to false");
  view.set('layerNeedsUpdate', YES);
  view.updateLayer();
  ok(view.$().hasClass('is-urgent'), "still has class when view display property is updated");
  ok(!view.$().hasClass('classified'), "still does not have customized class when view display property is updated");
});

});minispade.register('sproutcore-views/~tests/view/clippingFrame', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ htmlbody */

var pane, a, aa ;
module("SC.View#clippingFrame", {
  setup: function() {
    htmlbody('<style> .sc-view { border: 1px blue solid; position: absolute;  overflow: hidden; }</style>');
    SC.RunLoop.begin();
    pane = SC.Pane.design()
      .layout({ top: 0, left: 0, width: 200, height: 200 })
      .childView(SC.View.design()
        .layout({ top: 50, left: 50, width: 100, height: 100 })
        .childView(SC.View.design()
          .layout({ top: 20, left: 20, width: 40, height: 40 })))
      .create();
    pane.append();
    a = pane.childViews[0];
    aa = a.childViews[0];
  },

  teardown: function() {
    pane.remove();
    pane.destroy();
    pane = a = aa = null ;
    SC.RunLoop.end();
    clearHtmlbody();
  }
});

test("clippingFrame === frame w/ 0 offset if not partially hidden", function() {
  var result = pane.get('clippingFrame'), expected = pane.get('frame');
  expected.x = expected.y = 0 ;
  deepEqual(result, expected, 'pane');

  result = a.get('clippingFrame'); expected = a.get('frame');
  expected.x = expected.y = 0 ;
  deepEqual(result, expected, 'child');

  result = aa.get('clippingFrame'); expected = aa.get('frame');
  expected.x = expected.y = 0 ;
  deepEqual(result, expected, 'nested child');
});

test("cuts off top of frame", function() {
  var result, expected;

  a.adjust('top', -50);
  result = a.get('clippingFrame'); expected = a.get('frame');
  expected.x = 0 ; expected.y = 50 ; expected.height = 50 ;
  deepEqual(result, expected, 'child');

  result = aa.get('clippingFrame'); expected = aa.get('frame');
  expected.x = 0 ; expected.y = 30 ; expected.height = 10 ;
  deepEqual(result, expected, 'nested child');
});

test("cuts off bottom of frame", function() {
  var result, expected;

  a.adjust('top', 150);
  result = a.get('clippingFrame'); expected = a.get('frame');
  expected.x = 0 ; expected.y = 0 ; expected.height = 50 ;
  deepEqual(result, expected, 'child');

  result = aa.get('clippingFrame'); expected = aa.get('frame');
  expected.x = 0 ; expected.y = 0 ; expected.height = 30 ;
  deepEqual(result, expected, 'nested child');
});

test("cuts off left of frame", function() {
  var result, expected;

  a.adjust('left', -50);
  result = a.get('clippingFrame'); expected = a.get('frame');
  expected.y = 0 ; expected.x = 50 ; expected.width = 50 ;
  deepEqual(result, expected, 'child');

  result = aa.get('clippingFrame'); expected = aa.get('frame');
  expected.y = 0 ; expected.x = 30 ; expected.width = 10 ;
  deepEqual(result, expected, 'nested child');
});

test("cuts off right of frame", function() {
  var result, expected;

  a.adjust('left', 150);
  result = a.get('clippingFrame'); expected = a.get('frame');
  expected.y = 0 ; expected.x = 0 ; expected.width = 50 ;
  deepEqual(result, expected, 'child');

  result = aa.get('clippingFrame'); expected = aa.get('frame');
  expected.y = 0 ; expected.x = 0 ; expected.width = 30 ;
  deepEqual(result, expected, 'nested child');
});

test("notifies receiver and each child if parent clipping frame changes", function() {
  var callCount = 0;

  // setup observers
  function observer() { callCount++; }
  a.addObserver('clippingFrame', observer);
  aa.addObserver('clippingFrame', observer);

  // now, adjust layout of child so that clipping frame will change...
  a.adjust('top', -50);

  // IMPORTANT:  If this test fails because the callCount is > 2 it means that
  // when you set the layout, the frame is getting invalidated more than once.
  // This should not happen.  If this is the case, fix the view code so that
  // it does not invalidate frame more than once before you change this
  // number.
  equal(callCount, 2, 'should invoke observer on child and nested child');
});

test("returns 0, 0, W, H if parentView has no clippingFrame", function(){
  a.clippingFrame = null;

  var targetFrame = aa.get('clippingFrame');

  equal(targetFrame.x, 0, "x should be 0");
  equal(targetFrame.y, 0, "y should be 0");
  equal(targetFrame.width, 40, "width should be 40");
  equal(targetFrame.height, 40, "height should be 40");
});

});minispade.register('sproutcore-views/~tests/view/convertFrames', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ htmlbody */


// ..........................................................
// COMMON SETUP CODE
//
var pane, a, b, aa, aaa, bb, f ;
var A_LEFT = 10, A_TOP = 10, B_LEFT = 100, B_TOP = 100;

function setupFrameViews() {
  htmlbody('<style> .sc-view { border: 1px blue solid; position: absolute; }</style>');

  pane = SC.Pane.design()
    .layout({ top: 0, left: 0, width: 400, height: 300 })
    .childView(SC.View.design()
      .layout({ top: A_TOP, left: A_LEFT, width: 150, height: 150 })
      .childView(SC.View.design()
        .layout({ top: A_TOP, left: A_LEFT, width: 50, height: 50 })
        .childView(SC.View.design()
          .layout({ top: A_TOP, left: A_LEFT, width: 10, height: 10 }))))

    .childView(SC.View.design()
      .layout({ top: B_TOP, left: B_LEFT, width: 150, height: 150 })
      .childView(SC.View.design()
        .layout({ top: B_TOP, left: B_LEFT, width: 10, height: 10 })))
    .create();

  a = pane.childViews[0];
  b = pane.childViews[1];
  aa = a.childViews[0];
  aaa = aa.childViews[0];
  bb = b.childViews[0];

  f = { x: 10, y: 10, width: 10, height: 10 };
  pane.append();
}

function teardownFrameViews() {
  pane.remove() ;
  pane.destroy();
  pane = a = aa = aaa = b = bb = null ;
  clearHtmlbody();
}

// ..........................................................
// convertFrameToView()
//
module('SC.View#convertFrameToView', {
  setup: setupFrameViews, teardown: teardownFrameViews
});

test("convert a -> top level", function() {
  var result = a.convertFrameToView(f, null);
  f.x += A_LEFT; f.y += A_TOP ;
  deepEqual(result, f, 'should convert frame');
});

test("convert child -> top level", function() {
  var result = aa.convertFrameToView(f, null);
  f.x += A_LEFT*2; f.y += A_TOP*2 ;
  deepEqual(result, f, 'should convert frame');
});

test("convert nested child -> top level", function() {
  var result = aaa.convertFrameToView(f, null);
  f.x += A_LEFT*3; f.y += A_TOP*3 ;
  deepEqual(result, f, 'should convert frame');
});


test("convert a -> sibling", function() {
  var result = a.convertFrameToView(f, b);
  f.x += A_LEFT - B_LEFT; f.y += A_TOP - B_TOP ;
  deepEqual(result, f, 'should convert frame');
});

test("convert child -> parent sibling", function() {
  var result = aa.convertFrameToView(f, b);
  f.x += A_LEFT*2 - B_LEFT; f.y += A_TOP*2 - B_TOP ;
  deepEqual(result, f, 'should convert frame');
});

test("convert nested child -> parent sibling", function() {
  var result = aaa.convertFrameToView(f, b);
  f.x += A_LEFT*3 - B_LEFT; f.y += A_TOP*3 - B_TOP ;
  deepEqual(result, f, 'should convert frame');
});



test("convert a -> child", function() {
  var result = a.convertFrameToView(f, aa);
  f.x -= A_LEFT; f.y -= A_TOP ;
  deepEqual(result, f, 'should convert frame');
});

test("convert child -> parent", function() {
  var result = aa.convertFrameToView(f, a);
  f.x += A_LEFT; f.y += A_TOP ;
  deepEqual(result, f, 'should convert frame');
});

test("convert nested child -> parent", function() {
  var result = aaa.convertFrameToView(f, a);
  f.x += A_LEFT*2; f.y += A_TOP*2 ;
  deepEqual(result, f, 'should convert frame');
});



test("convert a -> nested child", function() {
  var result = a.convertFrameToView(f, aaa);
  f.x -= (A_LEFT+A_LEFT); f.y -= (A_TOP+A_TOP) ;
  deepEqual(result, f, 'should convert frame');
});

test("convert nested child -> direct parent (child)", function() {
  var result = aaa.convertFrameToView(f, aa);
  f.x += A_LEFT; f.y += (A_TOP) ;
  deepEqual(result, f, 'should convert frame');
});



test("convert a -> child of sibling", function() {
  var result = a.convertFrameToView(f, bb);
  f.x += A_LEFT - (B_LEFT+B_LEFT); f.y += A_TOP - (B_TOP+B_TOP) ;
  deepEqual(result, f, 'should convert frame');
});


test("convert child -> child of sibling", function() {
  var result = aa.convertFrameToView(f, bb);
  f.x += A_LEFT*2 - (B_LEFT+B_LEFT); f.y += A_TOP*2 - (B_TOP+B_TOP) ;
  deepEqual(result, f, 'should convert frame');
});

test("convert nested child -> child of sibling", function() {
  var result = aaa.convertFrameToView(f, bb);
  f.x += A_LEFT*3 - (B_LEFT+B_LEFT); f.y += A_TOP*3 - (B_TOP+B_TOP) ;
  deepEqual(result, f, 'should convert frame');
});


// ..........................................................
// convertFrameFromView()
//
module('SC.View#convertFrameFromView', {
  setup: setupFrameViews, teardown: teardownFrameViews
});

test("convert a <- top level", function() {
  var result = a.convertFrameFromView(f, null);
  f.x -= A_LEFT; f.y -= A_TOP ;
  deepEqual(result, f, 'should convert frame');
});

test("convert child <- top level", function() {
  var result = aa.convertFrameFromView(f, null);
  f.x -= A_LEFT*2; f.y -= A_TOP*2 ;
  deepEqual(result, f, 'should convert frame');
});

test("convert nested child <- top level", function() {
  var result = aaa.convertFrameFromView(f, null);
  f.x -= A_LEFT*3; f.y -= A_TOP*3 ;
  deepEqual(result, f, 'should convert frame');
});


test("convert a <- sibling", function() {
  var result = a.convertFrameFromView(f, b);
  f.x += B_LEFT - A_LEFT; f.y += B_TOP - A_TOP ;
  deepEqual(result, f, 'should convert frame');
});

test("convert child <- parent sibling", function() {
  var result = aa.convertFrameFromView(f, b);
  f.x += B_LEFT - A_LEFT*2; f.y += B_TOP - A_TOP*2;
  deepEqual(result, f, 'should convert frame');
});

test("convert nested child <- parent sibling", function() {
  var result = aaa.convertFrameFromView(f, b);
  f.x += B_LEFT - A_LEFT*3; f.y += B_TOP - A_TOP*3;
  deepEqual(result, f, 'should convert frame');
});



test("convert a <- child", function() {
  var result = a.convertFrameFromView(f, aa);
  f.x += A_LEFT; f.y += A_TOP ;
  deepEqual(result, f, 'should convert frame');
});

test("convert child <- parent", function() {
  var result = aa.convertFrameFromView(f, a);
  f.x -= A_LEFT; f.y -= A_TOP ;
  deepEqual(result, f, 'should convert frame');
});

test("convert nested child <- parent", function() {
  var result = aaa.convertFrameFromView(f, a);
  f.x -= A_LEFT*2; f.y -= A_TOP*2 ;
  deepEqual(result, f, 'should convert frame');
});



test("convert a <- nested child", function() {
  var result = a.convertFrameFromView(f, aaa);
  f.x += (A_LEFT+A_LEFT); f.y += (A_TOP+A_TOP) ;
  deepEqual(result, f, 'should convert frame');
});

test("convert nested child <- direct parent (child)", function() {
  var result = aaa.convertFrameFromView(f, aa);
  f.x -= A_LEFT; f.y -= (A_TOP) ;
  deepEqual(result, f, 'should convert frame');
});



test("convert a <- child of sibling", function() {
  var result = a.convertFrameFromView(f, bb);
  f.x += (B_LEFT+B_LEFT) - A_LEFT ; f.y += (B_TOP+B_TOP) - A_TOP ;
  deepEqual(result, f, 'should convert frame');
});


test("convert child <- child of sibling", function() {
  var result = aa.convertFrameFromView(f, bb);
  f.x += (B_LEFT+B_LEFT) - A_LEFT*2; f.y += (B_TOP+B_TOP) - A_TOP*2;
  deepEqual(result, f, 'should convert frame');
});

test("convert nested child <- child of sibling", function() {
  var result = aaa.convertFrameFromView(f, bb);
  f.x += (B_LEFT+B_LEFT) - A_LEFT*3; f.y += (B_TOP+B_TOP) - A_TOP*3 ;
  deepEqual(result, f, 'should convert frame');
});


});minispade.register('sproutcore-views/~tests/view/convertLayouts', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ========================================================================
// View Convertion Layout Unit Tests
// ========================================================================

/*globals module test ok same equals */

/* These unit tests verify:  convertLayoutToAnchoredLayout(), convertLayoutToCustomLayout() */

var parent, child;

/**
  Helper setup that creates a parent and child view so that you can do basic
  tests.
*/
var commonSetup = {
  setup: function() {
    
    // create basic parent view
    parent = SC.View.create({
      layout: { top: 0, left: 0, width: 500, height: 500 }
    });
    
    // create child view to test against.
    child = SC.View.create();
  },
  
  teardown: function() {
    parent = child = null ;
  }
};

// ..........................................................
// TEST LAYOUT WITH BASIC LAYOUT CONVERSION
// 

module('BASIC LAYOUT CONVERSION', commonSetup);

test("layout {top, left, width, height}", function() {
  var layout = { top: 10, left: 10, width: 50, height: 50 };
  var cl = SC.View.convertLayoutToAnchoredLayout(layout, parent.get('frame'));
  deepEqual(cl, layout, 'conversion is equal');
}) ;

test("layout {top, left, bottom, right}", function() {
  var layout = { top: 10, left: 10, bottom: 10, right: 10 };
  var cl = SC.View.convertLayoutToAnchoredLayout(layout, parent.get('frame'));
  
  var testLayout = { top: 10, left: 10, width: 480, height: 480 };
  deepEqual(cl, testLayout, 'conversion is equal');
}) ;

test("layout {bottom, right, width, height}", function() {
  var layout = { bottom: 10, right: 10, width: 50, height: 50 };
  var cl = SC.View.convertLayoutToAnchoredLayout(layout, parent.get('frame'));
  
  var testLayout = { top: 440, left: 440, width: 50, height: 50 };
  deepEqual(cl, testLayout, 'conversion is equal');
}) ;

test("layout {centerX, centerY, width, height}", function() {
  var layout = { centerX: 10, centerY: 10, width: 50, height: 50 };
  var cl = SC.View.convertLayoutToAnchoredLayout(layout, parent.get('frame'));
  
  var testLayout = { top: 235, left: 235, width: 50, height: 50 };
  deepEqual(cl, testLayout, 'conversion is equal');
}) ;


// ..........................................................
// TEST LAYOUT WITH INVALID LAYOUT VARIATIONS
// 

module('INVALID LAYOUT VARIATIONS', commonSetup);

test("layout {top, left} - assume right/bottom=0", function() {
  var layout = { top: 10, left: 10 };
  var cl = SC.View.convertLayoutToAnchoredLayout(layout, parent.get('frame'));
  
  var testLayout = { top: 10, left: 10, width: 490, height: 490 };
  deepEqual(cl, testLayout, 'conversion is equal');
}) ;

test("layout {height, width} - assume top/left=0", function() {
  var layout = { height: 60, width: 60 };
  var cl = SC.View.convertLayoutToAnchoredLayout(layout, parent.get('frame'));
  
  var testLayout = { top: 0, left: 0, width: 60, height: 60 };
  deepEqual(cl, testLayout, 'conversion is equal');
}) ;

test("layout {right, bottom} - assume top/left=0", function() {
  var layout = { right: 10, bottom: 10 };
  var cl = SC.View.convertLayoutToAnchoredLayout(layout, parent.get('frame'));
  
  var testLayout = { top: 0, left: 0, width: 490, height: 490 };
  deepEqual(cl, testLayout, 'conversion is equal');
}) ;

test("layout {centerX, centerY} - assume width/height=0", function() {
  var layout = { centerX: 10, centerY: 10 };
  var cl = SC.View.convertLayoutToAnchoredLayout(layout, parent.get('frame'));
  
  var testLayout = { top: 260, left: 260, width: 0, height: 0 };
  deepEqual(cl, testLayout, 'conversion is equal');
}) ;

test("layout {top, left, centerX, centerY, height, width} - top/left take presidence", function() {
  var layout = { top: 10, left: 10, centerX: 10, centerY: 10, height: 60, width: 60 };
  var cl = SC.View.convertLayoutToAnchoredLayout(layout, parent.get('frame'));
  
  var testLayout = { top: 10, left: 10, width: 60, height: 60 };
  deepEqual(cl, testLayout, 'conversion is equal');
}) ;

test("layout {bottom, right, centerX, centerY, height, width} - bottom/right take presidence", function() {
  var layout = { bottom: 10, right: 10, centerX: 10, centerY: 10, height: 60, width: 60 };
  var cl = SC.View.convertLayoutToAnchoredLayout(layout, parent.get('frame'));
  
  var testLayout = { top: 430, left: 430, width: 60, height: 60 };
  deepEqual(cl, testLayout, 'conversion is equal');
  
}) ;

test("layout {top, left, bottom, right, centerX, centerY, height, width} - top/left take presidence", function() {
  var layout = { top: 10, left: 10, bottom: 10, right: 10, centerX: 10, centerY: 10, height: 60, width: 60 };
  var cl = SC.View.convertLayoutToAnchoredLayout(layout, parent.get('frame'));
  
  var testLayout = { top: 10, left: 10, width: 60, height: 60 };
  deepEqual(cl, testLayout, 'conversion is equal');
}) ;


test("layout {centerX, centerY, width:auto, height:auto}");
/*
test("layout {centerX, centerY, width:auto, height:auto}", function() {
  var error=null;
  var layout = { centerX: 10, centerY: 10, width: 'auto', height: 'auto' };
  child.set('layout', layout) ;
  try{
    child.layoutStyle();
  }catch(e){
    error=e;
  }
  equal(SC.T_ERROR,SC.typeOf(error),'Layout style functions should throw and '+
    'error if centerx/y and width/height are set at the same time ' + error );
}) ;
*/

});minispade.register('sproutcore-views/~tests/view/createChildViews', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

// ..........................................................
// createChildViews()
//
module("SC.View#createChildViews");

test("calls createChildView() for each class or string in childViews array", function() {
  var called = [];
  var v = SC.View.create({
    childViews: [
      SC.View.extend({ key: 0 }), // class - should be called
      SC.View.create({ key: 1 }), // instance - will be called
      'customClassName'           // string - should be called
    ],

    // this should be used for the 'customClassName' item above
    customClassName: SC.View.extend({ key: 2 }),

    // patch to record results...
    createChildView: function(childView) {
      if(childView.isClass) {
        called.push(childView.prototype.key);
      } else {
        called.push(childView.key);
      }
      return this._super();
    }
  });

  // createChildViews() is called automatically during create.
  deepEqual(called, [0,1,2], 'called createChildView for correct children');

  // make sure childViews array is correct now.
  var cv = v.childViews, len = cv.length, idx;
  for(idx=0;idx<len;idx++) {
    equal(cv[idx].key, idx, 'has correct index key');
    ok(cv[idx].isObject, 'isObject - %@'.fmt(cv[idx]));
  }
});

test("should not error when there is a dud view name in childViews list.", function() {
  var called = [];
  var v = SC.View.create({
    childViews: [
      'nonExistantClassName',       // string - should NOT be called
      null,                       // null - should NOT be called
      '',                         // empty string - should NOT be called
      'customClassName'          // string - should be called
    ],
    // this should be used for the 'customClassName' item above
    customClassName: SC.View.extend({ key: 2 }),

    // patch to record results...
    createChildView: function(childView) {
      called.push(childView.prototype.key);
      ok(childView.isClass, "childView: %@ isClass".fmt(childView));
      return this._super();
    }
  });

  // createChildViews() is called automatically during create.
  deepEqual(called, [2], 'called createChildView for correct children');
  equal(v.get('childViews.length'), 1, "The childViews array should not contain any invalid childViews after creation.");
});

test("should not throw error when there is an extra space in the childViews list", function() {
  var called = [];
  var v = SC.View.create({
    childViews: "customClassName  customKlassName".w(),
    // this should be used for the 'customClassName' item above
    customClassName: SC.View.extend({ key: 2 }),
    customKlassName: SC.View.extend({ key: 3 })
  });

  ok(true, "called awake without issue.");

});

test("should not create layer for created child views", function() {
  var v = SC.View.create({
    childViews: [SC.View]
  });
  ok(v.childViews[0].isObject, 'precondition - did create child view');
  equal(v.childViews[0].get('layer'), null, 'childView does not have layer');
});

// ..........................................................
// createChildView()
//

var view, myViewClass ;
module("SC.View#createChildView", {
  setup: function() {
    view = SC.View.create({ page: SC.Object.create() });
    myViewClass = SC.View.extend({ isMyView: YES, foo: 'bar' });
  }
});

test("should create view from class with any passed attributes", function() {
  var v = view.createChildView(myViewClass, { foo: "baz" });
  ok(v.isMyView, 'v is instance of myView');
  equal(v.foo, 'baz', 'view did get custom attributes');
});

test("should set newView.owner & parentView to receiver", function() {
  var v = view.createChildView(myViewClass) ;
  equal(v.get('owner'), view, 'v.owner == view');
  equal(v.get('parentView'), view, 'v.parentView == view');
});

test("should set newView.page to receiver.page unless custom attr is passed", function() {
  var v = view.createChildView(myViewClass) ;
  equal(v.get('page'), view.get('page'), 'v.page == view.page');

  var myPage = SC.Object.create();
  v = view.createChildView(myViewClass, { page: myPage }) ;
  equal(v.get('page'), myPage, 'v.page == custom page');
});

// CoreView has basic visibility support based on state now.
// test("should not change isVisibleInWindow property on views that do not have visibility support", function() {
//   var coreView = SC.CoreView.extend({});

//   SC.run(function() { view.set('isVisible', NO); });
//   var v = view.createChildView(coreView);

//   ok(v.get('isVisibleInWindow'), "SC.CoreView instance always has isVisibleInWindow set to NO");
// });


});minispade.register('sproutcore-views/~tests/view/createLayer', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ */

// ..........................................................
// createLayer()
//
module("SC.View#createLayer");

test("returns the receiver", function() {
  var v = SC.View.create();
  equal(v.createLayer(), v, 'returns receiver');
  v.destroy();
});

test("calls renderToContext() and sets layer to resulting element", function() {
  var v = SC.View.create({
    tagName: 'span',

    renderToContext: function(context, firstTime) {
      context.push("foo");
    }
  });

  equal(v.get('layer'), null, 'precondition - has no layer');
  v.createLayer();

  var elem = v.get('layer');
  ok(!!elem, 'has element now');
  equal(elem.innerHTML, 'foo', 'has innerHTML from context');
  equal(elem.tagName.toString().toLowerCase(), 'span', 'has tagName from view');
  elem = null ;
  v.destroy();
});

test("invokes didCreateLayer() on receiver and all child views", function() {
  var callCount = 0, mixinCount = 0;
  var v = SC.View.create({

    didCreateLayer: function() { callCount++; },
    didCreateLayerMixin: function() { mixinCount++; },

    childViews: [SC.View.extend({
      didCreateLayer: function() { callCount++; },
      childViews: [SC.View.extend({
        didCreateLayer: function() { callCount++; },
        didCreateLayerMixin: function() { mixinCount++; }
      }), SC.View.extend({ /* no didCreateLayer */ })]
    })]
  });

  // verify setup...
  ok(v.didCreateLayer, 'precondition - has root');
  ok(v.childViews[0].didCreateLayer, 'precondition - has firstChild');
  ok(v.childViews[0].childViews[0].didCreateLayer, 'precondition - has nested child');
  ok(!v.get('layer'), 'has no layer');

  v.createLayer();
  equal(callCount, 3, 'did invoke all methods');
  equal(mixinCount, 2, 'did invoke all mixin methods');
  v.destroy();
});

test("generated layer include HTML from child views as well", function() {
  var v = SC.View.create({
    childViews: [ SC.View.extend({ layerId: "foo" })]
  });

  v.createLayer();
  ok($('#foo', v.get('layer')).get(0), 'has element with child layerId');
  v.destroy();
});

test("does NOT assign layer to child views immediately", function() {
  var v = SC.View.create({
    childViews: [ SC.View.extend({ layerId: "foo" })]
  });
  v.createLayer();
  ok(!v.childViews[0]._view_layer, 'has no layer yet');
  v.destroy();
});

// ..........................................................
// USE CASES
//

// when view is first created, createLayer is NOT called

// when view is added to parent view, and parent view is already visible in
// window, layer is created just before adding it to the DOM

// when a pane is added to the window, the pane layer is created.

// when a pane with an exiting layer is removed from the DOM, the layer is removed from the DOM, but it is not destroyed.

// what if we move a view from a parentView that has a layer to a parentView that does NOT have a layer.   Delete layer.

// what if a move a view from a parentView that does NOT have a layer to a parentView that DOES have a layer.

});minispade.register('sproutcore-views/~tests/view/destroy', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/* global module test equals context ok same */

module("SC.View#destroy");

test('isDestroyed works.', function() {
  var v = SC.View.create();
  ok(!v.get('isDestroyed'), 'undestroyed view\'s isDestroyed property is false.');
  v.destroy();
  ok(v.get('isDestroyed'), 'destroyed view\'s isDestroyed property is true.');
});

test('childViews specified as classes are also destroyed.', function() {
  var v = SC.View.create({ childViews: [ SC.View.extend({ childViews: [ SC.View ] }) ] }),
      v2 = v.childViews[0],
      v3 = v2.childViews[0];

  v.destroy();
  ok(v2.get('isDestroyed'), 'destroying a parent also destroys a child, mwaha.');
  ok(v3.get('isDestroyed'), 'destroying a parent also destroys a grandchild, mwaha.');

  SC.run(function() {
    ok(!v2.get('parentView'), 'destroying a parent removes the parentView reference from the child.');
    ok(v2.get('owner') === null, 'destroying a parent removes the owner reference from the child.');
    ok(!v3.get('parentView'), 'destroying a parent removes the parentView reference from the grandchild.');
    ok(v3.get('owner') === null, 'destroying a parent removes the owner reference from the grandchild.');
  });
});

test('childViews specified as instances are also destroyed.', function() {
  var v2 = SC.View.create(),
      v = SC.View.create({ childViews: [v2] });
  v.destroy();
  ok(v2.get('isDestroyed'), 'destroying a parent also destroys a child, mwaha.');

  SC.run(function() {
    ok(!v2.get('parentView'), 'destroying a parent removes the parentView reference from the child.');
    ok(v2.get('owner') === null, 'destroying a parent removes the owner reference from the child.');
  });
});

/**
  There was a bug introduced when we started destroying SC.Binding objects when
  destroying SC.Objects.

  Because the view was overriding destroy to destroy itself first (clearing out
  parentViews), later when we try to clean up bindings, any bindings to the
  parentView property of a view would not be able to remove observers from the
  parent view instance.
*/
test("Destroying a view, should also destroy its binding objects", function () {
  var v, v2;

  SC.run(function() {
    v = SC.View.create({
      childViews: ['v2'],
      foo: 'baz',
      v2: SC.View.extend({
        barBinding: '.parentView.foo'
      })
    });
  });

  v2 = v.get('v2');

  ok(v.hasObserverFor('foo'), "The view should have an observer on 'foo'");
  ok(v2.hasObserverFor('bar'), "The child view should have an observer on 'bar'");

  v.destroy();

  ok(!v.hasObserverFor('foo'), "The view should no longer have an observer on 'foo'");
  ok(!v2.hasObserverFor('bar'), "The child view should no longer have an observer on 'bar'");
});

test('Resigns firstResponder when destroyed.', function() {
  var pane = SC.Pane.create();
  var v = SC.View.create({ parentView: pane, acceptsFirstResponder: YES });
  v.becomeFirstResponder();
  ok(v.get('isFirstResponder'), 'view starts as firstResponder.');
  v.destroy();
  ok(!v.get('isFirstResponder'), 'destroying view resigns firstResponder.');
});

});minispade.register('sproutcore-views/~tests/view/destroyLayer', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module, test, equals, ok */


module("SC.View#destroyLayer");

test("it if has no layer, does nothing", function () {
  var callCount = 0;
  var view = SC.View.create({
    willDestroyLayer: function () { callCount++; }
  });
  ok(!view.get('layer'), 'precond - does NOT have layer');

  view.destroyLayer();
  equal(callCount, 0, 'did not invoke callback');
});

test("if it has a layer, calls willDestroyLayer on receiver and child views then deletes the layer", function () {
  var callCount = 0;

  var view = SC.View.create({
    willDestroyLayer: function () { callCount++; },
    childViews: [SC.View.extend({
      // no willDestroyLayer here... make sure no errors are thrown
      childViews: [SC.View.extend({
        willDestroyLayer: function () { callCount++; }
      })]
    })]
  });
  view.createLayer();
  ok(view.get('layer'), 'precond - view has layer');

  view.destroyLayer();
  equal(callCount, 2, 'invoked destroy layer');
  ok(!view.get('layer'), 'view no longer has layer');
});

test("if it has a layer, calls willDestroyLayerMixin on receiver and child views if defined (comes from mixins)", function () {
  var callCount = 0;

  // make sure this will call both mixins...
  var mixinA = {
    willDestroyLayerMixin: function () { callCount++; }
  };

  var mixinB = {
    willDestroyLayerMixin: function () { callCount++; }
  };

  var view = SC.View.create(mixinA, mixinB, {
    childViews: [SC.View.extend(mixinA, mixinB, {
      childViews: [SC.View.extend(mixinA)]
    })]
  });
  view.createLayer();
  view.destroyLayer();
  equal(callCount, 5, 'invoked willDestroyLayerMixin on all mixins');
});

test("returns receiver", function () {
  var view = SC.View.create().createLayer();
  equal(view.destroyLayer(), view, 'returns receiver');
});

/**
  There is a bug that if childView layers are rendered when the parentView's
  layer is created, the `layer` property on the childView will not be
  cached.  What occurs is that if the childView is removed from the parent
  view without ever having its `layer` requested, then when it comes time
  to destroy the layer of the childView, it will get('layer'), which had a
  bug that only returned a layer if the view has a parent view.  However,
  since the child was removed from the parent first and then destroyed, it
  no longer has a parent view and would return undefined for its `layer`.

  This left elements in the DOM.

  UPDATE:  The addition of the SC.View statechart prevents this from happening.
*/
test("Tests that if the childView's layer was never cached and the childView is removed, it should still destroy the childView's layer", function () {
  var childView,
    layerId,
    pane,
    view;

  childView = SC.View.create({});

  layerId = childView.get('layerId');

  view = SC.View.create({
    childViews: [childView]
  });

  pane = SC.Pane.create({
    childViews: [view]
  }).append();

  ok(document.getElementById(layerId), 'child layer should be in the DOM');
  ok(!childView._view_layer, 'child view should not have cached its layer');
  view.removeChild(childView);
  // Before SC.View states, this would be the case
  // ok(document.getElementById(layerId), 'child layer should be in the DOM');
  ok(!document.getElementById(layerId), 'child layer should not be in the DOM');
  childView.destroy();
  ok(!document.getElementById(layerId), 'child layer should not be in the DOM');

  pane.remove();
  pane.destroy();
});

});minispade.register('sproutcore-views/~tests/view/didAppendToDocument', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            portions copyright @2011 Apple Inc.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test ok equals same */


var counter, pane, view, additionalView;

module("SC.View#didAppendToDocument", {
  setup: function () {
    counter = 0;

    pane = SC.MainPane.create({
      childViews: [
        SC.View.extend({
          render: function (context, firstTime) {
            context.push('new string');
          },
          didAppendToDocument: function (){
            ok(document.getElementById(this.get('layerId')), "view layer should exist");
            counter++;
          }
        })
      ]
    });
    view = pane.childViews[0];

    additionalView = SC.View.create({
      didAppendToDocument: function (){
        ok(document.getElementById(this.get('layerId')), "additionalView layer should exist");
        counter++;
      }
    });
  },

  teardown: function () {
    pane.remove().destroy();
    pane = null;
  }
});

test("Check that didAppendToDocument gets called at the right moment", function () {

  equal(counter, 0, "precond - has not been called yet");
  pane.append(); // make sure there is a layer...
  equal(counter, 1, "didAppendToDocument was called once");

  SC.run(function () {
    view.updateLayer();
  });

  // This seems incorrect.  It's not appending the view layer again it's just updating it.
  // equal(counter, 1, "didAppendToDocument is called every time a new DOM element is created");

  pane.appendChild(additionalView);

  SC.RunLoop.begin().end();
  equal(counter, 2, "");
});


// Test for bug: when a childView has a non-fixed layout and we request its frame before the parentView has
// a layer and the parentView uses static layout, then the frame returned will be {x: 0, y:0, width: 0, height: 0}
// and any further requests for the childView's frame will not return a new value unless the parentViewDidChange
// or parentViewDidResize.  A weird case, but we prevent it from failing anyhow.
test("Check that childView is updated if the pane has a static layout and view doesn't have a fixed layout", function () {
  var childFrame,
      wrongFrame = { x:0, y:0, width: 0, height: 0 },
      correctFrame;

  pane.set('useStaticLayout', YES);

  childFrame = view.get('frame');
  deepEqual(childFrame, wrongFrame, 'getting frame before layer exists on non-fixed layout childView should return an empty frame');

  SC.run(function () {
    pane.append(); // make sure there is a layer...
  });
  childFrame = view.get('frame');
  correctFrame = pane.get('frame');

  deepEqual(childFrame, correctFrame, 'getting frame after layer exists on non-fixed layout childView should return actual frame');
});


test("Check that childView is updated if it has a static layout", function () {
  var childFrame,
      wrongFrame = {x:0, y:0, width: 0, height: 0},
      correctFrame;

  view.set('useStaticLayout', YES);

  equal(counter, 0, "precond - has not been called yet");
  pane.append(); // make sure there is a layer...
  equal(counter, 1, "didAppendToDocument was called once");
});

});minispade.register('sproutcore-views/~tests/view/enabled_states_test', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module, test,  equals,  ok */

var parent, view, child;

/** Test the SC.View states. */
module("SC.View#enabledState", {

  setup: function () {
    child = SC.View.create();
    view = SC.View.create({ childViews: [child] });
    parent = SC.View.create({ childViews: [view] });
  },

  teardown: function () {
    parent.destroy();
    parent = view = child = null;
  }

});

/**
  Test the initial state.
  */
test("Test initial states.", function () {
  // Test expected state of the views.
  equal(parent.enabledState, SC.CoreView.ENABLED, "A regular parent view should be in the state");
  equal(view.enabledState, SC.CoreView.ENABLED, "A regular view should be in the state");
  equal(child.enabledState, SC.CoreView.ENABLED, "A regular child view should be in the state");
  ok(parent.get('isEnabled'), "isEnabled should be true");
  ok(parent.get('isEnabledInPane'), "isEnabledInPane should be true");
  ok(view.get('isEnabled'), "isEnabled should be true");
  ok(view.get('isEnabledInPane'), "isEnabledInPane should be true");
  ok(child.get('isEnabled'), "isEnabled should be true");
  ok(child.get('isEnabledInPane'), "isEnabledInPane should be true");
});

test("Test initial disabled states.", function () {
  var newChild = SC.View.create({}),
    newView = SC.View.create({ isEnabled: false, childViews: [newChild] }),
    newParent;

  equal(newView.enabledState, SC.CoreView.DISABLED, "A disabled on creation view should be in the state");
  equal(newChild.enabledState, SC.CoreView.DISABLED_BY_PARENT, "A regular child view of disabled on creation parent should be in the state");

  newParent = SC.View.create({ isEnabled: false, childViews: [newView] });

  equal(newParent.enabledState, SC.CoreView.DISABLED, "A disabled on creation parent view should be in the state");
  equal(newView.enabledState, SC.CoreView.DISABLED_AND_BY_PARENT, "A disabled on creation view of disabled on creation parent should be in the state");
  equal(newChild.enabledState, SC.CoreView.DISABLED_BY_PARENT, "A regular child view of disabled on creation parent should be in the state");

  newParent.destroy();
  newView.destroy();
  newChild.destroy();
});

/**
  Test changing isEnabled to false on the child.
  */
test("Test toggling isEnabled on child.", function () {
  SC.run(function () {
    child.set('isEnabled', false);
  });

  // Test expected state of the views.
  SC.run(function () {
    equal(parent.enabledState, SC.CoreView.ENABLED, "A regular parent view should be in the state");
    equal(view.enabledState, SC.CoreView.ENABLED, "A regular view should be in the state");
    equal(child.enabledState, SC.CoreView.DISABLED, "A disabled child view should be in the state");
    ok(parent.get('isEnabled'), "isEnabled should be true");
    ok(parent.get('isEnabledInPane'), "isEnabledInPane should be true");
    ok(view.get('isEnabled'), "isEnabled should be true");
    ok(view.get('isEnabledInPane'), "isEnabledInPane should be true");
    ok(!child.get('isEnabled'), "isEnabled should be false");
    ok(!child.get('isEnabledInPane'), "isEnabledInPane should be false");
  });
});

/**
  Test changing isEnabled to false on the view.
  */
test("Test toggling isEnabled on view.", function () {
  SC.run(function () {
    view.set('isEnabled', false);
  });

  // Test expected state of the views.
  SC.run(function () {
    equal(parent.enabledState, SC.CoreView.ENABLED, "A regular parent view should be in the state");
    equal(view.enabledState, SC.CoreView.DISABLED, "A disabled view should be in the state");
    equal(child.enabledState, SC.CoreView.DISABLED_BY_PARENT, "A regular child view with disabled ancestor should be in the state");
    ok(parent.get('isEnabled'), "isEnabled should be true");
    ok(parent.get('isEnabledInPane'), "isEnabledInPane should be true");
    ok(!view.get('isEnabled'), "isEnabled should be false");
    ok(!view.get('isEnabledInPane'), "isEnabledInPane should be false");
    ok(child.get('isEnabled'), "isEnabled should be true");
    ok(!child.get('isEnabledInPane'), "isEnabledInPane should be false");
  });

  SC.run(function () {
    child.set('isEnabled', false);
  });

  // Test expected state of the views.
  SC.run(function () {
    equal(parent.enabledState, SC.CoreView.ENABLED, "A regular parent view should be in the state");
    equal(view.enabledState, SC.CoreView.DISABLED, "A disabled view should be in the state");
    equal(child.enabledState, SC.CoreView.DISABLED_AND_BY_PARENT, "A disabled child view with disabled ancestor should be in the state");
    ok(parent.get('isEnabled'), "isEnabled should be true");
    ok(parent.get('isEnabledInPane'), "isEnabledInPane should be true");
    ok(!view.get('isEnabled'), "isEnabled should be false");
    ok(!view.get('isEnabledInPane'), "isEnabledInPane should be false");
    ok(!child.get('isEnabled'), "isEnabled should be true");
    ok(!child.get('isEnabledInPane'), "isEnabledInPane should be false");
  });

  SC.run(function () {
    view.set('isEnabled', true);
  });

  // Test expected state of the views.
  SC.run(function () {
    equal(parent.enabledState, SC.CoreView.ENABLED, "A regular parent view should be in the state");
    equal(view.enabledState, SC.CoreView.ENABLED, "A regular view should be in the state");
    equal(child.enabledState, SC.CoreView.DISABLED, "A disabled child view should be in the state");
    ok(parent.get('isEnabled'), "isEnabled should be true");
    ok(parent.get('isEnabledInPane'), "isEnabledInPane should be true");
    ok(view.get('isEnabled'), "isEnabled should be false");
    ok(view.get('isEnabledInPane'), "isEnabledInPane should be false");
    ok(!child.get('isEnabled'), "isEnabled should be true");
    ok(!child.get('isEnabledInPane'), "isEnabledInPane should be false");
  });
});

/**
  Test changing isEnabled to false on the view.
  */
test("Test toggling isEnabled on parent.", function () {
  SC.run(function () {
    parent.set('isEnabled', false);
  });

  // Test expected state of the views.
  SC.run(function () {
    equal(parent.enabledState, SC.CoreView.DISABLED, "A disabled parent view should be in the state");
    equal(view.enabledState, SC.CoreView.DISABLED_BY_PARENT, "A regular view with disabled parent should be in the state");
    equal(child.enabledState, SC.CoreView.DISABLED_BY_PARENT, "A regular child view with disabled ancestor should be in the state");
    ok(!parent.get('isEnabled'), "disabled parent isEnabled should be false");
    ok(!parent.get('isEnabledInPane'), "disabled parent isEnabledInPane should be false");
    ok(view.get('isEnabled'), "view isEnabled should be true");
    ok(!view.get('isEnabledInPane'), "view isEnabledInPane should be false");
    ok(child.get('isEnabled'), "child isEnabled should be true");
    ok(!child.get('isEnabledInPane'), "child isEnabledInPane should be false");
  });

  SC.run(function () {
    child.set('isEnabled', false);
  });

  // Test expected state of the views.
  SC.run(function () {
    equal(parent.enabledState, SC.CoreView.DISABLED, "A disabled parent view should be in the state");
    equal(view.enabledState, SC.CoreView.DISABLED_BY_PARENT, "A regular view with disabled parent should be in the state");
    equal(child.enabledState, SC.CoreView.DISABLED_AND_BY_PARENT, "A disabled child view with disabled ancestor should be in the state");
    ok(!parent.get('isEnabled'), "isEnabled should be false");
    ok(!parent.get('isEnabledInPane'), "isEnabledInPane should be false");
    ok(view.get('isEnabled'), "view isEnabled should be true");
    ok(!view.get('isEnabledInPane'), "view isEnabledInPane should be false");
    ok(!child.get('isEnabled'), "disabled child isEnabled should be false");
    ok(!child.get('isEnabledInPane'), "disabled child isEnabledInPane should be false");
  });

  SC.run(function () {
    parent.set('isEnabled', true);
  });

  // Test expected state of the views.
  SC.run(function () {
    equal(parent.enabledState, SC.CoreView.ENABLED, "A regular parent view should be in the state");
    equal(view.enabledState, SC.CoreView.ENABLED, "A regular view should be in the state");
    equal(child.enabledState, SC.CoreView.DISABLED, "A disabled child view should be in the state");
    ok(parent.get('isEnabled'), "isEnabled should be true");
    ok(parent.get('isEnabledInPane'), "isEnabledInPane should be true");
    ok(view.get('isEnabled'), "isEnabled should be true");
    ok(view.get('isEnabledInPane'), "isEnabledInPane should be true");
    ok(!child.get('isEnabled'), "disabled child isEnabled should be false");
    ok(!child.get('isEnabledInPane'), "disabled child isEnabledInPane should be false");
  });
});

/**
  Test changing isEnabled to false on the view.
  */
test("Test toggling isEnabled on view.", function () {
  SC.run(function () {
    view.set('isEnabled', false);
  });

  // Test expected state of the views.
  SC.run(function () {
    equal(parent.enabledState, SC.CoreView.ENABLED, "A regular parent view should be in the state");
    equal(view.enabledState, SC.CoreView.DISABLED, "A disabled view should be in the state");
    equal(child.enabledState, SC.CoreView.DISABLED_BY_PARENT, "A regular child view with disabled ancestor should be in the state");
    ok(parent.get('isEnabled'), "isEnabled should be true");
    ok(parent.get('isEnabledInPane'), "isEnabledInPane should be true");
    ok(!view.get('isEnabled'), "isEnabled should be false");
    ok(!view.get('isEnabledInPane'), "isEnabledInPane should be false");
    ok(child.get('isEnabled'), "isEnabled should be true");
    ok(!child.get('isEnabledInPane'), "isEnabledInPane should be false");
  });

  SC.run(function () {
    child.set('isEnabled', false);
  });

  // Test expected state of the views.
  SC.run(function () {
    equal(parent.enabledState, SC.CoreView.ENABLED, "A regular parent view should be in the state");
    equal(view.enabledState, SC.CoreView.DISABLED, "A disabled view should be in the state");
    equal(child.enabledState, SC.CoreView.DISABLED_AND_BY_PARENT, "A disabled child view with disabled ancestor should be in the state");
    ok(parent.get('isEnabled'), "isEnabled should be true");
    ok(parent.get('isEnabledInPane'), "isEnabledInPane should be true");
    ok(!view.get('isEnabled'), "isEnabled should be false");
    ok(!view.get('isEnabledInPane'), "isEnabledInPane should be false");
    ok(!child.get('isEnabled'), "isEnabled should be true");
    ok(!child.get('isEnabledInPane'), "isEnabledInPane should be false");
  });

  SC.run(function () {
    view.set('isEnabled', true);
  });

  // Test expected state of the views.
  SC.run(function () {
    equal(parent.enabledState, SC.CoreView.ENABLED, "A regular parent view should be in the state");
    equal(view.enabledState, SC.CoreView.ENABLED, "A regular view should be in the state");
    equal(child.enabledState, SC.CoreView.DISABLED, "A disabled child view should be in the state");
    ok(parent.get('isEnabled'), "isEnabled should be true");
    ok(parent.get('isEnabledInPane'), "isEnabledInPane should be true");
    ok(view.get('isEnabled'), "isEnabled should be false");
    ok(view.get('isEnabledInPane'), "isEnabledInPane should be false");
    ok(!child.get('isEnabled'), "isEnabled should be true");
    ok(!child.get('isEnabledInPane'), "isEnabledInPane should be false");
  });
});

/**
  Test changing isEnabled to false on the view.
  */
test("Test shouldInheritEnabled.", function () {
  SC.run(function () {
    view.set('shouldInheritEnabled', false);
    parent.set('isEnabled', false);
  });

  // Test expected state of the views.
  SC.run(function () {
    equal(parent.enabledState, SC.CoreView.DISABLED, "A disabled parent view should be in the state");
    equal(view.enabledState, SC.CoreView.ENABLED, "A regular view with shouldInheritEnabled with disabled parent should be in the state");
    equal(child.enabledState, SC.CoreView.ENABLED, "A regular child view should be in the state");
  });

  SC.run(function () {
    view.set('isEnabled', false);
  });

  // Test expected state of the views.
  SC.run(function () {
    equal(parent.enabledState, SC.CoreView.DISABLED, "A disabled parent view should be in the state");
    equal(view.enabledState, SC.CoreView.DISABLED, "A disabled view with shouldInheritEnabled and disabled parent should be in the state");
    equal(child.enabledState, SC.CoreView.DISABLED_BY_PARENT, "A regular child view with disabled ancestor should be in the state");
  });

  SC.run(function () {
    parent.set('isEnabled', true);
  });

  // Test expected state of the views.
  SC.run(function () {
    equal(parent.enabledState, SC.CoreView.ENABLED, "A regular parent view should be in the state");
    equal(view.enabledState, SC.CoreView.DISABLED, "A disabled view should be in the state");
    equal(child.enabledState, SC.CoreView.DISABLED_BY_PARENT, "A regular child view with disabled ancestor should be in the state");
  });
});

test("Test toggling isEnabled adds/removes disabled class.", function () {
  parent.createLayer();
  parent._doAttach(document.body);

  ok(!parent.$().hasClass('disabled'), "A regular parent should not have disabled class.");
  SC.run(function () {
    parent.set('isEnabled', false);
  });

  // Test expected state of the views.
  SC.run(function () {
    ok(parent.$().hasClass('disabled'), "A disabled parent should have disabled class.");
  });

  SC.run(function () {
    parent.set('isEnabled', true);
  });

  // Test expected state of the views.
  SC.run(function () {
    ok(!parent.$().hasClass('disabled'), "A re-enabled parent should not have disabled class.");
  });

  parent._doDetach();
  parent.destroyLayer();
});

test("Test optimized display update.", function () {
  SC.run(function () {
    parent.set('isEnabled', false);
  });

  parent.createLayer();
  parent._doAttach(document.body);

  // Test expected state of the views.
  SC.run(function () {
    ok(parent.$().hasClass('disabled'), "A disabled when attached parent should have disabled class.");
  });

  parent._doDetach();
  parent.destroyLayer();
  parent.createLayer();
  parent._doAttach(document.body);

  SC.run(function () {
    parent.set('isEnabled', true);
  });

  // Test expected state of the views.
  SC.run(function () {
    ok(!parent.$().hasClass('disabled'), "A re-enabled parent should not have disabled class.");
  });

  parent._doDetach();
  parent.destroyLayer();
});

test("initializing with isEnabled: false, should still add the proper class on append", function () {
  var newView = SC.View.create({
    isEnabled: false
  });

  parent.createLayer();
  parent._doAttach(document.body);
  parent.appendChild(newView);

  ok(newView.$().hasClass('disabled'), "An initialized as disabled view should have disabled class on append.");
});

});minispade.register('sproutcore-views/~tests/view/findLayerInParentLayer', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

// ..........................................................
// createChildViews()
//
var view, parentDom, childDom, layerId ;
module("SC.View#findLayerInParentLayer", {
  setup: function() {

    layerId = 'foo-123';

    // manually construct a test layer.  next childDom a few layers deep
    childDom = document.createElement('div');
    SC.$(childDom).attr('id', layerId);

    var intermediate = document.createElement('div');
    intermediate.appendChild(childDom);

    parentDom = document.createElement('div');
    parentDom.appendChild(intermediate);
    intermediate = null;


    // setup view w/ layerId
    view = SC.View.create({ layerId: layerId });
  },

  teardown: function() {
    view.destroy();
    view = parentDom = childDom = layerId = null;
  }
});

test("discovers layer by finding element with matching layerId - when DOM is in document already", function() {
  document.body.appendChild(parentDom);
  equal(view.findLayerInParentLayer(parentDom), childDom, 'should find childDom');
  document.body.removeChild(parentDom); // cleanup or else next test may fail
});

test("discovers layer by finding element with matching layerId - when parent DOM is NOT in document", function() {
  if(parentDom.parentNode) equal(parentDom.parentNode.nodeType, 11, 'precond - NOT in parent doc');
  else equal(parentDom.parentNode, null, 'precond - NOT in parent doc');
  equal(view.findLayerInParentLayer(parentDom), childDom, 'found childDom');
});


});minispade.register('sproutcore-views/~tests/view/init', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

module("SC.View#init");

test("registers view in the global views hash using layerId for event targeted", function () {
  var v = SC.View.create();
  equal(SC.View.views[v.get('layerId')], v, 'registers view');
});

test("adds displayDidChange observer on all display properties (when rendered)", function () {
  var didChange = NO;
  var v = SC.View.create({
    // override just to make sure the registration works...
    displayDidChange: function () { didChange = YES; },

    displayProperties: 'foo bar'.w(),

    foo: 'foo',
    bar: 'bar'
  });

  v.set('foo', 'baz');
  ok(!didChange, '!didChange on set(foo) before view is rendered');
  didChange = NO;

  v.set('bar', 'baz');
  ok(!didChange, '!didChange on set(bar) before view is rendered');

  // Render the view.
  v._doRender();

  v.set('foo', 'buz');
  ok(didChange, 'didChange on set(foo) after view is rendered');
  didChange = NO;

  v.set('bar', 'buz');
  ok(didChange, 'didChange on set(bar) after view is rendered');
});

test("invokes createChildViews()", function () {
  var didInvoke = NO;
  var v = SC.View.create({
    // override just for test
    createChildViews: function () { didInvoke = YES; }
  });
  ok(didInvoke, 'did invoke createChildViews()');
});

test("does NOT create layer", function () {
  var v = SC.View.create();
  equal(v.get('layer'), null, 'did not create layer');
});



});minispade.register('sproutcore-views/~tests/view/insertBefore', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

var parent, child;
module("SC.View#insertBefore", {
	setup: function() {
	  child = SC.View.create();
	  parent = SC.View.create({
	    childViews: [SC.View]
	  });
	}
});

test("returns receiver", function() {
  equal(parent.insertBefore(child, null), parent, 'receiver');
});

test("makes set child.parentView = to new parent view", function() {
	ok(child.get('parentView')!==parent, 'precond - parent is not child.parentView yet');

	// add observer to make sure property change triggers
	var callCount = 0;
	child.addObserver('parentView', function() {
	  callCount++;
	});

	parent.insertBefore(child, null);
	equal(child.get('parentView'), parent, 'parent is child.parentView');
	equal(callCount, 1, 'observer did fire');
});

test("insertBefore(child, null) appends child to end of parent.childView's array", function() {
	parent.insertBefore(child, null);
	equal(parent.childViews[parent.childViews.length-1], child, 'child is last childView');
});

test("insertBefore(child, otherChild) inserts child before other child view", function() {

  var otherChild = parent.childViews[0]; // get current first child
  ok(otherChild, 'precond - otherChild is not null');
  parent.insertBefore(child, otherChild);
  equal(parent.childViews[0], child, 'child inserted before other child');
});

test("invokes willAddChild() on receiver if defined before adding child" ,function() {

  // monkey patch to test
  var callCount = 0;
  var otherChild = parent.childViews[0];
  parent.willAddChild = function(newChild, beforeView) {

  	// verify params
  	equal(newChild, child, 'passed newChild');
  	equal(beforeView, otherChild, 'passed beforeView');

  	// verify this is called BEFORE the view is added
  	ok(parent.childViews.indexOf(child)<0, 'should not have child yet');
  	ok(child.get('parentView')!==parent, 'childView not changed yet either');
  	callCount++;
  };


  parent.insertBefore(child, otherChild);
  equal(callCount, 1, 'invoked');
});

test("invokes willAddToParent() on child view if defined before adding child" ,function() {

  // monkey patch to test
  var callCount = 0;
  var otherChild = parent.childViews[0];
  child.willAddToParent = function(parentView, beforeView) {

  	// verify params
  	equal(parentView, parent, 'passed parent');
  	equal(beforeView, otherChild, 'passed beforeView');

  	// verify this is called BEFORE the view is added
  	ok(parent.childViews.indexOf(child)<0, 'should not have child yet');
  	ok(child.get('parentView')!==parent, 'childView not changed yet either');
  	callCount++;
  };


  parent.insertBefore(child, otherChild);
  equal(callCount, 1, 'invoked');
});

test("invokes didAddChild() on receiver if defined after adding child" ,function() {

  // monkey patch to test
  var callCount = 0;
  var otherChild = parent.childViews[0];
  parent.didAddChild = function(newChild, beforeView) {

  	// verify params
  	equal(newChild, child, 'passed newChild');
  	equal(beforeView, otherChild, 'passed beforeView');

  	// verify this is called AFTER the view is added
  	ok(parent.childViews.indexOf(child)>=0, 'should have child');
  	ok(child.get('parentView')===parent, 'childView should have new parentView');
  	callCount++;
  };

  SC.RunLoop.begin();
  parent.insertBefore(child, otherChild);
  SC.RunLoop.end();

  equal(callCount, 1, 'invoked');
});

test("invokes didAddToParent() on child view if defined after adding child" ,function() {

  // monkey patch to test
  var callCount = 0;
  var otherChild = parent.childViews[0];
  child.didAddToParent = function(parentView, beforeView) {

  	// verify params
  	equal(parentView, parent, 'passed parent');
  	equal(beforeView, otherChild, 'passed beforeView');

  	// verify this is called AFTER the view is added
  	ok(parent.childViews.indexOf(child)>=0, 'should have child');
  	ok(child.get('parentView')===parent, 'childView should have new parentView');
  	callCount++;
  };

  SC.RunLoop.begin();
  parent.insertBefore(child, otherChild);
  SC.RunLoop.end();

  equal(callCount, 1, 'invoked');
});

// VERIFY LAYER CHANGES ARE DEFERRED
test("should not move layer immediately");
// , function() {

//   parent.createLayer();
//   child.createLayer();

//   ok(parent.get('layer'), 'precond - parent has layer');
//   ok(child.get('layer'), 'precond - child has layer');

//   parent.insertBefore(child, null);
//   ok(child.get('layer').parentNode !== parent.get('layer'), 'did not move layer');

// });

// .......................................................
// appendChild()
//

module('SC.View#appendChild', {
  setup: function() {
    parent = SC.View.create({
      childViews: [SC.View, SC.View]
    });

    child = SC.View.create();
  }
});

test("returns receiver", function() {
  equal(parent.appendChild(child, null), parent, 'receiver');
});


test("should add child to end of childViews", function() {
  parent.appendChild(child);
  equal(parent.childViews[parent.childViews.length-1], child, 'child is last child view');
});



});minispade.register('sproutcore-views/~tests/view/isVisible', function() {// // ==========================================================================
// // Project:   SproutCore - JavaScript Application Framework
// // Copyright: ©2006-2011 Strobe Inc. and contributors.
// //            ©2008-2011 Apple Inc. All rights reserved.
// // License:   Licensed under MIT license (see license.js)
// // ==========================================================================
// // ========================================================================
// // View metrics Unit Tests
// // ========================================================================
// /*globals module test ok isObj equals expects */
//
// /**
//   These tests verify that all view metrics -- frame, clippingFrame,
//   isVisibleInWindow, etc. are correct.
// */
//
// // ..........................................................
// // BASE TESTS
// //
// // These tests exercise the API.  See below for tests that cover edge
// // conditions.  If you find a bug, we recommend that you add a test in the
// // edge case section.
//
// var FRAME = { x: 10, y: 10, width: 30, height: 30 };
//
// var pane, view; // test globals
//
// module("isVisible", {
//
//   setup: function() {
//     pane = SC.MainPane.create();
//     view = SC.View.create();
//   },
//
//   teardown: function() {
//     view.destroy();
//     pane.remove().destroy();
//     pane = view = null;
//   }
//
// });
//
// test("a new view should not be visible initially", function() {
//   ok(view.get('isVisible'), "view.get('isVisible') === NO");
// });
//
// test("initializing with isVisible: false, should still add the proper class on append", function() {
//   var newView = SC.View.create({
//     isVisible: false
//   });
//
//   SC.RunLoop.begin();
//   pane.append();
//   pane.appendChild(newView);
//   SC.RunLoop.end();
//   ok(newView.$().hasClass('sc-hidden'), "newView.$().hasClass('sc-hidden') should be true");
// });
//
// test("adding a new view to a visible pane should make it visible", function() {
//   ok(view.get('isVisible'), "view.get('isVisible') === YES");
//   ok(pane.get('isVisible'), "pane.get('isVisible') === YES");
//   SC.RunLoop.begin();
//   pane.appendChild(view);
//   pane.append();
//   view.set('isVisible', NO);
//   SC.RunLoop.end();
//   ok(!view.get('isVisible'), "after pane.appendChild(view), view.get('isVisible') === YES");
//   ok(view.$().hasClass('sc-hidden'), "after view.set('isVisible', NO), view.$().hasClass('sc-hidden') should be true");
// });
//
// test("a view with visibility can have a child view without visibility", function() {
//   var pane = SC.Pane.create({
//     childViews: ['visibleChild'],
//
//     visibleChild: SC.View.design({
//       childViews: ['noVisibilityChild'],
//       noVisibilityChild: SC.CoreView
//     })
//   });
//
//   var errored = false;
//
//   try {
//     pane.append();
//     pane.remove().destroy();
//   } catch(e) {
//     errored = true;
//   } finally {
//     try {
//       pane.remove().destroy();
//     } catch(e2) {
//       errored = true;
//     }
//   }
//
//   ok(!errored, "Inserting a pane containing a child with visibility that itself has a child without visibility does not cause an error");
// });
//
// // Test for issue #1093.
// test("a view whose pane is removed during an isVisible transition gets correctly hidden", function() {
//   SC.RunLoop.begin();
//   var pane = SC.Pane.create({
//     childViews: ['childView'],
//     childView: SC.View.extend({
//       transitionHide: { run: function (view) {
//         view.animate('opacity', 0, 0.4, function () { this.didTransitionOut(); });
//       }}
//     })
//   });
//   pane.append();
//   pane.childView.set('isVisible', NO);
//   equal(pane.childView.get('viewState'), SC.CoreView.ATTACHED_HIDING, 'View is transitioning');
//   pane.remove();
//   SC.RunLoop.end();
//   SC.RunLoop.begin();
//   pane.append();
//   ok(pane.childView.$().hasClass('sc-hidden'), 'View was successfully hidden.')
//   pane.remove();
//   pane.destroy();
//   SC.RunLoop.end();
// });

});minispade.register('sproutcore-views/~tests/view/isVisibleInWindow', function() {// // ==========================================================================
// // Project:   SproutCore - JavaScript Application Framework
// // Copyright: ©2006-2011 Strobe Inc. and contributors.
// //            ©2008-2011 Apple Inc. All rights reserved.
// // License:   Licensed under MIT license (see license.js)
// // ==========================================================================
// // ========================================================================
// // View metrics Unit Tests
// // ========================================================================
// /*global module, test, ok, equals */
//
// /**
//   These tests verify that all view metrics -- frame, clippingFrame,
//   isVisibleInWindow, etc. are correct.
// */
//
// // ..........................................................
// // BASE TESTS
// //
// // These tests exercise the API.  See below for tests that cover edge
// // conditions.  If you find a bug, we recommend that you add a test in the
// // edge case section.
//
// var pane, view; // test globals
//
// module("isVisibleInWindow", {
//
//   setup: function () {
//     pane = SC.MainPane.create();
//     pane.append();
//     view = SC.View.create();
//   },
//
//   teardown: function () {
//     view.destroy();
//     pane.remove().destroy();
//     pane = null;
//   }
//
// });
//
// test("a new view should not be visible initially", function () {
//   ok(!view.get('isVisibleInWindow'), "view.get('isVisibleInWindow') === NO");
// });
//
// test("adding a new view to a visible pane should make it visible", function () {
//   ok(!view.get('isVisibleInWindow'), "view.get('isVisibleInWindow') === NO");
//   ok(pane.get('isVisibleInWindow'), "pane.get('isVisibleInWindow') === YES");
//
//   pane.appendChild(view);
//   ok(view.get('isVisibleInWindow'), "after pane.appendChild(view), view.get('isVisibleInWindow') === YES");
// });
//
// test("removing a view from a visible pane should make it invisible again", function () {
//   ok(!view.get('isVisibleInWindow'), "view.get('isVisibleInWindow') === NO");
//   ok(pane.get('isVisibleInWindow'), "pane.get('isVisibleInWindow') === YES");
//   pane.appendChild(view);
//   ok(view.get('isVisibleInWindow'), "after pane.appendChild(view), view.get('isVisibleInWindow') === YES");
//
//   view.removeFromParent();
//   ok(!view.get('isVisibleInWindow'), "after view.removeFromParent(), view.get('isVisibleInWindow') === NO");
// });
//
// // .......................................................
// // integration with updateLayer and layoutChildViews
// //
// test("_executeDoUpdateContent should not be invoked even if layer becomes dirty until isVisibleInWindow changes, then it should invoke", function () {
//
//   var callCount = 0;
//   view._executeDoUpdateContent = function () {
//     SC.View.prototype._executeDoUpdateContent.apply(this, arguments);
//     callCount++;
//   };
//   ok(!view.get('isVisibleInWindow'), 'precond - view should not be visible to start');
//
//   SC.run(function () {
//     view.displayDidChange();
//   });
//   equal(callCount, 0, '_executeDoUpdateContent should not run b/c it\'s not visible');
//
//   view.set('isVisible', false);
//
//   SC.run(function () {
//     pane.appendChild(view); // Attach the view.
//     view.displayDidChange();
//   });
//   equal(callCount, 0, '_executeDoUpdateContent should not run b/c it\'s not visible');
//
//   SC.run(function () {
//     view.set('isVisible', true);
//     ok(view.get('isVisibleInWindow'), 'view should now be visible in window');
//   });
//   equal(callCount, 1, '_executeDoUpdateContent should exec now b/c the view is visible');
// });
//
// test("_doUpdateLayoutStyle should not be invoked even if layer needs layout until isVisibleInWindow changes, then it should invoke", function () {
//
//   var child = SC.View.create();
//   view.appendChild(child);
//
//   var callCount = 0;
//   child._doUpdateLayoutStyle = function () { callCount++; };
//   ok(!view.get('isVisibleInWindow'), 'precond - view should not be visible to start');
//
//   SC.run(function () {
//     child.layoutDidChange();
//   });
//
//   equal(callCount, 0, '_doUpdateLayoutStyle should not run b/c its not shown');
//
//   view.set('isVisible', false);
//
//   SC.run(function () {
//     pane.appendChild(view); // Attach the view.
//     child.layoutDidChange();
//   });
//   equal(callCount, 0, '_doUpdateLayoutStyle should not run b/c its not shown');
//
//   SC.run(function () {
//     view.set('isVisible', true);
//     ok(view.get('isVisibleInWindow'), 'view should now be visible in window');
//   });
//   equal(callCount, 1, '_doUpdateLayoutStyle should exec now b/c the child was appended to a shown parent');
// });
//
// test("setting isVisible to NO should trigger a layer update to hide the view", function () {
//
//   SC.RunLoop.begin();
//   pane.appendChild(view);
//   SC.RunLoop.end();
//
//   SC.RunLoop.begin();
//   view.set('isVisible', NO);
//   SC.RunLoop.end();
//
//   ok(view.renderContext(view.get('layer')).classes().indexOf('sc-hidden') >= 0, "layer should have the 'sc-hidden' class");
// });

});minispade.register('sproutcore-views/~tests/view/keyboard', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module, test, ok, equals */
var originalTabbing;

module("SC.View - Keyboard support with Tabbing Only Inside Document", {
  setup: function () {
    originalTabbing = SC.TABBING_ONLY_INSIDE_DOCUMENT;
    SC.TABBING_ONLY_INSIDE_DOCUMENT = YES;
  },

  teardown: function () {
    SC.TABBING_ONLY_INSIDE_DOCUMENT = originalTabbing;
  }
});

test("Views only attempt to call performKeyEquivalent on child views that support it", function () {
  var performKeyEquivalentCalled = 0;

  var view = SC.View.design({
    childViews: ['unsupported', 'supported'],

    unsupported: SC.CoreView,
    supported: SC.View.design({
      performKeyEquivalent: function (str) {
        performKeyEquivalentCalled++;
        return NO;
      }
    })
  });

  view = view.create();
  view.performKeyEquivalent("ctrl_r");

  ok(performKeyEquivalentCalled > 0, "performKeyEquivalent is called on the view that supports it");
  view.destroy();
});

/**
  nextValidKeyView tests
*/

test("nextValidKeyView is receiver if it is the only view that acceptsFirstResponder", function () {
  var testView = SC.View.extend({acceptsFirstResponder: YES}),
  pane = SC.Pane.create({
    childViews: ['view1', 'view2'],

    view1: SC.View.extend({
      childViews: ['view3', 'view4'],

      view3: SC.View,

      view4: testView
    }),

    view2: SC.View.extend({
      childViews: ['view5', 'view6'],

      view5: SC.View,

      view6: SC.View
    })
  });
  pane.append();

  equal(pane.view1.view4.get('nextValidKeyView'), pane.view1.view4, "nextValidKeyView is receiver");

  pane.remove();
  pane.destroy();
});

test("nextValidKeyView is null if no views have acceptsFirstResponder === YES", function () {
  var pane = SC.Pane.create({
    childViews: ['view1', 'view2'],

    view1: SC.View.extend({
      childViews: ['view3', 'view4'],

      view3: SC.View,

      view4: SC.View
    }),

    view2: SC.View.extend({
      childViews: ['view5', 'view6'],

      view5: SC.View,

      view6: SC.View
    })
  });
  pane.append();

  ok(SC.none(pane.view1.view4.get('nextValidKeyView')), "nextValidKeyView is null");

  pane.remove();
  pane.destroy();
});

test("firstKeyView and nextKeyView of parents are respected", function () {
  var testView = SC.View.extend({acceptsFirstResponder: YES}),
  pane = SC.Pane.create({
    childViews: ['view1', 'view2', 'view7'],

    view1: SC.View.extend({
      childViews: ['view3', 'view4'],

      view3: testView,

      view4: testView
    }),

    view2: SC.View.extend({
      childViews: ['view5', 'view6'],

      view5: testView,

      view6: testView
    }),

    view7: SC.View.extend({
      childViews: ['view8', 'view9'],

      view8: testView,

      view9: testView
    })
  });

  pane.append();

  equal(pane.view2.view6.get('nextValidKeyView'), pane.view7.view8, "order is correct when first and next not set");

  pane.set('firstKeyView', pane.view2);
  pane.view2.set('nextKeyView', pane.view1);
  pane.view1.set('nextKeyView', pane.view7);

  equal(pane.view2.view6.get('nextValidKeyView'), pane.view1.view3, "order is respected when first and next are set");
  pane.remove();
  pane.destroy();
});

test("nextValidKeyView is chosen correctly when nextKeyView is not a sibling", function () {
  var testView = SC.View.extend({acceptsFirstResponder: YES}),
  pane = SC.Pane.create({
    childViews: ['view1', 'view2'],

    view1: SC.View.extend({
      childViews: ['view3', 'view4'],

      view3: SC.View,

      view4: testView
    }),

    view2: SC.View.extend({
      childViews: ['view5', 'view6'],

      view5: testView,

      view6: SC.View
    })
  });

  pane.append();

  pane.view1.view4.set('nextKeyView', pane.view2.view5);
  pane.view2.view5.set('nextKeyView', pane.view1.view4);

  equal(pane.view1.view4.get('nextValidKeyView'), pane.view2.view5, "nextValidKeyView is correct");
  equal(pane.view2.view5.get('nextValidKeyView'), pane.view1.view4, "nextValidKeyView is correct");
  pane.remove();
  pane.destroy();
});

test("nextValidKeyView is chosen correctly when child of parent's previous sibling has nextKeyView set", function () {
  var testView = SC.View.extend({acceptsFirstResponder: YES}),
  pane = SC.Pane.create({
    childViews: ['view1', 'view2'],

    view1: SC.View.extend({
      childViews: ['view3', 'view4'],

      view3: testView,

      view4: testView
    }),

    view2: SC.View.extend({
      childViews: ['view5', 'view6'],

      view5: testView,

      view6: testView
    })
  });

  pane.view1.view3.set('nextKeyView', pane.view1.view4);
  pane.append();

  equal(pane.view2.view5.get('nextValidKeyView'), pane.view2.view6, "nextValidKeyView chosen is next sibling");
  pane.remove();
  pane.destroy();
});

test("nextValidKeyView checks for acceptsFirstResponder", function () {
  var pane = SC.Pane.create({
    childViews: ['view1', 'view2'],

    view1: SC.View.extend({
      acceptsFirstResponder: YES
    }),

    view2: SC.View.extend({
      acceptsFirstResponder: NO
    })
  });

  pane.view1.set('nextKeyView', pane.view2);
  pane.append();

  ok(pane.view1.get('nextValidKeyView') !== pane.view2, "nextValidKeyView is not nextKeyView because nextKeyView acceptsFirstResponder === NO");
  pane.remove();
  pane.destroy();
});

test("nextValidKeyView prioritizes parent's lastKeyView even if nextKeyView is set", function () {
  var testView = SC.View.extend({acceptsFirstResponder: YES}),
  pane = SC.Pane.create({
    childViews: ['view1', 'view2'],

    view1: SC.View.extend({
      childViews: ['view3', 'view4'],

      lastKeyView: function () {
        return this.view3;
      }.property(),

      view3: testView,

      view4: testView
    }),

    view2: SC.View.extend({
      childViews: ['view5', 'view6'],

      view5: testView,

      view6: testView
    })
  });

  pane.append();

  equal(pane.view1.view3.get('nextValidKeyView'), pane.view2.view5, "lastKeyView was respected; views after lastKeyView were skipped");
  pane.remove();
  pane.destroy();
});

/**
  previousValidKeyView tests
*/

test("previousValidKeyView is receiver if it is the only view that acceptsFirstResponder", function () {
  var testView = SC.View.extend({acceptsFirstResponder: YES}),
  pane = SC.Pane.create({
    childViews: ['view1', 'view2'],

    view1: SC.View.extend({
      childViews: ['view3', 'view4'],

      view3: SC.View,

      view4: testView
    }),

    view2: SC.View.extend({
      childViews: ['view5', 'view6'],

      view5: SC.View,

      view6: SC.View
    })
  });

  pane.append();

  equal(pane.view1.view4.get('previousValidKeyView'), pane.view1.view4, "previousValidKeyView is receiver");
  pane.remove();
  pane.destroy();
});

test("previousValidKeyView is null if no views have acceptsFirstResponder === YES", function () {
  var pane = SC.Pane.create({
    childViews: ['view1', 'view2'],

    view1: SC.View.extend({
      childViews: ['view3', 'view4'],

      view3: SC.View,

      view4: SC.View
    }),

    view2: SC.View.extend({
      childViews: ['view5', 'view6'],

      view5: SC.View,

      view6: SC.View
    })
  });

  pane.append();

  ok(SC.none(pane.view1.view4.get('previousValidKeyView')), "previousValidKeyView is null");
  pane.remove();
  pane.destroy();
});

test("lastKeyView and previousKeyView of parents are respected", function () {
  var testView = SC.View.extend({acceptsFirstResponder: YES}),
  pane = SC.Pane.create({
    childViews: ['view1', 'view2', 'view7'],

    view1: SC.View.extend({
      childViews: ['view3', 'view4'],

      view3: testView,

      view4: testView
    }),

    view2: SC.View.extend({
      childViews: ['view5', 'view6'],

      view5: testView,

      view6: testView
    }),

    view7: SC.View.extend({
      childViews: ['view8', 'view9'],

      view8: testView,

      view9: testView
    })
  });

  pane.append();

  equal(pane.view2.view5.get('previousValidKeyView'), pane.view1.view4, "order is correct when last and previous not set");

  pane.set('lastKeyView', pane.view2);
  pane.view2.set('previousKeyView', pane.view7);
  pane.view1.set('previousKeyView', pane.view1);

  equal(pane.view2.view5.get('previousValidKeyView'), pane.view7.view9, "order is respected when last and previous are set");
  pane.remove();
  pane.destroy();
});

test("previousValidKeyView is chosen correctly when previousKeyView is not a sibling", function () {
  var testView = SC.View.extend({acceptsFirstResponder: YES}),
  pane = SC.Pane.create({
    childViews: ['view1', 'view2'],

    view1: SC.View.extend({
      childViews: ['view3', 'view4'],

      view3: SC.View,

      view4: testView
    }),

    view2: SC.View.extend({
      childViews: ['view5', 'view6'],

      view5: testView,

      view6: SC.View
    })
  });

  pane.append();

  pane.view1.view4.set('previousKeyView', pane.view2.view5);
  pane.view2.view5.set('previousKeyView', pane.view1.view4);

  equal(pane.view1.view4.get('previousValidKeyView'), pane.view2.view5, "previousValidKeyView is correct");
  equal(pane.view2.view5.get('previousValidKeyView'), pane.view1.view4, "previousValidKeyView is correct");
  pane.remove();
  pane.destroy();
});

test("previousValidKeyView prioritizes parent's firstKeyView even if previousKeyView is set", function () {
  var testView = SC.View.extend({acceptsFirstResponder: YES}),
  pane = SC.Pane.create({
    childViews: ['view1', 'view2'],

    view1: SC.View.extend({
      childViews: ['view3', 'view4'],

      view3: testView,

      view4: testView
    }),

    view2: SC.View.extend({
      childViews: ['view5', 'view6'],

      firstKeyView: function () {
        return this.view6;
      }.property(),

      view5: testView,

      view6: testView
    })
  });

  pane.append();

  equal(pane.view2.view6.get('previousValidKeyView'), pane.view1.view4, "firstKeyView was respected; views before firstKeyView were skipped");
  pane.remove();
  pane.destroy();
});


module("SC.View - Keyboard support with Tabbing Outside of Document");

test("forward tab with no next responder moves out of document");

test("backwards tab with no previous responder moves out of document");

});minispade.register('sproutcore-views/~tests/view/layer', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module, test, equals, context, ok, same, precondition */

// NOTE: it is very important to make sure that the layer is not created
// until the view is actually visible in the window.

module("SC.View#layer");

test("returns null if the view has no layer and no parent view", function() {
  var view = SC.View.create() ;
  equal(view.get('parentView'), null, 'precond - has no parentView');
  equal(view.get('layer'), null, 'has no layer');
});

test("returns null if the view has no layer and parent view has no layer", function() {
  var parent = SC.View.create({
     childViews: [ SC.View.extend() ]
  });
  var view = parent.childViews[0];

  equal(view.get('parentView'), parent, 'precond - has parent view');
  equal(parent.get('layer'), null, 'parentView has no layer');
  equal(view.get('layer'), null, ' has no layer');
});

test("returns layer if you set the value", function() {
  var view = SC.View.create();
  equal(view.get('layer'), null, 'precond- has no layer');

  var dom = document.createElement('div');
  view.set('layer', dom);

  equal(view.get('layer'), dom, 'now has set layer');

  dom = null;
});

var parent, child, parentDom, childDom ;
module("SC.View#layer - autodiscovery", {
  setup: function() {

    parent = SC.View.create({
       childViews: [ SC.View.extend({
         // redefine this method in order to isolate testing of layer prop.
         // simple version just returns firstChild of parentLayer.
         findLayerInParentLayer: function(parentLayer) {
           return parentLayer.firstChild;
         }
       }) ]
    });
    child = parent.childViews[0];

    // setup parent/child dom
    parentDom = document.createElement('div');
    childDom = document.createElement('div');
    parentDom.appendChild(childDom);

    // set parent layer...
    parent.set('layer', parentDom);
  },

  teardown: function() {
    parent = child = parentDom = childDom = null ;
  }
});

test("discovers layer if has no layer but parent view does have layer", function() {
  equal(parent.get('layer'), parentDom, 'precond - parent has layer');
  ok(!!parentDom.firstChild, 'precond - parentDom has first child');

  equal(child.get('layer'), childDom, 'view discovered child');
});

test("once its discovers layer, returns the same element, even if you remove it from the parent view", function() {
  equal(child.get('layer'), childDom, 'precond - view discovered child');
  parentDom.removeChild(childDom) ;

  equal(child.get('layer'), childDom, 'view kept layer cached (i.e. did not do a discovery again)');
});

module("SC.View#layer - destroying");

test("returns null again if it has layer and layer is destroyed");

test("returns null again if parent view's layer is destroyed");

var pane, view ;
module("SC.View#$", {
  setup: function() {
    pane = SC.Pane.design()
      .childView(SC.View.design({
        render: function(context, firstTime) {
          context.push('<span></span>');
        }
      })).create();

    view = pane.childViews[0];

    SC.RunLoop.begin();
    pane.append(); // add to create layer...
    SC.RunLoop.end();
  },

  teardown: function() {
    SC.RunLoop.begin();
    pane.remove();
    SC.RunLoop.end();
  }
});

test("returns an empty CQ object if no layer", function() {
  var v = SC.View.create();
  ok(!v.get('layer'), 'precond - should have no layer');
  equal(v.$().size(), 0, 'should return empty CQ object');
  equal(v.$('span').size(), 0, 'should return empty CQ object even if filter passed');
});

test("returns CQ object selecting layer if provided", function() {
  ok(view.get('layer'), 'precond - should have layer');

  var cq = view.$();
  equal(cq.size(), 1, 'view.$() should have one element');
  equal(cq.get(0), view.get('layer'), 'element should be layer');
});

test("returns CQ object selecting element inside layer if provided", function() {
  ok(view.get('layer'), 'precond - should have layer');

  var cq = view.$('span');
  equal(cq.size(), 1, 'view.$() should have one element');
  equal(cq.get(0).parentNode, view.get('layer'), 'element should be in layer');
});

test("returns empty CQ object if filter passed that does not match item in parent", function() {
  ok(view.get('layer'), 'precond - should have layer');

  var cq = view.$('body'); // would normally work if not scoped to view
  equal(cq.size(), 0, 'view.$(body) should have no elements');
});

var parentView;

module("Notifies that layer has changed whenever re-render", {

  setup: function () {
    parentView = SC.View.create({
      childViews: ['a', 'b', SC.View],

      containerLayer: function () {
        return this.$('._wrapper')[0];
      }.property('layer').cacheable(),

      a: SC.View,
      b: SC.View,

      render: function (context) {
        context = context.begin().addClass('_wrapper');
        this.renderChildViews(context);
        context = context.end();
      }
    });
  },

  teardown: function () {
    parentView.destroy();
    parentView = null;
  }

});

/**
  If the containerLayer property is cached, then when the view re-renders and the original container layer
  element is lost, the containerLayer property will be invalid.  Instead, whenever the view updates,
  we have to indicate that the 'layer' property has changed.
  */
test("containerLayer should be able to be dependent on layer so that it invalidates when updated", function () {
  var containerLayer;

  // Render the parent view and attach.
  parentView.createLayer();
  parentView._doAttach(document.body);

  // Get the container layer.
  containerLayer = parentView.get('containerLayer');

  // Rerender the view.
  SC.run(function () {
    parentView.displayDidChange();
  });

  ok(containerLayer !== parentView.get('containerLayer'), "The container layer should not be the same anymore.");
});

});minispade.register('sproutcore-views/~tests/view/layout', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module, test, equals, ok */

var view;

/** Test isFixedLayout via isFixedSize and isFixedPosition properties. */
module("SC.View.prototype.isFixedLayout", {

  setup: function () {
    // Create a basic view.
    view = SC.View.create({});
  },

  teardown: function () {
    // Clean up.
    view.destroy();
    view = null;
  }

});

test("Test isFixedSize for various layouts.", function () {
  ok(!view.get('isFixedSize'), "The default layout doesn't correspond to a fixed size.");

  SC.run(function () { view.set('layout', { width: 100 }); });
  ok(!view.get('isFixedSize'), "A width alone doesn't correspond to a fixed size.");

  SC.run(function () { view.set('layout', { height: 100 }); });
  ok(!view.get('isFixedSize'), "A height alone doesn't correspond to a fixed size.");

  SC.run(function () { view.set('layout', { width: 100, height: 100 }); });
  ok(view.get('isFixedSize'), "A width & height corresponds to a fixed size.");
});

test("Test isFixedPosition for various layouts.", function () {
  ok(view.get('isFixedPosition'), "The default layout corresponds to a fixed position.");

  SC.run(function () { view.set('layout', { left: 0 }); });
  ok(view.get('isFixedPosition'), "A left: 0 (implied top, bottom, right) corresponds to a fixed position.");

  SC.run(function () { view.set('layout', { top: 0 }); });
  ok(view.get('isFixedPosition'), "A top: 0 (implied left, bottom, right) corresponds to a fixed position.");

  SC.run(function () { view.set('layout', { left: 0, top: 0 }); });
  ok(view.get('isFixedPosition'), "A left: 0, top: 0 corresponds to a fixed position.");

  SC.run(function () { view.set('layout', { left: 50 }); });
  ok(view.get('isFixedPosition'), "A left: 50 corresponds to a fixed position.");

  SC.run(function () { view.set('layout', { top: 50 }); });
  ok(view.get('isFixedPosition'), "A top: 50 corresponds to a fixed position.");

  SC.run(function () { view.set('layout', { left: 50, top: 50 }); });
  ok(view.get('isFixedPosition'), "A left: 50, top: 50 corresponds to a fixed position.");

  SC.run(function () { view.set('layout', { right: 0 }); });
  ok(view.get('isFixedPosition'), "A right: 0 (implied left) corresponds to a fixed position.");

  SC.run(function () { view.set('layout', { bottom: 0 }); });
  ok(view.get('isFixedPosition'), "A bottom: 0 (implied top) corresponds to a fixed position.");

  SC.run(function () { view.set('layout', { right: 50 }); });
  ok(view.get('isFixedPosition'), "A right: 50 (implied left) corresponds to a fixed position.");

  SC.run(function () { view.set('layout', { bottom: 50 }); });
  ok(view.get('isFixedPosition'), "A bottom: 50 (implied top) corresponds to a fixed position.");

  SC.run(function () { view.set('layout', { width: 100 }); });
  ok(view.get('isFixedPosition'), "A width: 100 (implied left) corresponds to a fixed position.");

  SC.run(function () { view.set('layout', { height: 100 }); });
  ok(view.get('isFixedPosition'), "A height: 100 (implied top) corresponds to a fixed position.");

  SC.run(function () { view.set('layout', { right: 0, width: 100 }); });
  ok(!view.get('isFixedPosition'), "A right: 0, width: 100 (overridden left) doesn't correspond to a fixed position.");

  SC.run(function () { view.set('layout', { bottom: 0, height: 100 }); });
  ok(!view.get('isFixedPosition'), "A bottom: 0, height: 100 (overridden top) doesn't correspond to a fixed position.");

  SC.run(function () { view.set('layout', { centerX: 0, width: 100 }); });
  ok(!view.get('isFixedPosition'), "A centerX: 0, width: 100 (overridden left) doesn't correspond to a fixed position.");

  SC.run(function () { view.set('layout', { centerY: 0, height: 100 }); });
  ok(!view.get('isFixedPosition'), "A centerY: 0, height: 100 (overridden top) doesn't correspond to a fixed position.");

  SC.run(function () { view.set('layout', { left: 0.2 }); });
  ok(!view.get('isFixedPosition'), "A left: 0.2 (percentage left) doesn't correspond to a fixed position.");

  SC.run(function () { view.set('layout', { top: 0.2 }); });
  ok(!view.get('isFixedPosition'), "A top: 0.2 (percentage top) doesn't correspond to a fixed position.");

  SC.run(function () { view.set('layout', { left: SC.LAYOUT_AUTO }); });
  ok(!view.get('isFixedPosition'), "A left: SC.LAYOUT_AUTO (auto left) doesn't correspond to a fixed position.");

  SC.run(function () { view.set('layout', { top: SC.LAYOUT_AUTO }); });
  ok(!view.get('isFixedPosition'), "A top: SC.LAYOUT_AUTO (auto top) doesn't correspond to a fixed position.");
});

});minispade.register('sproutcore-views/~tests/view/layoutChildViews', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

// .......................................................
// layoutChildViews()
//
module("SC.View#layoutChildViews");

test("calls renderLayout() on child views on views that need layout if they have a layer", function() {

	var callCount = 0 ;
	var ChildView = SC.View.extend({
		updateLayout: function(context) { callCount++; }
	});

	var view = SC.View.create({
		childViews: [ChildView, ChildView, ChildView]
	});

	var cv1 = view.childViews[0];
	var cv2 = view.childViews[1];

	// add to set...
	view.layoutDidChangeFor(cv1);
	view.layoutDidChangeFor(cv2);

	view.layoutChildViews();
	equal(callCount, 2, 'updateLayout should be called on two dirty child views');

	// Clean up.
	view.destroy();
});

// .......................................................
// updateLayout()
//
module("SC.View#updateLayout");

test("if view has layout, calls _doUpdateLayoutStyle", function() {

	// NOTE: renderLayout() is also called when a view's
	// layer is first created.  We use isTesting below to
	// avoid running the renderLayout() test code until we
	// are actually doing layout.
	var callCount = 0, isTesting = NO ;
	var view = SC.View.create({
		_doUpdateLayoutStyle: function() {
			callCount++;
		}
	});

	view.createLayer(); // we need a layer
	ok(view.get('layer'), 'precond - should have a layer');

	view.updateLayout();
	equal(callCount, 0, 'should not call _doUpdateLayoutStyle() because the view isn\'t shown');

	view.updateLayout(true);
	equal(callCount, 1, 'should call _doUpdateLayoutStyle() because we force it');

	// Clean up.
	view.destroy();
});

test("if view has NO layout, should not call renderLayout", function() {

	// NOTE: renderLayout() is also called when a view's
	// layer is first created.  We use isTesting below to
	// avoid running the renderLayout() test code until we
	// are actually doing layout.
	var callCount = 0, isTesting = NO ;
	var view = SC.View.create({
		renderLayout: function(context) {
			if (!isTesting) return ;
			callCount++;
		}
	});

	ok(!view.get('layer'), 'precond - should NOT have a layer');

	isTesting= YES ;
	view.updateLayout();
	equal(callCount, 0, 'should NOT call renderLayout()');

	// Clean up.
	view.destroy();
});

test("returns receiver", function() {
	var view = SC.View.create();
	equal(view.updateLayout(), view, 'should return receiver');

	// Clean up.
	view.destroy();
});

// .......................................................
//  renderLayout()
//
module('SC.View#renderLayout');

test("adds layoutStyle property to passed context", function() {

	var view = SC.View.create({
		// mock style for testing...
		layoutStyle: { width: 50, height: 50 }
	});
	var context = view.renderContext();

	ok(context.styles().width !== 50, 'precond - should NOT have width style');
	ok(context.styles().height !== 50, 'precond - should NOT have height style');


	view.renderLayout(context);

	equal(context.styles().width, 50, 'should have width style');
	equal(context.styles().height, 50, 'should have height style');

	// Clean up.
	view.destroy();
});

// .......................................................
// layoutChildViewsIfNeeded()
//
var view, callCount ;
module('SC.View#layoutChildViewsIfNeeded', {
	setup: function() {
		callCount = 0;
		view = SC.View.create({
			layoutChildViews: function() { callCount++; }
		});
	},
	teardown: function() {
		// Clean up.
		view.destroy();
		view = null;
	}
});

test("calls layoutChildViews() if childViewsNeedLayout and isVisibleInWindow & sets childViewsNeedLayout to NO", function() {

	view.childViewsNeedLayout = YES ;
	view.isVisibleInWindow = YES ;
	view.layoutChildViewsIfNeeded();
	equal(callCount, 1, 'should call layoutChildViews()');
	equal(view.get('childViewsNeedLayout'),NO,'should set childViewsNeedLayout to NO');
});

test("does not call layoutChildViews() if childViewsNeedLayout is NO", function() {

	view.childViewsNeedLayout = NO ;
	view.isVisibleInWindow = YES ;
	view.layoutChildViewsIfNeeded();
	equal(callCount, 0, 'should NOT call layoutChildViews()');
});

test("returns receiver", function() {
	equal(view.layoutChildViewsIfNeeded(), view, 'should return receiver');
});



});minispade.register('sproutcore-views/~tests/view/layoutDidChange', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module, test, equals, ok */

module("SC.View.prototype.layoutDidChange");

test("notifies layoutStyle & frame change", function () {

  var view = SC.View.create();
  var layoutStyleCallCount = 0, frameCallCount = 0;

  view.addObserver('layoutStyle', function () { layoutStyleCallCount++; });
  view.addObserver('frame', function () { frameCallCount++; });

  SC.run(function () {
    // Manually indicate a layout change.
    view.layoutDidChange();
  });

  equal(frameCallCount, 1, 'should trigger observers for frame');
  equal(layoutStyleCallCount, 0, 'should not trigger observers for layoutStyle');

  // Attach to the document.
  var parent = SC.Pane.create();
  parent.append();
  parent.appendChild(view);

  equal(frameCallCount, 2, 'should trigger observers for frame when attached to the document');
  equal(layoutStyleCallCount, 0, 'should still not trigger observers for layoutStyle');

  SC.run(function () {
    view.adjust('top', 20);
  });

  equal(frameCallCount, 3, 'should trigger observers for frame when attached to the document');
  equal(layoutStyleCallCount, 1, 'should trigger observers for layoutStyle');

  // Clean up.
  view.destroy();
  parent.destroy();
});

test("invokes layoutDidChangeFor() on layoutView each time it is called", function () {

  var callCount = 0;
  var layoutView = SC.View.create({
    layoutDidChangeFor: function (changedView) {
      equal(this.get('childViewsNeedLayout'), YES, 'should set childViewsNeedLayout to YES before calling layoutDidChangeFor()');

      equal(view, changedView, 'should pass view');
      callCount++;

      // Original
      var set = this._needLayoutViews;
      if (!set) set = this._needLayoutViews = SC.Set.create();
      set.add(changedView);
    }
  });

  var view = SC.View.create({ layoutView: layoutView });

  SC.run(function () {
    view.layoutDidChange();
    view.layoutDidChange();
    view.layoutDidChange();
  });

  equal(callCount, 3, 'should call layoutView.layoutDidChangeFor each time');

  // Clean up.
  layoutView.destroy();
  view.destroy();
});

test("invokes layoutChildViewsIfNeeded() on layoutView once per runloop", function () {

  var callCount = 0;
  var layoutView = SC.View.create({
    layoutChildViewsIfNeeded: function () {
      callCount++;
    }
  });

  var view = SC.View.create({ layoutView: layoutView });

  SC.run(function () {
    view.layoutDidChange();
    view.layoutDidChange();
    view.layoutDidChange();
  });

  equal(callCount, 1, 'should call layoutView.layoutChildViewsIfNeeded one time');

  // Clean up.
  layoutView.destroy();
  view.destroy();
});


test("should not invoke layoutChildViewsIfNeeded() if layoutDidChangeFor() sets childViewsNeedLayout to NO each time", function () {

  var callCount = 0;
  var layoutView = SC.View.create({
    layoutDidChangeFor: function () {
      this.set('childViewsNeedLayout', NO);
    },

    layoutChildViewsIfNeeded: function () {
      callCount++;
    }
  });

  var view = SC.View.create({ layoutView: layoutView });

  SC.run(function () {
    view.layoutDidChange();
    view.layoutDidChange();
    view.layoutDidChange();
  });

  equal(callCount, 0, 'should not call layoutView.layoutChildViewsIfNeeded');

  // Clean up.
  layoutView.destroy();
  view.destroy();
});

test('returns receiver', function () {
  var view = SC.View.create();

  SC.run(function () {
    equal(view.layoutDidChange(), view, 'should return receiver');
  });

  // Clean up.
  view.destroy();
});

test("is invoked whenever layout property changes", function () {

  var callCount = 0;
  var layoutView = SC.View.create({
    layoutDidChangeFor: function (changedView) {
      callCount++;

      // Original
      var set = this._needLayoutViews;
      if (!set) set = this._needLayoutViews = SC.Set.create();
      set.add(changedView);
    }
  });

  var view = SC.View.create({ layoutView: layoutView });

  SC.run(function () {
    view.set('layout', { top: 0, left: 10 });
  });
  equal(callCount, 1, 'should call layoutDidChangeFor when setting layout of child view');

  // Clean up.
  layoutView.destroy();
  view.destroy();
});

test("is invoked on parentView if no layoutView whenever layout property changes", function () {

  var callCount = 0;
  var parentView = SC.View.create({
    layoutDidChangeFor: function (changedView) {
      callCount++;

      // Original
      var set = this._needLayoutViews;
      if (!set) set = this._needLayoutViews = SC.Set.create();
      set.add(changedView);
    }
  });

  var view = SC.View.create({});
  view.set('parentView', parentView);

  SC.run(function () {
    view.set('layout', { top: 0, left: 10 });
  });
  equal(callCount, 1, 'should call layoutDidChangeFor when setting layout of child view');

  // Clean up.
  parentView.destroy();
  view.destroy();
});

test("sets rotateX when rotate is set", function () {
  var view = SC.View.create({});

  SC.run(function () {
    view.set('layout', { rotate: 45 });
  });

  equal(view.get('layout').rotateX, 45, "should set rotateX");

  // Clean up.
  view.destroy();
});

test("rotateX overrides rotate", function () {
  var view = SC.View.create({});

  SC.run(function () {
    view.set('layout', { rotate: 45, rotateX: 90 });
  });

  equal(view.get('layout').rotate, undefined, "should clear rotate for rotateX");

  // Clean up.
  view.destroy();
});

// The default implementation for viewDidResize calls internal layout-related
// methods on child views. This test confirms that child views that do not
// support layout do not cause this process to explode.
test("Calling viewDidResize on a view notifies its child views", function () {
  var regularViewCounter = 0, coreViewCounter = 0;

  var view = SC.View.create({
    childViews: ['regular', 'core'],

    regular: SC.View.create({
      viewDidResize: function () {
        regularViewCounter++;
        // Make sure we call the default implementation to
        // ensure potential blow-uppy behavior is invoked
        this._super();
      }
    }),

    core: SC.CoreView.create({
      viewDidResize: function () {
        coreViewCounter++;
        this._super();
      }
    })
  });

  view.viewDidResize();

  equal(regularViewCounter, 1, "regular view's viewDidResize gets called");
  equal(coreViewCounter, 1, "core view's viewDidResize gets called");

  // Clean up.
  view.destroy();
});

});minispade.register('sproutcore-views/~tests/view/layoutStyle', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ========================================================================
// View Layout Unit Tests
// ========================================================================

/*global module test ok same equals */


/* These unit tests verify:  layout(), frame(), styleLayout() and clippingFrame(). */
(function () {
  var parent, child, frameKeys, layoutKeys;

  frameKeys = 'x y width height'.w();
  layoutKeys = ['width', 'height', 'top', 'bottom', 'marginLeft', 'marginTop', 'left', 'right', 'zIndex',
    'minWidth', 'maxWidth', 'minHeight', 'maxHeight', 'borderTopWidth', 'borderBottomWidth',
    'borderLeftWidth', 'borderRightWidth'];

  /*
    helper method to test the layout of a view.  Applies the passed layout to a
    view, then compares both its frame and layoutStyle properties both before
    and after adding the view to a parent view.

    You can pass frame rects with some properties missing and they will be
    filled in for you just so you don't have to write so much code.

    @param {Hash} layout layout hash to test
    @param {Hash} no_f expected frame for view with no parent
    @param {Hash} no_s expected layoutStyle for view with no parent
    @param {Hash} with_f expected frame for view with parent
    @param {Hash} with_s expected layoutStyle for view with parent
    @param {Boolean} isFixedShouldBe expected value for view.get('isFixedLayout')
    @returns {void}
  */
  function performLayoutTest(layout, no_f, no_s, with_f, with_s, isFixedShouldBe) {
    if (SC.platform.supportsCSSTransforms) { layoutKeys.push('transform'); }

    // make sure we add null properties and convert numbers to 'XXpx' to style layout.
    layoutKeys.forEach(function (key) {
      if (no_s[key] === undefined) { no_s[key] = null; }
      if (with_s[key] === undefined) { with_s[key] = null; }


      if (typeof no_s[key] === 'number') { no_s[key] = no_s[key].toString() + 'px'; }
      if (typeof with_s[key] === 'number') { with_s[key] = with_s[key].toString() + 'px'; }
    });

    // set layout
    SC.run(function () {
      child.set('layout', layout);
    });

    var layoutStyle = child.get('layoutStyle'),
        frame = child.get('frame'),
        testKey;

    // test
    layoutKeys.forEach(function (key) {
      testKey = key === 'transform' ? SC.browser.domPrefix + 'Transform' : key;
      equal(layoutStyle[testKey], no_s[key], "STYLE NO PARENT %@".fmt(key));
    });

    if (no_f !== undefined) {
      if (frame && no_f) {
        frameKeys.forEach(function (key) {
          equal(frame[key], no_f[key], "FRAME NO PARENT %@".fmt(key));
        });
      } else {
        equal(frame, no_f, "FRAME NO PARENT");
      }
    }


    // add parent
    SC.RunLoop.begin();
    parent.appendChild(child);
    SC.RunLoop.end();

    layoutStyle = child.get('layoutStyle');
    frame = child.get('frame');

    // test again
    layoutKeys.forEach(function (key) {
      testKey = key === 'transform' ? SC.browser.domPrefix + 'Transform' : key;
      equal(layoutStyle[testKey], with_s[key], "STYLE W/ PARENT %@".fmt(key));
    });

    if (with_f !== undefined) {
      if (frame && with_f) {
        frameKeys.forEach(function (key) {
          equal(frame[key], with_f[key], "FRAME W/ PARENT %@".fmt(key));
        });
      } else {
        equal(frame, with_f, "FRAME W/ PARENT");
      }
    }

    // check if isFixedLayout is correct

    equal(child.get('isFixedLayout'), isFixedShouldBe, "isFixedLayout");
  }

  /**
    Helper setup that creates a parent and child view so that you can do basic
    tests.
  */
  var commonSetup = {
    setup: function () {

      // create basic parent view
      parent = SC.View.create({
        layout: { top: 0, left: 0, width: 200, height: 200 }
      });

      // create child view to test against.
      child = SC.View.create();
    },

    teardown: function () {
      child.destroy();
      parent.destroy();
      parent = child = null;
    }
  };

  module("NOTIFICATIONS", commonSetup);

  test("Setting layout will notify frame observers", function () {
    var didNotify = NO, didNotifyStyle = NO;
    child.addObserver('frame', this, function () { didNotify = YES; });
    child.addObserver('layoutStyle', this, function () { didNotifyStyle = YES; });

    SC.run(function () {
      child.set('layout', { left: 0, top: 10, bottom: 20, right: 50 });
    });

    ok(didNotify, "didNotify");
    ok(didNotifyStyle, 'didNotifyStyle');
  });

  // ..........................................................
  // TEST FRAME/STYLEFRAME WITH BASIC LAYOUT VARIATIONS
  //
  // NOTE:  Each test evaluates the frame before and after adding it to the
  // parent.

  module('BASIC LAYOUT VARIATIONS', commonSetup);

  test("layout {top, left, width, height}", function () {

    var layout = { top: 10, left: 10, width: 50, height: 50 };
    var s = { top: 10, left: 10, width: 50, height: 50 };
    var no_f = { x: 10, y: 10, width: 50, height: 50 };
    var with_f = { x: 10, y: 10, width: 50, height: 50 };

    performLayoutTest(layout, no_f, s, with_f, s, YES);
  });

  test("layout {top, left, bottom, right}", function () {

    var layout = { top: 10, left: 10, bottom: 10, right: 10 };
    var no_f = { x: 10, y: 10, width: 0, height: 0 };
    var with_f = { x: 10, y: 10, width: 180, height: 180 };
    var s = { top: 10, left: 10, bottom: 10, right: 10 };

    performLayoutTest(layout, no_f, s, with_f, s, NO);
  });

  test("layout {bottom, right, width, height}", function () {

    var layout = { bottom: 10, right: 10, width: 50, height: 50 };
    var no_f = { x: 0, y: 0, width: 50, height: 50 };
    var with_f = { x: 140, y: 140, width: 50, height: 50 };
    var s = { bottom: 10, right: 10, width: 50, height: 50 };

    performLayoutTest(layout, no_f, s, with_f, s, NO);
  });

  test("layout {centerX, centerY, width, height}", function () {

    var layout = { centerX: 10, centerY: 10, width: 60, height: 60 };
    var no_f = { x: 10, y: 10, width: 60, height: 60 };
    var with_f = { x: 80, y: 80, width: 60, height: 60 };
    var s = { marginLeft: -20, marginTop: -20, width: 60, height: 60, top: "50%", left: "50%" };

    performLayoutTest(layout, no_f, s, with_f, s, NO);
  });

  test("layout {top, left, width: auto, height: auto}", function () {
    // Reset.
    child.destroy();

    child = SC.View.create({
      useStaticLayout: YES,
      render: function (context) {
        // needed for auto
        context.push('<div style="padding: 10px"></div>');
      }
    });

    // parent MUST have a layer.
    parent.createLayer();
    var layer = parent.get('layer');
    document.body.appendChild(layer);

    var layout = { top: 0, left: 0, width: 'auto', height: 'auto' };
    var no_f = null;
    // See test below
    var with_f; // { x: 0, y: 0, width: 200, height: 200 };
    var s = { top: 0, left: 0, width: 'auto', height: 'auto' };

    performLayoutTest(layout, no_f, s, with_f, s, NO);

    layer.parentNode.removeChild(layer);
    child.destroy();
  });

  // See comment in above test
  test("layout {top, left, width: auto, height: auto} - frame");



  // ..........................................................
  // TEST FRAME/STYLEFRAME WITH BASIC LAYOUT VARIATIONS
  //
  // NOTE:  Each test evaluates the frame before and after adding it to the
  // parent.

  module('BASIC LAYOUT VARIATIONS PERCENTAGE', commonSetup);

  test("layout {top, left, width, height}", function () {

    var layout = { top: 0.1, left: 0.1, width: 0.5, height: 0.5 };
    var s = { top: '10%', left: '10%', width: '50%', height: '50%' };
    var no_f = { x: 0, y: 0, width: 0, height: 0 };
    var with_f = { x: 20, y: 20, width: 100, height: 100 };

    performLayoutTest(layout, no_f, s, with_f, s, NO);
  });

  test("layout {top, left, bottom, right}", function () {

    var layout = { top: 0.1, left: 0.1, bottom: 0.1, right: 0.1 };
    var no_f = { x: 0, y: 0, width: 0, height: 0 };
    var with_f =  { x: 20, y: 20, width: 160, height: 160 };
    var s = { top: '10%', left: '10%', bottom: '10%', right: '10%' };

    performLayoutTest(layout, no_f, s, with_f, s, NO);
  });

  test("layout {bottom, right, width, height}", function () {

    var layout = { bottom: 0.1, right: 0.1, width: 0.5, height: 0.5 };
    var no_f = { x: 0, y: 0, width: 0, height: 0 };
    var with_f = { x: 80, y: 80, width: 100, height: 100 };
    var s = { bottom: '10%', right: '10%', width: '50%', height: '50%' };

    performLayoutTest(layout, no_f, s, with_f, s, NO);
  });

  test("layout {centerX, centerY, width, height}", function () {

    var layout = { centerX: 0.1, centerY: 0.1, width: 0.6, height: 0.6 };
    var no_f = { x: 0, y: 0, width: 0, height: 0 };
    var with_f = { x: 60, y: 60, width: 120, height: 120 };
    var s = { marginLeft: '-20%', marginTop: '-20%', width: '60%', height: '60%', top: "50%", left: "50%" };

    performLayoutTest(layout, no_f, s, with_f, s, NO);
  });

  // Previously, you couldn't set a % width or height with a centerX/centerY of 0.
  // But there's no reason that a % sized view can't be centered at 0 and this
  // test shows that.
  test("layout {centerX 0, centerY 0, width %, height %}", function () {
    var layout = { centerX: 0, centerY: 0, width: 0.6, height: 0.6 };
    var no_f = { x: 0, y: 0, width: 0, height: 0 };

    // The parent frame is 200 x 200.
    var size = 200 * 0.6;
    var with_f = { x: (200 - size) * 0.5, y: (200 - size) * 0.5, width: size, height: size };
    var s = { marginLeft: '-30%', marginTop: '-30%', width: '60%', height: '60%', top: "50%", left: "50%" };

    performLayoutTest(layout, no_f, s, with_f, s, NO);
  });

  // Edge case: although rare, centered views should be able to have metrics of zero.
  test("layout {centerX 0, centerY 0, width 0, height 0}", function () {
    var layout = { centerX: 0, centerY: 0, width: 0, height: 0 };
    var no_f = { x: 0, y: 0, width: 0, height: 0 };

    // The parent frame is 200 x 200.
    var size = 0;
    var with_f = { x: (200 - size) * 0.5, y: (200 - size) * 0.5, width: size, height: size };
    var s = { marginLeft: '0px', marginTop: '0px', width: '0px', height: '0px', top: '50%', left: '50%' };

    performLayoutTest(layout, no_f, s, with_f, s, NO);
  });

  test("layout {top, left, width: auto, height: auto}", function () {
    // Reset.
    child.destroy();

    child = SC.View.create({
      useStaticLayout: YES,
      render: function (context) {
        // needed for auto
        context.push('<div style="padding: 10px"></div>');
      }
    });

    // parent MUST have a layer.
    parent.createLayer();
    var layer = parent.get('layer');
    document.body.appendChild(layer);

    var layout = { top: 0.1, left: 0.1, width: 'auto', height: 'auto' };
    var no_f = null;
    // See pending test below
    var with_f; // { x: 20, y: 20, width: 180, height: 180 };
    var s = { top: '10%', left: '10%', width: 'auto', height: 'auto' };

    performLayoutTest(layout, no_f, s, with_f, s, NO);

    layer.parentNode.removeChild(layer);
    child.destroy();
  });

  // See commented out lines in test above
  test("layout {top, left, width: auto, height: auto} - frame");



  // ..........................................................
  // TEST CSS TRANSFORM LAYOUT VARIATIONS
  //
  // NOTE:  Each test evaluates the frame before and after adding it to the
  // parent.

  module('CSS TRANSFORM LAYOUT VARIATIONS', {
    setup: function () {
      commonSetup.setup();
      child.createLayer();
      document.body.appendChild(child.get('layer'));
    },

    teardown: function () {
      document.body.removeChild(child.get('layer'));
      child.destroyLayer();
      commonSetup.teardown();
    }
  });

  function transformFor(view) {
    return view.get('layer').style[SC.browser.domPrefix + 'Transform'];
  }

  test("layout {rotateX}", function () {
    SC.run(function () {
      child.adjust('rotateX', 45).updateLayout(true);
    });

    equal(transformFor(child), 'rotateX(45deg)', 'transform attribute should be "rotateX(45deg)"');
  });

  test("layout {rotateY}", function () {
    SC.run(function () {
      child.adjust('rotateY', 45).updateLayout(true);
    });
    equal(transformFor(child), 'rotateY(45deg)', 'transform attribute should be "rotateY(45deg)"');
  });

  test("layout {rotateZ}", function () {
    SC.run(function () {
      child.adjust('rotateZ', 45).updateLayout(true);
    });

    equal(transformFor(child), 'rotateZ(45deg)', 'transform attribute should be "rotateZ(45deg)"');
  });

  test("layout {rotate}", function () {
    SC.run(function () {
      child.adjust('rotate', 45).updateLayout(true);
    });

    equal(transformFor(child), 'rotateX(45deg)', 'transform attribute should be "rotateX(45deg)"');
  });

  test("layout {rotateX} with units", function () {
    SC.run(function () {
      child.adjust('rotateX', '1rad').updateLayout(true);
    });

    equal(transformFor(child), 'rotateX(1rad)', 'transform attribute should be "rotateX(1rad)"');
  });

  test("layout {scale}", function () {
    SC.run(function () {
      child.adjust('scale', 2).updateLayout(true);
    });

    equal(transformFor(child), 'scale(2)', 'transform attribute should be "scale(2)"');
  });

  test("layout {scale} with multiple", function () {
    SC.run(function () {
      child.adjust('scale', [2, 3]).updateLayout(true);
    });

    equal(transformFor(child), 'scale(2, 3)', 'transform attribute should be "scale(2, 3)"');
  });

  test("layout {rotateX, scale}", function () {
    SC.run(function () {
      child.adjust({ rotateX: 45, scale: 2 }).updateLayout(true);
    });

    equal(transformFor(child), 'rotateX(45deg) scale(2)', 'transform attribute should be "rotateX(45deg) scale(2)"');
  });

  test("layout {rotateX} update", function () {
    SC.run(function () {
      child.adjust('rotateX', 45).updateLayout(true);
      child.adjust('rotateX', 90).updateLayout(true);
    });

    equal(transformFor(child), 'rotateX(90deg)', 'transform attribute should be "rotateX(90deg)"');
  });


  if (SC.platform.supportsCSSTransforms) {

    // ..........................................................
    // TEST FRAME/STYLEFRAME WITH ACCELERATE LAYOUT VARIATIONS
    //
    // NOTE:  Each test evaluates the frame before and after adding it to the
    // parent.

    module('ACCELERATED LAYOUT VARIATIONS', {
      setup: function () {
        commonSetup.setup();
        child.set('wantsAcceleratedLayer', YES);
      },

      teardown: commonSetup.teardown
    });

    test("layout {top, left, width, height}", function () {
      var layout = { top: 10, left: 10, width: 50, height: 50 };
      var expectedTransform = 'translateX(10px) translateY(10px)';
      if (SC.platform.supportsCSS3DTransforms) expectedTransform += ' translateZ(0px)';
      var s = { top: 0, left: 0, width: 50, height: 50, transform: expectedTransform };
      var no_f = { x: 10, y: 10, width: 50, height: 50 };
      var with_f = { x: 10, y: 10, width: 50, height: 50};

      performLayoutTest(layout, no_f, s, with_f, s, YES);
    });

    test("layout {top, left, bottom, right}", function () {

      var layout = { top: 10, left: 10, bottom: 10, right: 10 };
      var no_f = { x: 10, y: 10, width: 0, height: 0 };
      var with_f = { x: 10, y: 10, width: 180, height: 180 };
      var s = { top: 10, left: 10, bottom: 10, right: 10, transform: null };

      performLayoutTest(layout, no_f, s, with_f, s, NO);
    });

    test("layout {top, left, width: auto, height: auto}", function () {
      // Reset.
      child.destroy();

      child = SC.View.create({
        wantsAcceleratedLayer: YES,
        useStaticLayout: YES,
        render: function (context) {
          // needed for auto
          context.push('<div style="padding: 10px"></div>');
        }
      });

      // parent MUST have a layer.
      parent.createLayer();
      var layer = parent.get('layer');
      document.body.appendChild(layer);

      var layout = { top: 0, left: 0, width: 'auto', height: 'auto' };
      var no_f = null;
      // See test below
      var with_f; // { x: 0, y: 0, width: 200, height: 200 };
      var s = { top: 0, left: 0, width: 'auto', height: 'auto', transform: null };

      performLayoutTest(layout, no_f, s, with_f, s, NO);

      layer.parentNode.removeChild(layer);

      child.destroy();
    });

    // See commented lines in test above
    test("layout {top, left, width: auto, height: auto} - frame");

    test("layout w/ percentage {top, left, width, height}", function () {

      var layout = { top: 0.1, left: 0.1, width: 0.5, height: 0.5 };
      var s = { top: '10%', left: '10%', width: '50%', height: '50%', transform: null };
      var no_f = { x: 0, y: 0, width: 0, height: 0 };
      var with_f = { x: 20, y: 20, width: 100, height: 100 };

      performLayoutTest(layout, no_f, s, with_f, s, NO);
    });

  }



  // ..........................................................
  // TEST FRAME/STYLEFRAME WITH INVALID LAYOUT VARIATIONS
  //
  // NOTE:  Each test evaluates the frame before and after adding it to the
  // parent.

  module('INVALID LAYOUT VARIATIONS', commonSetup);

  test("layout {top, left} - assume right/bottom=0", function () {

    var layout = { top: 0.1, left: 0.1 };
    var no_f = { x: 0, y: 0, width: 0, height: 0 };
    var with_f = { x: 20, y: 20, width: 180, height: 180 };
    var s = { bottom: 0, right: 0, top: '10%', left: '10%' };

    performLayoutTest(layout, no_f, s, with_f, s, NO);
  });

  test("layout {height, width} - assume top/left=0", function () {

    var layout = { height: 0.6, width: 0.6 };
    var no_f = { x: 0, y: 0, width: 0, height: 0 };
    var with_f = { x: 0, y: 0, width: 120, height: 120 };
    var s = { width: '60%', height: '60%', top: 0, left: 0 };

    performLayoutTest(layout, no_f, s, with_f, s, NO);

  });

  test("layout {right, bottom} - assume top/left=0", function () {

    var layout = { right: 0.1, bottom: 0.1 };
    var no_f = { x: 0, y: 0, width: 0, height: 0 };
    var with_f = { x: 0, y: 0, width: 180, height: 180 };
    var s = { bottom: '10%', right: '10%', top: 0, left: 0 };

    performLayoutTest(layout, no_f, s, with_f, s, NO);

  });

  test("layout {right, bottom, maxWidth, maxHeight} - assume top/left=null", function () {

    var layout = { right: 0.1, bottom: 0.1, maxWidth: 10, maxHeight: 10 };
    var no_f = { x: 0, y: 0, width: 0, height: 0 };
    var with_f = { x: 0, y: 0, width: 10, height: 10 };
    var s = { bottom: '10%', right: '10%', top: null, left: null, maxWidth: 10, maxHeight: 10 };

    performLayoutTest(layout, no_f, s, with_f, s, NO);

  });

  test("layout {centerX, centerY} - assume width/height=0", function () {

    var layout = { centerX: 0.1, centerY: 0.1 };
    var no_f = { x: 0, y: 0, width: 0, height: 0 };
    var with_f = { x: 120, y: 120, width: 0, height: 0 };
    var s = { width: 0, height: 0, top: "50%", left: "50%", marginTop: "50%", marginLeft: "50%" };
    performLayoutTest(layout, no_f, s, with_f, s, NO);

  });

  test("layout {top, left, centerX, centerY, height, width} - top/left take presidence", function () {

    var layout = { top: 0.1, left: 0.1, centerX: 0.1, centerY: 0.1, height: 0.6, width: 0.6 };
    var no_f = { x: 0, y: 0, width: 0, height: 0 };
    var with_f = { x: 20, y: 20, width: 120, height: 120 };
    var s = { width: '60%', height: '60%', top: '10%', left: '10%' };

    performLayoutTest(layout, no_f, s, with_f, s, NO);

  });

  test("layout {bottom, right, centerX, centerY, height, width} - bottom/right take presidence", function () {

    var layout = { bottom: 0.1, right: 0.1, centerX: 0.1, centerY: 0.1, height: 0.6, width: 0.6 };
    var no_f = { x: 0, y: 0, width: 0, height: 0 };
    var with_f = { x: 60, y: 60, width: 120, height: 120 };
    var s = { width: '60%', height: '60%', bottom: '10%', right: '10%' };

    performLayoutTest(layout, no_f, s, with_f, s, NO);

  });

  test("layout {top, left, bottom, right, centerX, centerY, height, width} - top/left take presidence", function () {

    var layout = { top: 0.1, left: 0.1, bottom: 0.1, right: 0.1, centerX: 0.1, centerY: 0.1, height: 0.6, width: 0.6 };
    var no_f = { x: 0, y: 0, width: 0, height: 0 };
    var with_f = { x: 20, y: 20, width: 120, height: 120 };
    var s = { width: '60%', height: '60%', top: '10%', left: '10%' };

    performLayoutTest(layout, no_f, s, with_f, s, NO);

  });


  test("layout {centerX, centerY, width:auto, height:auto}", function () {
    var error = 'NONE';
    var layout = { centerX: 0.1, centerY: 0.1, width: 'auto', height: 'auto' };

    SC.run(function () {
      child.set('layout', layout);
    });

    try {
      child.layoutStyle();
    } catch (e) {
      error = e;
    }

    equal(SC.T_ERROR, SC.typeOf(error), 'Layout style functions should throw an ' +
                                           'error if centerx/y and width/height are set at the same time ' + error);
  });


  // ..........................................................
  // TEST BORDER
  //

  module('BORDER LAYOUT VARIATIONS', commonSetup);

  test("layout {top, left, width, height, border}", function () {
    var layout = { top: 10, left: 10, width: 50, height: 50, border: 2 };
    var s = { top: 10, left: 10, width: 46, height: 46,
              borderTopWidth: 2, borderRightWidth: 2, borderBottomWidth: 2, borderLeftWidth: 2 };
    var no_f = { x: 12, y: 12, width: 46, height: 46 };
    var with_f = { x: 12, y: 12, width: 46, height: 46 };

    performLayoutTest(layout, no_f, s, with_f, s, YES);
  });

  test("layout {top, left, bottom, right, border}", function () {
    var layout = { top: 10, left: 10, bottom: 10, right: 10, border: 2 };
    var no_f = { x: 12, y: 12, width: 0, height: 0 };
    var with_f = { x: 12, y: 12, width: 176, height: 176 };
    var s = { top: 10, left: 10, bottom: 10, right: 10,
               borderTopWidth: 2, borderRightWidth: 2, borderBottomWidth: 2, borderLeftWidth: 2 };

    performLayoutTest(layout, no_f, s, with_f, s, NO);
  });

  test("layout {top, left, bottom, right, borderTop, borderLeft, borderRight, borderBottom}", function () {
    var layout = { top: 10, left: 10, bottom: 10, right: 10, borderTop: 1, borderRight: 2, borderBottom: 3, borderLeft: 4 };
    var no_f = { x: 14, y: 11, width: 0, height: 0 };
    var with_f = { x: 14, y: 11, width: 174, height: 176 };
    var s = { top: 10, left: 10, bottom: 10, right: 10,
               borderTopWidth: 1, borderRightWidth: 2, borderBottomWidth: 3, borderLeftWidth: 4 };

    performLayoutTest(layout, no_f, s, with_f, s, NO);
  });

  test("layout {top, left, bottom, right, border, borderTop, borderLeft}", function () {
    var layout = { top: 10, left: 10, bottom: 10, right: 10, border: 5, borderTop: 1, borderRight: 2 };
    var no_f = { x: 15, y: 11, width: 0, height: 0 };
    var with_f = { x: 15, y: 11, width: 173, height: 174 };
    var s = { top: 10, left: 10, bottom: 10, right: 10,
               borderTopWidth: 1, borderRightWidth: 2, borderBottomWidth: 5, borderLeftWidth: 5 };

    performLayoutTest(layout, no_f, s, with_f, s, NO);
  });

  test("layout {bottom, right, width, height, border}", function () {

    var layout = { bottom: 10, right: 10, width: 50, height: 50, border: 2 };
    var no_f = { x: 2, y: 2, width: 46, height: 46 };
    var with_f = { x: 142, y: 142, width: 46, height: 46 };
    var s = { bottom: 10, right: 10, width: 46, height: 46,
              borderTopWidth: 2, borderRightWidth: 2, borderBottomWidth: 2, borderLeftWidth: 2 };

    performLayoutTest(layout, no_f, s, with_f, s, NO);
  });

  test("layout {centerX, centerY, width, height, border}", function () {

    var layout = { centerX: 10, centerY: 10, width: 60, height: 60, border: 2 };
    var no_f = { x: 12, y: 12, width: 56, height: 56 };
    var with_f = { x: 82, y: 82, width: 56, height: 56 };
    var s = { marginLeft: -20, marginTop: -20, width: 56, height: 56, top: "50%", left: "50%",
              borderTopWidth: 2, borderRightWidth: 2, borderBottomWidth: 2, borderLeftWidth: 2 };

    performLayoutTest(layout, no_f, s, with_f, s, NO);
  });

  test("layout {top, left, width: auto, height: auto}", function () {
    // Reset.
    child.destroy();

    child = SC.View.create({
      useStaticLayout: YES,
      render: function (context) {
        // needed for auto
        context.push('<div style="padding: 10px"></div>');
      }
    });

    // parent MUST have a layer.
    parent.createLayer();
    var layer = parent.get('layer');
    document.body.appendChild(layer);

    var layout = { top: 0, left: 0, width: 'auto', height: 'auto', border: 2 };
    var no_f = null;
    var with_f; //{ x: 2, y: 2, width: 196, height: 196 };
    var s = { top: 0, left: 0, width: 'auto', height: 'auto',
              borderTopWidth: 2, borderRightWidth: 2, borderBottomWidth: 2, borderLeftWidth: 2 };

    performLayoutTest(layout, no_f, s, with_f, s, NO);

    layer.parentNode.removeChild(layer);

    child.destroy();
  });


  // ..........................................................
  // TEST FRAME/STYLEFRAME WHEN PARENT VIEW IS RESIZED
  //

  module('RESIZE FRAME', commonSetup);

  function verifyFrameResize(layout, before, after) {
    parent.appendChild(child);
    SC.run(function () { child.set('layout', layout); });

    deepEqual(child.get('frame'), before, "Before: %@ == %@".fmt(SC.inspect(child.get('frame')), SC.inspect(before)));
    SC.run(function () { parent.adjust('width', 300).adjust('height', 300); });

    deepEqual(child.get('frame'), after, "After: %@ == %@".fmt(SC.inspect(child.get('frame')), SC.inspect(after)));

  }

  test("frame does not change with top/left/w/h", function () {
    var layout = { top: 10, left: 10, width: 60, height: 60 };
    var before = { x: 10, y: 10, width: 60, height: 60 };
    var after =  { x: 10, y: 10, width: 60, height: 60 };
    verifyFrameResize(layout, before, after);
  });

  test("frame shifts down with bottom/right/w/h", function () {
    var layout = { bottom: 10, right: 10, width: 60, height: 60 };
    var before = { x: 130, y: 130, width: 60, height: 60 };
    var after =  { x: 230, y: 230, width: 60, height: 60 };
    verifyFrameResize(layout, before, after);
  });

  test("frame size shifts with top/left/bottom/right", function () {
    var layout = { top: 10, left: 10, bottom: 10, right: 10 };
    var before = { x: 10, y: 10, width: 180, height: 180 };
    var after =  { x: 10, y: 10, width: 280, height: 280 };
    verifyFrameResize(layout, before, after);
  });

  test("frame loc shifts with centerX/centerY", function () {
    var layout = { centerX: 10, centerY: 10, width: 60, height: 60 };
    var before = { x: 80, y: 80, width: 60, height: 60 };
    var after =  { x: 130, y: 130, width: 60, height: 60 };
    verifyFrameResize(layout, before, after);
  });

  //with percentage

  test("frame does not change with top/left/w/h - percentage", function () {
    var layout = { top: 0.1, left: 0.1, width: 0.6, height: 0.6 };
    var before = { x: 20, width: 120, y: 20, height: 120 };
    var after =  { x: 30, y: 30, width: 180, height: 180 };
    verifyFrameResize(layout, before, after);
  });

  test("frame shifts down with bottom/right/w/h - percentage", function () {
    var layout = { bottom: 0.1, right: 0.1, width: 0.6, height: 0.6 };
    var before = { x: 60, y: 60, width: 120, height: 120 };
    var after =  { x: 90, y: 90, width: 180, height: 180 };
    verifyFrameResize(layout, before, after);
  });

  test("frame size shifts with top/left/bottom/right - percentage", function () {
    var layout = { top: 0.1, left: 0.1, bottom: 0.1, right: 0.1 };
    var before = { x: 20, y: 20, width: 160, height: 160 };
    var after =  { x: 30, y: 30, width: 240, height: 240 };
    verifyFrameResize(layout, before, after);
  });

  test("frame loc shifts with centerX/centerY - percentage", function () {
    var layout = { centerX: 0, centerY: 0, width: 0.6, height: 0.6 };
    var before = { x: 40, y: 40, width: 120, height: 120 };
    var after =  { x: 60, y: 60, width: 180, height: 180 };
    verifyFrameResize(layout, before, after);
  });

  test("for proper null variables");
  // nothing should get passed through as undefined, instead we want null in certain cases

  module('STATIC LAYOUT VARIATIONS', commonSetup);

  test("no layout", function () {

    var no_f = null,
        no_s = {},
        with_f = null,
        with_s = {};

    child.set('useStaticLayout', true);

    performLayoutTest(SC.View.prototype.layout, no_f, no_s, with_f, with_s, NO);
  });

  test("with layout", function () {

    var layout = { top: 10, left: 10, width: 50, height: 50 },
        no_f = null,
        no_s = { top: 10, left: 10, width: 50, height: 50 },
        with_f = null,
        with_s = { top: 10, left: 10, width: 50, height: 50 };

    child.set('useStaticLayout', true);

    performLayoutTest(layout, no_f, no_s, with_f, with_s, YES);
  });

  // test("frame size shifts with top/left/bottom/right", function () {
  //   var error=null;
  //   var layout = { top: 10, left: 10, bottom: 10, right: 10 };
  //   parent.appendChild(child);
  //   child.set('layout', layout);
  //   child.get('frame');
  //   parent.adjust('width', 'auto').adjust('height', 'auto');
  //   try{
  //     child.get('frame');
  //   }catch(e) {
  //     error=e;
  //   }
  //   equal(SC.T_ERROR,SC.typeOf(error),'Layout style functions should throw and '+
  //   'error if centerx/y and width/height are set at the same time ' + error );
  //
  //
  // });

  var pane, view;
  module("COMPUTED LAYOUT", {
    setup: function () {

      SC.run(function () {
        // create basic view
        view = SC.View.create({
          useTopLayout: YES,

          layout: function () {
            if (this.get('useTopLayout')) {
              return { top: 10, left: 10, width: 100, height: 100 };
            } else {
              return { bottom: 10, right: 10, width: 200, height: 50 };
            }
          }.property('useTopLayout').cacheable()
        });

        pane = SC.Pane.create({
          layout: { centerX: 0, centerY: 0, width: 400, height: 400 },
          childViews: [view]
        }).append();
      });
    },

    teardown: function () {
      pane.destroy();
      pane = view = null;
    }
  });

  /**
    There was a regression while moving to jQuery 1.8 and removing the seemingly
    unuseful buffered jQuery code, where updating the style failed to clear the
    old style from the view's style attribute.
  */
  test("with computed layout", function () {
    var expectedLayoutStyle,
      expectedStyleAttr,
      layoutStyle,
      styleAttr;

    deepEqual(view.get('layout'), { top: 10, left: 10, width: 100, height: 100 }, "Test the value of the computed layout.");
    layoutStyle = view.get('layoutStyle');
    expectedLayoutStyle = { top: "10px", left: "10px", width: "100px", height: "100px" };
    for (var key in layoutStyle) {
      equal(layoutStyle[key], expectedLayoutStyle[key], "Test the value of %@ in the layout style.".fmt(key));
    }
    styleAttr = view.$().attr('style');
    styleAttr = styleAttr.split(/;\s*/).filter(function (o) { return o; });
    expectedStyleAttr = ['left: 10px', 'width: 100px', 'top: 10px', 'height: 100px'];
    for (var i = styleAttr.length - 1; i >= 0; i--) {
      ok(expectedStyleAttr.indexOf(styleAttr[i]) >= 0, "Test the expected style attribute includes `%@` found in the actual style attribute.".fmt(styleAttr[i]));
    }

    SC.run(function () {
      view.set('useTopLayout', NO);
    });

    deepEqual(view.get('layout'), { bottom: 10, right: 10, width: 200, height: 50 }, "Test the value of the computed layout.");
    layoutStyle = view.get('layoutStyle');
    expectedLayoutStyle = { bottom: "10px", right: "10px", width: "200px", height: "50px" };
    for (var key in layoutStyle) {
      equal(layoutStyle[key], expectedLayoutStyle[key], "Test the value of %@ in the layout style.".fmt(key));
    }

    styleAttr = view.$().attr('style');
    styleAttr = styleAttr.split(/;\s*/).filter(function (o) { return o; });
    expectedStyleAttr = ['bottom: 10px', 'width: 200px', 'right: 10px', 'height: 50px'];
    for (i = styleAttr.length - 1; i >= 0; i--) {
      ok(expectedStyleAttr.indexOf(styleAttr[i]) >= 0, "Test the expected style attribute includes `%@` found in the actual style attribute.".fmt(styleAttr[i]));
    }
  });


  module("OTHER LAYOUT STYLE TESTS", {
    setup: function () {

      SC.run(function () {
        // create basic view
        view = SC.View.create({});

        pane = SC.Pane.create({
          layout: { centerX: 0, centerY: 0, width: 400, height: 400 },
          childViews: [view]
        }).append();
      });
    },

    teardown: function () {
      pane.destroy();
      pane = view = null;
    }
  });



  /*
    There was a regression where switching from a centered layout to a non-centered
    layout failed to remove the margin style.
  */
  test("Switching from centered to non-centered layouts.", function () {
    var styleAttr;

    SC.run(function () {
      view.set('layout', { centerX: 10, centerY: 10, width: 60, height: 60 });
    });

    SC.run(function () {
      view.set('layout', { left: 10, top: 10, width: 60, height: 60 });
    });

    styleAttr = view.$().attr('style');
    styleAttr = styleAttr.split(/;\s*/).filter(function (o) { return o; });
    var expectedStyleAttr = ['left: 10px', 'top: 10px', 'width: 60px', 'height: 60px'];
    for (var i = styleAttr.length - 1; i >= 0; i--) {
      ok(expectedStyleAttr.indexOf(styleAttr[i]) >= 0, "Test the expected style attribute includes `%@` found in the actual style attribute.".fmt(styleAttr[i]));
    }
  });
})();

});minispade.register('sproutcore-views/~tests/view/removeChild', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

// .......................................................
// removeChild()
//

var parent, child;
module("SC.View#removeChild", {
	setup: function() {
		parent = SC.View.create({ childViews: [
      SC.View.extend({
        updateLayerLocationIfNeeded: CoreTest.stub('updateLayerLocationIfNeeded', SC.View.prototype.updateLayerLocationIfNeeded)
      })
    ] });
		child = parent.childViews[0];
	}
});

test("returns receiver", function() {
	equal(parent.removeChild(child), parent, 'receiver');
});

test("removes child from parent.childViews array", function() {
  ok(parent.childViews.indexOf(child)>=0, 'precond - has child in childViews array before remove');
  parent.removeChild(child);
  ok(parent.childViews.indexOf(child)<0, 'removed child');
});

test("sets parentView property to null", function() {
  ok(child.get('parentView'), 'precond - has parentView');
  parent.removeChild(child);
  ok(!child.get('parentView'), 'parentView is now null');
});

test("does nothing if passed null", function() {

  // monkey patch callbacks to make sure nothing runs.
  var callCount = 0;
  parent.willRemoveChild = parent.didRemoveChild = function() { callCount++; };

  parent.removeChild(null);
  equal(callCount, 0, 'did not invoke callbacks');
});

test("invokes child.willRemoveFromParent before removing if defined", function() {

  // monkey patch to test
  var callCount = 0;
  child.willRemoveFromParent = function() {
    // verify invoked BEFORE removal
    equal(child.get('parentView'), parent, 'still in parent');
    callCount++;
  };

  parent.removeChild(child);
  equal(callCount, 1, 'invoked callback');
});

test("invokes parent.willRemoveChild before removing if defined", function() {

  // monkey patch to test
  var callCount = 0;
  parent.willRemoveChild = function(view) {
    equal(view, child, 'passed child as param');

    // verify invoked BEFORE removal
    equal(child.get('parentView'), parent, 'still in parent');
    callCount++;
  };

  parent.removeChild(child);
  equal(callCount, 1, 'invoked callback');
});


test("invokes child.didRemoveFromParent AFTER removing if defined", function() {

  // monkey patch to test
  var callCount = 0;
  child.didRemoveFromParent = function(view) {
    equal(view, parent, 'passed parent as param');

    // verify invoked AFTER removal
    ok(!child.get('parentView'), 'no longer in parent');
    callCount++;
  };

  parent.removeChild(child);
  equal(callCount, 1, 'invoked callback');
});

test("invokes parent.didRemoveChild before removing if defined", function() {

  // monkey patch to test
  var callCount = 0;
  parent.didRemoveChild = function(view) {
    equal(view, child, 'passed child as param');

    // verify invoked BEFORE removal
    ok(!child.get('parentView'), 'no longer in parent');
    callCount++;
  };

  parent.removeChild(child);
  equal(callCount, 1, 'invoked callback');
});

// VERIFY LAYER CHANGES ARE DEFERRED
test("should not move layer immediately");
// , function() {

//   parent.createLayer();

// 	var parentLayer = parent.get('layer'), childLayer = child.get('layer');
//   ok(parentLayer, 'precond - parent has layer');
//   ok(childLayer, 'precond - child has layer');
//   equal(childLayer.parentNode, parentLayer, 'child layer belong to parent');

//   parent.removeChild(child);
//   equal(childLayer.parentNode, parentLayer, 'child layer belong to parent');
// });

// .......................................................
// removeAllChildren()
//
var view;
module("SC.View#removeAllChildren", {
  setup: function() {
    view = SC.View.create({
      childViews: [SC.View, SC.View, SC.View]
    });
  }
});

test("removes all child views", function() {
  equal(view.childViews.length, 3, 'precond - has child views');

  view.removeAllChildren();
  equal(view.childViews.length, 0, 'removed all children');
});

test("returns receiver", function() {
	equal(view.removeAllChildren(), view, 'receiver');
});

// .......................................................
// removeFromParent()
//
module("SC.View#removeFromParent");

test("removes view from parent view", function() {
  parent = SC.View.create({ childViews: [SC.View] });
  child = parent.childViews[0];
  ok(child.get('parentView'), 'precond - has parentView');

  child.removeFromParent();
  ok(!child.get('parentView'), 'no longer has parentView');
  ok(parent.childViews.indexOf(child)<0, 'no longer in parent childViews');
});

test("returns receiver", function() {
	equal(child.removeFromParent(), child, 'receiver');
});

test("does nothing if not in parentView", function() {
  var callCount = 0;
  child = SC.View.create();

	// monkey patch for testing...
	child.willRemoveFromParent = function() { callCount++; };
	ok(!child.get('parentView'), 'precond - has no parent');

	child.removeFromParent();
	equal(callCount, 0, 'did not invoke callback');
});



});minispade.register('sproutcore-views/~tests/view/render', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

// .......................................................
//  render()
//
module("SC.View#render");

test("default implementation invokes renderChildViews if firstTime = YES", function() {

  var rendered = 0, updated = 0, parentRendered = 0, parentUpdated = 0 ;
  var view = SC.View.create({
    displayProperties: ["triggerRenderProperty"],
    childViews: ["child"],

    render: function(context) {
      parentRendered++;
    },

    update: function(jquery) {
      parentUpdated++;
    },

    child: SC.View.create({
      render: function(context) {
        rendered++;
      },

      update: function(jquery) {
        updated++;
      }
    })
  });

  view.createLayer();
  equal(rendered, 1, 'rendered the child');
  equal(parentRendered, 1);

  view.updateLayer(true);
  equal(rendered, 1, 'didn\'t call render again');
  equal(parentRendered, 1, 'didn\'t call the parent\'s render again');
  equal(parentUpdated, 1, 'called the parent\'s update');
  equal(updated, 0, 'didn\'t call the child\'s update');

  // Clean up.
  view.destroy();
});

test("default implementation does not invoke renderChildViews if explicitly rendered in render method", function() {

  var rendered = 0, updated = 0, parentRendered = 0, parentUpdated = 0 ;
  var view = SC.View.create({
    displayProperties: ["triggerRenderProperty"],
    childViews: ["child"],

    render: function(context) {
      this.renderChildViews(context);
      parentRendered++;
    },

    update: function(jquery) {
      parentUpdated++;
    },

    child: SC.View.create({
      render: function(context) {
        rendered++;
      },

      update: function(jquery) {
        updated++;
      }
    })
  });

  view.createLayer();
  equal(rendered, 1, 'rendered the child once');
  equal(parentRendered, 1);
  equal(view.$('div').length, 1);

  view.updateLayer(true);
  equal(rendered, 1, 'didn\'t call render again');
  equal(parentRendered, 1, 'didn\'t call the parent\'s render again');
  equal(parentUpdated, 1, 'called the parent\'s update');
  equal(updated, 0, 'didn\'t call the child\'s update');

  // Clean up.
  view.destroy();
});

test("should invoke renderChildViews if layer is destroyed then re-rendered", function() {

  var rendered = 0, updated = 0, parentRendered = 0, parentUpdated = 0 ;
  var view = SC.View.create({
    displayProperties: ["triggerRenderProperty"],
    childViews: ["child"],

    render: function(context) {
      parentRendered++;
    },

    update: function(jquery) {
      parentUpdated++;
    },

    child: SC.View.create({
      render: function(context) {
        rendered++;
      },

      update: function(jquery) {
        updated++;
      }
    })
  });

  view.createLayer();
  equal(rendered, 1, 'rendered the child once');
  equal(parentRendered, 1);
  equal(view.$('div').length, 1);

  view.destroyLayer();
  view.createLayer();
  equal(rendered, 2, 'rendered the child twice');
  equal(parentRendered, 2);
  equal(view.$('div').length, 1);

  // Clean up.
  view.destroy();
});
// .......................................................
// renderChildViews()
//

module("SC.View#renderChildViews");

test("creates a context and then invokes renderToContext or updateLayer on each childView", function() {

  var runCount = 0, curContext, curFirstTime ;

  var ChildView = SC.View.extend({
    renderToContext: function(context) {
      equal(context.prevObject, curContext, 'passed child context of curContext');

      equal(context.tagName(), this.get('tagName'), 'context setup with current tag name');

      runCount++; // record run
    },

    updateLayer: function() {
      runCount++;
    }
  });

  var view = SC.View.create({
    childViews: [
      ChildView.extend({ tagName: 'foo' }),
      ChildView.extend({ tagName: 'bar' }),
      ChildView.extend({ tagName: 'baz' })
    ]
  });

  // VERIFY: firstTime= YES
  curContext = view.renderContext('div');
  curFirstTime= YES ;
  equal(view.renderChildViews(curContext, curFirstTime), curContext, 'returns context');
  equal(runCount, 3, 'renderToContext() invoked for each child view');


  // VERIFY: firstTime= NO
  runCount = 0 ; //reset
  curContext = view.renderContext('div');
  curFirstTime= NO ;
  equal(view.renderChildViews(curContext, curFirstTime), curContext, 'returns context');
  equal(runCount, 3, 'updateLayer() invoked for each child view');

  // Clean up.
  view.destroy();
});

test("creates a context and then invokes renderChildViews to call renderToContext on each childView", function() {

  var runCount = 0, curContext ;

  var ChildView = SC.View.extend({
    renderToContext: function(context) {
      equal(context.prevObject, curContext, 'passed child context of curContext');
      equal(context.tagName(), this.get('tagName'), 'context setup with current tag name');
      runCount++; // record run
    }
  });

  var view = SC.View.create({
    childViews: [
      ChildView.extend({ tagName: 'foo' }),
      ChildView.extend({ tagName: 'bar' }),
      ChildView.extend({ tagName: 'baz' })
    ]
  });

  // VERIFY: firstTime= YES
  curContext = view.renderContext('div');
  view.renderChildViews(curContext);
  equal(runCount, 3, 'renderToContext() invoked for each child view');

  // Clean up.
  view.destroy();
});

});minispade.register('sproutcore-views/~tests/view/render_delegate_support', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

// .......................................................
//  render()
//
module("SC.View#render");

test("Supports backwards-compatible render method", function() {
  var renderCallCount = 0;
  var view = SC.View.create({
    render: function(context, firstTime) {
      renderCallCount++;
      ok(context._STYLE_REGEX, 'passes RenderContext');
      equal(firstTime, YES, 'passes YES for firstTime');
    }
  });

  view.createLayer();

  view.render = function(context, firstTime) {
    renderCallCount++;
    ok(context._STYLE_REGEX, 'passes RenderContext');
    equal(firstTime, NO, 'passes NO for firstTime');
  };

  view.updateLayer();

  equal(renderCallCount, 2, 'render should have been called twice');

  // Clean up.
  view.destroy();
});

test("Treats a view as its own render delegate", function() {
  var renderCallCount = 0,
      updateCallCount = 0;

  var view = SC.View.create({
    render: function(context) {
      // Check for existence of _STYLE_REGEX to determine if this is an instance
      // of SC.RenderContext
      ok(context._STYLE_REGEX, 'passes render context');
      renderCallCount++;
    },

    update: function(elem) {
     ok(elem.jquery, 'passes a jQuery object as first parameter');
     updateCallCount++;
    }
  });

  view.createLayer();
  view.updateLayer();
  equal(renderCallCount, 1, "calls render once");
  equal(updateCallCount, 1, "calls update once");

  // Clean up.
  view.destroy();
});

test("Passes data source as first parameter if render delegate is not the view", function() {
  var renderCallCount = 0,
      updateCallCount = 0;

  var view;

  var renderDelegate = SC.Object.create({
    render: function(dataSource, context, firstTime) {
      equal(dataSource, view.get('renderDelegateProxy'), "passes the view's render delegate proxy as data source");
      ok(context._STYLE_REGEX, "passes render context");
      equal(firstTime, undefined, "does not pass third parameter");
      renderCallCount++;
    },

    update: function(dataSource, elem) {
      equal(dataSource, view.get('renderDelegateProxy'), "passes view's render delegate proxy as data source");
      ok(elem.jquery, "passes a jQuery object as first parameter");
      updateCallCount++;
    }
  });

  view = SC.View.create({
    renderDelegate: renderDelegate
  });

  view.createLayer();
  view.updateLayer();
  equal(renderCallCount, 1, "calls render once");
  equal(updateCallCount, 1, "calls update once");

  // Clean up.
  view.destroy();
});

test("Extending view with render delegate by implementing old render method", function() {
  var renderCalls = 0, updateCalls = 0;
  var parentView = SC.View.extend({
    renderDelegate: SC.Object.create({
      render: function(context) {
        renderCalls++;
      },

      update: function(cq) {
        updateCalls++;
      }
    })
  });

  var childView = parentView.create({
    render: function(context, firstTime) {
      this._super();
    }
  });

  childView.createLayer();
  childView.updateLayer();

  equal(renderCalls, 1, "calls render on render delegate once");
  equal(updateCalls, 1, "calls update on render delegates once");
});

test("Views that do not override render should render their child views", function() {
  var newStyleCount = 0, oldStyleCount = 0, renderDelegateCount = 0;

  var parentView = SC.View.design({
    childViews: 'newStyle oldStyle renderDelegateView'.w(),

    newStyle: SC.View.design({
      render: function(context) {
        newStyleCount++;
      },

      update: function() {
        // no op
      }
    }),

    oldStyle: SC.View.design({
      render: function(context, firstTime) {
        oldStyleCount++;
      }
    }),

    renderDelegateView: SC.View.design({
      renderDelegate: SC.Object.create({
        render: function(dataSource, context) {
          ok(dataSource.isViewRenderDelegateProxy, "Render delegate should get passed a view's proxy for its data source");
          renderDelegateCount++;
        },

        update: function() {
          // no op
        }
      })
    })
  });

  parentView = parentView.create();

  parentView.createLayer();
  parentView.updateLayer();

  equal(newStyleCount, 1, "calls render on new style view once");
  equal(oldStyleCount, 1, "calls render on old style view once");
  equal(renderDelegateCount, 1, "calls render on render delegate once");
});

});minispade.register('sproutcore-views/~tests/view/replaceAllChildren_test', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module, test, equals, ok */

var parentView;

/*
 * SC.CoreView.UNRENDERED
 * SC.CoreView.UNATTACHED
 * SC.CoreView.UNATTACHED_BY_PARENT
 * SC.CoreView.ATTACHED_SHOWING
 * SC.CoreView.ATTACHED_SHOWN
 * SC.CoreView.ATTACHED_HIDING
 * SC.CoreView.ATTACHED_HIDDEN
 * SC.CoreView.ATTACHED_HIDDEN_BY_PARENT
 * SC.CoreView.ATTACHED_BUILDING_IN
 * SC.CoreView.ATTACHED_BUILDING_OUT
 * SC.CoreView.ATTACHED_BUILDING_OUT_BY_PARENT
 */


module("SC.View.prototype.replaceAllChildren", {

  setup: function () {
    parentView = SC.View.create({
      childViews: ['a', 'b', SC.View],

      a: SC.View,
      b: SC.View
    });
  },

  teardown: function () {
    parentView.destroy();
    parentView = null;
  }

});

test("Replaces all children. UNRENDERED parent view.", function () {
  var childViews = parentView.get('childViews'),
    newChildViews = [SC.View.create(), SC.View.create()];

  equal(childViews.get('length'), 3, "There are this many child views originally");

  // Replace all children.
  parentView.replaceAllChildren(newChildViews);

  childViews = parentView.get('childViews');
  equal(childViews.get('length'), 2, "There are this many child views after replaceAllChildren");
});


test("Replaces all children.  UNATTACHED parent view.", function () {
  var childViews = parentView.get('childViews'),
    newChildViews = [SC.View.create(), SC.View.create()],
    childView, jq;

  // Render the parent view.
  parentView.createLayer();

  equal(childViews.get('length'), 3, "There are this many child views originally");

  jq = parentView.$();
  for (var i = 0, len = childViews.get('length'); i < len; i++) {
    childView = childViews.objectAt(i);

    ok(jq.find('#' + childView.get('layerId')).get('length') === 1, "The child view with layer id %@ exists in the parent view's layer".fmt(childView.get('layerId')));
  }

  // Replace all children.
  parentView.replaceAllChildren(newChildViews);

  childViews = parentView.get('childViews');
  equal(childViews.get('length'), 2, "There are this many child views after replaceAllChildren");

  jq = parentView.$();
  for (i = 0, len = childViews.get('length'); i < len; i++) {
    childView = childViews.objectAt(i);

    ok(jq.find('#' + childView.get('layerId')).get('length') === 1, "The new child view with layer id %@ exists in the parent view's layer".fmt(childView.get('layerId')));
  }
});


test("Replaces all children.  ATTACHED_SHOWN parent view.", function () {
  var childViews = parentView.get('childViews'),
    newChildViews = [SC.View.create(), SC.View.create()],
    childView, jq;

  // Render the parent view and attach.
  parentView.createLayer();
  parentView._doAttach(document.body);

  equal(childViews.get('length'), 3, "There are this many child views originally");

  jq = parentView.$();
  for (var i = 0, len = childViews.get('length'); i < len; i++) {
    childView = childViews.objectAt(i);

    ok(jq.find('#' + childView.get('layerId')).get('length') === 1, "The child view with layer id %@ exists in the parent view's layer".fmt(childView.get('layerId')));
  }

  // Replace all children.
  parentView.replaceAllChildren(newChildViews);

  childViews = parentView.get('childViews');
  equal(childViews.get('length'), 2, "There are this many child views after replaceAllChildren");

  jq = parentView.$();
  for (i = 0, len = childViews.get('length'); i < len; i++) {
    childView = childViews.objectAt(i);

    ok(jq.find('#' + childView.get('layerId')).get('length') === 1, "The new child view with layer id %@ exists in the parent view's layer".fmt(childView.get('layerId')));
  }
});


module("SC.View.prototype.replaceAllChildren", {

  setup: function () {
    parentView = SC.View.create({
      childViews: ['a', 'b', SC.View],

      containerLayer: function () {
        return this.$('._wrapper')[0];
      }.property('layer').cacheable(),

      a: SC.View,
      b: SC.View,

      render: function (context) {
        context = context.begin().addClass('_wrapper');
        this.renderChildViews(context);
        context = context.end();
      }
    });
  },

  teardown: function () {
    parentView.destroy();
    parentView = null;
  }

});


test("Replaces all children. UNRENDERED parent view.", function () {
  var childViews = parentView.get('childViews'),
    newChildViews = [SC.View.create(), SC.View.create()];

  equal(childViews.get('length'), 3, "There are this many child views originally");

  // Replace all children.
  parentView.replaceAllChildren(newChildViews);

  childViews = parentView.get('childViews');
  equal(childViews.get('length'), 2, "There are this many child views after replaceAllChildren");
});


test("Replaces all children.  UNATTACHED parent view.", function () {
  var childViews = parentView.get('childViews'),
    newChildViews = [SC.View.create(), SC.View.create()],
    childView, jq;

  // Render the parent view.
  parentView.createLayer();

  equal(childViews.get('length'), 3, "There are this many child views originally");

  jq = parentView.$('._wrapper');
  for (var i = 0, len = childViews.get('length'); i < len; i++) {
    childView = childViews.objectAt(i);

    ok(jq.find('#' + childView.get('layerId')).get('length') === 1, "The child view with layer id %@ exists in the parent view's layer".fmt(childView.get('layerId')));
  }

  // Replace all children.
  parentView.replaceAllChildren(newChildViews);

  childViews = parentView.get('childViews');
  equal(childViews.get('length'), 2, "There are this many child views after replaceAllChildren");

  jq = parentView.$('._wrapper');
  for (i = 0, len = childViews.get('length'); i < len; i++) {
    childView = childViews.objectAt(i);

    ok(jq.find('#' + childView.get('layerId')).get('length') === 1, "The new child view with layer id %@ exists in the parent view's layer".fmt(childView.get('layerId')));
  }
});


test("Replaces all children using containerLayer.  ATTACHED_SHOWN parent view.", function () {
  var childViews = parentView.get('childViews'),
    newChildViews = [SC.View.create(), SC.View.create()],
    childView, jq;

  // Render the parent view and attach.
  parentView.createLayer();
  parentView._doAttach(document.body);

  equal(childViews.get('length'), 3, "There are this many child views originally");

  jq = parentView.$('._wrapper');
  for (var i = 0, len = childViews.get('length'); i < len; i++) {
    childView = childViews.objectAt(i);

    ok(jq.find('#' + childView.get('layerId')).get('length') === 1, "The child view with layer id %@ exists in the parent view's layer".fmt(childView.get('layerId')));
  }

  // Replace all children.
  parentView.replaceAllChildren(newChildViews);

  childViews = parentView.get('childViews');
  equal(childViews.get('length'), 2, "There are this many child views after replaceAllChildren");

  jq = parentView.$('._wrapper');
  for (i = 0, len = childViews.get('length'); i < len; i++) {
    childView = childViews.objectAt(i);

    ok(jq.find('#' + childView.get('layerId')).get('length') === 1, "The new child view with layer id %@ exists in the parent view's layer".fmt(childView.get('layerId')));
  }
});

});minispade.register('sproutcore-views/~tests/view/replaceChild', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

var parent, child;
module("SC.View#replaceChild", {
	setup: function() {
	  child = SC.View.create();
	  parent = SC.View.create({
	    childViews: [SC.View, SC.View, SC.View]
	  });		
	}
});


test("swaps the old child with the new child", function() {
  var oldChild = parent.childViews[1];

  parent.replaceChild(child, oldChild);
  equal(child.get('parentView'), parent, 'child has new parent');
  ok(!oldChild.get('parentView'), 'old child no longer has parent');
  
  equal(parent.childViews[1], child, 'parent view has new child at loc 1');
  equal(parent.childViews.length, 3, 'parent has same number of children');
});

});minispade.register('sproutcore-views/~tests/view/static_layout', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

module("SC.View - Static Layout functionality");

test("Static layout", function() {
  var view = SC.View.create({
    useStaticLayout: YES
  });

  view.createLayer();

  ok(view.$().is('.sc-static-layout'), "views with useStaticLayout get the sc-static-layout class");
});

});minispade.register('sproutcore-views/~tests/view/theme', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok */

module("SC.View#themes");

// TODO: This isn't passing on master. Alex needs to take a look at it.

//var t1 = SC.Theme.addTheme("sc-test-1", SC.BaseTheme.extend({name: 'test-1' }));
//var t2 = SC.Theme.addTheme("sc-test-2", SC.BaseTheme.extend({name: 'test-2' }));

test("changing themes propagates to child view.");
//test("changing themes propagates to child view.", function() {
  //var view = SC.View.create({
    //"childViews": "child".w(),
    //theme: "sc-test-1",
    //child: SC.View.extend({
      
    //})
  //});
  
  //ok(t1 === view.get("theme"), "view's theme should be sc-test-1");
  //ok(t1 === view.child.get("theme"), "view's child's theme should be sc-test-1");
  //view.set('themeName', 'sc-test-2');
  //ok(t2 === view.get("theme"), "view's theme should be sc-test-2");
  //ok(t2 === view.child.get("theme"), "view's child's theme should be sc-test-2");
//});

test("adding child to parent propagates theme to child view.");
//test("adding child to parent propagates theme to child view.", function() {
  //var child = SC.View.create({});
  //var view = SC.View.create({
    //theme: "sc-test-1"
  //});
  
  //ok(t1 === view.get("theme"), "view's theme should be sc-test-1");
  //equal(child.get("theme"), SC.Theme.find('sc-base'), "view's child's theme should start at base theme");
  //view.appendChild(child);
  //equal(t1, child.get("theme"), "view's child's theme should be sc-test-1");
//});

});minispade.register('sproutcore-views/~tests/view/touch', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            portions copyright @2011 Apple Inc.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var pane;

module("SC.View#touch", {
  setup: function() {
    SC.run(function() {
     pane = SC.Pane.create({
       layout: { width: 200, height: 200, left: 0, top: 0 },
       childViews: ['outerView'],

       outerView: SC.View.extend({
         childViews: ['innerView'],

         innerView: SC.View.extend({
           layout: { width: 50, height: 50, left: 100, top: 100 }
         })
       })
     }).append();
    });
  },

  teardown: function() {
    pane.remove();
    pane = null;
  }
});

function testTouches (view, left, top, boundary) {
  var frame = view.get('frame');

  // Just outside the touchBoundary
  ok(!view.touchIsInBoundary({ pageX: left - boundary - 1, pageY: top }), '{ pageX: %@, pageY: %@ } is not inside %@'.fmt(left - boundary - 1, top, SC.stringFromRect(view.get('_touchBoundaryFrame'))));

  // Just inside the touchBoundary
  ok(view.touchIsInBoundary({ pageX: left - boundary, pageY: top }), '{ pageX: %@, pageY: %@ } is inside %@'.fmt(left - boundary, top, SC.stringFromRect(view.get('_touchBoundaryFrame'))));

  // Just inside the edge of the view
  ok(view.touchIsInBoundary({ pageX: left + frame.width, pageY: top }), '{ pageX: %@, pageY: %@ } is inside %@'.fmt(left + frame.width, top, SC.stringFromRect(view.get('_touchBoundaryFrame'))));

  // Just inside the touchBoundary
  ok(view.touchIsInBoundary({ pageX: left + frame.width + boundary, pageY: top }), '{ pageX: %@, pageY: %@ } is inside %@'.fmt(left + frame.width + boundary, top, SC.stringFromRect(view.get('_touchBoundaryFrame'))));

  // Just outside the touchBoundary
  ok(!view.touchIsInBoundary({ pageX: left + frame.width + boundary + 1, pageY: top }), '{ pageX: %@, pageY: %@ } is not inside %@'.fmt(left + frame.width + boundary + 1, top, SC.stringFromRect(view.get('_touchBoundaryFrame'))));

  // Just outside the touchBoundary
  ok(!view.touchIsInBoundary({ pageX: left, pageY: top - boundary - 1 }), '{ pageX: %@, pageY: %@ } is not inside %@'.fmt(left, top - boundary - 1, SC.stringFromRect(view.get('_touchBoundaryFrame'))));

  // Just inside the touchBoundary
  ok(view.touchIsInBoundary({ pageX: left, pageY: top - boundary }), '{ pageX: %@, pageY: %@ } is inside %@'.fmt(left, top - boundary, SC.stringFromRect(view.get('_touchBoundaryFrame'))));

  // Just inside the edge of the view
  ok(view.touchIsInBoundary({ pageX: left, pageY: top + frame.height }), '{ pageX: %@, pageY: %@ } is inside %@'.fmt(left, top + frame.height, SC.stringFromRect(view.get('_touchBoundaryFrame'))));

  // Just inside the touchBoundary
  ok(view.touchIsInBoundary({ pageX: left, pageY: top + frame.height + boundary }), '{ pageX: %@, pageY: %@ } is inside %@'.fmt(left, top + frame.height + boundary, SC.stringFromRect(view.get('_touchBoundaryFrame'))));

  // Just outside the touchBoundary
  ok(!view.touchIsInBoundary({ pageX: left, pageY: top + frame.height + boundary + 1 }), '{ pageX: %@, pageY: %@ } is not inside %@'.fmt(left, top + frame.height + boundary + 1, SC.stringFromRect(view.get('_touchBoundaryFrame'))));

}

test("touchIsInBoundary() should return appropriate values", function() {
  var outerView = pane.get('outerView'),
    innerView = outerView.get('innerView');

  testTouches(innerView, 100, 100, 25);

  // Move the inner view
  SC.run(function() {
    innerView.adjust('top', 150);
  });
  testTouches(innerView, 100, 150, 25);

  // Move the outer view
  SC.run(function() {
    outerView.adjust('left', 100);
  });
  testTouches(innerView, 200, 150, 25);

  // Expand the touch boundary
  SC.run(function() {
    innerView.set('touchBoundary', { left: 50, bottom: 50, top: 50, right: 50 });
  });
  testTouches(innerView, 200, 150, 50);

  // Contract the touch boundary
  SC.run(function() {
    innerView.set('touchBoundary', { left: 5, bottom: 5, top: 5, right: 5 });
  });
  testTouches(innerView, 200, 150, 5);
});

test("touchIsInBoundary() should return appropriate values for a newly appended view", function() {
  var outerView = pane.get('outerView'),
    innerView = outerView.get('innerView');

  // Append a view
  var newView = SC.View.create({
    layout: { width: 10, height: 10, left: 50, top: 50 }
  });

  SC.run(function() {
    outerView.appendChild(newView);
  });
  testTouches(newView, 50, 50, 25);
});

});minispade.register('sproutcore-views/~tests/view/updateLayer', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

// NOTE: This file tests both updateLayer() and the related methods that
// will trigger it.

// ..........................................................
// TEST: updateLayer()
//
module("SC.View#updateLayer");

test("invokes applyAttributesToContext() and then updates layer element", function() {
  var layer = document.createElement('div');

  var times = 0;
  var view = SC.View.create({
    applyAttributesToContext: function() {
      times++;
      this.$().addClass('did-update-' + times);
    }
  });
  view.createLayer();
  view.updateLayer(true);
  ok(view.$().attr('class').indexOf('did-update-2')>=0, 'has class name added by render()');

  // Clean up.
  layer = null;
  view.destroy();
});

// ..........................................................
// TEST: updateLayerIfNeeded()
//
var view, callCount ;
module("SC.View#updateLayerIfNeeded", {
  setup: function() {
    view = SC.View.create({
      isVisible: false,
      _executeDoUpdateContent: function() {
        callCount++;
      }
    });
    callCount = 0 ;

    view.createLayer();
    view._doAttach(document.body);
  },

  teardown: function () {
    // Clean up.
    view.destroy();
    view = null;
  }

});

test("does not call _executeDoUpdateContent if not in shown state", function() {
  view.updateLayerIfNeeded();
  equal(callCount, 0, '_executeDoUpdateContent did NOT run');
});

test("does call _executeDoUpdateContent if in shown state", function() {
  view.set('isVisible', true);
  equal(view.get('isVisibleInWindow'), YES, 'precond - isVisibleInWindow');

  view.updateLayerIfNeeded();
  ok(callCount > 0, '_executeDoUpdateContent() did run');
});

test("returns receiver", function() {
  equal(view.updateLayerIfNeeded(), view, 'returns receiver');
});

test("only runs _executeDoUpdateContent once if called multiple times (since layerNeedsUpdate is set to NO)", function() {
  callCount = 0;
  view.set('isVisible', true);
  SC.run(function () {
    view.displayDidChange().displayDidChange().displayDidChange();
  });
  equal(callCount, 1, '_executeDoUpdateContent() called only once');
});

});minispade.register('sproutcore-views/~tests/view/view', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok */

module("SC.View");

test("setting themeName should trigger a theme observer", function() {
  var count = 0;
  var view = SC.View.create({
    themeDidChange: function() {
      count++;
    }.observes('theme')
  });

  view.set('themeName', 'hello');
  equal(1, count, "theme observers should get called");
});

test("setting themeName should trigger a theme observer when extending", function() {
  var count = 0;
  var View = SC.View.extend({
    themeDidChange: function() {
      count++;
    }.observes('theme')
  });

  View.create().set('themeName', 'hello');
  equal(1, count, "theme observers should get called");
});

test("it still works with the backward compatible theme property", function() {
  var count = 0;
  var view = SC.View.create({
    theme: 'sc-base',
    themeDidChange: function() {
      count++;
    }.observes('theme')
  });

  equal(SC.Theme.find('sc-base'), view.get('theme'));
  view.set('themeName', 'hello');
  equal(1, count, "theme observers should get called");
});

test("it still works with the backward compatible theme property when extending", function() {
  var count = 0;
  var View = SC.View.extend({
    theme: 'sc-base',
    themeDidChange: function() {
      count++;
    }.observes('theme')
  });

  var view = View.create();
  equal(SC.Theme.find('sc-base'), view.get('theme'));
  view.set('themeName', 'hello');
  equal(1, count, "theme observers should get called");
});


});minispade.register('sproutcore-views/~tests/view/viewDidResize', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ htmlbody */

// ..........................................................
// viewDidResize()
//
module("SC.View#viewDidResize");

test("invokes parentViewDidResize on all child views", function() {
  var callCount = 0 ;
  var ChildView = SC.View.extend({
    parentViewDidResize: function() { callCount++; }
  });

  var view = SC.View.create({
    childViews: [ChildView, ChildView, ChildView]
  });

  // now test...
  SC.run(function() { view.viewDidResize(); });
  equal(callCount, 3, 'should invoke parentViewDidResize() on all children');
});

test("parentViewDidResize should only be called when the parent's layout property changes in a manner that may affect child views.", function() {
  var callCount = 0 ;
  var view = SC.View.create({
    // use the callback below to detect when viewDidResize is icalled.
    childViews: [SC.View.extend({
      parentViewDidResize: function() { callCount++; }
    })]
  });

  SC.run(function () { view.set('layout', { top: 10, left: 20, height: 50, width: 40 }); });
  equal(callCount, 1, 'parentViewDidResize should invoke once');

  SC.run(function () { view.adjust('top', 0); });
  equal(callCount, 1, 'parentViewDidResize should invoke once');

  SC.run(function () { view.adjust('height', 60); });
  equal(callCount, 2, 'parentViewDidResize should invoke twice');

  // This is tricky, if the height increases, but the same size border is added, the effective height/width is unchanged.
  SC.run(function () { view.adjust({'height': 70, 'borderTop': 10 }); });
  equal(callCount, 2, 'parentViewDidResize should invoke twice');
});

test("The view's frame should only notify changes when its layout changes if the effective size or position actually change.", function () {
  var view2 = SC.View.create({
      frameCallCount: 0,
      frameDidChange: function() {
        this.frameCallCount++;
      }.observes('frame'),
      viewDidResize: CoreTest.stub('viewDidResize', SC.View.prototype.viewDidResize)
    }),
    view1 = SC.View.create({
      childViews: [view2],
      layout: { width: 200, height: 200 }
    });

  SC.run(function () { view2.set('layout', { height: 50, width: 50 }); });
  equal(view2.get('frameCallCount'), 1, 'frame should have notified changing once.');

  SC.run(function () { view2.adjust('top', 0); });
  equal(view2.get('frameCallCount'), 2, 'frame should have notified changing once.');

  SC.run(function () { view2.adjust('height', 100); });
  equal(view2.get('frameCallCount'), 3, 'frame should have notified changing twice.');

  // Tricky.
  SC.run(function () { view2.adjust({ 'height': 110, 'borderTop': 10, 'top': -10 }); });
  equal(view2.get('frameCallCount'), 4, 'frame should have notified changing twice.');

  SC.run(function () { view2.adjust('width', null); });
  equal(view2.get('frameCallCount'), 5, 'frame should have notified changing thrice.');

  // Tricky.
  SC.run(function () { view2.adjust('width', 200); });
  equal(view2.get('frameCallCount'), 6, 'frame should have notified changing thrice.');
});

test("making sure that the frame value is correct inside viewDidResize()", function() {
  // We want to test to be sure that when the view's viewDidResize() method is
  // called, its frame has been updated.  But rather than run the test inside
  // the method itself, we'll cache a global reference to the then-current
  // value and test it later.
  var cachedFrame;

  var view = SC.View.create({

    layout: { left:0, top:0, width:400, height:400 },

    viewDidResize: function() {
        this._super();

        // Set a global reference to my frame at this point so that we can
        // test for the correct value later.
        cachedFrame = this.get('frame');
      }
  });


  // Access the frame once before resizing the view, to make sure that the
  // previous value was cached.  That way, when we ask for the frame again
  // after the resize, we can verify that the cache invalidation logic is
  // working correctly.
  var originalFrame = view.get('frame');

  SC.RunLoop.begin();
  view.adjust('height', 314);
  SC.RunLoop.end();

  // Now that we've adjusted the view, the cached view (as it was inside its
  // viewDidResize() method) should be the same value, because the cached
  // 'frame' value should have been invalidated by that point.
  deepEqual(view.get('frame').height, cachedFrame.height, 'height');
});


// ..........................................................
// parentViewDidResize()
//
module("SC.View#parentViewDidResize");

test("When parentViewDidResize is called on a view, it should only notify on frame and cascade the call to child views if it will be affected by the parent's resize.", function() {
  var view = SC.View.create({
      // instrument...
      frameCallCount: 0,
      frameDidChange: function() {
        this.frameCallCount++;
      }.observes('frame'),
      viewDidResize: CoreTest.stub('viewDidResize', SC.View.prototype.viewDidResize)
    }),
    parentView = SC.View.create({
      childViews: [view],
      layout: { height: 100, width: 100 }
    });

  // try with fixed layout
  view.set('layout', { top: 10, left: 10, height: 10, width: 10 });
  view.viewDidResize.reset(); view.frameCallCount = 0;
  parentView.adjust({ width: 90, height: 90 });
  view.viewDidResize.expect(0);
  equal(view.frameCallCount, 0, 'should not notify frame changed when isFixedPosition: %@ and isFixedSize: %@'.fmt(view.get('isFixedPosition'), view.get('isFixedSize')));

  // try with flexible height
  view.set('layout', { top: 10, left: 10, bottom: 10, width: 10 });
  view.viewDidResize.reset(); view.frameCallCount = 0;
  parentView.adjust({ width: 80, height: 80 });
  view.viewDidResize.expect(1);
  equal(view.frameCallCount, 1, 'should notify frame changed when isFixedPosition: %@ and isFixedSize: %@'.fmt(view.get('isFixedPosition'), view.get('isFixedSize')));

  // try with flexible width
  view.set('layout', { top: 10, left: 10, height: 10, right: 10 });
  view.viewDidResize.reset(); view.frameCallCount = 0;
  parentView.adjust({ width: 70, height: 70 });
  view.viewDidResize.expect(1);
  equal(view.frameCallCount, 1, 'should notify frame changed when isFixedPosition: %@ and isFixedSize: %@'.fmt(view.get('isFixedPosition'), view.get('isFixedSize')));

  // try with right align
  view.set('layout', { top: 10, right: 10, height: 10, width: 10 });
  view.viewDidResize.reset(); view.frameCallCount = 0;
  parentView.adjust({ width: 60, height: 60 });
  view.viewDidResize.expect(0);
  equal(view.frameCallCount, 1, 'right align: should notify frame changed when isFixedPosition: %@ and isFixedSize: %@'.fmt(view.get('isFixedPosition'), view.get('isFixedSize')));

  // try with bottom align
  view.set('layout', { left: 10, bottom: 10, height: 10, width: 10 });
  view.viewDidResize.reset(); view.frameCallCount = 0;
  parentView.adjust({ width: 50, height: 50 });
  view.viewDidResize.expect(0);
  equal(view.frameCallCount, 1, 'bottom align: should notify frame changed when isFixedPosition: %@ and isFixedSize: %@'.fmt(view.get('isFixedPosition'), view.get('isFixedSize')));

  // try with center horizontal align
  view.set('layout', { centerX: 10, top: 10, height: 10, width: 10 });
  view.viewDidResize.reset(); view.frameCallCount = 0;
  parentView.adjust({ width: 40, height: 40 });
  view.viewDidResize.expect(0);
  equal(view.frameCallCount, 1, 'centerX: should notify frame changed when isFixedPosition: %@ and isFixedSize: %@'.fmt(view.get('isFixedPosition'), view.get('isFixedSize')));

  // try with center vertical align
  view.set('layout', { left: 10, centerY: 10, height: 10, width: 10 });
  view.viewDidResize.reset(); view.frameCallCount = 0;
  parentView.adjust({ width: 30, height: 30 });
  view.viewDidResize.expect(0);
  equal(view.frameCallCount, 1, 'centerY: should notify frame changed when isFixedPosition: %@ and isFixedSize: %@'.fmt(view.get('isFixedPosition'), view.get('isFixedSize')));
});

// ..........................................................
// beginLiveResize()
//
module("SC.View#beginLiveResize");

test("invokes willBeginLiveResize on receiver and any child views that implement it", function() {
  var callCount = 0;
  var ChildView = SC.View.extend({
    willBeginLiveResize: function() { callCount++ ;}
  });

  var view = ChildView.create({ // <-- has callback
    childViews: [SC.View.extend({ // <-- this does not implement callback
      childViews: [ChildView] // <-- has callback
    })]
  });

  callCount = 0 ;
  view.beginLiveResize();
  equal(callCount, 2, 'should invoke willBeginLiveResize when implemented');
});

test("returns receiver", function() {
  var view = SC.View.create();
  equal(view.beginLiveResize(), view, 'returns receiver');
});

// ..........................................................
// endLiveResize()
//
module("SC.View#endLiveResize");

test("invokes didEndLiveResize on receiver and any child views that implement it", function() {
  var callCount = 0;
  var ChildView = SC.View.extend({
    didEndLiveResize: function() { callCount++; }
  });

  var view = ChildView.create({ // <-- has callback
    childViews: [SC.View.extend({ // <-- this does not implement callback
      childViews: [ChildView] // <-- has callback
    })]
  });

  callCount = 0 ;
  view.endLiveResize();
  equal(callCount, 2, 'should invoke didEndLiveResize when implemented');
});

test("returns receiver", function() {
  var view = SC.View.create();
  equal(view.endLiveResize(), view, 'returns receiver');
});

});minispade.register('sproutcore-views/~tests/view/view_states_test', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module, test, equals,ok */

var parentView;

/** Test the SC.View states. */
module("SC.View States", {

  setup: function () {
    parentView = SC.View.create();
  },

  teardown: function () {
    parentView.destroy();
    parentView = null;
  }

});

/**
  Test the state, in particular supported actions.
  */
test("Test unrendered state.", function () {
  var handled,
    view = SC.View.create();

  // Test expected state of the view.
  equal(view.viewState, SC.CoreView.UNRENDERED, "A newly created view should be in the state");
  ok(!view.get('isAttached'), "isAttached should be false");
  ok(!view.get('_isRendered'), "_isRendered should be false");
  ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");

  // _doAttach(document.body)
  // _doDestroyLayer()
  // _doDetach()
  // _doHide()
  // _doRender()
  // _doShow()
  // _doUpdateContent()
  // _doUpdateLayout()

  // UNHANDLED ACTIONS
  handled = view._doShow();
  ok(!handled, "Calling _doShow() should not be handled");
  equal(view.viewState, SC.CoreView.UNRENDERED, "Calling _doShow() doesn't change state");

  handled = view._doAttach(document.body);
  ok(!handled, "Calling _doAttach(document.body) should not be handled");
  equal(view.viewState, SC.CoreView.UNRENDERED, "Calling _doAttach(document.body) doesn't change state");

  handled = view._doDestroyLayer();
  ok(!handled, "Calling _doDestroyLayer() should not be handled");
  equal(view.viewState, SC.CoreView.UNRENDERED, "Calling _doDestroyLayer() doesn't change state");

  handled = view._doDetach();
  ok(!handled, "Calling _doDetach() should not be handled");
  equal(view.viewState, SC.CoreView.UNRENDERED, "Calling _doDetach() doesn't change state");

  SC.run(function () {
    handled = view._doHide();
  });
  ok(!handled, "Calling _doHide() should not be handled");
  equal(view.viewState, SC.CoreView.UNRENDERED, "Calling _doHide() doesn't change state");

  handled = view._doUpdateContent();
  ok(!handled, "Calling _doUpdateContent() should not be handled");
  equal(view.viewState, SC.CoreView.UNRENDERED, "Calling _doUpdateContent() doesn't change state");

  handled = view._doUpdateLayout();
  ok(!handled, "Calling _doUpdateLayout() should not be handled");
  equal(view.viewState, SC.CoreView.UNRENDERED, "Calling _doUpdateLayout() doesn't change state");


  // HANDLED ACTIONS

  handled = view._doRender();
  ok(handled, "Calling _doRender() should be handled");
  equal(view.viewState, SC.CoreView.UNATTACHED, "Calling _doRender() changes state");


  // CLEAN UP
  view.destroy();
});

/**
  Test the state, in particular supported actions.
  */
test("Test unattached state.", function () {
  var handled,
    view = SC.View.create();

  // Test expected state of the view.
  view._doRender();
  equal(view.viewState, SC.CoreView.UNATTACHED, "A newly created view that is rendered should be in the state");
  ok(!view.get('isAttached'), "isAttached should be false");
  ok(view.get('_isRendered'), "_isRendered should be true");
  ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");

  // _doAttach(document.body)
  // _doDestroyLayer()
  // _doDetach()
  // _doHide()
  // _doRender()
  // _doShow()
  // _doUpdateContent()
  // _doUpdateLayout()

  // UNHANDLED ACTIONS
  handled = view._doDetach();
  ok(!handled, "Calling _doDetach() should not be handled");
  equal(view.viewState, SC.CoreView.UNATTACHED, "Calling _doDetach() doesn't change state");

  handled = view._doRender();
  ok(!handled, "Calling _doRender() should not be handled");
  equal(view.viewState, SC.CoreView.UNATTACHED, "Calling _doRender() doesn't change state");


  // HANDLED ACTIONS

  SC.run(function () {
    handled = view._doHide();
  });
  ok(handled, "Calling _doHide() should be handled");
  equal(view.viewState, SC.CoreView.UNATTACHED, "Calling _doHide() doesn't change state");

  handled = view._doShow();
  ok(handled, "Calling _doShow() should be handled");
  equal(view.viewState, SC.CoreView.UNATTACHED, "Calling _doShow() doesn't change state");

  handled = view._doAttach(document.body);
  ok(handled, "Calling _doAttach(document.body) should be handled");
  equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "Calling _doAttach(document.body) changes state");

  // Reset
  view.destroy();
  view = SC.View.create();
  view._doRender();

  handled = view._doDestroyLayer();
  ok(handled, "Calling _doDestroyLayer() should be handled");
  equal(view.viewState, SC.CoreView.UNRENDERED, "Calling _doDestroyLayer() changes state");

  // Reset
  view.destroy();
  view = SC.View.create();
  view._doRender();

  handled = view._doUpdateContent();
  ok(handled, "Calling _doUpdateContent() should be handled");
  equal(view.viewState, SC.CoreView.UNATTACHED, "Calling _doUpdateContent() doesn't change state");

  handled = view._doUpdateLayout();
  ok(handled, "Calling _doUpdateLayout() should be handled");
  equal(view.viewState, SC.CoreView.UNATTACHED, "Calling _doUpdateLayout() doesn't change state");

  // Reset
  view.destroy();
  view = SC.View.create();
  view._doRender();

  handled = view._doAttach(document.body);
  ok(handled, "Calling _doAttach(document.body) with unrendered orphan parentView should be handled");
  equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "Calling _doAttach(document.body) changes state");


  // CLEAN UP
  view.destroy();
});


/**
  Test the state, in particular supported actions.
  */
test("Test attached_shown state.", function () {
  var handled,
    view = SC.View.create();

  // Test expected state of the view.
  view._doRender();
  view._doAttach(document.body);
  equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "A newly created orphan view that is rendered and attached should be in the state");
  ok(view.get('isAttached'), "isAttached should be true");
  ok(view.get('_isRendered'), "_isRendered should be true");
  ok(view.get('isVisibleInWindow'), "isVisibleInWindow should be true");

  // _doAttach(document.body)
  // _doDestroyLayer()
  // _doDetach()
  // _doHide()
  // _doRender()
  // _doShow()
  // _doUpdateContent()
  // _doUpdateLayout()


  // UNHANDLED ACTIONS
  handled = view._doAttach(document.body);
  ok(!handled, "Calling _doAttach(document.body) should not be handled");
  equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "Calling _doAttach(document.body) doesn't change state");

  handled = view._doDestroyLayer();
  ok(!handled, "Calling _doDestroyLayer() should not be handled");
  equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "Calling _doDestroyLayer() doesn't change state");

  handled = view._doRender();
  ok(!handled, "Calling _doRender() should not be handled");
  equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "Calling _doRender() doesn't change state");

  handled = view._doShow();
  ok(!handled, "Calling _doShow() should not be handled");
  equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "Calling _doShow() doesn't change state");


  // HANDLED ACTIONS

  handled = view._doUpdateContent();
  ok(handled, "Calling _doUpdateContent() should be handled");
  equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "Calling _doUpdateContent() doesn't change state");

  handled = view._doUpdateLayout();
  ok(handled, "Calling _doUpdateLayout() should be handled");
  equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "Calling _doUpdateLayout() doesn't change state");

  handled = view._doDetach();
  ok(handled, "Calling _doDetach() should be handled");
  equal(view.viewState, SC.CoreView.UNATTACHED, "Calling _doDetach() changes state");

  // Reset
  view.destroy();
  view = SC.View.create();
  view._doRender();
  view._doAttach(document.body);

  SC.run(function () {
    handled = view._doHide();
  });
  ok(handled, "Calling _doHide() should be handled");
  equal(view.viewState, SC.CoreView.ATTACHED_HIDDEN, "Calling _doHide() changes state");


  // CLEAN UP
  view.destroy();
});


test("Calling destroy layer, clears the layer from all child views.",  function () {
  var child = SC.View.create(),
    view = SC.View.create({ childViews: [child] });

  view._doAdopt(parentView);
  parentView._doRender();

  ok(parentView.get('layer'), "The parentView should have a reference to the layer.");
  ok(view.get('layer'), "The view should have a reference to the layer.");
  ok(child.get('layer'), "The child should have a reference to the layer.");

  parentView._doDestroyLayer();
  equal(parentView.get('layer'), null, "The parentView should not have a reference to the layer.");
  equal(view.get('layer'), null, "The view should not have a reference to the layer.");
  equal(child.get('layer'), null, "The child should not have a reference to the layer.");

  // CLEAN UP
  view.destroy();
});

/** Test the SC.View state propagation to child views. */
module("SC.View Adoption", {

  setup: function () {
    parentView = SC.Pane.create();
  },

  teardown: function () {
    parentView.destroy();
    parentView = null;
  }

});


test("Test adding a child brings that child to the same state as the parentView.", function () {
  var child = SC.View.create(),
    view = SC.View.create({ childViews: [child] });

  // Test expected state of the view.
  view._doAdopt(parentView);
  equal(parentView.viewState, SC.CoreView.UNRENDERED, "A newly created parentView should be in the state");
  equal(view.viewState, SC.CoreView.UNRENDERED, "A newly created child view of unrendered parentView should be in the state");
  equal(child.viewState, SC.CoreView.UNRENDERED, "A newly created child view of unrendered parentView's child view should be in the state");
  ok(!view.get('_isRendered'), "_isRendered should be false");
  ok(!view.get('isAttached'), "isAttached should be false");
  ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");

  // Render the view.
  view._doRender();
  equal(view.viewState, SC.CoreView.UNATTACHED, "A rendered child view of unrendered parentView should be in the state");
  equal(child.viewState, SC.CoreView.UNATTACHED_BY_PARENT, "A rendered child view of unrendered parentView's child view should be in the state");
  ok(view.get('_isRendered'), "_isRendered should be true");
  ok(!view.get('isAttached'), "isAttached should be false");
  ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");

  // Attach the view.
  view._doAttach(document.body);
  equal(view.viewState, SC.CoreView.UNATTACHED_BY_PARENT, "An attached child view of unrendered parentView should be in the state");
  equal(child.viewState, SC.CoreView.UNATTACHED_BY_PARENT, "An attached child view of unrendered parentView's child view should be in the state");
  ok(view.get('_isRendered'), "_isRendered should be true");
  ok(!view.get('isAttached'), "isAttached should be false");
  ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");

  // Reset
  view.destroy();
  child = SC.View.create();
  view = SC.View.create({ childViews: [child] });

  parentView._doRender();
  view._doAdopt(parentView);
  equal(parentView.viewState, SC.CoreView.UNATTACHED, "A newly created parentView that is rendered should be in the state");
  equal(view.viewState, SC.CoreView.UNATTACHED_BY_PARENT, "A newly created child view of unattached parentView should be in the state");
  equal(child.viewState, SC.CoreView.UNATTACHED_BY_PARENT, "A newly created child view of unattached parentView's child view should be in the state");
  ok(view.get('_isRendered'), "_isRendered should be true");
  ok(!view.get('isAttached'), "isAttached should be false");
  ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");

  // Attach the view.
  view._doAttach(document.body);
  equal(view.viewState, SC.CoreView.UNATTACHED_BY_PARENT, "An attached child view of unattached parentView should be in the state");
  equal(child.viewState, SC.CoreView.UNATTACHED_BY_PARENT, "An attached child view of unattached parentView's child view should be in the state");
  ok(view.get('_isRendered'), "_isRendered should be true");
  ok(!view.get('isAttached'), "isAttached should be false");
  ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");

  // Reset
  view.destroy();
  child = SC.View.create();
  view = SC.View.create({ childViews: [child] });

  parentView._doAttach(document.body);
  view._doAdopt(parentView);
  equal(parentView.viewState, SC.CoreView.ATTACHED_SHOWN, "A newly created parentView that is attached should be in the state");
  equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "A newly created child view of attached parentView should be in the state");
  equal(child.viewState, SC.CoreView.ATTACHED_SHOWN, "A child of newly created view of attached parentView should be in the state");
  ok(view.get('_isRendered'), "_isRendered should be true");
  ok(view.get('isAttached'), "isAttached should be true");
  ok(view.get('isVisibleInWindow'), "isVisibleInWindow should be true");


  // CLEAN UP
  view.destroy();
});


test("Test showing and hiding parentView updates child views.", function () {
  var handled,
    child = SC.View.create(),
    view = SC.View.create({ childViews: [child] });

  // Test expected state of the view.
  parentView._doRender();
  parentView._doAttach(document.body);
  view._doAdopt(parentView);
  equal(parentView.viewState, SC.CoreView.ATTACHED_SHOWN, "A newly created parentView that is attached should be in the state");
  equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "A newly created child view of unattached parentView should be in the state");
  equal(child.viewState, SC.CoreView.ATTACHED_SHOWN, "A newly created child view of unattached parentView's child view should be in the state");
  ok(view.get('isVisibleInWindow'), "isVisibleInWindow should be true");

  // Hide the parentView.
  SC.run(function () {
    parentView._doHide();
  });
  equal(parentView.viewState, SC.CoreView.ATTACHED_HIDDEN, "A hidden parentView that is attached should be in the state");
  equal(view.viewState, SC.CoreView.ATTACHED_HIDDEN_BY_PARENT, "A child view of attached_hidden parentView should be in the state");
  equal(child.viewState, SC.CoreView.ATTACHED_HIDDEN_BY_PARENT, "A child view of attached_hidden parentView's child view should be in the state");
  ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");

  // Show the parentView/hide the view.
  handled = parentView._doShow();
  ok(handled, "Calling _doShow() on parentView should be handled");
  equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "Calling _doShow() on parentView changes state on view.");
  equal(child.viewState, SC.CoreView.ATTACHED_SHOWN, "Calling _doShow() on parentView changes state on child");

  SC.run(function () {
    handled = view._doHide();
  });
  ok(handled, "Calling _doHide() should be handled");
  equal(view.viewState, SC.CoreView.ATTACHED_HIDDEN, "Calling _doHide() on view changes state on view");
  equal(child.viewState, SC.CoreView.ATTACHED_HIDDEN_BY_PARENT, "Calling _doHide() on view changes state on child");

  // Reset
  SC.run(function () {
    parentView._doHide();
  });
  view.destroy();
  child = SC.View.create();
  view = SC.View.create({ childViews: [child] });
  view._doAdopt(parentView);

  // Add child to already hidden parentView.
  equal(view.viewState, SC.CoreView.ATTACHED_HIDDEN_BY_PARENT, "A child view of attached_hidden parentView should be in the state");
  equal(child.viewState, SC.CoreView.ATTACHED_HIDDEN_BY_PARENT, "A child view of attached_hidden parentView's child view should be in the state");
  ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");

  // Reset
  parentView.destroy();
  parentView = SC.View.create();
  parentView._doRender();
  child = SC.View.create();
  view = SC.View.create({ childViews: [child] });
  view._doAdopt(parentView);

  // Attach a parentView with children
  equal(view.viewState, SC.CoreView.UNATTACHED_BY_PARENT, "A child view of unattached parentView should be in the state");
  equal(child.viewState, SC.CoreView.UNATTACHED_BY_PARENT, "A child view of unattached parentView's child view should be in the state");
  parentView._doAttach(document.body);
  equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "A child view of attached_shown parentView should be in the state");
  equal(child.viewState, SC.CoreView.ATTACHED_SHOWN, "A child view of attached_shown parentView's child view should be in the state");

  // CLEAN UP
  view.destroy();
});

test("Test hiding with transitionHide", function () {
  var child = SC.View.create(),
    transitionHide = { run: function () {} },
    view = SC.View.create({ childViews: [child] });

  // Set up.
  parentView._doRender();
  parentView._doAttach(document.body);
  view._doAdopt(parentView);

  // Hide the parentView with transitionHide
  parentView.set('transitionHide', transitionHide);
  SC.run(function () {
    parentView._doHide();
  });
  ok(parentView.get('isVisibleInWindow'), "isVisibleInWindow of parentView should be false");
  ok(view.get('isVisibleInWindow'), "isVisibleInWindow should be true");
  ok(child.get('isVisibleInWindow'), "isVisibleInWindow of child should be true");

  SC.run(function () {
    parentView.didTransitionOut();
  });
  ok(!parentView.get('isVisibleInWindow'), "isVisibleInWindow of parentView should be false after didTransitionOut");
  ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false after didTransitionOut");
  ok(!child.get('isVisibleInWindow'), "isVisibleInWindow of child should be false after didTransitionOut");

  // CLEAN UP
  view.destroy();
});

test("Adjusting unrelated layout property (not specified in transition's layoutProperties) during transition.", function() {
  var transition = {
    layoutProperties: ['opacity'],
    run: function (view) {
      view.adjust('opacity', 0);
      SC.run.scheduleOnce('afterRender', view, view.didTransitionIn);
    }
  }
  var view = SC.View.create({
    transitionIn: transition,
    layout: { height: 40 },
    didTransitionIn: function() {
      this._super();
      equal(this.get('layout.height'), 30, "height adjusted during an opacity transition is retained after the transition is complete");
      start();
    }
  });

  SC.run(function() {
    view._doRender();
    view._doAttach(document.body);
    equal(view.get('layout.height'), 40, 'PRELIM: View height starts at 40');
    equal(view.get('viewState'), SC.View.ATTACHED_BUILDING_IN, "PRELIM: View is building in");
    view.adjust('height', 30);
    stop(250);
  });

});

/** isVisible */
var child, view;
module("SC.View isVisible integration with shown and hidden state", {

  setup: function () {
    SC.run(function () {
      parentView = SC.View.create();
      parentView._doRender();
      parentView._doAttach(document.body);

      child = SC.View.create(),
      view = SC.View.create({
        // STUB: _executeDoUpdateContent
        _executeDoUpdateContent: CoreTest.stub('_executeDoUpdateContent', SC.CoreView.prototype._executeDoUpdateContent),
        // STUB: _doUpdateVisibleStyle
        _doUpdateVisibleStyle: CoreTest.stub('_doUpdateVisibleStyle', SC.CoreView.prototype._doUpdateVisibleStyle),

        childViews: [child],
        displayProperties: ['foo'],
        foo: false
      });
    });
  },

  teardown: function () {
    view.destroy();
    parentView.destroy();
    parentView = null;
  }

});

test("Test showing and hiding a hidden view in same run loop should not update visibility or content.", function () {
  view._doAdopt(parentView);

  SC.run(function () {
    view.set('isVisible', false);
  });

  view._executeDoUpdateContent.expect(0);
  view._doUpdateVisibleStyle.expect(1);

  // Hide the view using isVisible.
  SC.run(function () {
    view.set('foo', true);
    equal(view.viewState, SC.CoreView.ATTACHED_HIDDEN, "The view should be in the state");
    equal(child.viewState, SC.CoreView.ATTACHED_HIDDEN_BY_PARENT, "The child view should be in the state");

    ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");
    ok(!child.get('isVisibleInWindow'), "isVisibleInWindow of child should be false");

    view.set('isVisible', true);
    equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "The view should now be in the state");
    equal(child.viewState, SC.CoreView.ATTACHED_SHOWN, "The child view should now be in the state");

    ok(view.get('isVisibleInWindow'), "isVisibleInWindow should be true");
    ok(child.get('isVisibleInWindow'), "isVisibleInWindow of child should be true");

    view.set('isVisible', false);
  });

  view._executeDoUpdateContent.expect(0);
  view._doUpdateVisibleStyle.expect(3);
});

test("Test hiding and showing a shown view in same run loop should not update visibility.", function () {
  view._doAdopt(parentView);

  // Hide the view using isVisible.
  SC.run(function () {
    view.set('foo', true);
    view.set('isVisible', false);
    equal(view.viewState, SC.CoreView.ATTACHED_HIDDEN, "The view should be in the state");
    equal(child.viewState, SC.CoreView.ATTACHED_HIDDEN_BY_PARENT, "The child view should be in the state");

    ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");
    ok(!child.get('isVisibleInWindow'), "isVisibleInWindow of child should be false");

    view.set('isVisible', true);
    equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "The view should be in the state");
    equal(child.viewState, SC.CoreView.ATTACHED_SHOWN, "The child view should be in the state");

    ok(view.get('isVisibleInWindow'), "isVisibleInWindow should be true");
    ok(child.get('isVisibleInWindow'), "isVisibleInWindow of child should be true");
  });

  view._executeDoUpdateContent.expect(1);
  view._doUpdateVisibleStyle.expect(2);
});


test("Test showing and hiding a hiding view in same run loop should not update visibility or content.", function () {
  var transitionHide = { run: function () {} };

  view._doAdopt(parentView);

  view.set('transitionHide', transitionHide);

  SC.run(function () {
    view.set('foo', true);
    view.set('isVisible', false);
  });

  // Hide the view using isVisible.
  SC.run(function () {
    equal(view.viewState, SC.CoreView.ATTACHED_HIDING, "The view should be in the state");
    equal(child.viewState, SC.CoreView.ATTACHED_SHOWN, "The child view should be in the state");

    ok(view.get('isVisibleInWindow'), "isVisibleInWindow should be true");
    ok(child.get('isVisibleInWindow'), "isVisibleInWindow of child should be true");

    view.set('isVisible', true);
    equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "The view should be in the state");
    equal(child.viewState, SC.CoreView.ATTACHED_SHOWN, "The child view should be in the state");

    ok(view.get('isVisibleInWindow'), "isVisibleInWindow should be true");
    ok(child.get('isVisibleInWindow'), "isVisibleInWindow of child should be true");

    view.set('isVisible', false);
  });

  view._executeDoUpdateContent.expect(1);
  view._doUpdateVisibleStyle.expect(0);
});

test("Test hiding and showing a showing view in same run loop should not update visibility.", function () {
  var transitionShow = { run: function () {} };

  view._doAdopt(parentView);

  view.set('transitionShow', transitionShow);

  SC.run(function () {
    view.set('foo', true);
    view.set('isVisible', false);
  });

  SC.run(function () {
    view.set('isVisible', true);
  });

  // Hide the view using isVisible.
  SC.run(function () {
    equal(view.viewState, SC.CoreView.ATTACHED_SHOWING, "The view should be in the state");
    equal(child.viewState, SC.CoreView.ATTACHED_HIDDEN_BY_PARENT, "The child view should be in the state");

    ok(view.get('isVisibleInWindow'), "isVisibleInWindow should be true");
    ok(!child.get('isVisibleInWindow'), "isVisibleInWindow of child should be false");

    view.set('isVisible', false);
    equal(view.viewState, SC.CoreView.ATTACHED_HIDDEN, "The view should be in the state");
    equal(child.viewState, SC.CoreView.ATTACHED_HIDDEN_BY_PARENT, "The child view should be in the state");

    ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");
    ok(!child.get('isVisibleInWindow'), "isVisibleInWindow of child should be false");

    view.set('isVisible', true);
  });

  view._executeDoUpdateContent.expect(1);
  view._doUpdateVisibleStyle.expect(4);
});


test("Test hiding and showing an attached child view with child views.", function () {
  view._doAdopt(parentView);

  // Hide the view using isVisible.
  SC.run(function () {
    view.set('isVisible', false);
  });

  equal(parentView.viewState, SC.CoreView.ATTACHED_SHOWN, "The parentView view should be in the state");
  equal(view.viewState, SC.CoreView.ATTACHED_HIDDEN, "The view should be in the state");
  equal(child.viewState, SC.CoreView.ATTACHED_HIDDEN_BY_PARENT, "The child view should be in the state");
  ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");
  ok(!child.get('isVisibleInWindow'), "isVisibleInWindow of child should be false");

  // Show the view using isVisible.
  SC.run(function () {
    view.set('isVisible', true);
  });

  equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "The view should be in the state");
  equal(child.viewState, SC.CoreView.ATTACHED_SHOWN, "The child view should be in the state");
  ok(view.get('isVisibleInWindow'), "isVisibleInWindow should now be true");
  ok(child.get('isVisibleInWindow'), "isVisibleInWindow of child should now be true");
});


test("Test hiding an attached parentView view and then adding child views.", function () {
  // Hide the parentView using isVisible and then adopting child views.
  SC.run(function () {
    parentView.set('isVisible', false);
    view._doAdopt(parentView);
  });

  equal(parentView.viewState, SC.CoreView.ATTACHED_HIDDEN, "The parentView view should be in the state");
  equal(view.viewState, SC.CoreView.ATTACHED_HIDDEN_BY_PARENT, "The view should be in the state");
  equal(child.viewState, SC.CoreView.ATTACHED_HIDDEN_BY_PARENT, "The child view should be in the state");
  ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");
  ok(!child.get('isVisibleInWindow'), "isVisibleInWindow of child should be false");

  // Show the parentView using isVisible.
  SC.run(function () {
    parentView.set('isVisible', true);
  });

  equal(parentView.viewState, SC.CoreView.ATTACHED_SHOWN, "The parentView view should be in the state");
  equal(view.viewState, SC.CoreView.ATTACHED_SHOWN, "The view should be in the state");
  equal(child.viewState, SC.CoreView.ATTACHED_SHOWN, "The child view should be in the state");
  ok(view.get('isVisibleInWindow'), "isVisibleInWindow should be false");
  ok(child.get('isVisibleInWindow'), "isVisibleInWindow of child should be false");
});


test("Test showing an attached parentView view while hiding the child view.", function () {
  SC.run(function () {
    parentView.set('isVisible', false);
    view._doAdopt(parentView);

    // Hide the view and then show the parentView using isVisible.
    view.set('isVisible', false);
    parentView.set('isVisible', true);
  });

  equal(parentView.viewState, SC.CoreView.ATTACHED_SHOWN, "The parentView view should be in the state");
  equal(view.viewState, SC.CoreView.ATTACHED_HIDDEN, "The view should be in the state");
  equal(child.viewState, SC.CoreView.ATTACHED_HIDDEN_BY_PARENT, "The child view should be in the state");
  ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");
  ok(!child.get('isVisibleInWindow'), "isVisibleInWindow of child should be false");
});


test("Test adding a hidden child view to attached shown parentView.", function () {
  // Hide the view with isVisible and then add to parentView.
  SC.run(function () {
    view.set('isVisible', false);
    view._doAdopt(parentView);
  });

  equal(view.viewState, SC.CoreView.ATTACHED_HIDDEN, "The view should be in the state");
  equal(child.viewState, SC.CoreView.ATTACHED_HIDDEN_BY_PARENT, "The child view should be in the state");
  ok(!view.get('isVisibleInWindow'), "isVisibleInWindow should be false");
  ok(!child.get('isVisibleInWindow'), "isVisibleInWindow of child should be false");
});

});minispade.register('sproutcore-foundation/~tests/ext/object_test', function() {// // ==========================================================================
// // Project:   SproutCore - JavaScript Application Framework
// // Copyright: ©2006-2011 Strobe Inc. and contributors.
// //            Portions ©2008-2011 Apple Inc. All rights reserved.
// // License:   Licensed under MIT license (see license.js)
// // ==========================================================================
// /*globals module, test, start, stop, expect, ok, equals*/
//
//
// module("Object:invokeOnce()");
//
// test("should invoke function using invokeLater after specified time and pass in extra arguments", function() {
//   stop(2000);
//
//   SC.RunLoop.begin();
//   var o = SC.Object.create({
//     stopped: YES,
//
//     method: function(a, b, c) {
//       equal(a, 'a', "Argument 'a' passed");
//       equal(b, 'b', "Argument 'b' passed");
//       equal(c, 'c', "Argument 'c' passed");
//
//       start();
//     }
//   });
//   o.invokeLater('method', 200, 'a', 'b', 'c');
//   SC.RunLoop.end();
// });
//
// test("should invoke function once multiple times using invokeLater after specified time", function() {
//   stop(2000);
//   expect(3);
//
//   SC.RunLoop.begin();
//   var o = SC.Object.create({
//     stopped: YES,
//
//     method: function() {
//       ok(true, 'method called');
//
//       if (this.stopped) {
//         this.stopped = NO;
//         // Continue on in a short moment.  Before the test times out, but after
//         // enough time for a second call to method to possibly come in.
//         setTimeout(function() {
//           start();
//         }, 100);
//       }
//     }
//   });
//   o.invokeLater('method', 200);
//   o.invokeLater('method', 200);
//   o.invokeLater('method', 200);
//   SC.RunLoop.end();
// });
//
//
//
// module("Object:invokeOnceLater()");
//
// test("should invoke function using invokeOnceLater after specified time and pass in extra arguments", function() {
//   stop(2000);
//
//   SC.RunLoop.begin();
//   var o = SC.Object.create({
//     stopped: YES,
//
//     method: function(a, b, c) {
//       equal(a, 'a', "Argument 'a' passed");
//       equal(b, 'b', "Argument 'b' passed");
//       equal(c, 'c', "Argument 'c' passed");
//
//       start();
//     }
//   });
//   o.invokeOnceLater('method', 200, 'a', 'b', 'c');
//   SC.RunLoop.end();
// });
//
// test("should invoke function once using invokeOnceLater after specified time", function() {
//   stop(2000);
//   expect(1);
//
//   SC.RunLoop.begin();
//   var o = SC.Object.create({
//     stopped: YES,
//
//     method: function() {
//       ok(true, 'method called');
//
//       if (this.stopped) {
//         this.stopped = NO;
//         // Continue on in a short moment.  Before the test times out, but after
//         // enough time for a second call to method to possibly come in.
//         setTimeout(function() {
//           start();
//         }, 100);
//       }
//     }
//   });
//   o.invokeOnceLater('method', 200);
//   o.invokeOnceLater('method', 200);
//   o.invokeOnceLater('method', 200);
//   SC.RunLoop.end();
// });

});minispade.register('sproutcore-foundation/~tests/mixins/responder_context', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module test equals context ok same */
var S, A, a, B, Manager;
module("ResponderContext", {
  setup: function() {
    Manager = SC.Responder.createWithMixins(SC.ResponderContext);
    var TestResponder = SC.Responder.extend({
      didBecomeFirstResponder: function() {
        this.didBecome = YES;
        this.hasFirst = YES;
      },
      willLoseFirstResponder: function() {
        this.didLose = YES;
        this.hasFirst = NO;
      }
    });

    A = TestResponder.create();
    a = TestResponder.create({nextResponder: A});
    B = TestResponder.create();
  }
});

test("Can enter and exit states.", function() {
  Manager.makeFirstResponder(A);
  ok(A.didBecome, "A did become first responder.");
  ok(A.hasFirst, "A has first responder.");

  Manager.makeFirstResponder(B);
  ok(A.didLose, "A did lose first responder.");
  ok(!A.hasFirst, "A does not have first responder.");
});

test("Can enter and exit chained states.", function() {
  Manager.makeFirstResponder(A);
  ok(A.didBecome, "A did become first responder.");
  ok(A.hasFirst, "A has first responder.");

  Manager.makeFirstResponder(a);
  ok(!A.didLose, "A did not lose first responder.");
  ok(A.hasFirst, "A has first responder.");
  ok(A.didBecome, "a did become first responder.");
  ok(A.hasFirst, "a has first responder.");

  Manager.makeFirstResponder(B);
  ok(a.didLose, "a did lose first responder.");
  ok(!a.hasFirst, "a does not have first responder.");
  ok(A.didLose, "A did lose first responder.");
  ok(!A.hasFirst, "A does not have first responder.");
});

test("Setting responder to the current responder does not reenter.", function() {
  Manager.makeFirstResponder(A);
  ok(A.didBecome, "A did become first responder.");
  ok(A.hasFirst, "A has first responder.");

  A.didBecome = NO;
  Manager.makeFirstResponder(A);
  ok(!A.didBecome, "A did become first responder.");
});

test("Calling 'resetFirstResponder' reenters the first responder.", function() {
  Manager.makeFirstResponder(A);
  ok(A.didBecome, "A did become first responder.");
  ok(A.hasFirst, "A has first responder.");

  A.didBecome = NO;
  Manager.resetFirstResponder();
  ok(A.didLose, "A did leave.");
  ok(A.didBecome, "A did reenter.");
});

});minispade.register('sproutcore-foundation/~tests/mixins/string', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module test equals context ok same should_throw*/
var LocaleObject;

module('String', {
  setup: function() {

    LocaleObject = SC.Locale.createWithMixins({
      init: function(){
        this._super();
        //hash of new languages
        var newLocales = { deflang: 'dl', empty: '' };

        //Added the new languages to the existing list of locales
        SC.Locale.addStrings(newLocales);
      }
    });
    this.currentLocale = LocaleObject;

    SC.stringsFor('English', {
      'Test': '%@',
      'Test.Multiple': '%@ %@'
    });

    SC.metricsFor('English', {
      'Button.left': 10,
      'Button.top': 20,
      'Button.width': 80,
      'Button.height': 30
    });
  }
});

test("'one two three'.w() => ['one','two','three']", function() {
  deepEqual('one two three'.w(), ['one','two','three'], "should be equal");
});

test("'one    two    three'.w() with extra spaces between words => ['one','two','three']", function() {
  deepEqual('one    two    three'.w(), ['one','two','three'], "should be equal");
});

test("Trim ' spaces on both sides '", function() {
  deepEqual(' spaces on both sides '.trim(), 'spaces on both sides', "should be equal");
});

test("Trim ' spaces on both sides ' on left only", function() {
  deepEqual(' spaces on both sides '.trimLeft(), 'spaces on both sides ', "should be equal");
});

test("Trim ' spaces on both sides ' on right only", function() {
  deepEqual(' spaces on both sides '.trimRight(), ' spaces on both sides', "should be equal");
});

test("Localize a string", function() {
  //Based on the input passed it should return the default locale
  equal("en".loc(), "en", "Using String.prototype.loc") ;
  equal(SC.String.loc("en"), "en", "Using SC.String.loc");

  equal("jp".locWithDefault("Japanese"), "Japanese", "Using String.prototype.locWithDefault") ;
  equal(SC.String.locWithDefault("jp", "Japanese"), "Japanese", "Using SC.String.locWithDefault") ;

  equal('deflang'.loc(), "dl", "Using String.prototype.loc") ;
  equal(SC.String.loc('deflang'), "dl", "Using SC.String.loc") ;
});

test("Localize a string with mutliple parameters", function() {
  equal("Test".loc('parameter1'), 'parameter1', "Localizing with one parameter - using String.prototype.loc");
  equal(SC.String.loc("Test", 'parameter1'), 'parameter1', "Localizing with one parameter - using SC.String.loc");

  equal("Test.Multiple".loc('parameter1', 'parameter2'), 'parameter1 parameter2', "Localizing with multiple parameters - using String.prototype.loc");
  equal(SC.String.loc("Test.Multiple", 'parameter1', 'parameter2'), 'parameter1 parameter2', "Localizing with multiple parameters - using SC.String.loc");
});

test("Localize a string with null or missing parameters", function() {
  equal("Test".loc(null), "(null)", "Localizing with null parameter - using String.prototype.loc");
  equal(SC.String.loc("Test", null), "(null)", "Localizing with null parameter - using SC.String.loc");

  equal("Test".loc(), "", "Localizing with missing parameter - using String.prototype.loc");
  equal(SC.String.loc("Test"), "", "Localizing with missing parameter - using SC.String.loc");

  equal("Test.Multiple".loc("p1", null), "p1 (null)", "Localizing multiple with null parameter - using String.prototype.loc");
  equal(SC.String.loc("Test.Multiple", "p1", null), "p1 (null)", "Localizing with null parameter - using SC.String.loc");

  equal("Test.Multiple".loc("p1"), "p1 ", "Localizing multiple with missing parameter - using String.prototype.loc");
  equal(SC.String.loc("Test.Multiple", "p1"), "p1 ", "Localizing with missing parameter - using SC.String.loc");
});

test("Localize a string even if localized version is empty", function() {
  equal("empty".loc(), "", "Using String.prototype.loc");
  equal(SC.String.loc("empty"), "", "Using SC.String.loc");

  equal("empty".locWithDefault("Empty"), "", "Using String.prototype.locWithDefault");
  equal(SC.String.locWithDefault("empty", "Empty"), "", "Using SC.String.locWithDefault");
});

test("Access a localized metric", function() {
  equal(10, "Button.left".locMetric());
  equal(20, "Button.top".locMetric());
  equal(undefined, "Button.notThere".locMetric());
});

test("Access a localized layout hash", function() {
  // Simple case (if we ever get a full hash comparison function, we should use
  // it here).
  var layout = "Button".locLayout();
  equal(10, layout.left);
  equal(20, layout.top);
  equal(80, layout.width);
  equal(30, layout.height);
  equal(undefined, layout.right);    // No localized key


  // Slightly more involved case:  allow the user to specify an additional hash.
  layout = "Button".locLayout({right:50});
  equal(10, layout.left);
  equal(20, layout.top);
  equal(80, layout.width);
  equal(30, layout.height);
  equal(50, layout.right);    // No localized key


  // Sanity-check case:  Since we have both a localized key for 'left' and we'll
  // pass it in, an exception should be thrown.
  throws(function() {
    "Button".locLayout({left:10});
  }, Error, "locLayout():  There is a localized value for the key 'Button.left' but a value for 'left' was also specified in the non-localized hash");
});

test("Multiply string", function() {
  equal('a'.mult(0), null);
  equal('a'.mult(1), 'a');
  equal('a'.mult(2), 'aa');
  equal('xyz'.mult(1), 'xyz');
  equal('xyz'.mult(2), 'xyzxyz');
});

test('CSS escaping a string', function () {
  equal('AnHtmlId...WithSome:Problematic::Characters'.escapeCssIdForSelector(), 'AnHtmlId\\.\\.\\.WithSome\\:Problematic\\:\\:Characters', 'should be escaped');
  equal('AnHtmlIdWithNormalCharacters'.escapeCssIdForSelector(), 'AnHtmlIdWithNormalCharacters', 'should be escaped, with no effect');
});

});minispade.register('sproutcore-foundation/~tests/system/browser', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


test("SC.browser.compare()", function() {
  var browser;

  // Use SC.browser.compare() to determine if the given OS is Mac OS 10.7 "Lion"
  // like as was/is in use in SC.TextFieldView.
  equal(SC.browser.compare('10.6.8', '10.7'), -1, "'10.6.8' compared to '10.7' should be -1");
  equal(SC.browser.compare('10.7', '10.7'), 0, "'10.7' compared to '10.7' should be 0");
  equal(SC.browser.compare('10.7.1', '10.7'), 0, "'10.7.1' compared to '10.7' should be 0");
  equal(SC.browser.compare('10.8', '10.7'), 1, "'10.8' compared to '10.7' should be 1");

  equal(SC.browser.compare('10.6.8', 10.7), -1, "'10.6.8' compared to 10.7 should be -1");
  equal(SC.browser.compare('10.7', 10.7), 0, "'10.7' compared to 10.7 should be 0");
  equal(SC.browser.compare('10.7.1', 10.7), 0, "'10.7.1' compared to 10.7 should be 0");
  equal(SC.browser.compare('10.8', 10.7), 1, "'10.8' compared to 10.7 should be 1");

  // Use SC.browser.compare() to determine if the given browser is Firefox 3.5
  // like as was/is in use in SC.RootResponder.
  equal(SC.browser.compare('1.8.10', '1.9.1'), -1, "'1.8.10' compared to '1.9.1' should be -1");
  equal(SC.browser.compare('1.9.0', '1.9.1'), -1, "'1.9.0' compared to '1.9.1' should be -1");
  equal(SC.browser.compare('1.9', '1.9.1'), 0, "'1.9' compared to '1.9.1' should be 0");
  equal(SC.browser.compare('1.9.1', '1.9.1'), 0, "'1.9.1' compared to '1.9.1' should be 0");
  equal(SC.browser.compare('1.10', '1.9.1'), 1, "'1.10' compared to '1.9.1' should be 1");

  equal(SC.browser.compare('1.9.0', 1.9), 0, "'1.9.0' compared to 1.9 should be 0");
  equal(SC.browser.compare('1.9', 1.9), 0, "'1.9' compared to 1.9 should be 0");
  equal(SC.browser.compare('1.9.1', 1.9), 0, "'1.9.1' compared to 1.9 should be 0");
  equal(SC.browser.compare('1.10', 1.9), 1, "'1.10' compared to 1.9 should be 1");

  // Use SC.browser.compare() to determine if the given browser is Safari 5.0.1
  // like as was/is in use in SC.Event.
  equal(SC.browser.compare('532.7', '533.7'), -1, "'532.7' compared to '533.7' should be -1");
  equal(SC.browser.compare('533.6', '533.7'), -1, "'533.6' compared to '533.7' should be -1");
  equal(SC.browser.compare('533.7', '533.7'), 0, "'533.7' compared to '533.7' should be 0");
  equal(SC.browser.compare('533', '533.7'), 0, "'533' compared to '533.7' should be 0");
  equal(SC.browser.compare('533.8', '533.7'), 1, "'533.8' compared to '533.7' should be 1");
  equal(SC.browser.compare('534.7', '533.7'), 1, "'534.7' compared to '533.7' should be 1");

  equal(SC.browser.compare('532.7', 533.7), -1, "'532.7' compared to 533.7 should be -1");
  equal(SC.browser.compare('533.6', 533.7), -1, "'533.6' compared to 533.7 should be -1");
  equal(SC.browser.compare('533.7', 533.7), 0, "'533.7' compared to 533.7 should be 0");
  equal(SC.browser.compare('533', 533.7), 0, "'533' compared to 533.7 should be 0");
  equal(SC.browser.compare('533.8', 533.7), 1, "'533.8' compared to 533.7 should be 1");
  equal(SC.browser.compare('534.7', 533.7), 1, "'534.7' compared to 533.7 should be 1");

  // Use SC.browser.compare() to determine if the given OS is IE7 like as
  // was/is in use in SC.Pane.
  equal(SC.browser.compare('6.0', '7.0'), -1, "'6.0' compared to '7.0' should be -1");
  equal(SC.browser.compare('7.0', '7.0'), 0, "'7.0' compared to '7.0' should be 0");
  equal(SC.browser.compare('7', '7.0'), 0, "'7' compared to '7.0' should be 0");
  equal(SC.browser.compare('7.1', '7.0'), 1, "'7.1' compared to '7.0' should be 1");
  equal(SC.browser.compare('8.0', '7.0'), 1, "'8.0' compared to '7.0' should be 1");

  equal(SC.browser.compare('6.0', 7.0), -1, "'6.0' compared to `7.0 should be -1");
  equal(SC.browser.compare('7.0', 7.0), 0, "'7.0' compared to 7.0 should be 0");
  equal(SC.browser.compare('7', 7.0), 0, "'7' compared to 7.0 should be 0");
  equal(SC.browser.compare('7.1', 7.0), 0, "'7.1' compared to 7.0 should be 0");
  equal(SC.browser.compare('8.0', 7.0), 1, "'8.0' compared to 7.0 should be 1");
});

});minispade.register('sproutcore-foundation/~tests/system/builder', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// ========================================================================
// SC.Builder Base Tests
// ========================================================================
/*globals module test ok isObj equals expects */

var obj; //global variables

// Test cases for pushStack and end functions
module("Builder",{

	  setup: function(){
	  	obj = [1,2,3,4];

	}
});

test("To check if the set of array elements are pushed into stack",function(){

    var c = SC.Builder.fn.pushStack(obj);
    equal(4,obj.length = c.length,'No Of elements in the stack');
    equal(YES,obj[0]==c[0],'First element');
    equal(YES,obj[1]==c[1],'Second element');
    equal(YES,obj[2]==c[2],'Third element');
    equal(YES,obj[3]==c[3],'Fourth element');

    var d = SC.Builder.fn.end();
    equal(YES,SC.typeOf(d) == SC.T_HASH,'Previous item returned');
});

test("create a new builder subclass with any passed properties copied to the builder's 'fn' property",function(){
	obj =SC.Builder.create({ name : 'Charles'});
	var fn_name =obj.fn.name;
	equal(fn_name,"Charles","name should match");
});

test("instantiate the builder, any passed args will be forwarded onto an internal init() method",function(){
	obj = new SC.Builder({name : 'Charles',age :23, sex :'M'});
	var objA =obj.fn.init();
	equal(objA.name,obj.fn.name);
	equal(objA.age,obj.fn.age);
	equal(objA.sex,obj.fn.sex);
});
});minispade.register('sproutcore-foundation/~tests/system/color', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// ...............................................
// SC.Color.from parsing
//

module("SC.Color");

function matches(c, r, g, b, a, msg) {
  var isEqual = c.get('r') === r &&
                c.get('g') === g &&
                c.get('b') === b &&
                c.get('a') === a;
  ok(isEqual, msg + " [rgba(%@, %@, %@, %@) === rgba(%@, %@, %@, %@)]".fmt(r, g, b, a,
                                                                     c.get('r'), c.get('g'), c.get('b'), c.get('a')));
};

test("from(rgb)", function () {
  matches(SC.Color.from("rgb(212, 15, 2)"),
                             212, 15, 2, 1,
                        "rgb() colors should be parseable");
  matches(SC.Color.from("rgb(10000, 20, 256)"),
                             255, 20, 255, 1,
                        "Colors should be clamped to the device gamut");

  matches(SC.Color.from("rgb(10%, 20%, 30%)"),
                             26, 51, 77, 1,
                        "rgb should allow percents as values");

  matches(SC.Color.from("rgb(140%, 200%, 350%)"),
                             255, 255, 255, 1,
                        "rgb percents should be clamped to the device gamut");

  ok(SC.Color.from("rgb(1,2,3)"), "Whitespace shouldn't matter");
  ok(SC.Color.from("rgb(1   ,           2   ,   3  )"), "Whitespace shouldn't matter");
});

test("from(rgba)", function () {
  matches(SC.Color.from("rgba(212, 15, 2, .2)"),
                              212, 15, 2, .2,
                        "rgba() colors should be parseable");
  matches(SC.Color.from("rgba(260, 255, 20, 1.5)"),
                              255, 255, 20, 1,
                        "Alpha should be clamped to 1");

  matches(SC.Color.from("rgba(10%, 20%, 30%, .5)"),
                             26, 51, 77, .5,
                        "rgba should allow percents as values");

  matches(SC.Color.from("rgba(140%, 200%, 350%, .5)"),
                             255, 255, 255, .5,
                        "rgba percents should be clamped to the device gamut");

  ok(!SC.ok(SC.Color.from("rgba(255, 255, 255, -.2)")),
     "Invalid alpha should create an SC.Color in error state");

  ok(SC.Color.from("rgba(1,2,3,1)"), "Whitespace shouldn't matter");
  ok(SC.Color.from("rgba(1   ,           2   ,   3 , 1 )"), "Whitespace shouldn't matter");
});

test("from() with invalid rgb colors", function () {
  ok(!SC.ok(SC.Color.from("rgb(0, 0, 0, 0)")), "Too many arguments");

  ok(!SC.ok(SC.Color.from("rgba(0, 0, 0)")), "Too few arguments");
  ok(!SC.ok(SC.Color.from("rgb(0, 0)")), "Too few arguments");

  ok(!SC.ok(SC.Color.from("rgb(0.0, 0.0, 0.0)")), "Floats are not allowed");

  ok(!SC.ok(SC.Color.from("rgb(0, 0, 0")), "Missing parenthesis");

  ok(!SC.ok(SC.Color.from("rgb(260, -10, 5)")), "Negative numbers");
});

test("from(#rgb)", function () {
  matches(SC.Color.from("#21a"),
          34, 17, 170, 1,
          "#rgb colors should be parseable");

  ok(SC.Color.from("#ABC").isEqualTo(
     SC.Color.from("#abc")),
     "Character casing should not matter with hex colors");
});

test("from(#rrggbb)", function () {
  matches(SC.Color.from("#ABCDEF"),
          171, 205, 239, 1,
          "#rrggbb colors should be parseable");

  ok(SC.Color.from("#ABCDEF").isEqualTo(
     SC.Color.from("#abcdef")),
     "Character casing should not matter with hex colors");
});

test("from(#aarrggbb)", function () {
  matches(SC.Color.from("#00ABCDEF"),
          171, 205, 239, 0,
          "#aarrggbb colors should be parseable");

  ok(SC.Color.from("#BAABCDEF").isEqualTo(
     SC.Color.from("#baabcdef")),
     "Character casing should not matter with hex colors");
});

test("from() with invalid hex colors", function () {
  ok(!SC.ok(SC.Color.from("#GAB")), "Invalid character");

  ok(!SC.ok(SC.Color.from("#0000")), "Invalid length");
  ok(!SC.ok(SC.Color.from("#00000")), "Invalid length");
  ok(!SC.ok(SC.Color.from("#0000000")), "Invalid length");
});

test("SC.Color error state", function() {
  var color = SC.Color.create(); // black
  color.set('r', 255); // red
  matches(color, 255, 0, 0, 1, "PRELIM: Color is as expected");
  color.set('cssText', 'nonsense'); //error (transparent)
  ok(color.get('isError'), "Setting cssText to nonsense puts the color in an error state.");
  equal(color.get('errorValue'), 'nonsense', "Errored color's errorValue property should be");
  equal(color.get('cssText'), 'nonsense', "Errored color's cssText should be");
  equal(color.get('validCssText'), 'transparent', "Errored color's validCssText should be");
  color.set('g', 255); // shouldn't work
  equal(color.get('g'), 0, "Color values become read-only while in error state");
  color.reset(); // back to red
  ok(!color.get('isError'), "Resetting an errored color should remove the error flag.");
  matches(color, 255, 0, 0, 1, "Resetting an errored color should reset its values to last-good values");
})

test("from(hsl)", function () {
  matches(SC.Color.from("hsl(330, 60%, 54%)"),
          208, 67, 138, 1,
          "hsl() colors should be parseable");

  matches(SC.Color.from("hsl(-90, 50%, 44%)"),
          112, 56, 168, 1,
          "negative hues should be allowed");

  matches(SC.Color.from("hsl(-810, 50%, 44%)"),
          112, 56, 168, 1,
          "negative hues should be allowed");

  matches(SC.Color.from("hsl(690, 60%, 54%)"),
          208, 67, 138, 1,
          "hues above 360 degrees should be valid");

  matches(SC.Color.from("hsl(1050, 60%, 54%)"),
          208, 67, 138, 1,
          "hues above 360 degrees should be valid");

  matches(SC.Color.from("hsl(1050, 150%, 190%)"),
          255, 255, 255, 1,
          "luminosity and saturation should be clamped between 0 and 100");

  ok(SC.Color.from("hsl(1,2%,3%)"), "Whitespace shouldn't matter");
  ok(SC.Color.from("hsl(1   ,           2%   ,   3% )"), "Whitespace shouldn't matter");
});

test("from(hsla)", function () {
  matches(SC.Color.from("hsla(210, 87%, 55%, 0.4)"),
          40, 140, 240, .4,
          "hsla() colors should be parseable");

  matches(SC.Color.from("hsla(-150, 87%, 55%, 0.4)"),
          40, 140, 240, .4,
          "negative hues should be allowed");

  matches(SC.Color.from("hsla(-510, 87%, 55%, 0.4)"),
          40, 140, 240, .4,
          "negative hues should be allowed");

  matches(SC.Color.from("hsla(570, 87%, 55%, 0.4)"),
          40, 140, 240, .4,
          "hues above 360 degrees should be valid");

  matches(SC.Color.from("hsla(930, 87%, 55%, 0.4)"),
          40, 140, 240, .4,
          "hues above 360 degrees should be valid");

  matches(SC.Color.from("hsla(930, 0427%, 200%, 0.4)"),
          255, 255, 255, .4,
          "luminosity and saturation should be clamped between 0 and 100");

  ok(SC.Color.from("hsla(1,2%,3%,1)"), "Whitespace shouldn't matter");
  ok(SC.Color.from("hsla(1   ,           2%   ,   3% , 1 )"), "Whitespace shouldn't matter");
});

test("from(transparent)", function () {
  matches(SC.Color.from("transparent"),
          0, 0, 0, 0,
          "transparent should be black with an alpha of 0");
});

test("from(white, black)", function () {
  matches(SC.Color.from("white"),
          255, 255, 255, 1,
          "white should convert to rgb(255, 255, 255)");

  matches(SC.Color.from("black"),
          0, 0, 0, 1,
          "black should convert to rgb(0, 0, 0)");
});

// ...............................................
// SC.Color helper functions
//

test("clamp", function () {
  equal(SC.Color.clamp(0, 0, 1), 0);
  equal(SC.Color.clamp(.5, 0, 1), .5);
  equal(SC.Color.clamp(1, 0, 1), 1);

  equal(SC.Color.clamp(-1, 0, 1), 0);
  equal(SC.Color.clamp(2, 0, 1), 1);
});

test("clampInt", function () {
  equal(SC.Color.clampInt(0, 0, 1), 0);
  equal(SC.Color.clampInt(.5, 0, 1), 1);
  equal(SC.Color.clampInt(1, 0, 1), 1);

  equal(SC.Color.clampInt(-1, 0, 1), 0);
  equal(SC.Color.clampInt(2, 0, 1), 1);
});

test("clampToDeviceGamut", function () {
  equal(SC.Color.clampToDeviceGamut(250.25), 250);
  equal(SC.Color.clampToDeviceGamut(260), 255);
  equal(SC.Color.clampToDeviceGamut(-20), 0);
});

test("supportsArgb", function () {
  ok(SC.Color.hasOwnProperty('supportsArgb'),
     "supportsARGB should exist on SC.Color");
});

test("supportsRgba", function () {
  ok(SC.Color.hasOwnProperty('supportsRgba'),
     "supportsRGBA should exist on SC.Color");
});

// ...............................................
// SC.Color color space conversion functions
//

test("hsvToRgb", function () {
  var rgb = SC.Color.hsvToRgb(252, .94, .7843),
      isValid;

  isValid = rgb[0] === 50 &&
            rgb[1] === 12 &&
            rgb[2] === 200;
  ok(isValid, "[rgb(50, 12, 200) === rgb(" + rgb.join(', ') + ")");
});

test("rgbToHsv", function () {
  var hsv = SC.Color.rgbToHsv(50, 12, 200),
      isValid;

  hsv[0] = Math.round(hsv[0]);
  hsv[1] = Math.round(hsv[1] * 100);
  hsv[2] = Math.round(hsv[2] * 100);

  isValid = hsv[0] === 252 &&
            hsv[1] === 94 &&
            hsv[2] === 78;
  ok(isValid, "[rgb(50, 12, 200) === hsv(212, 75%, 49%) === hsv(" + hsv.join(', ') + ")]");
});

test("Converting between color spaces doesn't reduce accuracy", function () {
  var rgb = [20, 145, 42],
      cRgb = SC.Color.hsvToRgb.apply(null, SC.Color.rgbToHsv.apply(null, rgb));

  ok(rgb[0] === cRgb[0] &&
     rgb[1] === cRgb[1] &&
     rgb[2] === cRgb[2]);

  cRgb = SC.Color.hslToRgb.apply(null, SC.Color.rgbToHsl.apply(null, rgb));

  ok(rgb[0] === cRgb[0] &&
     rgb[1] === cRgb[1] &&
     rgb[2] === cRgb[2]);
});

// ...............................................
// SC.Copyable
//

test("isCopyable", function () {
  ok(SC.Copyable.detect(SC.Color.create()));
});

test("SC.Color copy() creates a clone of the current color", function () {
  var teal = SC.Color.from("teal"),
      cTeal = teal.copy();

  ok(teal.isEqualTo(cTeal), "the colors should be equivalent");
  teal.incrementProperty('hue', 30);
  ok(!teal.isEqualTo(cTeal), "mutating one color should not affect the other");
});

// ...............................................
// SC.Color properties
//

test("cssText", function () {
  var color = SC.Color.create({
    r: 255, g: 255, b: 255
  });
  equal(color.get('cssText'), '#ffffff');

  color.set('r', 0);
  equal(color.get('cssText'), '#00ffff');

  color.set('g', 128);
  equal(color.get('cssText'), '#0080ff');

  color.set('b', 128);
  equal(color.get('cssText'), '#008080');

  color.set('a', 0.5);
  ok(color.get('cssText') !== '#008080');
});

test("hue", function () {
  var color = SC.Color.from("hsl(330, 60%, 54%)"),
      round = Math.round;

  equal(round(color.get('hue')), 330);

  color.set('hue', 300);

  equal(color.get('r'), 208);
  equal(color.get('g'), 67);
  equal(color.get('b'), 208);

  equal(round(color.get('hue')), 300);
});

test("saturation", function () {
  var color = SC.Color.from("hsl(330, 60%, 54%)"),
      round = Math.round;

  equal(round(color.get('saturation') * 100), 60);

  color.set('saturation', .5);

  equal(color.get('r'), 196);
  equal(color.get('g'), 79);
  equal(color.get('b'), 138);

  equal(round(color.get('saturation') * 100), 50);
});

test("luminosity", function () {
  var color = SC.Color.from("hsl(330, 60%, 54%)"),
      round = Math.round;

  equal(round(color.get('luminosity') * 100), 54);

  color.set('luminosity', .74);

  equal(color.get('r'), 228);
  equal(color.get('g'), 149);
  equal(color.get('b'), 189);

  equal(round(color.get('luminosity') * 100), 74);
});

test("isEqualTo", function () {
  var white = SC.Color.from("white"),
      cWhite = SC.Color.create({ r: 255, g: 255, b: 255 });

  ok(white.isEqualTo(cWhite));
});

test("toRgb", function () {
  equal(SC.Color.create({ r: 50, g: 240, b: 250, a: .4 }).toRgb(),
         "rgb(50,240,250)");

  equal(SC.Color.create({ r: -50, g: 270, b: 250 }).toRgb(),
         "rgb(0,255,250)",
         "Color clamping should occur");
});

test("toRgba", function () {
  equal(SC.Color.create({ r: 50, g: 240, b: 250, a: .4 }).toRgba(),
         "rgba(50,240,250,0.4)");

  equal(SC.Color.create({ r: -50, g: 270, b: 250 }).toRgba(),
         "rgba(0,255,250,1)",
         "Color clamping should occur");
});

test("toHex", function () {
  equal(SC.Color.create({ r: 50, g: 240, b: 250, a: .4 }).toHex(),
         "#32f0fa");

  equal(SC.Color.create({ r: -50, g: 270, b: 250 }).toHex(),
         "#00fffa",
         "Color clamping should occur");
});

test("toArgb", function () {
  equal(SC.Color.create({ r: 50, g: 240, b: 250, a: .4 }).toArgb(),
         "#6632f0fa");

  equal(SC.Color.create({ r: -50, g: 270, b: 250 }).toArgb(),
         "#ff00fffa",
         "Color clamping should occur");
});

test("toHsl", function () {
  equal(SC.Color.create({ r: 50, g: 240, b: 250, a: .4 }).toHsl(),
         "hsl(183,95%,59%)");

  equal(SC.Color.create({ r: -50, g: 270, b: 250 }).toHsl(),
         "hsl(179,100%,50%)",
         "Color clamping should occur");
});

test("toHsla", function () {
  equal(SC.Color.create({ r: 50, g: 240, b: 250, a: .4 }).toHsla(),
         "hsla(183,95%,59%,0.4)");

  equal(SC.Color.create({ r: -50, g: 270, b: 250 }).toHsla(),
         "hsla(179,100%,50%,1)",
         "Color clamping should occur");
});

test("add", function () {
  var white = SC.Color.create({ r: 255, g: 255, b: 255 }),
      red = SC.Color.create({ r: 255, g: 0, b: 25, a: .4 }),
      c;

  c = white.add(red);
  equal(c.get('r'), 510);
  equal(c.get('g'), 255);
  equal(c.get('b'), 280);
  equal(c.get('a'), 1.4);
});

test("sub", function () {
  var white = SC.Color.create({ r: 255, g: 255, b: 255 }),
      red = SC.Color.create({ r: 255, g: 0, b: 25, a: .4 }),
      c;

  c = white.sub(red);
  equal(c.get('r'), 0);
  equal(c.get('g'), 255);
  equal(c.get('b'), 230);
  equal(c.get('a'), .6);
});

test("mult", function () {
  var c = SC.Color.create({ r: 10, g: 20, b: 30 });

  c = c.mult(.5);
  equal(c.get('r'), 5);
  equal(c.get('g'), 10);
  equal(c.get('b'), 15);
  equal(c.get('a'), .5);
});

});minispade.register('sproutcore-foundation/~tests/system/core_query/within', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ========================================================================
// CoreQuery Tests
// ========================================================================

// This file tests additions to CoreQuery.  These should function even if you use
// jQuery
module("CoreQuery.within() && within()");

test("should return if passed RAW element that is child", function() {
  var cq = SC.$('<div class="root">\
    <div class="middle">\
      <div class="child1"></div>\
      <div class="child2"></div>\
    </div>\
  </div>') ;

  var child = cq.find('.child1');
  equal(cq.within(child.get(0)), YES, "cq.within(DOMElement) = YES") ;

  var notChild = SC.$('<div class="not-child"></div>') ;
  equal(cq.within(notChild.get(0)), NO, "cq.hadChild(DOMElement) = NO");
  child = notChild = cq = null ;
}) ;

test("should return if passed CQ with element that is child", function() {
  var cq = SC.$('<div class="root">\
    <div class="middle">\
      <div class="child1"></div>\
      <div class="child2"></div>\
    </div>\
  </div>') ;

  var child = cq.find('.child1');
  equal(cq.within(child), YES, "cq.within(DOMElement) = YES") ;

  var notChild = SC.$('<div class="not-child"></div>') ;
  equal(cq.within(notChild), NO, "cq.hadChild(DOMElement) = NO");
  child = notChild = cq = null ;
}) ;

test("should work if matched set has multiple element", function() {
  var cq = SC.$('<div class="wrapper">\
    <div class="root"></div>\
    <div class="root"></div>\
    <div class="root">\
      <div class="middle">\
        <div class="child1"></div>\
        <div class="child2"></div>\
      </div>\
    </div>\
  </div>').find('.root') ;
  equal(cq.length, 3, "should have three element in matched set");

  var child = cq.find('.child1');
  equal(cq.within(child), YES, "cq.within(DOMElement) = YES") ;

  var notChild = SC.$('<div class="not-child"></div>') ;
  equal(cq.within(notChild), NO, "cq.hadChild(DOMElement) = NO");
  child = notChild = cq = null ;
}) ;

test("should return YES if matching self", function() {
  var cq = SC.$('<div></div>');
  equal(cq.within(cq), YES, "should not match");
});

});minispade.register('sproutcore-foundation/~tests/system/cursor', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module, test, htmlbody*/

module("SC.Cursor", {
  setup: function () {
    htmlbody('<style title="wrong-style"></style>');
  },

  teardown: function () {
    clearHtmlbody();
  }
});

/**
  There was a bug that if any additional style elements exist in the body
  the cursor would create a stylesheet in the head, but then retrieve the
  last stylesheet object which would be wrong.
*/
test("The cursor's stylesheet object should be the right object.", function () {
  var actual = SC.Cursor.sharedStyleSheet(),
    wrong;

  wrong = document.styleSheets[document.styleSheets.length - 1];
  ok(actual !== wrong, "The last stylesheet is not correct.");
});

});minispade.register('sproutcore-foundation/~tests/system/event', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// // ========================================================================
// SC.Event Tests
// ========================================================================
(function () {
  module("SC.Event");

  // WebKit browsers have equal values for keyCode and charCode on keypress event
  test("commandCodes() : should handle equal keyCode and charCode on keypress", function () {
    // 115 is also keyCode for F4 button
    var codes = new SC.Event({ type: 'keypress', keyCode: 115, charCode: 115 }).commandCodes();
    equal(codes[0], null, 'command');
    equal(codes[1], 's', 'char');
  });  
})();


});minispade.register('sproutcore-foundation/~tests/system/locale', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var LocaleObject;
module("object.SC.Locale()", {
		setup: function() {

			LocaleObject = SC.Locale.createWithMixins({
				init: function(){
					this._super();
					//hash of new languages
					var newLocales = { deflang: 'dl', empty: '' };

					//Added the new languages to the existing list of locales
					SC.Locale.addStrings(newLocales);
				}
			});

		}
	});

test("Locale.init() : Should return a flag if the language has been set during the locale initialization", function() {
	// As the locale is added during initialization the value of hasString is true
	equal(LocaleObject.hasStrings, true) ;

	//check the string values.
	equal(LocaleObject.strings.deflang, 'dl') ;
});


test("Locale.locWithDefault() : localized version of the string or the string if no match was found", function() {
	//Based on the input passed it should return the default locale
	equal(LocaleObject.locWithDefault("en"), "en") ;
	equal(LocaleObject.locWithDefault("jp", "Japanese"), "Japanese") ;
	equal(LocaleObject.locWithDefault('deflang'), "dl") ;
});

test("Locale.locWithDefault() : localized version of the string even if localized version is blank", function() {
  equal(LocaleObject.locWithDefault("empty"), "");
  equal(LocaleObject.locWithDefault("empty", "Empty"), "");
});

test("Locale.addStrings() : Should be able to add the passed hash of strings to the locale's strings table", function() {

	//Check for the new languages. This should be false as these are not added to the list of locales
	equal(false, SC.Locale.options().strings.chinese === 'zh' && SC.Locale.options().strings.dutch === 'nl') ;

	//hash of new languages
	var newLocales = { chinese: 'zh', czech: 'cs', dutch: 'nl'};

	//Added the new languages to the existing list of locales
	SC.Locale.addStrings(newLocales);

	//Result should be true as the new locales added to the list of default locales
	equal(true, SC.Locale.options().strings.chinese === 'zh' && SC.Locale.options().strings.dutch === 'nl') ;
});

/**
	There was a bug in SC.Locale where the `strings` object was cloned for each
	subclass but then the original `strings` object was used to mix in new strings
	and applied back.  This meant that each subclass ended up sharing the
	`strings` object and only one set of localizations (the last one) would exist.
*/
test("Locale.extend.addStrings() : Subclasses should not share the strings object.", function() {
	var strings;

	strings = { 'hello': 'Hello' };
	SC.Locale.locales.en.addStrings(strings);

	strings = { 'hello': 'Bonjour' };
	SC.Locale.locales.fr.addStrings(strings);

	//Result should be true as the new locales added to the list of default locales
	ok(SC.Locale.locales.en.prototype.strings !== SC.Locale.locales.fr.prototype.strings, "The strings object should not be shared between subclasses.");
});

test("Locale.options() : Should provide the registered locales that have not been instantiated", function() {

		//hash of new languages
		var newLocales = { jamaican: 'ji', korean: 'ko'};

		//Added the new languages to the existing list of locales
		SC.Locale.addStrings(newLocales);

		//Options should return the list of registered locales, so checking if the returned object has strings.
		equal(SC.Locale.options().hasStrings, true) ;

		//Checking the strings with default locales.
		equal(true, SC.Locale.options().strings.jamaican === 'ji' && SC.Locale.options().strings.korean === 'ko') ;
	});

test("Locale.normalizeLanguage() : Should provide the two character language code for the passed locale", function() {
	//If nothing is passed this will return the default code as 'en'
	equal(SC.Locale.normalizeLanguage(), 'en') ;

	//If the language is passed as 'English' this will return the code as 'en'
	equal(SC.Locale.normalizeLanguage('English'), 'en') ;

	//For any other code passed which is not in the default code it should return as it was passed
	equal(SC.Locale.normalizeLanguage('ab'), 'ab') ;
});

// test("Locale.toString() : Should return the current language set with the guid value", function() {
//   //TODO test does not match description
//   // Creating the new locale by extending an existing Locale object
//   SC.Locale.locales['mx'] = SC.Locale.extend({ _deprecatedLanguageCodes: ['mexican'] }) ;
//
//   ok(SC.Locale.locales.mx.currentLocale) ;
// });

test("Locale.createCurrentLocale() : Should create the Locale Object for the language selected", function() {
	//This will match the browser language with the SC language and create the object accordingly
	// This test will pass only for the default languages i.e en, fr, de, ja, es, it.
	equal(true, SC.Locale.createCurrentLocale().language === SC.browser.language) ;

	//Resetting the default browser language
	SC.browser.language='kn';

	//This is false as currentLocale will be created as 'en'
	equal(false, SC.Locale.createCurrentLocale().language===SC.browser.language) ;
});

test("Locale.localeClassFor() : Should find the locale class for the names language code or creates on based on its most likely parent", function() {
 		// Local Class for any language other than default languages will be 'en'. Therefore this condition is false
	equal(false, SC.Locale.localeClassFor('nl').create().language === "nl") ;

	// This adds the new language with the parent language to the default list
	SC.Locale.locales['nl'] = SC.Locale.extend({ _deprecatedLanguageCodes: ['Dutch'] }) ;

	//This condition is true as the local class now exists for 'nl'
	equal(true, SC.Locale.localeClassFor('nl').create().language==="nl") ;
});

test("Locale.define() : Should be able to define a particular type of locale", function() {
 		SC.Locale.define('xy', {
		longNames: 'Charles John Romonoski Gregory William'.split(' '),
		shortNames: ['C','A','Y','N']
	});

	//Result should return the new locale object
	equal(SC.Locale.locales.xy.isClass, true) ;
});

test("Locale.extend() : Should make sure important properties of Locale object are copied to a new class", function() {
	SC.Locale.locales['mn'] = SC.Locale.extend({ _deprecatedLanguageCodes: ['newlang'] }) ;

	//hash of new languages
	var testLocales = { test: 'te', newtest: 'nt'};
	//Added the new languages to the existing list of locales through the new locale object
	SC.Locale.locales.mn.addStrings(testLocales);

	//Result should be true as the new locales added to the list of default locales
	equal(SC.Locale.locales.mn.options().strings.test,'te') ;
});

});minispade.register('sproutcore-foundation/~tests/system/platform', function() {// ==========================================================================
// Project: SproutCore - JavaScript Application Framework
// Copyright: ©2012 Michael Krotscheck and contributors. All rights reserved.
// License: Licensed under MIT license (see license.js)
// ==========================================================================

/**
 * Test for correct cordova detection.
 */
test("SC.platform.cordova", function() {
  var platform = SC.Platform.create({browser: SC.browser});

  ok(typeof platform.get('cordova') == 'boolean', "Cordova check must have been executed.");

  // Is there a chance we're in a cordova runtime?
  var isCordova = typeof window.cordova !== "undefined";
  equal(isCordova, platform.get('cordova'), "Cordova detection must match what we've been able to determine for ourselves");

});

});minispade.register('sproutcore-foundation/~tests/system/ready/done', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var realMainFunction, realApplicationMode, timesMainCalled;
module("SC.onReady.done", {
  setup: function() {
    timesMainCalled = 0;

    realMainFunction = window.main;
    window.main = function() {
      timesMainCalled += 1;
    };

    realApplicationMode = SC.mode;
  },

  teardown: function() {
    window.main = realMainFunction;
    SC.mode = realApplicationMode;
    SC.isReady = false;
  }
});

test("When the application is done loading in test mode", function() {
  SC.mode = SC.TEST_MODE;
  SC.onReady.done();

  equal(timesMainCalled, 0, "main should not have been called");
});

test("When the application is done loading in application mode", function() {
  SC.mode = SC.APP_MODE;
  SC.onReady.done();

  equal(timesMainCalled, 1, "main should have been called");
});

});minispade.register('sproutcore-foundation/~tests/system/render_context/begin', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok */

var context = null;

module("SC.RenderContext#begin", {
  setup: function() {
    context = SC.RenderContext();
  }
});

test("should return a new context with parent context as prevObject", function() {
  var c2 = context.begin();
  ok(c2 !== context, "new context");
  equal(c2.prevObject, context, 'previous context');
});

test("should set offset for new context equal to length of previous context", function() {
  context.push("line1");
  var expected = context.length ;
  var c2 = context.begin();
  equal(c2.offset, expected, "offset");
});

test("should copy same strings array to new child context", function() {
  context.push("line1");
  var c2 =context.begin();
  equal(c2.strings, context.strings);
});

test("should start new context with length of 1 (reserving a space for opening tag)", function() {
  context.push("line1");
  var c2 = context.begin() ;
  equal(c2.length, 1, 'has empty line');
  equal(c2.strings.length, 3, "parent empty line + parent line + empty line");
});

test("should assign passed tag name to new context", function() {
  var c2 = context.begin('foo');
  equal(c2.tagName(), 'foo', 'tag name');
});

});minispade.register('sproutcore-foundation/~tests/system/render_context/element', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok */

var context = null;

module("SC.RenderContext#element", {
  setup: function() {
    context = SC.RenderContext() ;
  },
  
  teardown: function() {
    context = null;
  }
});

test("converts context to a DOM element and returns root element if there is one", function() {
  context.id('foo');
  var elem = context.element();
  ok(elem, 'elem not null');
  equal(elem.tagName.toString().toLowerCase(), 'div', 'is div');
  equal(elem.id.toString(), 'foo', 'is id=foo');
  elem = null ;
});

test("returns null if context does not generate valid element", function() {
  context = SC.RenderContext(null);
  var elem = context.element();
  equal(elem, null, 'should be null');
  elem = null;
});

test("returns first element if context renders multiple element", function() {
  context.tag('div').tag('span');
  var elem = context.element();
  ok(elem, 'elem not null');
  equal(elem.tagName.toString().toLowerCase(), 'div', 'is div');
  elem = null;
});

});minispade.register('sproutcore-foundation/~tests/system/render_context/end', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok */

var context = null;

module("SC.RenderContext#end", {
  setup: function() {
    context = SC.RenderContext();
  }
});

test("should replace opening tag with string and add closing tag, leaving middle content in place", function() {
  context.push("line1").end();
  equal(context.get(0), "<div>", "opening tag");
  equal(context.get(1), "line1", "opening tag");
  equal(context.get(2), "</div>", "closing tag");
});

test("should emit any CSS class names included in the tag opts.addClass array", function() {
  context.addClass("foo bar".w()).end();
  ok(context.get(0).match(/class=\"(?:bar|foo)\s*(?:foo|bar)\s*\"/), '<div> has classes foo bar') ;
});

test("should emit id in tag opts.id", function() {
  context.id("foo").end();
  ok(context.get(0).match(/id=\"foo\"/), "<div> has id attr");
});

test("should emit style in tag if opts.styles is defined", function() {
  context.setStyle({ alpha: "beta", foo: "bar" }).end();
  ok(context.get(0).match(/style=\"alpha: beta; foo: bar; \"/), '<div> has style="alpha: beta; foo: bar; "');
});

test("should emit style with custom browser attributes", function() {
  context.setStyle({ mozColumnCount: '3', webkitColumnCount: '3', oColumnCount: '3', msColumnCount: '3' }).end();
  ok(context.get(0).match('<div style="-moz-column-count: 3; -webkit-column-count: 3; -o-column-count: 3; -ms-column-count: 3; " >'),
                            '<div> has style="-moz-column-count: 3; -webkit-column-count: 3, -o-column-count: 3, -ms-column-count: 3; "');
});

test("should write arbitrary attrs has in opts", function() {
  context.setAttr({ foo: "bar", bar: "baz" }).end();
  ok(context.get(0).match(/foo=\"bar\"/), 'has foo="bar"');
  ok(context.get(0).match(/bar=\"baz\"/), 'has bar="baz"');
});

test("addClass should override attrs.class", function() {
  context.addClass("foo".w()).setAttr({ "class": "bar" }).end();
  ok(context.get(0).match(/class=\"foo\"/), 'has class="foo"');
});

test("opts.id should override opts.attrs.id", function() {
  context.id("foo").setAttr({ id: "bar" }).end();
  ok(context.get(0).match(/id=\"foo\"/), 'has id="foo"');
});

test("opts.styles should override opts.attrs.style", function() {
  context.setStyle({ foo: "foo" }).setAttr({ style: "bar: bar" }).end();
  ok(context.get(0).match(/style=\"foo: foo; \"/), 'has style="foo: foo; "');
});

test("should return receiver if receiver has no prevObject", function() {
  ok(!context.prevObject, 'precondition - prevObject is null');
  equal(context.end(), context, 'ends as self');
});

test("should return prevObject if receiver has prevObject", function() {
  var c2 = context.begin();
  equal(c2.end(), context, "should return prevObject");
});

test("emits self closing tag if tag has no content and c._selfClosing !== NO", function() {
  var c2 = context.begin('input');
  c2.end();
  equal(c2.get(0), "<input />");
});

test("emits two tags even if tag has no content if opts.selfClosing == NO", function() {
  context._selfClosing = NO;

  context.end();
  equal(context.length, 2, "has two lines");
  equal(context.get(0), "<div>", "has opening tag");
  equal(context.get(1), "</div>", "has closing tag");
});

test("does NOT emit self closing tag if it has content, even if opts.selfClosing == YES (because that would yield invalid HTML)", function() {
  context._selfClosing = YES;
  context.push("line").end();
  equal(context.length, 3, "has 3 lines");
  equal(context.get(2), "</div>", "has closing tag");
});

test("it should make sure to clear reused temporary attributes object", function() {

  // generate one tag...
  context.begin('input')
    .id("foo")
    .setStyle({ foo: "bar" })
    .addClass("foo bar".w())
    .push("line")
  .end();

  // generate second tag...will reuse internal temporary attrs object.
  context.begin('input').id("bar").end();
  var str = context.get(context.length-1);
  equal(str, "<input id=\"bar\"  />");
});

test("it should work when nested more than one level deep", function() {
  context.begin().id("foo")
    .begin().id("bar").end()
  .end();

  var str = context.join('');
  ok(str.match(/id="foo"/), 'has foo');
  ok(str.match(/id="bar"/), 'has bar');
});


});minispade.register('sproutcore-foundation/~tests/system/render_context/escape_html', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context */
module("Render Context--Escaping HTML");
test("Escaping HTML", function() {
  var input = "<p>HTML!</p><script>alert('hi');<" + "/script> & Hello, World!";
  var output = SC.RenderContext.escapeHTML(input);
  
  equal(output, '&lt;p&gt;HTML!&lt;/p&gt;&lt;script&gt;alert(\'hi\');&lt;/script&gt; &amp; Hello, World!', "Properly escapes HTML");
});

module("Render Context--Escaping , preserve HTML entities like &apos;");
test("Escaping HTML, preserve HTML entities", function() {
  var input = "<p>HTML!</p><script>alert('hi');<" + "/script> &illegalese; & &amp; Hello, World!";
  var output = SC.RenderContext.escapeHTML(input);
  
  equal(output, '&lt;p&gt;HTML!&lt;/p&gt;&lt;script&gt;alert(\'hi\');&lt;/script&gt; &amp;illegalese; &amp; &amp; Hello, World!', "Properly escapes HTML");
});

test("Tests stolen from Prototype.js", function() {
  var largeTextEscaped = '&lt;span&gt;test&lt;/span&gt;', 
      largeTextUnescaped = '<span>test</span>';
  for (var i = 0; i < 2048; i++) { 
    largeTextEscaped += ' ABC';
    largeTextUnescaped += ' ABC';
  }
  
  
  var tests = [
    'foo bar', 'foo bar',
    'foo <span>bar</span>', 'foo &lt;span&gt;bar&lt;/span&gt;',
    'foo ß bar', 'foo ß bar',
    'ウィメンズ2007\nクルーズコレクション', 'ウィメンズ2007\nクルーズコレクション',
    'a<a href="blah">blub</a>b<span><div></div></span>cdef<strong>!!!!</strong>g',
      'a&lt;a href="blah"&gt;blub&lt;/a&gt;b&lt;span&gt;&lt;div&gt;&lt;/div&gt;&lt;/span&gt;cdef&lt;strong&gt;!!!!&lt;/strong&gt;g',
    '1\n2', '1\n2',
    
    largeTextUnescaped, largeTextEscaped
  ];
  
  for (var idx = 0; idx < tests.length; idx++) {
    // some of these strings are REALLY LONG so we don't want to write them out
    ok(SC.RenderContext.escapeHTML(tests[idx++]) === tests[idx]);
  }
});

test("Should accept number argument", function() {
  var number = 12345.6789,
      numStr = number.toString();
  
  equal(numStr, SC.RenderContext.escapeHTML(number), "Properly produces string when invoked with a number argument");
});

});minispade.register('sproutcore-foundation/~tests/system/render_context/get', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context */

var context = null;

module("SC.RenderContext#get", {
  setup: function() {
    context = SC.RenderContext();
  },
  
  teardown: function() {
    context = null;
  }
});

test("it should return strings array with space for top tag if no params passed and no strings pushed yet", function() {
  deepEqual(context.get(), [null]);
});

test("it should return full strings array if no params passed and no strings pushed yet", function() {
  context.push("line1");
  deepEqual(context.get(), [null, "line1"]);
});

test("it should return individual string if index passed that is within current length", function() {
  context.push("line1");
  equal(context.get(1), "line1");
});

test("it should return undefined if index passed that is outside of current range", function() {
  context.push("line1");
  equal(context.get(3), undefined);
});

// test this special case since the internal strings array is created lazily.
test("it should return undefined if index passed and no strings set yet", function() {
  equal(context.get(2), undefined);
});

test("it should return the value based on an index from the context offset of the context is chained", function() {
  context.push('line1', 'line2');
  var childContext = context.begin();
  childContext.push("NEXT");
  equal(childContext.get(1), "NEXT", 'gets child line');
}) ;

});minispade.register('sproutcore-foundation/~tests/system/render_context/helpers_attr', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same same */

var context = null;



// ..........................................................
// attr
//
module("SC.RenderContext#attr", {
  setup: function() {
    context = SC.RenderContext().setAttr({ foo: 'foo' }) ;
  }
});

test("should add passed name to value", function() {
  context.setAttr('bar', 'bar');
  equal(context._attrs.bar, 'bar', 'verify attr name');
});

test("should replace passed name  value in attrs", function() {
  context.setAttr('foo', 'bar');
  equal(context._attrs.foo, 'bar', 'verify attr name');
});

test("should return receiver", function() {
  equal(context, context.setAttr('foo', 'bar'));
});

test("should create attrs hash if needed", function() {
  context = SC.RenderContext().begin();
  equal(context._attrs, null, 'precondition - has no attrs');

  context.setAttr('foo', 'bar');
  equal(context._attrs.foo, 'bar', 'has styles');
});

test("should assign all attrs if a hash is passed", function() {
  context.setAttr({ foo: 'bar', bar: 'bar' });
  deepEqual(context._attrs, { foo: 'bar', bar: 'bar' }, 'has same styles');
});



});minispade.register('sproutcore-foundation/~tests/system/render_context/helpers_basic', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

var context = null;

// ..........................................................
// id()
// 
module("SC.RenderContext#id", {
  setup: function() {
    context = SC.RenderContext().id('foo') ;
  }
});

test("id() returns the current id for the tag", function() {
  equal(context.id(), 'foo', 'get id');
});

test("id(bar) alters the current id", function() {
  equal(context.id("bar"), context, "Returns receiver");
  equal(context.id(), 'bar', 'changed to bar');
});

});minispade.register('sproutcore-foundation/~tests/system/render_context/helpers_className', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

var context = null;

// ..........................................................
// classes()
//
module("SC.RenderContext#classes", {
  setup: function() {
    context = SC.RenderContext() ;
  }
});

test("returns empty array if no current class names", function() {
  deepEqual(context.classes(), [], 'classes') ;
});

test("addClass(array) updates class names", function() {
  var cl = 'bar baz'.w();
  equal(context.addClass(cl), context, "returns receiver");
  deepEqual(context.classes(), cl, 'class names');
});

test("returns classes if set", function() {
  context.addClass('bar');
  deepEqual(context.classes(), ['bar'], 'classNames');
});

test("clone on retrieval if addClass(array) set", function() {
  var cl = 'foo bar'.w();
  context.addClass(cl);

  var result = context.classes();
  ok(result !== cl, "class name is NOT same instance");
  deepEqual(result, cl, "but arrays are equivalent");

  equal(result, context.classes(), "2nd retrieval is same instance");
});

test("extracts class names from element on first retrieval", function() {
  var elem = document.createElement('div');
  SC.$(elem).attr('class', 'foo bar');
  context = SC.RenderContext(elem);

  var result = context.classes();
  deepEqual(result, ['foo', 'bar'], 'extracted class names');
});

// ..........................................................
// hasClass()
//
module("SC.RenderContext#hasClass", {
  setup: function() {
    context = SC.RenderContext().addClass('foo bar'.w()) ;
  }
});

test("should return true if context classNames has class name", function() {
  equal(YES, context.hasClass('foo'), 'should have foo');
});

test("should return false if context classNames does not have class name", function() {
  equal(NO, context.hasClass('imaginary'), "should not have imaginary");
});

test("should return false if context has no classNames", function() {
  context = context.begin('div');
  ok(context.classes().length === 0, 'precondition - context has no classNames');
  equal(NO, context.hasClass('foo'), 'should not have foo');
});

// ..........................................................
// addClass()
//
module("SC.RenderContext#addClass", {
  setup: function() {
    context = SC.RenderContext().addClass('foo') ;
  }
});

test("should return receiver", function() {
  equal(context.addClass('foo'), context, "receiver");
});

test("should add class name to existing classNames array on currentTag", function() {
  context.addClass('bar');
  deepEqual(context.classes(), ['foo', 'bar'], 'has classes');
  equal(context._classesDidChange, YES, "note did change");
});

test("should only add class name once - does nothing if name already in array", function() {
  deepEqual(context.classes(), ['foo'], 'precondition - has foo classname');
  context._classesDidChange = NO; // reset  to pretend once not modified

  context.addClass('foo');
  deepEqual(context.classes(), ['foo'], 'no change');
  equal(context._classesDidChange, NO, "note did not change");
});

// ..........................................................
// removeClass()
//
module("SC.RenderContext#removeClass", {
  setup: function() {
    context = SC.RenderContext().addClass(['foo', 'bar']) ;
  }
});

test("should remove class if already in classNames array", function() {
  ok(context.classes().indexOf('foo')>=0, "precondition - has foo");

  context.removeClass('foo');
  ok(context.classes().indexOf('foo')<0, "does not have foo");
});

test('should return receiver', function() {
  equal(context.removeClass('foo'), context, 'receiver');
});

test("should do nothing if class name not in array", function() {
  context._classesDidChange = NO; // reset to pretend not modified
  context.removeClass('imaginary');
  deepEqual(context.classes(), 'foo bar'.w(), 'did not change');
  equal(context._classesDidChange, NO, "note did not change");
});

test("should do nothing if there are no class names", function() {
  context = context.begin();
  deepEqual(context.classes(), [], 'precondition - no class names');
  context._classesDidChange = NO; // reset to pretend not modified

  context.removeClass('foo');
  deepEqual(context.classes(), [], 'still no class names -- and no errors');
  equal(context._classesDidChange, NO, "note did not change");
});

// ..........................................................
// setClass
//
module("SC.RenderContext#setClass", {
  setup: function() {
    context = SC.RenderContext().addClass('foo') ;
  }
});

test("should add named class if shouldAdd is YES", function() {
  ok(!context.hasClass("bar"), "precondition - does not have class bar");
  context.setClass("bar", YES);
  ok(context.hasClass("bar"), "now has bar");
});

test("should remove named class if shouldAdd is NO", function() {
  ok(context.hasClass("foo"), "precondition - has class foo");
  context.setClass("foo", NO);
  ok(!context.hasClass("foo"), "should not have foo ");
});

test("should return receiver", function() {
  equal(context, context.setClass("bar", YES), "returns receiver");
});

test("should add/remove all classes if a hash of class names is passed", function() {
  ok(context.hasClass("foo"), "precondition - has class foo");
  ok(!context.hasClass("bar"), "precondition - does not have class bar");

  context.setClass({ foo: NO, bar: YES });

  ok(context.hasClass("bar"), "now has bar");
  ok(!context.hasClass("foo"), "should not have foo ");
});

});minispade.register('sproutcore-foundation/~tests/system/render_context/helpers_style', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same same */

var context = null;

// ..........................................................
// styles
//
module("SC.RenderContext#styles", {
  setup: function() {
    context = SC.RenderContext() ;
  }
});

test("returns empty hash if no current styles", function() {
  deepEqual(context.styles(), {}, 'styles') ;
});

test("styles(hash) replaces styles", function() {
  var styles = { foo: 'bar' };
  equal(context.setStyle(styles), context, "returns receiver");
  deepEqual(context.styles(), styles, 'Styles');
});

test("clone on next retrieval if styles(foo) set with cloneOnModify=YES", function() {
  var styles = { foo: 'bar' };
  context.setStyle(styles);

  var result = context.styles();
  ok(result !== styles, "styles is NOT same instance");
  deepEqual(result, styles, "but styles are equivalent");

  equal(result, context.styles(), "2nd retrieval is same instance");
});

test("extracts styles from element on first retrieval", function() {
  var elem = document.createElement('div');
  SC.$(elem).attr('style', 'color: black; height: 20px; border-top: 1px solid hotpink; -webkit-column-count: 3');
  context = SC.RenderContext(elem);

  var result = context.styles();

  if(SC.browser.isIE){
    deepEqual(result, { color: 'black', height: '20px', borderTop: 'hotpink 1px solid', WebkitColumnCount: '3' }, 'extracted style. This is failing in IE8 because it return styles like cOLOR.');
  }else{
    deepEqual(result, { color: 'black', height: '20px', borderTop: '1px solid hotpink', WebkitColumnCount: '3' }, 'extracted style. This is failing in IE8 because it return styles like cOLOR.');
  }
  equal(context.styles(), result, "should reuse same instance thereafter");
});

// ..........................................................
// addStyle
//
module("SC.RenderContext#addStyle", {
  setup: function() {
    context = SC.RenderContext().setStyle({ foo: 'foo' }) ;
  }
});

test("should add passed style name to value", function() {
  context.addStyle('bar', 'bar');
  equal('bar', context.styles().bar, 'verify style name');
});

test("should replace passed style name  value", function() {
  context.addStyle('foo', 'bar');
  equal('bar', context.styles().foo, 'verify style name');
});

test("should return receiver", function() {
  equal(context, context.addStyle('foo', 'bar'));
});

test("should create styles hash if needed", function() {
  context = SC.RenderContext();
  equal(context._styles, null, 'precondition - has no styles');

  context.addStyle('foo', 'bar');
  equal('bar', context.styles().foo, 'has styles');
});

test("should assign all styles if a hash is passed", function() {
  context.addStyle({ foo: 'bar', bar: 'bar' });
  deepEqual(context.styles(), { foo: 'bar', bar: 'bar' }, 'has same styles');
});

test("addStyle should remove properties that are part of combo properties", function(){
  SC.COMBO_STYLES = { foo: 'fooSub'.w() };
  context.setStyle({ foo: 'foo', fooSub: 'bar' });
  equal(context.styles().fooSub, 'bar', 'proper starting values');
  context.addStyle('foo', 'bar');
  equal(context.styles().foo, 'bar', 'foo has new value');
  equal(context.styles().fooSub, undefined, 'fooSub has no value');
});


});minispade.register('sproutcore-foundation/~tests/system/render_context/init', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context */

var context = null;

module("SC.RenderContext#init");

test("it should return a new context object with the passed tag name", function() {
  equal(SC.RenderContext('foo').tagName(), 'foo', 'tag name');
});

test("it should use a default tag name of div if not passed", function() {
  equal(SC.RenderContext().tagName(), 'div', 'tag name');
});

test("it should lowercase any tag name passed in", function() {
  equal(SC.RenderContext('DIV').tagName(), 'div', 'lowercase tag name');
});

test("it should have a length of 1 with a null value for the first time, saving space for the opening tag", function() {
  var context = SC.RenderContext();
  equal(context.length, 1, 'context length');
  equal(context.get(0), null, 'first item');
});

test("if script tag is passed, should mark context._selfClosing as NO" ,function() {
  var context = SC.RenderContext('script');
  ok(context._selfClosing === NO, "selfClosing MUST be no");
  
  context = SC.RenderContext('SCRIPT');
  ok(context._selfClosing === NO, "selfClosing MUST be no 2");
});

test("if element is passed, it should save element and not reserve space for string output", function() {
  var elem = document.createElement('div');
  var context = SC.RenderContext(elem);
  equal(context.length, 0, 'no length');
  equal(context._elem, elem, 'element');
  elem = context._elem = null; //cleanup
});

test("offset should should use offset + length of parent for self", function() {
  var context =SC.RenderContext('div');
  context.offset = 2;
  context.length = 3;
  var newContext = SC.RenderContext('div', context);
  equal(newContext.offset, 5, 'has proper offset');
});


});minispade.register('sproutcore-foundation/~tests/system/render_context/join', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context */

var context = null;

module("SC.RenderContext#join", {
  setup: function() {
    context = SC.RenderContext().push("line1", "line2") ;
  },
  
  teardown: function() {
    context = null;
  }
});

test("it should return joined lines with no separator string by default", function() {
  equal(context.join(), '<div>line1line2</div>');
});

test("it should return joined lines with separator string if passed", function() {
  equal(context.join(","), "<div>,line1,line2,</div>") ;
});

});minispade.register('sproutcore-foundation/~tests/system/render_context/push_text', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context */

var context = null;

// ..........................................................
// push()
// 
module("SC.RenderContext#push", {
  setup: function() {
    context = SC.RenderContext();
  },
  
  teardown: function() {
    context = null;
  }
});

test("it should add the line to the strings and increase the length", function() {
  equal(context.length, 1, "precondition - length=");

  context.push("sample line");
  equal(context.length, 2, "length should increase");
  equal(context.get(1), "sample line", "line should be in strings array");
});

test("it should accept multiple parameters, pushing each one into strings", function() {

  equal(context.length, 1, "precondition - length=");
  
  context.push("line1", "line2", "line3");
  equal(context.length, 4, "should add 3 lines to strings");
  equal(context.get(1), "line1", "1st item");
  equal(context.get(2), "line2", "2nd item");
  equal(context.get(3), "line3", "3rd item");
});

test("it should return receiver", function() {
  equal(context.push("line1"), context, "return value");
});

test("pushing a line onto a subcontext, should update the length in the parent context as well", function() {
  context.push("line1", "line2");
  var len = context.length ;
  
  var c2 = context.begin().push("line3");
  ok(context.length > len, "length should have increased");
});

// ..........................................................
// text()
// 
module("SC.RenderContext#text", {
  setup: function() {
    context = SC.RenderContext();
  },
  
  teardown: function() {
    context = null;
  }
});

test("should escape passed HTML before pushing", function() {
  context.text("<b>test me!</b>");
  equal(context.get(1),'&lt;b&gt;test me!&lt;/b&gt;', 'escaped');
});



});minispade.register('sproutcore-foundation/~tests/system/render_context/tag', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context */

var context = null;

module("SC.RenderContext#tag", {
  setup: function() {
    context = SC.RenderContext() ;
  }
});

test("should emit a self closing tag.  like calling begin().end()", function() {
  context.tag("input");
  equal(SC.RenderContext.escapeHTML(context.get(1)), SC.RenderContext.escapeHTML("<input />"));
});

test("should respect passed opts when emitting", function() {
  context.tag("foo") ;
  equal(context.length, 3);
  equal(SC.RenderContext.escapeHTML(context.get(1)), SC.RenderContext.escapeHTML("<foo>"));
  equal(SC.RenderContext.escapeHTML(context.get(2)), SC.RenderContext.escapeHTML('<'+'/foo>'));
});

test("should NOT emit self closing tag if tag is script", function() {
  context.tag("script");
  equal(SC.RenderContext.escapeHTML(context.get(1)), SC.RenderContext.escapeHTML('<script>'));
  equal(SC.RenderContext.escapeHTML(context.get(2)), SC.RenderContext.escapeHTML('<'+'/script>'));
});

test("should NOT emit self closing tag if tag is div", function() {
  context.tag("div");
  equal(SC.RenderContext.escapeHTML(context.get(1)), SC.RenderContext.escapeHTML('<div>'));
  equal(SC.RenderContext.escapeHTML(context.get(2)), SC.RenderContext.escapeHTML('<'+'/div>'));
});

test("should NOT emit self closing tag if no tag is passed", function() {
  context.tag();
  equal(SC.RenderContext.escapeHTML(context.get(1)), SC.RenderContext.escapeHTML('<div>'));
  equal(SC.RenderContext.escapeHTML(context.get(2)), SC.RenderContext.escapeHTML('<'+'/div>'));
});

});minispade.register('sproutcore-foundation/~tests/system/render_context/update', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok */

var context = null, elem = null;

module("SC.RenderContext#update", {
  setup: function() {
    elem = document.createElement('div');
    context = SC.RenderContext(elem) ;
  },

  teardown: function() {
    elem = context = null; // avoid memory leaks
  }
});

test("should replace innerHTML of DIV if strings were pushed", function() {
  elem.innerHTML = "initial";
  context.push("changed").update();
  equal(elem.innerHTML, "changed", "innerHTML did change");
});

test("should NOT replace innerHTML of DIV if no strings were pushed", function() {
  elem.innerHTML = "initial";
  context.update();
  equal(elem.innerHTML, "initial", "innerHTML did NOT change");
});

test("returns receiver if no prevObject", function() {
  equal(context.update(), context, "return value");
});

test("returns previous context if there is one", function() {
  var c2 = context.begin(elem);
  equal(c2.update(), context, "returns prev context");
});

test("clears internal _elem to avoid memory leaks on update", function() {
  ok(!!context._elem, 'precondition - has element')  ;
  context.update();
  ok(!context._elem, "no longer an element");
});

// ..........................................................
// Attribute Editing
//
module("SC.RenderContext#update - attrs", {
  setup: function() {
    elem = document.createElement('div');
    SC.$(elem).attr("foo", "initial");
    context = SC.RenderContext(elem);
  },

  teardown: function() {
    elem = context = null ;
  }
});

test("does not change attributes if attrs were not actually changed", function() {
  context.update();
  equal(elem.getAttribute("foo"), "initial", "attribute");
});

test("updates attribute if attrs changed", function() {
  context.setAttr('foo', 'changed');
  context.update();
  equal(elem.getAttribute("foo"), "changed", "attribute");
});

test("adds attribute if new", function() {
  context.setAttr('bar', 'baz');
  context.update();
  equal(elem.getAttribute("bar"), "baz", "attribute");
});

test("removes attribute if value is null", function() {
  context.setAttr('foo', null);
  context.update();
  equal(elem.getAttribute("foo"), null, "attribute");
});

// ..........................................................
// ID
//
module("SC.RenderContext#update - id", {
  setup: function() {
    elem = document.createElement('div');
    SC.$(elem).attr("id", "foo");
    context = SC.RenderContext(elem);
  },

  teardown: function() {
    elem = context = null ;
  }
});

test("does not change id if retrieved but not edited", function() {
  context.id();
  context.update();
  equal(elem.getAttribute("id"), "foo", "id");
});

test("replaces id if edited", function() {
  context.id('bar');
  context.update();
  equal(elem.getAttribute("id"), "bar", "id");
});

test("set id overrides attr", function() {
  context.setAttr("id", "bar");
  context.id('baz');
  context.update();
  equal(elem.getAttribute("id"), "baz", "should use id");
});

// ..........................................................
// Class Name Editing
//
module("SC.RenderContext#update - className", {
  setup: function() {
    elem = document.createElement('div');
    SC.$(elem).attr("class", "foo bar");
    context = SC.RenderContext(elem);
  },

  teardown: function() {
    elem = context = null ;
  }
});

test("does not change class names if retrieved but not edited", function() {
  context.classes();
  context.update();
  equal(SC.$(elem).attr("class"), "foo bar", "class");
});


// ..........................................................
// Style Editing
//
module("SC.RenderContext#update - style", {
  setup: function() {
    elem = document.createElement('div');
    SC.$(elem).attr("style", "color: red;");
    context = SC.RenderContext(elem);
  },

  teardown: function() {
    elem = context = null ;
  }
});

test("does not change styles if retrieved but not edited", function() {
  context.styles();
  context.update();
  var style = SC.$(elem).attr("style").trim();
  if (!style.match(/;$/)) style += ';' ;

  equal(style.toLowerCase(), "color: red;", "style");
});

test("replaces style name if styles edited", function() {
  context.setStyle({ color: "black" });
  context.update();

  // Browsers return single attribute styles differently, sometimes with a trailing ';'
  // sometimes, without one. Normalize it here.
  var style = SC.$(elem).attr("style").trim();
  if (!style.match(/;\s{0,1}$/)) style += ';' ;

  equal(style.toLowerCase(), "color: black;", "attribute");
});


test("set styles override style attr", function() {
  context.setAttr("style", "color: green");
  context.setStyle({ color: "black" });
  context.update();

  // Browsers return single attribute styles differently, sometimes with a trailing ';'
  // sometimes, without one. Normalize it here.
  var style = SC.$(elem).attr("style").trim();
  if (!style.match(/;$/)) style += ';' ;

  equal(style.toLowerCase(), "color: black;", "attribute");
});

test("set styles handle custom browser attributes", function() {
  context.resetStyles();
  context.setStyle({ columnCount: '3', mozColumnCount: '3', webkitColumnCount: '3', oColumnCount: '3', msColumnCount: '3' });
  context.update();

  // Browsers return single attribute styles differently, sometimes with a trailing ';'
  // sometimes, without one. Normalize it here.
  var style = SC.$(elem).attr("style").trim();
  if (!style.match(/;$/)) style += ';' ;

  // Older Gecko completely ignores css attributes that it doesn't understand.
  if(SC.browser.isMozilla) equal(style, "-moz-column-count: 3;");
  else if (SC.browser.isIE) equal(style, "-ms-column-count: 3;");
  else if (SC.browser.engine === SC.ENGINE.webkit) equal(style, "-webkit-column-count: 3;");
});

});minispade.register('sproutcore-foundation/~tests/system/selection_set/add', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var set, array, array2;
module("SC.SelectionSet#add", {
  setup: function() {
    set = SC.SelectionSet.create();
    array = '0 1 2 3 4 5 6 7 8 9'.w();
    array2 = 'a b c d e f g h i k l m'.w();
  }
});

/* 
  validates that the selection set has the expected content.  pass index sets
  with sources set appropriately.  The order of the array is not important.
*/
function validate(set, expected, defaultSource) {
  var sources = set.get('sources'),
      len  = expected.length,
      idx, cur, actual ;
      
  equal(sources.length, expected.length, 'should have same number of sources (actual sources: %@)'.fmt(sources));  
  
  for(idx=0;idx<len;idx++) {
    cur = expected[idx];
    if (!cur.source) cur.source =defaultSource; 
    actual = set.indexSetForSource(cur.source, NO);
    ok(actual, 'should have indexSet for source: %@'.fmt(cur.source));
    equal(actual.source, cur.source, 'indexSet.source should match source');
    ok(actual.isEqual(cur), 'indexSet should match for source %@ (actual: %@ expected: %@)'.fmt(cur.source, actual, cur));
  }
}

// ..........................................................
// BASIC ADDS
// 

test("Adding indexes for single source", function() {
  set.add(array, 4, 3);
  validate(set, [SC.IndexSet.create(4,3)], array);

  set.add(array, 1);
  validate(set, [SC.IndexSet.create(1).add(4,3)], array);
});

test("Adding multiple sources", function() {
  var expected = SC.IndexSet.create(4,3);
  var expected2 = SC.IndexSet.create(1);
  expected.source = array;
  expected2.source = array2;
  
  set.add(array, 4, 3);
  validate(set, [expected]);

  set.add(array2, 1);
  validate(set, [expected, expected2]);
});

test("Adding IndexSet with source", function() {
  var expected = SC.IndexSet.create(4,3);
  expected.source = array;
  
  set.add(expected);
  validate(set, [expected]);
});

test("Adding another SelectionSet", function() {
  var expected = SC.IndexSet.create(4,3);
  var expected2 = SC.IndexSet.create(1,5);
  expected.source = array;
  expected2.source = array2;
  
  set.add(array, 4, 3);
  validate(set, [expected]);

  var set2 = SC.SelectionSet.create().add(array2, 1, 5);
  validate(set2, [expected2]);
  
  set.add(set2);
  validate(set, [expected, expected2]);
});

test("Adding indexes with range object !!", function() {
  set.add(array, { start: 4, length: 3 });
  validate(set, [SC.IndexSet.create(4,3)], array);
});




});minispade.register('sproutcore-foundation/~tests/system/selection_set/copy', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

module("SC.SelectionSet.copy");

test("basic copy", function() {
  var content = "1 2 3 4 5 6 7 8 9".w(),
      set     = SC.SelectionSet.create().add(content,4,4).remove(content,6),
      copy    = set.copy();

  equal(set.get('length'), 3, 'precond - original set should have length');
  equal(copy.get('length'), 3, 'copy should have same length');
  ok(copy.isEqual(set), 'copy should be the same as original set');
});

});minispade.register('sproutcore-foundation/~tests/system/selection_set/indexSetForSource', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var set, array, array2;
module("SC.SelectionSet#indexSetForSource", {
  setup: function() {
    set = SC.SelectionSet.create();
    array = '0 1 2 3 4 5 6 7 8 9'.w();
    array2 = 'a b c d e f g h i k l m'.w();
  }
});

test("empty selection set", function() {
  equal(set.indexSetForSource(array), null, 'should return null for source not in set');
  equal(set.indexSetForSource(array2), null, 'should return null for source not in set (2)');
});

test("selection set if index range is added", function() {
  var ret;

  set.add(array, 3,4);
  ret = set.indexSetForSource(array);
  ok(ret, 'should return an index set for the array');
  ok(ret.isEqual(SC.IndexSet.create(3,4)), 'should be index set that was added');

  set.remove(array,3,1);
  ret = set.indexSetForSource(array);
  ok(ret.isEqual(SC.IndexSet.create(4,3)), 'should return new index set when membership changes');

  set.add(array,10,1);
  ret = set.indexSetForSource(array);
  ok(ret.isEqual(SC.IndexSet.create(4,3).add(10,1)), 'should return combined index set when multiple items are added');
});

test("selection set if objects in index set are added", function() {
  var ret ;
  set.addObjects(["0", 'a']);

  ret = set.indexSetForSource(array);
  ok(ret.isEqual(SC.IndexSet.create(0,1)), 'should return index set with objects found in set interpolated');

  ret = set.indexSetForSource(array2);
  ok(ret.isEqual(SC.IndexSet.create(0,1)), 'should return index set with objects found in set interpolated (2)');

  set.removeObject("0");
  ret = set.indexSetForSource(array);
  equal(ret, null, 'should return null when matching objects are removed');

  ret = set.indexSetForSource(array2);
  ok(ret.isEqual(SC.IndexSet.create(0,1)), 'removing other objects should not effect');

});


test("selection set if objects and ranged are added", function() {
  var ret ;
  set.add(array, 4,3).addObjects(["0", 'a']);

  ret = set.indexSetForSource(array);
  ok(ret.isEqual(SC.IndexSet.create(0,1).add(4,3)), 'should return index set with objects found in set interpolated');

  ret = set.indexSetForSource(array2);
  ok(ret.isEqual(SC.IndexSet.create(0,1)), 'should return index set with objects found in set interpolated (2)');

  set.removeObject("0");
  ret = set.indexSetForSource(array);
  ok(ret.isEqual(SC.IndexSet.create(4,3)), 'should return just range when objects are removed');

  ret = set.indexSetForSource(array2);
  ok(ret.isEqual(SC.IndexSet.create(0,1)), 'removing other objects should not effect');

});


// ..........................................................
// SPECIAL CASES
//

test("add and remove source", function() {
  set.add(array, 3,4).remove(array, 3,4);
  equal(set.indexSetForSource(array), null, 'should return null for source not in set');
});

test("looking up indexSet for source when objects are added should recache when source content changes", function() {
  var obj = array.objectAt(0), ret;

  set = SC.SelectionSet.create().addObject(obj);
  ret = set.indexSetForSource(array);
  ok(ret.isEqual(SC.IndexSet.create(0)), 'should return index set with item at 0');

  array.removeObject(obj).pushObject(obj); // move obj to end.
  ret = set.indexSetForSource(array) ;
  var newSet = SC.IndexSet.create(array.indexOf(obj));
  ok(ret.isEqual(newSet), 'should return index set with item at end [expected: %@, got: %@]'.fmt(ret.inspect(), newSet.inspect()));

});

});minispade.register('sproutcore-foundation/~tests/system/selection_set/isEqual', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// TODO: Make these unit tests more complete.

var set1, set2, content;
module("SC.SelectionSet.isEqual", {
  setup: function() {
    content = '1 2 3 4 5 6 7 8 9 0'.w();
    set1 = SC.SelectionSet.create();
    set2 = SC.SelectionSet.create();
  }
});

test("set.isEqual(same instance)", function() {
  ok(set1.isEqual(set1), 'same instance should return YES');
});

test("set.isEqual(null)", function() {
  ok(!set1.isEqual(null), 'null should return NO');
});


test("set1.isEqual(set2)", function() {
  ok(set1.isEqual(set2), 'same content should return YES');
  
  set1.add(content, 4,4);
  set2.add(content, 4,4);
  ok(set1.isEqual(set2), 'same content should return YES');

  set1.remove(content, 6);
  set2.remove(content, 6);
  ok(set1.isEqual(set2), 'same content should return YES');

  set1.remove(content, 4,4);
  set2.remove(content, 4,4);
  ok(set1.isEqual(set2), 'same content should return YES');
  
});

test("multiple content objects", function() {
  var content2 = "1 2 3 4 5".w();
  set1.add(content, 4,4).add(content2, 3);
  ok(!set1.isEqual(set2), 'should not be same when set2 is empty');

  set2.add(content2, 3);
  ok(!set1.isEqual(set2), 'should not be same when set2 has only one content');

  set2.add(content,4,4);
  ok(set1.isEqual(set2), 'should not be same when set2 has both content');
  
});

test("set1.isEqual(set2) after set2 is filled and emptied", function() {
  set2.add(content,4,4).remove(content,4,4);
  ok(set1.isEqual(set2), 'same content should return YES');
});

});minispade.register('sproutcore-foundation/~tests/system/selection_set/remove', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var set, array, array2, expected, expected2 ;
module("SC.SelectionSet#remove", {
  setup: function() {
    set = SC.SelectionSet.create();
    array = '0 1 2 3 4 5 6 7 8 9'.w();
    array2 = 'a b c d e f g h i k l m'.w();

    expected = SC.IndexSet.create(4,3);
    expected2 = SC.IndexSet.create(1);
    expected.source = array;
    expected2.source = array2;
  }
});

/*
  validates that the selection set has the expected content.  pass index sets
  with sources set appropriately.  The order of the array is not important.
*/
function validate(set, expected, defaultSource) {
  var sources = set.get('sources'),
      len  = expected.length,
      idx, cur, actual ;

  equal(sources.length, expected.length, 'should have same number of sources (actual sources: %@)'.fmt(sources));

  for(idx=0;idx<len;idx++) {
    cur = expected[idx];
    if (!cur.source) cur.source =defaultSource;
    actual = set.indexSetForSource(cur.source, NO);
    ok(actual, 'should have indexSet for source: %@'.fmt(cur.source));
    equal(actual.source, cur.source, 'indexSet.source should match source');
    ok(actual.isEqual(cur), 'indexSet should match for source %@ (actual: %@ expected: %@)'.fmt(cur.source, actual, cur));
  }
}
// ..........................................................
// BASIC REMOVES
//

test("Removed indexes for single source", function() {
  set.add(array, 4, 3);
  validate(set, [SC.IndexSet.create(4,3)], array); // precondition

  set.remove(array, 4, 1);
  validate(set, [SC.IndexSet.create(5,2)], array);
});

test("Removed multiple sources", function() {

  set.add(array, 4, 3).add(array2, 1);
  validate(set, [expected, expected2]); // precondition

  set.remove(array, 4,1).remove(array2, 1);
  expected.remove(4,1);
  validate(set, [expected]); // precondition
});

test("Remove IndexSet with source", function() {
  set.add(array, 4, 3);
  validate(set, [SC.IndexSet.create(4,3)], array); // precondition

  var s = SC.IndexSet.create(4,1);
  s.source = array;
  set.remove(s);
  validate(set, [SC.IndexSet.create(5,2)], array);
});

test("Adding another SelectionSet", function() {

  set.add(array, 4, 3).add(array2, 1);
  validate(set, [expected, expected2]); // precondition

  var x = SC.SelectionSet.create().add(array, 4,1).add(array2, 1);
  set.remove(x);

  expected.remove(4,1);
  validate(set, [SC.IndexSet.create(5,2)], array);
});


// ..........................................................
// SPECIAL CASES
//

test("removing index set should also remove individually added objects", function() {
  var objToRemove = array[3]; // item from one array...
  var objToNotRemove = array2[3]; // item from array we won't remove..

  // add both objects.
  set.addObject(objToRemove).addObject(objToNotRemove);
  set.add(array, 4, 3);

  ok(set.contains(objToRemove), 'set should contain objToRemove');
  ok(set.contains(objToNotRemove), 'set should contain objToNotRemove');
  equal(set.get('length'), 5, 'set.length should == two objects + index.length');

  // now remove from array set
  set.remove(array, 2, 4);

  SC.stopIt = NO ;

  ok(!set.contains(objToRemove), 'set should NOT contain objToRemove');
  ok(set.contains(objToNotRemove), 'set should contain objToNotRemove');
  equal(set.get('length'), 2, 'set.length should == 1 object + index.length');
});


module("SC.SelectionSet#constrain", {
  setup: function() {
    set = SC.SelectionSet.create();
    array = '0 1 2 3 4 5 6 7 8 9'.w();
    array2 = 'a b c d e f g h i k l m'.w();

    expected = SC.IndexSet.create(4,3);
    expected2 = SC.IndexSet.create(1);
    expected.source = array;
    expected2.source = array2;
  }
});

/**
  After cleaning up a memory leak in SC.Set, it was discovered that the constrain
  method of SC.SelectionSet doesn't work properly.  It was naively using forEach
  to iterate through the objects while mutating the array so that the last
  object would never be constrained.

  This test shows that you can constrain more than one object using the method.
*/
test("Tests constrain helper method.", function () {
  var objToRemove1 = 'a',
    objToRemove2 = 'b';

  set.add(array, 4, 3);
  set.addObject(objToRemove1);
  set.addObject(objToRemove2);
  ok(set.contains(objToRemove1), 'Set should contain objToRemove1');
  ok(set.contains(objToRemove2), 'Set should contain objToRemove2');
  set.constrain(array);
  ok(!set.contains(objToRemove1), 'Set should not contain objToRemove1');
  ok(!set.contains(objToRemove2), 'Set should not contain objToRemove2');
});


});minispade.register('sproutcore-foundation/~tests/system/sparse_array', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// // ========================================================================
// SC.SparseArray Tests
// ========================================================================
/*globals module test ok isObj equals expects */
var objectA = 23, objectB = 12, objectC = 31, numbers, new_numbers;
module("SC.SparseArray") ;

test("new SparseArray has expected length", function() {
  var ary = SC.SparseArray.array(10000) ;
  equal(10000, ary.get('length'), "length") ;
});

test("fetching the object at index", function() {
	var ary = SC.SparseArray.array(10);
	var arr = ["I'll","be","there","4u"];
	ary = arr;
	equal(2 ,ary.indexOf('there'), "Index of 'there' is");
});

test("Update the sparse array using provideObjectAtIndex", function() {
	var ary = SC.SparseArray.array(2);
	var obj = "not";
	ary.provideObjectAtIndex(0, obj);
	equal(obj, ary._sa_content[0],"Content at 0th index");
	obj = "now";
	ary.provideObjectAtIndex(1, obj);
	equal(obj, ary._sa_content[1],"Content at 1st index");
});

test("objectAt() should get the object at the specified index",function() {
	var spArray = SC.SparseArray.array(4) ;
	var arr = [SC.Object.create({ dummy: YES }),"Sproutcore",2,true];
	spArray = arr;
	equal(4,spArray.length,'the length');
	equal(arr[0],spArray.objectAt(0),'first object');
	equal(arr[1],spArray.objectAt(1),'second object');
	equal(arr[2],spArray.objectAt(2),'third object');
	equal(arr[3],spArray.objectAt(3),'fourth object');
});

test("objectAt() beyond the length should return undefined and not attempt to retrieve the index.", function () {
  var delegateObject = {
        count: 0,

        sparseArrayDidRequestIndex: function(sparseArray, idx) {
          this.count++;
          sparseArray.provideObjectAtIndex(idx, "foo");
        }

      },
    sparseArray = SC.SparseArray.create({
      delegate: delegateObject
    });

  equal(sparseArray.objectAt(0), undefined, "There should not be an item beyond the length of the sparse array.");
  equal(delegateObject.count, 0, "The index beyond the length should not be requested on the delegate.");

  // Update the length. count goes up one because arrayContentDidChange checks objectAt on the last index in order
  // to update lastObject property
  sparseArray.provideLength(100);
  equal(sparseArray.objectAt(0), 'foo', "There should be an item within the length of the sparse array.");
  equal(delegateObject.count, 2, "The index within the length should be requested on the delegate.");

  equal(sparseArray.objectAt(100), undefined, "There should not be an item beyond the length of the sparse array.");
  equal(delegateObject.count, 2, "The index beyond the length should not be requested on the delegate.");
});

module("SC.SparseArray.replace",{
	setup: function() {
		// create objects...
		numbers= [1,2,3] ;
		new_numbers = [4,5,6];
	}
});

test("element to be added is at idx > length of array ", function() {
	var ary = SC.SparseArray.array(5) ;
	equal(5, ary.get('length'), "length") ;
	ary = numbers;
	ary.replace(7,3,new_numbers,"put the new number at idx>len ");
	equal(6, ary.get('length'), "length") ;
});

test("element to be added is such that amt + idx > length of array ", function() {
	var ary = SC.SparseArray.array(5) ;
	equal(5, ary.get('length'), "length") ;
	ary = numbers;
	ary.replace(4,3,new_numbers,"put the new number at idx < len ");
	equal(6, ary.get('length'), "length") ;
});

test("element to be added is at idx < length of array ", function() {
	var ary = SC.SparseArray.array(5) ;
	equal(5, ary.get('length'), "length") ;
	ary = numbers;
	ary.replace(2,3,new_numbers,"put the new number overlapping existing numbers ");
	equal(5, ary.get('length'), "length") ;
});

// test("should work with @each dependent keys");
// Reduced this test to a warning, because we are not going to support using
// @each with SC.SparseArray at this time.  It likely doesn't work as an observer
// and certainly not as a property chain.
// There is some code that will support this, but it would need to be refactored
// to avoid loading every item in the sparse array in order to add observers
// to them.
// Checkout the team/publickeating/enumerable-property-chains-support branch for the relevant code.

// , function() {
//   var array = SC.SparseArray.create();

//   array.pushObject(SC.Object.create({
//     value: 5
//   }));
//   array.provideLength(1);

//   var obj = SC.Object.create({
//     total: function() {
//       return this.get('content').reduce(function(prev, item) {
//         return prev + item.get('value');
//       }, 0);
//     }.property('content.@each.value').cacheable(),

//     content: array
//   });

//   equal(obj.get('total'), 5, "precond - computes total of all objects");

//   array.pushObject(SC.Object.create({
//     value: 10
//   }));

//   equal(obj.get('total'), 15, "recomputes when a new object is added");

//   array.objectAt(1).set('value', 15);

//   equal(obj.get('total'), 20, "recomputes when value property on child object changes");

// });


test("modifying a range should not require the rest of the array to refetch", function() {
  var del = {
    cnt: 0,

    sparseArrayDidRequestIndex: function(sparseArray, idx) {
      this.cnt++;
      sparseArray.provideObjectAtIndex(idx, "foo");
    },

    sparseArrayDidRequestLength: function(sparseArray) {
      sparseArray.provideLength(100);
    },

    // make editable
    sparseArrayShouldReplace: function() { return YES; }

  };

  var ary = SC.SparseArray.create({
    delegate: del
  });

  equal(ary.objectAt(10), 'foo', 'precond - should provide foo');
  equal(del.cnt, 1, 'precond - should invoke sparseArrayDidRequestIndex() one time');

  del.cnt = 0;

  ary.removeAt(5); // delete an item before 10
  equal(ary.objectAt(9), 'foo', 'should provide foo at index after delete');
  equal(del.cnt, 0, 'should NOT invoke sparseArrayRequestIndex() since it was provided already');
});

test("Check that requestIndex works with a rangeWindowSize larger than 1", function() {
	var ary = SC.SparseArray.array(10) ;
	var didRequestRange=NO;

	var DummyDelegate = SC.Object.extend({
    content: [], // source array

    sparseArrayDidRequestLength: function(sparseArray) {
      sparseArray.provideLength(this.content.length);
    },

    sparseArrayDidRequestIndex: function(sparseArray, index) {
      sparseArray.provideObjectAtIndex(index, this.content[index]);
    },

    sparseArrayDidRequestIndexOf: function(sparseArray, object) {
      return this.content.indexOf(object);
    },

    sparseArrayShouldReplace: function(sparseArray, idx, amt, objects) {
      this.content.replace(idx, amt, objects) ; // keep internal up-to-date
      return YES ; // allow anything
    },
    sparseArrayDidRequestRange: function(sparseArray, range) {
       didRequestRange=YES;
     }

  });
  ary.set('delegate', DummyDelegate.create());
	ary.set('rangeWindowSize', 4);
	equal(10, ary.get('length'), "length") ;
	ary.objectAt(7);
	equal(didRequestRange, YES, "The range was requested") ;
});


// ..........................................................
// definedIndexes
//

test("definedIndexes", function() {
  var ary = SC.SparseArray.array(10);
  ary.provideObjectAtIndex(5, "foo");

  var expected = SC.IndexSet.create().add(5);
  ok(ary.definedIndexes().isEqual(expected), 'definedIndexes() should return all defined indexes');

  ok(ary.definedIndexes(SC.IndexSet.create().add(2, 10)).isEqual(expected), 'definedIndexes([2..11]) should return indexes within');

  ok(ary.definedIndexes(SC.IndexSet.create().add(2)).isEqual(SC.IndexSet.EMPTY), 'definedIndexes([2]) should return empty set (since does not overlap with defined index)');

});

// ..........................................................
// TEST SC.ARRAY COMPLIANCE
//

var DummyDelegate = SC.Object.extend({
  content: [], // source array

  sparseArrayDidRequestLength: function(sparseArray) {
    sparseArray.provideLength(this.content.length);
  },

  sparseArrayDidRequestIndex: function(sparseArray, index) {
    sparseArray.provideObjectAtIndex(index, this.content[index]);
  },

  sparseArrayDidRequestIndexOf: function(sparseArray, object) {
    return this.content.indexOf(object);
  },

  sparseArrayShouldReplace: function(sparseArray, idx, amt, objects) {
    this.content.replace(idx, amt, objects) ; // keep internal up-to-date
    return YES ; // allow anything
  }

});

// SC.ArraySuite.generate("SC.SparseArray", {
//   newObject: function(amt) {
//     if (amt === undefined || typeof amt === SC.T_NUMBER) {
//       amt = this.expected(amt);
//     }
//
//     var del = DummyDelegate.create({ content: amt });
//     return SC.SparseArray.create({ delegate: del });
//   }
// });

test("should notify enumerable property", function() {
    var arr = SC.SparseArray.create();
    var count = 0;
    function counter() {
        count++;
    }

    arr.provideLength(1);
    arr.addObserver('[]', this, counter);
    arr.provideObjectAtIndex(0, 'one');
    equal(count, 1, "observer should have fired once");
});

test("test updating SparseArray length via delegate", function() {
    var delegate = SC.Object.create({
        arrlen: null,
        sparseArrayDidRequestLength: function(arr) {
            arr.provideLength(this.arrlen);
        }
    });

    var arr = SC.SparseArray.create({delegate: delegate});
    delegate.arrlen = 5;
    equal(arr.get('length'), 5)
    arr.provideLength(null);
    delegate.arrlen = 50;
    equal(arr.get('length'), 50)
});

test("test updating SparseArray length explictly", function() {
    var arr = SC.SparseArray.create();
    arr.provideLength(5);
    equal(arr.get('length'), 5)
    arr.provideLength(50);
    equal(arr.get('length'), 50)
});


});minispade.register('sproutcore-foundation/~tests/system/utils/normalizeURL', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ========================================================================
// SC.normalizeURL Tests
// ========================================================================

var url,url1,url2;

module("SC.normalizeURL");

test("should normalize the url passed as the parameter",function(){
 url = '/desktop/mydocuments/music';
 equal(SC.normalizeURL(url), 'http://'+window.location.host+'/desktop/mydocuments/music','Path with slash');
 
 url1 = 'desktop/mydocuments/music';
 equal(SC.normalizeURL(url1), '%@/desktop/mydocuments/music'.fmt(window.location.href),'Path without slash');  

 url2 = 'http:';
 equal(YES,SC.normalizeURL(url2) === url2,'Path with http:');	
});
});minispade.register('sproutcore-foundation/~tests/system/utils/rect', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ========================================================================
// Rect utility Tests
// ========================================================================


module("Rect utilities");

test("Get the X & Y points of a rect", function() {
  var frame = { x: 50, y: 40, width: 700, height: 9000 };
  expect(6);
  equal(SC.minX(frame),50,'Left edge');
  equal(SC.maxX(frame),750,'Right edge');
  equal(SC.midX(frame),400,'Horizontal midpoint');
  
  equal(SC.minY(frame),40, 'Top edge');
  equal(SC.maxY(frame),9040,'Bottom edge');
  equal(SC.midY(frame),4540,'Vertical midpoint');
});

test("Treat empty object as frame with 0 width and height", function() {
  var frame = { };
  expect(6);
  equal(SC.minX(frame),0,'Left edge');
  equal(SC.maxX(frame),0,'Right edge');
  equal(SC.midX(frame),0,'Horizontal midpoint');
  
  equal(SC.minY(frame),0,'Top edge');
  equal(SC.maxY(frame),0,'Bottom edge');
  equal(SC.midY(frame),0,'Vertical midpoint');
});

test("pointInRect() to test if a given point is inside the rect", function(){
  var frame = { x: 50, y: 40, width: 700, height: 9000 };
  
  ok(SC.pointInRect({ x: 100, y: 100 }, frame), "Point in rect");
  equal(NO, SC.pointInRect({ x: 40, y: 100 }, frame), "Point out of rect horizontally");
  equal(NO, SC.pointInRect({ x: 600, y: 9100 }, frame), "Point out of rect vertically");
  equal(NO, SC.pointInRect({ x: 0, y: 0 }, frame), "Point up and left from rect");
  equal(NO, SC.pointInRect({ x: 800, y: 9500 }, frame), "Point down and right from rect");
});

test("rectsEqual() tests equality with default delta", function() {
  var frame = { x: 50, y: 50, width: 100, height: 100 };
  
  equal(SC.rectsEqual(frame, frame), YES, "Frames are same object");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100 }), YES, "Frames have same position and dimensions");
  equal(SC.rectsEqual(frame, { x: 50.08, y: 50, width: 100, height: 100 }), YES, "Frame.x above, within delta");
  equal(SC.rectsEqual(frame, { x: 49.92, y: 50, width: 100, height: 100 }), YES, "Frame.x below, within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50.099, width: 100, height: 100 }), YES, "Frame.y within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100.001, height: 100 }), YES, "Frame.width within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100.09999 }), YES, "Frame.height within delta");
  equal(SC.rectsEqual(frame, { x: 55, y: 50, width: 100, height: 100 }), NO, "Frame.x not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 55, width: 100, height: 100 }), NO, "Frame.y not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 105, height: 100 }), NO, "Frame.width not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 105 }), NO, "Frame.height not equal");
});

test("rectsEqual() tests equality with null delta", function() {
  var frame = { x: 50, y: 50, width: 100, height: 100 };
  
  equal(SC.rectsEqual(frame, frame), YES, "Frames are same object");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100 }, null), YES, "Frames have same position and dimensions");
  equal(SC.rectsEqual(frame, { x: 50.08, y: 50, width: 100, height: 100 }, null), YES, "Frame.x above, within delta");
  equal(SC.rectsEqual(frame, { x: 49.92, y: 50, width: 100, height: 100 }, null), YES, "Frame.x below, within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50.099, width: 100, height: 100 }, null), YES, "Frame.y within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100.001, height: 100 }, null), YES, "Frame.width within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100.01 }, null), YES, "Frame.height within delta");
  equal(SC.rectsEqual(frame, { x: 55, y: 50, width: 100, height: 100 }, null), NO, "Frame.x not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 55, width: 100, height: 100 }, null), NO, "Frame.y not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 105, height: 100 }, null), NO, "Frame.width not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 105 }, null), NO, "Frame.height not equal");
});

test("rectsEqual() tests equality with delta of 10", function() {
  var frame = { x: 50, y: 50, width: 100, height: 100 };
  
  equal(SC.rectsEqual(frame, frame), YES, "Frames are same object");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100 }, 10), YES, "Frames have same position and dimensions");
  equal(SC.rectsEqual(frame, { x: 59.99, y: 50, width: 100, height: 100 }, 10), YES, "Frame.x above, within delta");
  equal(SC.rectsEqual(frame, { x: 41, y: 50, width: 100, height: 100 }, 10), YES, "Frame.x below, within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 59, width: 100, height: 100 }, 10), YES, "Frame.y within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 109, height: 100 }, 10), YES, "Frame.width within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100.000002 }, 10), YES, "Frame.height within delta");
  equal(SC.rectsEqual(frame, { x: 61, y: 50, width: 100, height: 100 }, 10), NO, "Frame.x not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 92, width: 100, height: 100 }, 10), NO, "Frame.y not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 89, height: 100 }, 10), NO, "Frame.width not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 89.99999 }, 10), NO, "Frame.height not equal");
});

test("rectsEqual() tests equality with delta of 0", function() {
  var frame = { x: 50, y: 50, width: 100, height: 100 };
  
  equal(SC.rectsEqual(frame, frame), YES, "Frames are same object");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100 }, 0), YES, "Frames have same position and dimensions");
  equal(SC.rectsEqual(frame, { x: 50.0001, y: 50, width: 100, height: 100 }, 0), NO, "Frame.x not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 51, width: 100, height: 100 }, 0), NO, "Frame.y not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 99, height: 100 }, 0), NO, "Frame.width not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 102 }, 0), NO, "Frame.height not equal");
});
});minispade.register('sproutcore-runtime/~tests/system/index_set/add', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same should_throw*/
var set ;
module("SC.IndexSet#add", {
  setup: function() {
    set = SC.IndexSet.create();
  }
});

function iter(s) {
  var ret = [];
  set.forEach(function(k) { ret.push(k); });
  return ret ;
}

// ..........................................................
// BASIC ADDS
//

test("add range to end of set", function() {
  set.add(1000,5);
  equal(set.get('length'), 5, 'should have correct index count');
  equal(set.get('max'), 1005, 'max should return 1 past last index');
  deepEqual(iter(set), [1000,1001,1002,1003,1004]);
});

test("add range into middle of empty range", function() {
  set.add(100,2); // add initial set.
  equal(iter(set)[0], 100, 'precond - first index is 100');

  // now add second range
  set.add(10,1);
  equal(set.get('length'), 3, 'should have extra length');
  equal(set.get('max'), 102, 'max should return 1 past last index');
  deepEqual(iter(set), [10, 100, 101]);
});

test("add range overlapping front edge of range", function() {
  set.add(100,2); // add initial set.
  equal(iter(set)[0], 100, 'precond - first index is 100');

  // now add second range
  set.add(99,2);
  equal(set.get('length'), 3, 'should have extra length');
  equal(set.get('max'), 102, 'max should return 1 past last index');
  deepEqual(iter(set), [99, 100, 101]);
});

test("add range overlapping last edge of range", function() {
  set.add(100,2).add(200,2);
  deepEqual(iter(set), [100,101,200,201], 'should have two sets');

  // now add overlapping range
  set.add(101,2);
  equal(set.get('length'), 5, 'new set.length');
  equal(set.get('max'), 202, 'max should return 1 past last index');
  deepEqual(iter(set), [100,101,102,200,201], 'should include 101-102');
});

test("add range overlapping two ranges, merging into one", function() {
  set.add(100,2).add(110,2);
  deepEqual(iter(set), [100,101,110,111], 'should have two sets');

  // now add overlapping range
  set.add(101,10);
  equal(set.get('length'), 12, 'new set.length');
  equal(set.get('max'), 112, 'max should return 1 past last index');
  deepEqual(iter(set), [100,101,102,103,104,105,106,107,108,109,110,111], 'should include one range 100-111');
});

test("add range overlapping three ranges, merging into one", function() {
  set.add(100,2).add(105,2).add(110,2);
  deepEqual(iter(set), [100,101,105,106,110,111], 'should have two sets');

  // now add overlapping range
  set.add(101,10);
  equal(set.get('length'), 12, 'new set.length');
  equal(set.get('max'), 112, 'max should return 1 past last index');
  deepEqual(iter(set), [100,101,102,103,104,105,106,107,108,109,110,111], 'should include one range 100-111');
});

test("add range partially overlapping one range and replacing another range, merging into one", function() {
  set.add(100,2).add(105,2);
  deepEqual(iter(set), [100,101,105,106], 'should have two sets');

  // now add overlapping range
  set.add(101,10);
  equal(set.get('length'), 11, 'new set.length');

  equal(set.get('max'), 111, 'max should return 1 past last index');
  deepEqual(iter(set), [100,101,102,103,104,105,106,107,108,109,110], 'should include one range 100-110');
});

test("add range overlapping last index", function() {
  set.add(100,2); // add initial set.
  equal(iter(set)[0], 100, 'precond - first index is 100');

  // now add second range
  set.add(101,2);
  equal(set.get('length'), 3, 'should have extra length');
  equal(set.get('max'), 103, 'max should return 1 past last index');
  deepEqual(iter(set), [100, 101, 102]);
});

test("add range matching existing range", function() {
  set.add(100,5); // add initial set.
  equal(iter(set)[0], 100, 'precond - first index is 100');

  // now add second range
  set.add(100,5);
  equal(set.get('length'), 5, 'should not change');
  equal(set.get('max'), 105, 'max should return 1 past last index');
  deepEqual(iter(set), [100, 101, 102, 103, 104]);
});

// ..........................................................
// NORMALIZED PARAMETER CASES
//

test("add with no params should do nothing", function() {
  set.add();
  deepEqual(iter(set), []);
});

test("add with single number should add index only", function() {
  set.add(2);
  deepEqual(iter(set), [2]);
});

test("add with range object should add range only", function() {
  set.add({ start: 2, length: 2 });
  deepEqual(iter(set), [2,3]);
});

test("add with index set should add indexes in set", function() {
  set.add(SC.IndexSet.create().add(2,2).add(10,2));
  deepEqual(iter(set), [2,3,10,11]);
});

// ..........................................................
// OTHER BEHAVIORS
//

test("adding a range should trigger an observer notification", function() {
  var callCnt = 0;
  set.addObserver('[]', function() { callCnt++; });
  set.add(10,10);
  equal(callCnt, 1, 'should have called observer once');
});

test("adding a range over an existing range should not trigger an observer notification", function() {
  var callCnt = 0;
  set.add(10,10);
  set.addObserver('[]', function() { callCnt++; });
  set.add(15,5);
  equal(callCnt, 0, 'should not have called observer');
});

test("appending a range to end should merge into last range", function() {
  set = SC.IndexSet.create(2).add(3);
  equal(set.rangeStartForIndex(3), 2, 'last two range should merge together (%@)'.fmt(set.inspect()));
  equal(set.get('max'), 4, 'should have max');
  equal(set.get('length'), 2, 'should have length');

  set = SC.IndexSet.create(2000, 1000).add(3000, 1000);
  equal(set.rangeStartForIndex(3990), 2000, 'last two range should merge together (%@)'.fmt(set.inspect()));
  equal(set.get('max'), 4000, 'should have max');
  equal(set.get('length'), 2000, 'should have length');

});

test("appending range to start of empty set should create a single range", function() {
  set = SC.IndexSet.create().add(0,2);
  equal(set.rangeStartForIndex(1), 0, 'should have single range (%@)'.fmt(set.inspect()));
  equal(set.get('length'), 2, 'should have length');
  equal(set.get('max'), 2, 'should have max');

  set = SC.IndexSet.create().add(0,2000);
  equal(set.rangeStartForIndex(1998), 0, 'should have single range (%@)'.fmt(set.inspect()));
  equal(set.get('length'), 2000, 'should have length');
  equal(set.get('max'), 2000, 'should have max');

});

test("add raises exception when frozen", function() {
  throws(function() {
    set.freeze().add(0,2);
  }, SC.FROZEN_ERROR);
});

// ..........................................................
// SPECIAL CASES
//
// demonstrate fixes for specific bugs here.

test("adding in the same range should keep length consistent", function() {
  set = SC.IndexSet.create();
  set.add(1,4);
  equal(set.length, 4, 'set length should be 4');

  set.add(1,3); // should be like a no-op
  equal(set.length, 4, 'set length should remain 4 after set.add(1,3)');

  set.add(1,2); // should be like a no-op
  equal(set.length, 4, 'set length should remain 4 after set.add(1,2)');

});

});minispade.register('sproutcore-runtime/~tests/system/index_set/addEach', function() {// // ==========================================================================
// // Project:   SproutCore - JavaScript Application Framework
// // Copyright: ©2006-2011 Apple Inc. and contributors.
// // License:   Licensed under MIT license (see license.js)
// // ==========================================================================
//
// /*global module test equals context ok same */
var set ;
module("SC.IndexSet#addEach", {
  setup: function() {
    set = SC.IndexSet.create();
  }
});

function iter(s) {
  var ret = [];
  set.forEach(function(k) { ret.push(k); });
  return ret ;
}

// ..........................................................
// BASIC ADDS
//

test("adding should iterate over an array", function() {
  set.addEach([1000, 1010, 1020, 1030]);
  equal(set.get('length'), 4, 'should have correct index count');
  equal(set.get('max'), 1031, 'max should return 1 past last index');
  deepEqual(iter(set), [1000, 1010, 1020, 1030]);
});//
//
test("adding should iterate over a set", function() {
  // add out of order...
  var input = SC.Set.create().add(1030).add(1010).add(1020).add(1000);
  set.addEach(input);
  equal(set.get('length'), 4, 'should have correct index count');
  equal(set.get('max'), 1031, 'max should return 1 past last index');
  deepEqual(iter(set), [1000, 1010, 1020, 1030]);
});


test("adding should iterate over a indexset", function() {
  // add out of order...
  var input = SC.IndexSet.create().add(1000,2).add(1010).add(1020).add(1030);
  set.addEach(input);
  equal(set.get('length'), 5, 'should have correct index count');
  equal(set.get('max'), 1031, 'max should return 1 past last index');
  deepEqual(iter(set), [1000, 1001, 1010, 1020, 1030]);
});

});minispade.register('sproutcore-runtime/~tests/system/index_set/clone', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest */
var set ;
module("SC.IndexSet#clone", {
  setup: function() {
    set = SC.IndexSet.create();
  }
});

test("clone should return new object with same key properties", function() {
  set.add(100,100).add(200,100);
  set.source = "foo";
  
  var set2 = set.clone();
  ok(set2 !== null, 'return value should not be null');
  ok(set2 !== set, 'cloned set should not be same instance as set');
  ok(set.isEqual(set2), 'set.isEqual(set2) should be true');
  
  equal(set2.get('length'), set.get('length'), 'clone should have same length');
  equal(set2.get('min'), set.get('min'), 'clone should have same min');
  equal(set2.get('max'), set.get('max'), 'clone should have same max');
  equal(set2.get('source'), set.get('source'), 'clone should have same source');

});

test("cloning frozen object returns unfrozen", function() {
  var set2 = set.freeze().clone();
  equal(set2.get('isFrozen'), NO, 'set2.isFrozen should be NO');
});

test("copy works like clone", function() {
  deepEqual(set.copy(), set, 'should return copy');
  ok(set.copy() !== set, 'should not return same instance');
  
  set.freeze();
  equal(set.frozenCopy(), set, 'should return same instance when frozen');
});


});minispade.register('sproutcore-runtime/~tests/system/index_set/contains', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest */

var set ;
module("SC.IndexSet#contains", {
  setup: function() {
    set = SC.IndexSet.create().add(1000, 10).add(2000,1);
  }
});

// ..........................................................
// SINGLE INDEX
// 

test("handle index in set", function() {
  equal(set.contains(1001), YES, 'index 1001 should be in set %@'.fmt(set));
  equal(set.contains(1009), YES, 'index 1009 should be in set %@'.fmt(set));
  equal(set.contains(2000), YES, 'index 2000 should be in set %@'.fmt(set));
});

test("handle index not in set", function() {
  equal(set.contains(0), NO, 'index 0 should not be in set');
  equal(set.contains(10), NO, 'index 10 should not be in set');
  equal(set.contains(1100), NO, 'index 1100 should not be in set');
});

test("handle index past end of set", function() {
  equal(set.contains(3000), NO, 'index 3000 should not be in set');
});

// ..........................................................
// RANGE
// 

test("handle range inside set", function() {
  equal(set.contains(1001,4), YES, '1001..1003 should be in set');
});

test("handle range outside of set", function() {
  equal(set.contains(100,4), NO, '100..1003 should NOT be in set');
});

test("handle range partially inside set", function() {
  equal(set.contains(998,4), NO,'998..1001 should be in set');
});

// ..........................................................
// INDEX SET
// 

test("handle set inside IndexSet", function() {
  var test = SC.IndexSet.create().add(1001,4).add(1005,2);
  equal(set.contains(test), YES, '%@ should be in %@'.fmt(test, set));
});

test("handle range outside of IndexSet", function() {
  var test = SC.IndexSet.create().add(100,4).add(105,2);
  equal(set.contains(test), NO, '%@ should be in %@'.fmt(test, set));
});

test("handle range partially inside IndexSet", function() {
  var test = SC.IndexSet.create().add(1001,4).add(100,2);
  equal(set.contains(test), NO, '%@ should be in %@'.fmt(test, set));
});

test("handle self", function() {
  equal(set.contains(set), YES, 'should return YES when passed itself');  
});


});minispade.register('sproutcore-runtime/~tests/system/index_set/create', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest */

module("SC.IndexSet#create");

test("create with no params", function() {
  var set = SC.IndexSet.create();
  equal(set.get('length'), 0, 'should have no indexes');
});

test("create with just index", function() {
  var set = SC.IndexSet.create(4);
  equal(set.get('length'),1, 'should have 1 index');
  equal(set.contains(4), YES, 'should contain index');
  equal(set.contains(5), NO, 'should not contain 5');
});

test("create with index and length", function() {
  var set = SC.IndexSet.create(4, 2);
  equal(set.get('length'),2, 'should have 2 indexes');
  equal(set.contains(4), YES, 'should contain 4');
  equal(set.contains(5), YES, 'should contain 5');
});

test("create with other set", function() {
  var first = SC.IndexSet.create(4,2);

  var set = SC.IndexSet.create(first);
  equal(set.get('length'),2, 'should have same number of indexes (2)');
  equal(set.contains(4), YES, 'should contain 4, just like first');
  equal(set.contains(5), YES, 'should contain 5, just like first');
});






});minispade.register('sproutcore-runtime/~tests/system/index_set/indexAfter', function() {// ==========================================================================
// Project:   SproutCore Costello - Property Observing Library
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var set ;

module("SC.IndexSet.indexAfter", {
  setup: function() {
    set = SC.IndexSet.create(5).add(10,5).add(100);
  }
});

test("no earlier index in set", function(){ 
  equal(set.indexAfter(3), 5, 'set.indexAfter(3) in %@ should start of first index range'.fmt(set));
});

test("with index after end of set", function() {
  equal(set.indexAfter(1000), -1, 'set.indexAfter(1000) in %@ should return -1'.fmt(set));
});

test("inside of multi-index range", function() {
  equal(set.indexAfter(12), 13, 'set.indexAfter(12) in %@ should return next index'.fmt(set));
});

test("end of multi-index range", function() {
  equal(set.indexAfter(14), 100, 'set.indexAfter(14) in %@ should start of next range'.fmt(set));
});


test("single index range", function() {
  equal(set.indexAfter(5), 10, 'set.indexAfter(5) in %@ should start of next range multi-index range'.fmt(set));
});




});minispade.register('sproutcore-runtime/~tests/system/index_set/indexBefore', function() {// ==========================================================================
// Project:   SproutCore Costello - Property Observing Library
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var set ;

module("SC.IndexSet.indexBefore", {
  setup: function() {
    set = SC.IndexSet.create(5).add(10,5).add(100);
  }
});

test("no earlier index in set", function(){ 
  equal(set.indexBefore(4), -1, 'set.indexBefore(4) in %@ should not have index before it'.fmt(set));
});

test("with index after end of set", function() {
  equal(set.indexBefore(1000), 100, 'set.indexBefore(1000) in %@ should return last index in set'.fmt(set));
});

test("inside of multi-index range", function() {
  equal(set.indexBefore(12), 11, 'set.indexBefore(12) in %@ should return previous index'.fmt(set));
});

test("beginning of multi-index range", function() {
  equal(set.indexBefore(10), 5, 'set.indexBefore(10) in %@ should end of previous range'.fmt(set));
});


test("single index range", function() {
  equal(set.indexBefore(100), 14, 'set.indexBefore(100) in %@ should end of previous range multi-index range'.fmt(set));
});




});minispade.register('sproutcore-runtime/~tests/system/index_set/infinite', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module test equals ok */


var set;

module("SC.IndexSet Infinite Ranges", {
  setup: function () {
    set = SC.IndexSet.create();
  }
});


test("Able to add an infinite range.", function () {
  set.add(100, Infinity);

  equal(set.get('length'), Infinity, 'The length should be');
  equal(set.get('max'), Infinity, 'The max index should be');
});

test("The infinite range contains all indexes.", function () {
  set.add(100, 2000);
  set.add(5000, Infinity);

  ok(!set.contains(99), "The set does not contain 99.");
  ok(set.contains(100), "The set does contain 100.");
  ok(set.contains(2099), "The set does contain 2099.");
  ok(!set.contains(4999), "The set does not contain 4999.");
  ok(set.contains(5000), "The set does contain 5000.");
  ok(set.contains(99999999999), "The set does contain 99999999999.");
  ok(set.contains(Number.MAX_VALUE), "The set does contain Number.MAX_VALUE.");
  ok(set.contains(Infinity), "The set does contain Infinity.");
});

test("Able to remove an infinite range.", function () {
  set.add(100, Infinity);
  set.remove(1000, Infinity);

  ok(set.contains(900), "The set does contain 900.");
  ok(!set.contains(1000), "The set does not contain 1000.");
  ok(!set.contains(Infinity), "The set does not contain Infinity.");
});

test("Attempting to iterate over an infinite range throws an exception.", function () {
  set.add(0, Infinity);

  try {
    set.forEach(function () { });
  } catch (ex) {
    ok(true, 'forEach threw an exception.');
  }
});

test("Able to add an infinite range over an existing range.", function () {
  set.add(100, 2); // add initial set.
  equal(set.get('firstObject'), 100, 'The first index is');
  equal(set.get('length'), 2, 'The length should be');
  equal(set.get('max'), 102, 'The max index should be');

  set.add(50, Infinity);
  equal(set.get('firstObject'), 50, 'The first index is now');
  equal(set.get('length'), Infinity, 'The length should now be');
  equal(set.get('max'), Infinity, 'The max index should now be');
});

test("Infinite ranges may be equal.", function () {
  var secondSet = SC.IndexSet.create();

  set.add(50, Infinity);
  secondSet.add(50, Infinity);
  ok(set.isEqual(secondSet), 'The two infinite sets are equal.');

  secondSet.add(10, 10);
  ok(!set.isEqual(secondSet), 'The two infinite sets are no longer equal.');
});

test("The range start for the infinite range is correct.", function () {
  set.add(100, 2000);

  equal(set.rangeStartForIndex(1234), 100, "The range for 1234 starts at");
  equal(set.rangeStartForIndex(2234), 2100, "The range for 2234 starts at");
  equal(set.rangeStartForIndex(99999999999), 2100, "The range for 99999999999 starts at");
  equal(set.rangeStartForIndex(Number.MAX_VALUE), 2100, "The range for Number.MAX_VALUE starts at");
  equal(set.rangeStartForIndex(Infinity), 2100, "The range for Infinity starts at");

  set.add(5000, Infinity);

  equal(set.rangeStartForIndex(1234), 100, "The range for 1234 starts at");
  equal(set.rangeStartForIndex(2234), 2100, "The range for 2234 starts at");
  equal(set.rangeStartForIndex(99999999999), 5000, "The range for 99999999999 starts at");
  equal(set.rangeStartForIndex(Number.MAX_VALUE), 5000, "The range for Number.MAX_VALUE starts at");
  equal(set.rangeStartForIndex(Infinity), Infinity, "The range for Infinity starts at");
});

test("The indexBefore for the infinite range is correct.", function () {
  set.add(10, 10);

  equal(set.indexBefore(100), 19, "The indexBefore 100 is");
  equal(set.indexBefore(Infinity), 19, "The indexBefore Infinity is");

  set.add(50, Infinity);

  equal(set.indexBefore(100), 99, "The indexBefore 100 is");
  equal(set.indexBefore(Infinity), Infinity, "The indexBefore Infinity is");
});

test("The indexAfter for the infinite range is correct.", function () {
  set.add(10, 1000);

  equal(set.indexAfter(100), 101, "The indexAfter 100 is");
  equal(set.indexAfter(2000), -1, "The indexAfter 2000 is");
  equal(set.indexAfter(Infinity), -1, "The indexAfter Infinity is");

  set.add(5000, Infinity);

  equal(set.indexAfter(100), 101, "The indexAfter 100 is");
  equal(set.indexAfter(2000), 5000, "The indexAfter 2000 is");
  equal(set.indexAfter(Infinity), -1, "The indexAfter Infinity is");
});

test("The infinite range intersects all indexes.", function () {
  set.add(100, 2000);
  set.add(5000, Infinity);

  ok(!set.intersects(0, 99), "The set does not intersect 0 - 99.");
  ok(set.intersects(99, 2), "The set does intersect 99 - 101.");
  ok(!set.intersects(2100, 99), "The set does not intersect 2100 - 2199.");
  ok(set.intersects(4999, 2), "The set does intersect 4999 - 5001.");
  ok(set.intersects(99999999999, 900000000000), "The set does intersect 99999999999 - 999999999999.");
  ok(set.intersects(0, Number.MAX_VALUE), "The set does intersect 0 - Number.MAX_VALUE.");
  ok(set.intersects(0, Infinity), "The set does intersect 0 - Infinity.");
});

test("The infinite range works with without().", function () {
  set.add(100, 2000);
  set.add(5000, Infinity);

  set = set.without(10000, 1000);

  ok(set.contains(9999), "The set does contain 9999.");
  ok(!set.contains(10000), "The set does not contain 10000.");
  ok(set.contains(11000), "The set does contain 11000.");

  set = set.without(99999, 900000);

  ok(set.contains(99998), "The set does contain 99998.");
  ok(!set.contains(99999), "The set does not contain 99999.");
  ok(set.contains(10000000), "The set does contain 10000000.");

  // Hinting makes this too slow to use.
  // set = set.without(0, Number.MAX_VALUE);
  //
  // ok(!set.contains(Number.MAX_VALUE), "The set does not contain Number.MAX_VALUE.");
  // ok(set.contains(Infinity), "The set does contain Infinity.");

  set = set.without(0, Infinity);

  ok(!set.contains(Number.MAX_VALUE), "The set does not contain Number.MAX_VALUE.");
  ok(!set.contains(Infinity), "The set does not contain Infinity.");
});

test("The infinite range works with replace().", function () {
  set.add(100, 2000);
  set.add(5000, Infinity);

  set = set.replace(10000, 1000);

  ok(!set.contains(9999), "The set does not contain 9999.");
  ok(set.contains(10000), "The set does contain 10000.");
  ok(!set.contains(11000), "The set does not contain 11000.");
  ok(!set.contains(Infinity), "The set does not contain Infinity.");

  set = set.replace(10000, Infinity);

  ok(!set.contains(9999), "The set does not contain 9999.");
  ok(set.contains(10000), "The set does contain 10000.");
  ok(set.contains(Number.MAX_VALUE), "The set does contain Number.MAX_VALUE.");
  ok(set.contains(Infinity), "The set does contain Infinity.");
});


});minispade.register('sproutcore-runtime/~tests/system/index_set/intersects', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest */

var set ;
module("SC.IndexSet#intersects", {
  setup: function() {
    set = SC.IndexSet.create().add(1000, 10).add(2000,1);
  }
});

// ..........................................................
// SINGLE INDEX
// 

test("handle index in set", function() {
  equal(set.intersects(1001), YES, 'index 1001 should be in set %@'.fmt(set));
  equal(set.intersects(1009), YES, 'index 1009 should be in set %@'.fmt(set));
  equal(set.intersects(2000), YES, 'index 2000 should be in set %@'.fmt(set));
});

test("handle index not in set", function() {
  equal(set.intersects(0), NO, 'index 0 should not be in set');
  equal(set.intersects(10), NO, 'index 10 should not be in set');
  equal(set.intersects(1100), NO, 'index 1100 should not be in set');
});

test("handle index past end of set", function() {
  equal(set.intersects(3000), NO, 'index 3000 should not be in set');
});

// ..........................................................
// RANGE
// 

test("handle range inside set", function() {
  equal(set.intersects(1001,4), YES, '1001..1003 should be in set');
});

test("handle range outside of set", function() {
  equal(set.intersects(100,4), NO, '100..1003 should NOT be in set');
});

test("handle range partially inside set", function() {
  equal(set.intersects(998,4), YES,'998..1001 should be in set');
});

// ..........................................................
// INDEX SET
// 

test("handle set inside IndexSet", function() {
  var test = SC.IndexSet.create().add(1001,4).add(1005,2);
  equal(set.intersects(test), YES, '%@ should be in %@'.fmt(test, set));
});

test("handle range outside of IndexSet", function() {
  var test = SC.IndexSet.create().add(100,4).add(105,2);
  equal(set.intersects(test), NO, '%@ should be in %@'.fmt(test, set));
});

test("handle range partially inside IndexSet", function() {
  var test = SC.IndexSet.create().add(1001,4).add(100,2);
  equal(set.intersects(test), YES, '%@ should be in %@'.fmt(test, set));
});

test("handle self", function() {
  equal(set.contains(set), YES, 'should return YES when passed itself');  
});


});minispade.register('sproutcore-runtime/~tests/system/index_set/max', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest */

module("SC.IndexSet#max");

test("newly created index", function() {
  var set = SC.IndexSet.create();
  equal(set.get('max'), 0, 'max should be 0');
});

test("after adding one range", function() {
  var set = SC.IndexSet.create().add(4,2);
  equal(set.get('max'),6, 'max should be one greater than max index');
});

test("after adding range then removing part of range", function() {
  var set = SC.IndexSet.create().add(4,4).remove(6,4);
  equal(set.get('max'),6, 'max should be one greater than max index');
});

test("after adding range several disjoint ranges", function() {
  var set = SC.IndexSet.create().add(4,4).add(6000);
  equal(set.get('max'),6001, 'max should be one greater than max index');
});

test("after removing disjoint range", function() {
  var set = SC.IndexSet.create().add(4,2).add(6000).remove(5998,10);
  equal(set.get('max'),6, 'max should be one greater than max index');
});

test("after removing all ranges", function() {
  var set = SC.IndexSet.create().add(4,2).add(6000).remove(3,6200);
  equal(set.get('max'), 0, 'max should be back to 0 with no content');
});


});minispade.register('sproutcore-runtime/~tests/system/index_set/min', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest */

module("SC.IndexSet#min");

test("newly created index", function() {
  var set = SC.IndexSet.create();
  equal(set.get('min'), -1, 'min should be -1');
});

test("after adding one range", function() {
  var set = SC.IndexSet.create().add(4,2);
  equal(set.get('min'),4, 'min should be lowest index');
});

test("after adding range then removing part of range", function() {
  var set = SC.IndexSet.create().add(4,4).remove(2,4);
  equal(set.get('min'),6, 'min should be lowest index');
});

test("after adding range several disjoint ranges", function() {
  var set = SC.IndexSet.create().add(6000).add(4,4);
  equal(set.get('min'),4, 'min should be lowest index');
});

test("after removing disjoint range", function() {
  var set = SC.IndexSet.create().add(4,2).add(6000).remove(2,10);
  equal(set.get('min'),6000, 'min should be lowest index');
});

test("after removing all ranges", function() {
  var set = SC.IndexSet.create().add(4,2).add(6000).remove(3,6200);
  equal(set.get('min'), -1, 'min should be back to -1 with no content');
});


test("newly created index, clearing and then adding", function() {
  var set = SC.IndexSet.create().add(4,2);
  equal(set.get('min'), 4, 'min should be lowest index');
	set.clear()
  equal(set.get('min'), -1, 'min should be back to -1 with no content');
	set.add(7, 3)
  equal(set.get('min'), 7, 'min should be lowest index');
});


});minispade.register('sproutcore-runtime/~tests/system/index_set/rangeStartForIndex', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */
var set, start, len ;
module("SC.IndexSet#rangeStartForIndex", {
  setup: function() {
    start = SC.IndexSet.HINT_SIZE*2 + 10 ;
    len  = Math.floor(SC.IndexSet.HINT_SIZE * 1.5);
    set = SC.IndexSet.create().add(start, len);
  }
});

test("index is start of range", function() {
  equal(set.rangeStartForIndex(start), start, 'should return start');
  equal(set.rangeStartForIndex(0), 0, 'should return first range');
});

test("index is middle of range", function() {
  equal(set.rangeStartForIndex(start+20), start, 'should return start');
  equal(set.rangeStartForIndex(start+SC.IndexSet.HINT_SIZE), start, 'should return start');
  equal(set.rangeStartForIndex(20), 0, 'should return first range');
});

test("index last index", function() {
  equal(set.rangeStartForIndex(start+len), start+len, 'should return end of range');
});

test("index past last index", function() {
  equal(set.rangeStartForIndex(start+len+20), start+len, 'should return end of range');
});

test("creating holes by appending to an existing range should not affect the range start", function () {
  var hintSize = SC.IndexSet.HINT_SIZE,
      start, set;

  set = SC.IndexSet.create();

  set.add(1);
  set.add(hintSize + 1);

  // Before adding 2,
  // the internal data structure looks like:
  // {
  //   0  : -  1,   // Hole until 1
  //   1  :    2,   // End of range is 2
  //   2  : -257,   // Hole until 257
  //   256:    2,   // Hint points at index 2, which is ok.
  //   257:  258,   // End of range is 258
  //   258:    0    // End of index set
  // }
  equal(set.rangeStartForIndex(hintSize),
         set.rangeStartForIndex(hintSize - 1));

  set.add(2);

  // Assuming SC.IndexSet.HINT_SIZE is 256,
  // the internal data structure looks like:
  // {
  //   0  : -  1,   // Hole until 1
  //   1  :    3,   // End of range is 3
  //   3  : -257,   // Hole until 257
  //   256:    2,   // Hint points at index 2, which is invalid.
  //   257:  258,   // End of range is 258
  //   258:    0    // End of index set
  // }

  equal(set.rangeStartForIndex(hintSize),
         set.rangeStartForIndex(hintSize - 1));
});

});minispade.register('sproutcore-runtime/~tests/system/index_set/remove', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest should_throw*/
var set ;
module("SC.IndexSet#remove", {
  setup: function() {
    set = SC.IndexSet.create();
  }
});

function iter(s) {
  var ret = [];
  set.forEach(function(k) { ret.push(k); });
  return ret ;
}

// ..........................................................
// BASIC REMOVES
//

test("remove a range after end of set", function() {
  equal(set.get('length'), 0, 'precond - should be empty');

  set.remove(1000, 5);
  equal(set.get('length'), 0, 'should still be empty');
  equal(set.get('max'), 0, 'max should return 1 past last index');
  deepEqual(iter(set), [], 'should be empty');
});

test("remove range in middle of an existing range", function() {
  set.add(100,4);
  deepEqual(iter(set), [100, 101, 102, 103], 'precond - should have range');

  set.remove(101,2);
  equal(set.get('length'), 2, 'new length should not include removed range');
  equal(set.get('max'), 104, 'max should return 1 past last index');
  deepEqual(iter(set), [100,103], 'should remove range in the middle');
});

test("remove range overlapping front edge of range", function() {
  set.add(100,2); // add initial set.
  equal(iter(set)[0], 100, 'precond - first index is 100');

  // now add second range
  set.remove(99,2);
  equal(set.get('length'), 1, 'should have extra length');
  equal(set.get('max'), 102, 'max should return 1 past last index');
  deepEqual(iter(set), [101]);
});

test("remove range overlapping last edge of range", function() {
  set.add(100,2).add(200,2); // make sure not last range
  deepEqual(iter(set), [100,101,200,201], 'should have two sets');

  // now add overlapping range
  set.remove(101,2);
  equal(set.get('length'), 3, 'new set.length');
  equal(set.get('max'), 202, 'max should return 1 past last index');
  deepEqual(iter(set), [100,200,201], 'should remove 101-102');
});

test("remove range overlapping two ranges, remove parts of both", function() {
  set.add(100,2).add(110,2);
  deepEqual(iter(set), [100,101,110,111], 'should have two sets');

  // now add overlapping range
  set.remove(101,10);
  equal(set.get('length'), 2, 'new set.length');
  equal(set.get('max'), 112, 'max should return 1 past last index');
  deepEqual(iter(set), [100,111], 'should remove range 101-110');
});

test("remove range overlapping three ranges, removing one and parts of the others", function() {
  set.add(100,2).add(105,2).add(110,2);
  deepEqual(iter(set), [100,101,105,106,110,111], 'should have two sets');

  // now add overlapping range
  set.remove(101,10);
  equal(set.get('length'), 2, 'new set.length');
  equal(set.get('max'), 112, 'max should return 1 past last index');
  deepEqual(iter(set), [100,111], 'should remove range 101-110');
});

test("remove range partially overlapping one range and replacing another range", function() {
  set.add(100,2).add(105,2);
  deepEqual(iter(set), [100,101,105,106], 'should have two sets');

  // now add overlapping range
  set.remove(101,10);
  equal(set.get('length'), 1, 'new set.length');

  equal(set.get('max'), 101, 'max should return 1 past last index');
  deepEqual(iter(set), [100], 'should include one range 100-110');
});

test("remove range overlapping last index", function() {
  set.add(100,2); // add initial set.
  equal(iter(set)[0], 100, 'precond - first index is 100');

  // now add second range
  set.remove(101,2);
  equal(set.get('length'), 1, 'should have extra length');
  equal(set.get('max'), 101, 'max should return 1 past last index');
  deepEqual(iter(set), [100]);
});

test("remove range matching existing range", function() {
  set.add(100,5); // add initial set.
  deepEqual(iter(set), [100, 101, 102, 103, 104]);

  // now add second range
  set.remove(100,5);
  equal(set.get('length'), 0, 'should be empty');
  equal(set.get('max'), 0, 'max should return 1 past last index');
  deepEqual(iter(set), []);
});

// ..........................................................
// NORMALIZED PARAMETER CASES
//

test("remove with no params should do nothing", function() {
  set.add(10,2).remove();
  deepEqual(iter(set), [10,11]);
});

test("remove with single number should remove index only", function() {
  set.add(10,2).remove(10);
  deepEqual(iter(set), [11]);
});

test("remove with range object should remove range only", function() {
  set.add(10,5).remove({ start: 10, length: 2 });
  deepEqual(iter(set), [12,13,14]);
});

test("remove with index set should add indexes in set", function() {
  set.add(0,14).remove(SC.IndexSet.create().add(2,2).add(10,2));
  deepEqual(iter(set), [0,1,4,5,6,7,8,9,12,13]);
});


// ..........................................................
// OTHER BEHAVIORS
//
test("remove a range should trigger an observer notification", function() {
  var callCnt = 0;
  set.add(10, 20);

  set.addObserver('[]', function() { callCnt++; });
  set.remove(10,10);
  equal(callCnt, 1, 'should have called observer once');
});

test("removing a non-existent range should not trigger observer notification", function() {
  var callCnt = 0;

  set.addObserver('[]', function() { callCnt++; });
  set.remove(10,10); // 10-20 are already empty
  equal(callCnt, 0, 'should NOT have called observer');
});

test("removing a clone of the same index set should leave an empty set", function() {
  var set = SC.IndexSet.create(0,2), set2 = set.clone();
  ok(set.isEqual(set2), 'precond - clone is equal to receiver');
  set.remove(set2);
  equal(set.get('length'), 0, 'set should now be empty');
});

test("removing an index range outside of target range (specific bug)", function() {

  var set = SC.IndexSet.create(10,3);
  var set2 = SC.IndexSet.create(0,3);

  // removing set2 from set should not changed set at all because it is
  // before the first range, but it causes a problem with the length.
  set.remove(set2);
  equal(set.get('length'), 3, 'length should not change');
});

test("remove() raises exception when frozen", function() {
  throws(function() {
    set.freeze().remove(0,2);
  }, SC.FROZEN_ERROR);
});

});minispade.register('sproutcore-runtime/~tests/system/index_set/removeEach', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */
var set ;
module("SC.IndexSet#removeEach", {
  setup: function() {
    set = SC.IndexSet.create().add(1000,2).add(1010).add(1020).add(1030);
  }
});

function iter(s) {
  var ret = [];
  set.forEach(function(k) { ret.push(k); });
  return ret ;
}

// ..........................................................
// BASIC ADDS
//

test("should iterate over an array", function() {
  set.removeEach([1000, 1010, 1020, 1030]);
  equal(set.get('length'), 1, 'should have correct index count');
  equal(set.get('max'), 1002, 'max should return 1 past last index');
  deepEqual(iter(set), [1001]);
});

test("adding should iterate over a set", function() {
  // add out of order...
  var input = SC.Set.create().add(1030).add(1010).add(1020).add(1000);
  set.removeEach(input);
  equal(set.get('length'), 1, 'should have correct index count');
  equal(set.get('max'), 1002, 'max should return 1 past last index');
  deepEqual(iter(set), [1001]);
});


test("adding should iterate over a indexset", function() {
  // add out of order...
  var input = SC.IndexSet.create().add(1000).add(1010).add(1020).add(1030);
  set.removeEach(input);
  equal(set.get('length'), 1, 'should have correct index count');
  equal(set.get('max'), 1002, 'max should return 1 past last index');
  deepEqual(iter(set), [1001]);
});

});minispade.register('sproutcore-runtime/~tests/system/index_set/without', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest */
var set, ret ;
module("SC.IndexSet#without", {
  setup: function() {
    set = SC.IndexSet.create(1,9);
  }
});

function iter(s) {
  var ret = [];
  s.forEach(function(k) { ret.push(k); });
  return ret ;
}

test("should return empty set when removing self", function() {
  ret = set.without(set);
  ok(ret !== set, 'is not same instance');
  deepEqual(iter(ret), []);
});

test("should return set with range removed from middle", function() {
  ret = SC.IndexSet.create(2,6);
  ret = set.without(ret);
  ok(ret !== set, 'is not same instance');
  deepEqual(iter(ret), [1,8,9]);
});

test("should return set with range removed overlapping end", function() {
  ret = set.without(SC.IndexSet.create(6,6));
  ok(ret !== set, 'is not same instance');
  deepEqual(iter(ret), [1,2,3,4,5]);
});

test("should return set with range removed overlapping beginning", function() {
  ret = set.without(SC.IndexSet.create(0,6));
  ok(ret !== set, 'is not same instance');
  deepEqual(iter(ret), [6,7,8,9]);
});


test("should return set with multiple ranges removed", function() {
  ret = set.without(SC.IndexSet.create(2,2).add(6,2));
  ok(ret !== set, 'is not same instance');
  deepEqual(iter(ret), [1,4,5,8,9]);
});

test("using without should properly hint returned index set", function() {
  var set = SC.IndexSet.create(10000,5),
      set2 = SC.IndexSet.create(10000),
      actual = set.without(set2),
      loc = SC.IndexSet.HINT_SIZE;
      
  while(loc<2000) { // spot check
    equal(actual._content[loc], 0, 'index set should have hint at loc %@ - set: %@'.fmt(loc, actual.inspect()));
    loc += SC.IndexSet.HINT_SIZE;
  }
});

// ..........................................................
// NORMALIZED PARAMETER CASES
// 

test("passing no params should return clone", function() {
  ret = set.without();
  ok(ret !== set, 'is not same instance');
  ok(ret.isEqual(set), 'has same content');
});

test("passing single number should remove just that index", function() {
  ret = set.without(5);
  deepEqual(iter(ret), [1,2,3,4,6,7,8,9]);
});

test("passing two numbers should remove range", function() {
  ret = set.without(2,6);
  deepEqual(iter(ret), [1,8,9]);
});

test("passing range object should remove range", function() {
  ret = set.without({ start: 2, length: 6 });
  deepEqual(iter(ret), [1,8,9]);
});


});