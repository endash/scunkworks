// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

module("SC.SelectionSet.copy");

test("basic copy", function() {
  var content = "1 2 3 4 5 6 7 8 9".w(),
      set     = SC.SelectionSet.create().add(content,4,4).remove(content,6),
      copy    = set.copy();

  equal(set.get('length'), 3, 'precond - original set should have length');
  equal(copy.get('length'), 3, 'copy should have same length');
  ok(copy.isEqual(set), 'copy should be the same as original set');
});
