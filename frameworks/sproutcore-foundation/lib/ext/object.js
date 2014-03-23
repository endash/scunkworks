// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// Extensions to the core SC.Object class
SC.mixin(SC.Object.prototype, /** @scope SC.Object.prototype */ {

  /**
    Invokes the named method after the specified period of time.  This
    uses SC.Timer, which works properly with the Run Loop.

    Any additional arguments given to invokeOnce will be passed to the
    method.

    For example,

        var obj = SC.Object.create({
          myMethod: function(a, b, c) {
            alert('a: %@, b: %@, c: %@'.fmt(a, b, c));
          }
        });

        obj.invokeLater('myMethod', 200, 'x', 'y', 'z');

        // After 200 ms, alerts "a: x, b: y, c: z"

    @param method {String} method name to perform.
    @param interval {Number} period from current time to schedule.
    @returns {SC.Timer} scheduled timer.
  */
  invokeLater: function(method, interval) {
    return SC.run.later(this, method, interval);
  },

  /**
    A convenience method which makes it easy to coalesce invocations to ensure
    that the method is only called once after the given period of time. This is
    useful if you need to schedule a call from multiple places, but only want
    it to run at most once.

    Any additional arguments given to invokeOnceLater will be passed to the
    method.

    For example,

        var obj = SC.Object.create({
          myMethod: function(a, b, c) {
            alert('a: %@, b: %@, c: %@'.fmt(a, b, c));
          }
        });

        obj.invokeOnceLater('myMethod', 200, 'x', 'y', 'z');

        // After 200 ms, alerts "a: x, b: y, c: z"

    @param {Function|String} method reference or method name
    @param {Number} interval
  */
  invokeOnceLater: function(method, interval) {
    return SC.run.once(this, method, interval);
  },

  /**
    Lookup the named property path and then invoke the passed function,
    passing the resulting value to the function.

    This method is a useful way to handle deferred loading of properties.
    If you want to defer loading a property, you can override this method.
    When the method is called, passing a deferred property, you can load the
    property before invoking the callback method.

    You can even swap out the receiver object.

    The callback method should have the signature:

    function callback(objectAtPath, sourceObject) { ... }

    You may pass either a function itself or a target/method pair.

    @param {String} pathName
    @param {Object} target target or method
    @param {Function|String} method
    @returns {SC.Object} receiver
  */
  invokeWith: function(pathName, target, method) {
    // normalize target/method
    if (method === undefined) {
      method = target; target = this;
    }
    if (!target) { target = this ; }
    if (SC.typeOf(method) === SC.T_STRING) { method = target[method]; }

    // get value
    var v = this.get(pathName);

    // invoke method
    method.call(target, v, this);
    return this ;
  }

});
