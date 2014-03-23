// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same same */

var context = null;

// ..........................................................
// styles
//
module("SC.RenderContext#styles", {
  setup: function() {
    context = SC.RenderContext() ;
  }
});

test("returns empty hash if no current styles", function() {
  deepEqual(context.styles(), {}, 'styles') ;
});

test("styles(hash) replaces styles", function() {
  var styles = { foo: 'bar' };
  equal(context.setStyle(styles), context, "returns receiver");
  deepEqual(context.styles(), styles, 'Styles');
});

test("clone on next retrieval if styles(foo) set with cloneOnModify=YES", function() {
  var styles = { foo: 'bar' };
  context.setStyle(styles);

  var result = context.styles();
  ok(result !== styles, "styles is NOT same instance");
  deepEqual(result, styles, "but styles are equivalent");

  equal(result, context.styles(), "2nd retrieval is same instance");
});

test("extracts styles from element on first retrieval", function() {
  var elem = document.createElement('div');
  SC.$(elem).attr('style', 'color: black; height: 20px; border-top: 1px solid hotpink; -webkit-column-count: 3');
  context = SC.RenderContext(elem);

  var result = context.styles();

  if(SC.browser.isIE){
    deepEqual(result, { color: 'black', height: '20px', borderTop: 'hotpink 1px solid', WebkitColumnCount: '3' }, 'extracted style. This is failing in IE8 because it return styles like cOLOR.');
  }else{
    deepEqual(result, { color: 'black', height: '20px', borderTop: '1px solid hotpink', WebkitColumnCount: '3' }, 'extracted style. This is failing in IE8 because it return styles like cOLOR.');
  }
  equal(context.styles(), result, "should reuse same instance thereafter");
});

// ..........................................................
// addStyle
//
module("SC.RenderContext#addStyle", {
  setup: function() {
    context = SC.RenderContext().setStyle({ foo: 'foo' }) ;
  }
});

test("should add passed style name to value", function() {
  context.addStyle('bar', 'bar');
  equal('bar', context.styles().bar, 'verify style name');
});

test("should replace passed style name  value", function() {
  context.addStyle('foo', 'bar');
  equal('bar', context.styles().foo, 'verify style name');
});

test("should return receiver", function() {
  equal(context, context.addStyle('foo', 'bar'));
});

test("should create styles hash if needed", function() {
  context = SC.RenderContext();
  equal(context._styles, null, 'precondition - has no styles');

  context.addStyle('foo', 'bar');
  equal('bar', context.styles().foo, 'has styles');
});

test("should assign all styles if a hash is passed", function() {
  context.addStyle({ foo: 'bar', bar: 'bar' });
  deepEqual(context.styles(), { foo: 'bar', bar: 'bar' }, 'has same styles');
});

test("addStyle should remove properties that are part of combo properties", function(){
  SC.COMBO_STYLES = { foo: 'fooSub'.w() };
  context.setStyle({ foo: 'foo', fooSub: 'bar' });
  equal(context.styles().fooSub, 'bar', 'proper starting values');
  context.addStyle('foo', 'bar');
  equal(context.styles().foo, 'bar', 'foo has new value');
  equal(context.styles().fooSub, undefined, 'fooSub has no value');
});

