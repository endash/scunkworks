// ==========================================================================
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
  var parent = SC.Pane.create({ rootResponder: rootResponder() });
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
  var layoutView = SC.View.createWithMixins({
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

    regular: SC.View.createWithMixins({
      viewDidResize: function () {
        regularViewCounter++;
        // Make sure we call the default implementation to
        // ensure potential blow-uppy behavior is invoked
        this._super();
      }
    }),

    core: SC.CoreView.createWithMixins({
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
