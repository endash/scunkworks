// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.mixin(Function.prototype, /** @scope Function.prototype */ {

  /**
    Creates a timer that will execute the function after a specified
    period of time.

    If you pass an optional set of arguments, the arguments will be passed
    to the function as well.  Otherwise the function should have the
    signature:

        function functionName(timer)

    @param target {Object} optional target object to use as this
    @param interval {Number} the time to wait, in msec
  */
  invokeLater: function(target, interval) {
    return SC.run.later(target, this, interval);
  }
});
