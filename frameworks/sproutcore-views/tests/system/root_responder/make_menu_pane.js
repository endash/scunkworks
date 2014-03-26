// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ htmlbody */

var responder, menu;

function setup() {
  if (menu) menu.remove();

  destroyRootResponder();
  responder = rootResponder();
  menu = SC.Pane.create({
    rootResponder: rootResponder(),
    acceptsMenuPane: YES
  });
}

module("SC.RootResponder#makeMenuPane");

test("Returns receiver", function() {
  setup();
  ok(responder.makeMenuPane(menu) == responder, 'returns receiver');
});

test("Sets RootResponder's menuPane", function() {
  setup();
  ok(responder.get('menuPane') == null, 'precond - menuPane should be null by default');
  responder.makeMenuPane(menu);
  ok(responder.get('menuPane') == menu, 'menuPane should be passed menu');
});

test("menuPane does not affect keyPane", function() {
  setup();
  var p2 = SC.Pane.create({ rootResponder: rootResponder() });
  responder.makeKeyPane(p2);
  ok(responder.get('keyPane') == p2, 'precond - pane should be key pane');
  responder.makeMenuPane(menu);
  ok(responder.get('menuPane') == menu, 'menuPane should be set');
  ok(responder.get('keyPane') == p2, 'key pane should not change');
});

test("Pane should not become menu pane if acceptsMenuPane is not YES", function() {
  setup();
  menu.set('acceptsMenuPane', NO);
  responder.makeMenuPane(menu);
  ok(responder.get('menuPane') == null, 'menuPane should remain null');
});
