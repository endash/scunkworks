// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context */

var context = null;

module("SC.RenderContext#tag", {
  setup: function() {
    context = SC.RenderContext() ;
  }
});

test("should emit a self closing tag.  like calling begin().end()", function() {
  context.tag("input");
  equal(SC.RenderContext.escapeHTML(context.get(1)), SC.RenderContext.escapeHTML("<input />"));
});

test("should respect passed opts when emitting", function() {
  context.tag("foo") ;
  equal(context.length, 3);
  equal(SC.RenderContext.escapeHTML(context.get(1)), SC.RenderContext.escapeHTML("<foo>"));
  equal(SC.RenderContext.escapeHTML(context.get(2)), SC.RenderContext.escapeHTML('<'+'/foo>'));
});

test("should NOT emit self closing tag if tag is script", function() {
  context.tag("script");
  equal(SC.RenderContext.escapeHTML(context.get(1)), SC.RenderContext.escapeHTML('<script>'));
  equal(SC.RenderContext.escapeHTML(context.get(2)), SC.RenderContext.escapeHTML('<'+'/script>'));
});

test("should NOT emit self closing tag if tag is div", function() {
  context.tag("div");
  equal(SC.RenderContext.escapeHTML(context.get(1)), SC.RenderContext.escapeHTML('<div>'));
  equal(SC.RenderContext.escapeHTML(context.get(2)), SC.RenderContext.escapeHTML('<'+'/div>'));
});

test("should NOT emit self closing tag if no tag is passed", function() {
  context.tag();
  equal(SC.RenderContext.escapeHTML(context.get(1)), SC.RenderContext.escapeHTML('<div>'));
  equal(SC.RenderContext.escapeHTML(context.get(2)), SC.RenderContext.escapeHTML('<'+'/div>'));
});
