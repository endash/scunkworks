// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ htmlbody */
module("SC.RootResponder#makeMainPane");

test("returns receiver", function() {
  var p1 = SC.Pane.create({ rootResponder: rootResponder() }), p2 = SC.Pane.create({ rootResponder: rootResponder() });
  var r = rootResponder();
  equal(r.makeMainPane(p1), r, 'returns receiver');
});

test("changes mainPane to new pane", function() {
  var p1 = SC.Pane.create({ rootResponder: rootResponder() }), p2 = SC.Pane.create({ rootResponder: rootResponder() });
  var r = rootResponder();

  r.makeMainPane(p1);
  equal(r.get('mainPane'), p1, 'mainPane should be p1');

  r.makeMainPane(p2);
  equal(r.get('mainPane'), p2, 'mainPane should be p2');

});

test("if current mainpane is also keypane, automatically make new main pane key also", function() {
  // acceptsKeyPane is required to allow keyPane to change
  var p1 = SC.Pane.create({ rootResponder: rootResponder(), acceptsKeyPane: YES });
  var p2 = SC.Pane.create({ rootResponder: rootResponder(), acceptsKeyPane: YES });

  var r= rootResponder();
  r.setProperties({ mainPane: p1, keyPane: p1 });
  r.makeMainPane(p2);
  ok(r.get('keyPane') === p2, 'should change keyPane(%@) p1 = %@ - p2 = %@'.fmt(r.get('keyPane'), p1, p2));
});

test("should call blurMainTo() on current pane, passing new pane", function() {
  var callCount = 0;
  var p2 = SC.Pane.create({ rootResponder: rootResponder() });
  var p1 = SC.Pane.create({
    rootResponder: rootResponder(),
    blurMainTo: function(pane) {
      callCount++ ;
      equal(pane, p2, 'should pass new pane');
    }
  });

  var r = rootResponder();
  r.set('mainPane', p1);

  r.makeMainPane(p2);
  equal(callCount, 1, 'should invoke callback');
});


test("should call focusMainFrom() on new pane, passing old pane", function() {
  var callCount = 0;
  var p1 = SC.Pane.create({ rootResponder: rootResponder() });
  var p2 = SC.Pane.create({
    rootResponder: rootResponder(),
    focusMainFrom: function(pane) {
      callCount++ ;
      equal(pane, p1, 'should pass old pane');
    }
  });

  var r= rootResponder();
  r.set('mainPane', p1);
  r.makeMainPane(p2);
  equal(callCount, 1, 'should invoke callback');
});

