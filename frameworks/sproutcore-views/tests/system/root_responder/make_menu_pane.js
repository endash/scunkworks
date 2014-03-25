// ==========================================================================
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
      rootResponder: rootResponder(),
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
  var p2 = SC.Pane.create({ rootResponder: rootResponder() });
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
