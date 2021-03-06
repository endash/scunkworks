// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same $ htmlbody */

var pane;

module("SC.Pane#layout", {
  setup: function() {
    pane = SC.Pane.create({
      rootResponder: rootResponder(),
      layout: { top: 0, left: 0, width: 1, height: 1}
    });
    pane.append();
  },

  teardown: function() {
    pane.remove();
    pane.destroy();
  }
});

test("make sure that a call to adjust actually adjusts the view's size", function() {
  SC.run(function () {
    pane.adjust({ width: 100, height: 50 });
  });

  equal(pane.$()[0].style.width, '100px', 'width should have been adjusted');
  equal(pane.$()[0].style.height, '50px', 'height should have been adjusted');
});
