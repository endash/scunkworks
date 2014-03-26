// ==========================================================================
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
  var v = SC.View.createWithMixins({
    childViews: [
      SC.View.extend({ key: 0 }), // class - should be called
      SC.View.create({ key: 1 }), // instance - will be called
      'customClassName'           // string - should be called
    ],

    // this should be used for the 'customClassName' item above
    customClassName: SC.View.extend({ key: 2 }),

    // patch to record results...
    createChildView: function(childView) {
      if(SC.View.detect(childView)) {
        called.push(childView.create().key);
      } else {
        called.push(childView.key);
      }
      return this._super(childView);
    }
  });

  // createChildViews() is called automatically during create.
  deepEqual(called, [0,1,2], 'called createChildView for correct children');

  // make sure childViews array is correct now.
  var cv = v.childViews, len = cv.length, idx;
  for(idx=0;idx<len;idx++) {
    equal(cv[idx].key, idx, 'has correct index key');
    ok(cv[idx] instanceof SC.View, 'is a view instance - %@'.fmt(cv[idx]));
  }
});

test("should not error when there is a dud view name in childViews list.", function() {
  var called = [];
  var v = SC.View.createWithMixins({
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
      called.push(childView.create().key);
      ok(SC.View.detect(childView), "childView: %@ isClass".fmt(childView));
      return this._super(childView);
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
  ok(v.childViews[0] instanceof SC.View, 'precondition - did create child view');
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

