// ==========================================================================
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
