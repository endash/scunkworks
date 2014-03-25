// ==========================================================================
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
      rootResponder: rootResponder(),
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

