// ==========================================================================
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
    rootResponder: rootResponder(),
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

  ok(pane.get('view1.view4.nextValidKeyView') == pane.get('view1.view4'), "nextValidKeyView is receiver");

  pane.remove();
  pane.destroy();
});

test("nextValidKeyView is null if no views have acceptsFirstResponder === YES", function () {
  var pane = SC.Pane.create({
    rootResponder: rootResponder(),
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
    rootResponder: rootResponder(),
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

  SC.run(function () {
    pane.append();
  });

  ok(pane.get('view2.view6.nextValidKeyView') == pane.get('view7.view8'), "order is correct when first and next not set");

  SC.run(function () {
    pane.set('firstKeyView', pane.view2);
    pane.set('view2.nextKeyView', pane.view1);
    pane.set('view1.nextKeyView', pane.view7);
  });

  ok(pane.get('view2.view6.nextValidKeyView') == pane.get('view1.view3'), "order is respected when first and next are set");
  pane.remove();
  pane.destroy();
});

test("nextValidKeyView is chosen correctly when nextKeyView is not a sibling", function () {
  var testView = SC.View.extend({acceptsFirstResponder: YES}),
  pane = SC.Pane.create({
    rootResponder: rootResponder(),
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

  ok(pane.get('view1.view4.nextValidKeyView') == pane.view2.view5, "nextValidKeyView is correct");
  ok(pane.get('view2.view5.nextValidKeyView') == pane.view1.view4, "nextValidKeyView is correct");
  pane.remove();
  pane.destroy();
});

test("nextValidKeyView is chosen correctly when child of parent's previous sibling has nextKeyView set", function () {
  var testView = SC.View.extend({acceptsFirstResponder: YES}),
  pane = SC.Pane.create({
    rootResponder: rootResponder(),
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

  ok(pane.get('view2.view5.nextValidKeyView') == pane.get('view2.view6'), "nextValidKeyView chosen is next sibling");
  pane.remove();
  pane.destroy();
});

test("nextValidKeyView checks for acceptsFirstResponder", function () {
  var pane = SC.Pane.create({
    rootResponder: rootResponder(),
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
    rootResponder: rootResponder(),
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

  ok(pane.get('view1.view3.nextValidKeyView') == pane.get('view2.view5'), "lastKeyView was respected; views after lastKeyView were skipped");
  pane.remove();
  pane.destroy();
});

/**
  previousValidKeyView tests
*/

test("previousValidKeyView is receiver if it is the only view that acceptsFirstResponder", function () {
  var testView = SC.View.extend({acceptsFirstResponder: YES}),
  pane = SC.Pane.create({
    rootResponder: rootResponder(),
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

  ok(pane.get('view1.view4.previousValidKeyView') == pane.get('view1.view4'), "previousValidKeyView is receiver");
  pane.remove();
  pane.destroy();
});

test("previousValidKeyView is null if no views have acceptsFirstResponder === YES", function () {
  var pane = SC.Pane.create({
    rootResponder: rootResponder(),
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
    rootResponder: rootResponder(),
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

  ok(pane.get('view2.view5.previousValidKeyView') == pane.get('view1.view4'), "order is correct when last and previous not set");

  pane.set('lastKeyView', pane.view2);
  pane.view2.set('previousKeyView', pane.view7);
  pane.view1.set('previousKeyView', pane.view1);

  ok(pane.get('view2.view5.previousValidKeyView') == pane.get('view7.view9'), "order is respected when last and previous are set");
  pane.remove();
  pane.destroy();
});

test("previousValidKeyView is chosen correctly when previousKeyView is not a sibling", function () {
  var testView = SC.View.extend({acceptsFirstResponder: YES}),
  pane = SC.Pane.create({
    rootResponder: rootResponder(),
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

  ok(pane.get('view1.view4.previousValidKeyView') == pane.get('view2.view5'), "previousValidKeyView is correct");
  ok(pane.get('view2.view5.previousValidKeyView') == pane.get('view1.view4'), "previousValidKeyView is correct");
  pane.remove();
  pane.destroy();
});

test("previousValidKeyView prioritizes parent's firstKeyView even if previousKeyView is set", function () {
  var testView = SC.View.extend({acceptsFirstResponder: YES}),
  pane = SC.Pane.create({
    rootResponder: rootResponder(),
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

  ok(pane.get('view2.view6.previousValidKeyView') == pane.get('view1.view4'), "firstKeyView was respected; views before firstKeyView were skipped");
  pane.remove();
  pane.destroy();
});
