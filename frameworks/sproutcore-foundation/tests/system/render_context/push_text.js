// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context */

var context = null;

// ..........................................................
// push()
// 
module("SC.RenderContext#push", {
  setup: function() {
    context = SC.RenderContext();
  },
  
  teardown: function() {
    context = null;
  }
});

test("it should add the line to the strings and increase the length", function() {
  equal(context.length, 1, "precondition - length=");

  context.push("sample line");
  equal(context.length, 2, "length should increase");
  equal(context.get(1), "sample line", "line should be in strings array");
});

test("it should accept multiple parameters, pushing each one into strings", function() {

  equal(context.length, 1, "precondition - length=");
  
  context.push("line1", "line2", "line3");
  equal(context.length, 4, "should add 3 lines to strings");
  equal(context.get(1), "line1", "1st item");
  equal(context.get(2), "line2", "2nd item");
  equal(context.get(3), "line3", "3rd item");
});

test("it should return receiver", function() {
  equal(context.push("line1"), context, "return value");
});

test("pushing a line onto a subcontext, should update the length in the parent context as well", function() {
  context.push("line1", "line2");
  var len = context.length ;
  
  var c2 = context.begin().push("line3");
  ok(context.length > len, "length should have increased");
});

// ..........................................................
// text()
// 
module("SC.RenderContext#text", {
  setup: function() {
    context = SC.RenderContext();
  },
  
  teardown: function() {
    context = null;
  }
});

test("should escape passed HTML before pushing", function() {
  context.text("<b>test me!</b>");
  equal(context.get(1),'&lt;b&gt;test me!&lt;/b&gt;', 'escaped');
});


