// ==========================================================================
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

var FRAME = { x: 10, y: 10, width: 30, height: 30 } ;

var pane ; // test globals

module('SC.MainPane', {
  setup: function() {
    pane = SC.MainPane.create({rootResponder: rootResponder()});
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
