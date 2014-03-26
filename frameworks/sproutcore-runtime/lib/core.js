// ==========================================================================
// Project:   SproutCore Costello - Property Observing Library
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global jQuery, require, console */

// These commands are used by the build tools to control load order.  On the
// client side these are a no-op.

// ........................................
// GLOBAL CONSTANTS
//
// Most global constants should be defined inside of the SC namespace.
// However the following two are useful enough and generally benign enough
// to put into the global object.
window.YES = true;
window.NO = false;

// prevent a console.log from blowing things up if we are on a browser that
// does not support it
if (typeof console === 'undefined') {
  window.console = {};
  console.log = console.info = console.warn = console.error = function () {};
}

// window.Ember = window.Ember.__loader.require('ember-runtime').default

window.SC = window.Ember || {};
window.SproutCore = window.SproutCore || SC;

// ........................................
// BOOTSTRAP
//
// The root namespace and some common utility methods are defined here. The
// rest of the methods go into the mixin defined below.

/**
  @version Edge
  @namespace

  All SproutCore methods and functions are defined
  inside of this namespace.  You generally should not add new properties to
  this namespace as it may be overwritten by future versions of SproutCore.

  You can also use the shorthand "SC" instead of "SproutCore".

  SproutCore-Base is a framework that provides core functions for SproutCore
  including cross-platform functions, support for property observing and
  objects.  It's focus is on small size and performance.  You can use this
  in place of or along-side other cross-platform libraries such as jQuery or
  Prototype.

  The core Base framework is based on the jQuery API with a number of
  performance optimizations.
*/
SC = window.SC; // This is dumb but necessary for jsdoc to get it right
SC.RunLoop = SC.Run;

SC.mixin(SC, {
  T_ERROR:     'error',
  T_OBJECT:    'object',
  T_NULL:      'null',
  T_CLASS:     'class',
  T_HASH:      'object',
  T_FUNCTION:  'function',
  T_UNDEFINED: 'undefined',
  T_NUMBER:    'number',
  T_BOOL:      'boolean',
  T_ARRAY:     'array',
  T_STRING:    'string',
  T_DATE:      'date',
  T_REGEXP:    'regexp',

  beget: function (obj) {
    if (obj === null || obj === undefined) return null;
    var K = SC.K;
    K.prototype = obj;
    var ret = new K();
    K.prototype = null; // avoid leaks
    if (typeof obj.didBeget === "function") ret = obj.didBeget(ret);
    return ret;
  },

  hashFor: function () {
    var l = arguments.length,
      h = '',
      obj, f, i;

    for (i = 0; i < l; ++i) {
      obj = arguments[i];
      h += (obj && (f = obj.hash) && (typeof f === SC.T_FUNCTION)) ? f.call(obj) : this.guidFor(obj);
    }

    return h === '' ? null : h;
  },

  $A: function (obj) {
    // null or undefined -- fast path
    if (obj === null || obj === undefined) return [];

    // primitive -- fast path
    if (obj.slice instanceof Function) {
      // do we have a string?
      if (typeof(obj) === 'string') return [obj];
      else return obj.slice();
    }

    // enumerable -- fast path
    if (obj.toArray) return obj.toArray();

    // if not array-like, then just wrap in array.
    if (!SC.isArray(obj)) return [obj];

    // when all else fails, do a manual convert...
    var ret = [], len = obj.length;
    while (--len >= 0) ret[len] = obj[len];
    return ret;
  },

  clone: SC.copy,

  ok: function(ret) {
    return (ret !== false) && !(ret && ret.isError);
  },

  assert: function(desc, test) {
    if (!test) {
      throw new Error("Assertion Failed: " + desc);
    }
  }
});

SC.Object.reopen({
  /**
    Returns YES if the named value is an executable function.

    @param {String} methodName the property name to check
    @returns {Boolean}
  */
  respondsTo: function (methodName) {
    return !!(this[methodName] instanceof Function);
  },

  /**
    Attempts to invoke the named method, passing the included two arguments.
    Returns NO if the method is either not implemented or if the handler
    returns NO (indicating that it did not handle the event).  This method
    is invoked to deliver actions from menu items and to deliver events.
    You can override this method to provide additional handling if you
    prefer.

    @param {String} methodName
    @param {Object} arg1
    @param {Object} arg2
    @returns {Boolean} YES if handled, NO if not handled
  */
  tryToPerform: function (methodName, arg1, arg2) {
    return this.respondsTo(methodName) && (this[methodName](arg1, arg2) !== NO);
  }
})