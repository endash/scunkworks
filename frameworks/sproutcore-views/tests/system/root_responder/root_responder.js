// ==========================================================================
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

		newPane = SC.Pane.create({ rootResponder: rootResponder(), owner: this});
		oldPane = SC.Pane.create({ rootResponder: rootResponder(), owner: this});
		lightPane = SC.Pane.create({ rootResponder: rootResponder(), owner: this});
		darkPane = SC.Pane.create({ rootResponder: rootResponder(), owner: this});
		myPane = SC.Pane.create({ rootResponder: rootResponder() });
		responder = rootResponder();
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
  ok(SC.RootResponder, "SC.RootResponder");
});

test("root_responder.makeMainPane() : Should change the new Pane to key view", function() {
	responder.makeMainPane(newPane);
	//Checking the mainPane property
	ok(responder.get('mainPane') == newPane);
	ok(responder.get('keyPane') == newPane);
});

test("root_responder.makeMainPane() : Should notify other panes about the changes", function() {
	responder.makeMainPane(newPane);

	//Notify other panes about the changes
	ok(newPane.get('isMainPane'));
	ok(!oldPane.get('isMainPane'));

});

test("root_responder.makeKeyPane() : Should make the passed pane as the key pane", function() {
 responder.makeMainPane(oldPane);
 ok(responder.get('keyPane') == oldPane);

 responder.makeKeyPane(lightPane);
 ok(responder.get('keyPane') == lightPane);
});

test("root_responder.makeKeyPane() : Should make the main pane as the key pane if null is passed", function() {
 responder.makeMainPane(lightPane);
 responder.makeKeyPane(oldPane);
 // newPane is set as the Main pane
 ok(responder.get('mainPane') == lightPane);
 // KeyPane is null as it is not set yet
 ok(responder.get('keyPane') == oldPane);

 responder.makeKeyPane();
 // KeyPane is set as the mainPane as null is passed
 ok(responder.get('keyPane') == lightPane);
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

