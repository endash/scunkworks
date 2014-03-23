minispade.register('sproutcore-foundation/~tests/ext/object_test', function() {// // ==========================================================================
// // Project:   SproutCore - JavaScript Application Framework
// // Copyright: ©2006-2011 Strobe Inc. and contributors.
// //            Portions ©2008-2011 Apple Inc. All rights reserved.
// // License:   Licensed under MIT license (see license.js)
// // ==========================================================================
// /*globals module, test, start, stop, expect, ok, equals*/
//
//
// module("Object:invokeOnce()");
//
// test("should invoke function using invokeLater after specified time and pass in extra arguments", function() {
//   stop(2000);
//
//   SC.RunLoop.begin();
//   var o = SC.Object.create({
//     stopped: YES,
//
//     method: function(a, b, c) {
//       equal(a, 'a', "Argument 'a' passed");
//       equal(b, 'b', "Argument 'b' passed");
//       equal(c, 'c', "Argument 'c' passed");
//
//       start();
//     }
//   });
//   o.invokeLater('method', 200, 'a', 'b', 'c');
//   SC.RunLoop.end();
// });
//
// test("should invoke function once multiple times using invokeLater after specified time", function() {
//   stop(2000);
//   expect(3);
//
//   SC.RunLoop.begin();
//   var o = SC.Object.create({
//     stopped: YES,
//
//     method: function() {
//       ok(true, 'method called');
//
//       if (this.stopped) {
//         this.stopped = NO;
//         // Continue on in a short moment.  Before the test times out, but after
//         // enough time for a second call to method to possibly come in.
//         setTimeout(function() {
//           start();
//         }, 100);
//       }
//     }
//   });
//   o.invokeLater('method', 200);
//   o.invokeLater('method', 200);
//   o.invokeLater('method', 200);
//   SC.RunLoop.end();
// });
//
//
//
// module("Object:invokeOnceLater()");
//
// test("should invoke function using invokeOnceLater after specified time and pass in extra arguments", function() {
//   stop(2000);
//
//   SC.RunLoop.begin();
//   var o = SC.Object.create({
//     stopped: YES,
//
//     method: function(a, b, c) {
//       equal(a, 'a', "Argument 'a' passed");
//       equal(b, 'b', "Argument 'b' passed");
//       equal(c, 'c', "Argument 'c' passed");
//
//       start();
//     }
//   });
//   o.invokeOnceLater('method', 200, 'a', 'b', 'c');
//   SC.RunLoop.end();
// });
//
// test("should invoke function once using invokeOnceLater after specified time", function() {
//   stop(2000);
//   expect(1);
//
//   SC.RunLoop.begin();
//   var o = SC.Object.create({
//     stopped: YES,
//
//     method: function() {
//       ok(true, 'method called');
//
//       if (this.stopped) {
//         this.stopped = NO;
//         // Continue on in a short moment.  Before the test times out, but after
//         // enough time for a second call to method to possibly come in.
//         setTimeout(function() {
//           start();
//         }, 100);
//       }
//     }
//   });
//   o.invokeOnceLater('method', 200);
//   o.invokeOnceLater('method', 200);
//   o.invokeOnceLater('method', 200);
//   SC.RunLoop.end();
// });

});minispade.register('sproutcore-foundation/~tests/mixins/responder_context', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module test equals context ok same */
var S, A, a, B, Manager;
module("ResponderContext", {
  setup: function() {
    Manager = SC.Responder.createWithMixins(SC.ResponderContext);
    var TestResponder = SC.Responder.extend({
      didBecomeFirstResponder: function() {
        this.didBecome = YES;
        this.hasFirst = YES;
      },
      willLoseFirstResponder: function() {
        this.didLose = YES;
        this.hasFirst = NO;
      }
    });

    A = TestResponder.create();
    a = TestResponder.create({nextResponder: A});
    B = TestResponder.create();
  }
});

test("Can enter and exit states.", function() {
  Manager.makeFirstResponder(A);
  ok(A.didBecome, "A did become first responder.");
  ok(A.hasFirst, "A has first responder.");

  Manager.makeFirstResponder(B);
  ok(A.didLose, "A did lose first responder.");
  ok(!A.hasFirst, "A does not have first responder.");
});

test("Can enter and exit chained states.", function() {
  Manager.makeFirstResponder(A);
  ok(A.didBecome, "A did become first responder.");
  ok(A.hasFirst, "A has first responder.");

  Manager.makeFirstResponder(a);
  ok(!A.didLose, "A did not lose first responder.");
  ok(A.hasFirst, "A has first responder.");
  ok(A.didBecome, "a did become first responder.");
  ok(A.hasFirst, "a has first responder.");

  Manager.makeFirstResponder(B);
  ok(a.didLose, "a did lose first responder.");
  ok(!a.hasFirst, "a does not have first responder.");
  ok(A.didLose, "A did lose first responder.");
  ok(!A.hasFirst, "A does not have first responder.");
});

test("Setting responder to the current responder does not reenter.", function() {
  Manager.makeFirstResponder(A);
  ok(A.didBecome, "A did become first responder.");
  ok(A.hasFirst, "A has first responder.");

  A.didBecome = NO;
  Manager.makeFirstResponder(A);
  ok(!A.didBecome, "A did become first responder.");
});

test("Calling 'resetFirstResponder' reenters the first responder.", function() {
  Manager.makeFirstResponder(A);
  ok(A.didBecome, "A did become first responder.");
  ok(A.hasFirst, "A has first responder.");

  A.didBecome = NO;
  Manager.resetFirstResponder();
  ok(A.didLose, "A did leave.");
  ok(A.didBecome, "A did reenter.");
});

});minispade.register('sproutcore-foundation/~tests/mixins/string', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module test equals context ok same should_throw*/
var LocaleObject;

module('String', {
  setup: function() {

    LocaleObject = SC.Locale.createWithMixins({
      init: function(){
        this._super();
        //hash of new languages
        var newLocales = { deflang: 'dl', empty: '' };

        //Added the new languages to the existing list of locales
        SC.Locale.addStrings(newLocales);
      }
    });
    this.currentLocale = LocaleObject;

    SC.stringsFor('English', {
      'Test': '%@',
      'Test.Multiple': '%@ %@'
    });

    SC.metricsFor('English', {
      'Button.left': 10,
      'Button.top': 20,
      'Button.width': 80,
      'Button.height': 30
    });
  }
});

test("'one two three'.w() => ['one','two','three']", function() {
  deepEqual('one two three'.w(), ['one','two','three'], "should be equal");
});

test("'one    two    three'.w() with extra spaces between words => ['one','two','three']", function() {
  deepEqual('one    two    three'.w(), ['one','two','three'], "should be equal");
});

test("Trim ' spaces on both sides '", function() {
  deepEqual(' spaces on both sides '.trim(), 'spaces on both sides', "should be equal");
});

test("Trim ' spaces on both sides ' on left only", function() {
  deepEqual(' spaces on both sides '.trimLeft(), 'spaces on both sides ', "should be equal");
});

test("Trim ' spaces on both sides ' on right only", function() {
  deepEqual(' spaces on both sides '.trimRight(), ' spaces on both sides', "should be equal");
});

test("Localize a string", function() {
  //Based on the input passed it should return the default locale
  equal("en".loc(), "en", "Using String.prototype.loc") ;
  equal(SC.String.loc("en"), "en", "Using SC.String.loc");

  equal("jp".locWithDefault("Japanese"), "Japanese", "Using String.prototype.locWithDefault") ;
  equal(SC.String.locWithDefault("jp", "Japanese"), "Japanese", "Using SC.String.locWithDefault") ;

  equal('deflang'.loc(), "dl", "Using String.prototype.loc") ;
  equal(SC.String.loc('deflang'), "dl", "Using SC.String.loc") ;
});

test("Localize a string with mutliple parameters", function() {
  equal("Test".loc('parameter1'), 'parameter1', "Localizing with one parameter - using String.prototype.loc");
  equal(SC.String.loc("Test", 'parameter1'), 'parameter1', "Localizing with one parameter - using SC.String.loc");

  equal("Test.Multiple".loc('parameter1', 'parameter2'), 'parameter1 parameter2', "Localizing with multiple parameters - using String.prototype.loc");
  equal(SC.String.loc("Test.Multiple", 'parameter1', 'parameter2'), 'parameter1 parameter2', "Localizing with multiple parameters - using SC.String.loc");
});

test("Localize a string with null or missing parameters", function() {
  equal("Test".loc(null), "(null)", "Localizing with null parameter - using String.prototype.loc");
  equal(SC.String.loc("Test", null), "(null)", "Localizing with null parameter - using SC.String.loc");

  equal("Test".loc(), "", "Localizing with missing parameter - using String.prototype.loc");
  equal(SC.String.loc("Test"), "", "Localizing with missing parameter - using SC.String.loc");

  equal("Test.Multiple".loc("p1", null), "p1 (null)", "Localizing multiple with null parameter - using String.prototype.loc");
  equal(SC.String.loc("Test.Multiple", "p1", null), "p1 (null)", "Localizing with null parameter - using SC.String.loc");

  equal("Test.Multiple".loc("p1"), "p1 ", "Localizing multiple with missing parameter - using String.prototype.loc");
  equal(SC.String.loc("Test.Multiple", "p1"), "p1 ", "Localizing with missing parameter - using SC.String.loc");
});

test("Localize a string even if localized version is empty", function() {
  equal("empty".loc(), "", "Using String.prototype.loc");
  equal(SC.String.loc("empty"), "", "Using SC.String.loc");

  equal("empty".locWithDefault("Empty"), "", "Using String.prototype.locWithDefault");
  equal(SC.String.locWithDefault("empty", "Empty"), "", "Using SC.String.locWithDefault");
});

test("Access a localized metric", function() {
  equal(10, "Button.left".locMetric());
  equal(20, "Button.top".locMetric());
  equal(undefined, "Button.notThere".locMetric());
});

test("Access a localized layout hash", function() {
  // Simple case (if we ever get a full hash comparison function, we should use
  // it here).
  var layout = "Button".locLayout();
  equal(10, layout.left);
  equal(20, layout.top);
  equal(80, layout.width);
  equal(30, layout.height);
  equal(undefined, layout.right);    // No localized key


  // Slightly more involved case:  allow the user to specify an additional hash.
  layout = "Button".locLayout({right:50});
  equal(10, layout.left);
  equal(20, layout.top);
  equal(80, layout.width);
  equal(30, layout.height);
  equal(50, layout.right);    // No localized key


  // Sanity-check case:  Since we have both a localized key for 'left' and we'll
  // pass it in, an exception should be thrown.
  throws(function() {
    "Button".locLayout({left:10});
  }, Error, "locLayout():  There is a localized value for the key 'Button.left' but a value for 'left' was also specified in the non-localized hash");
});

test("Multiply string", function() {
  equal('a'.mult(0), null);
  equal('a'.mult(1), 'a');
  equal('a'.mult(2), 'aa');
  equal('xyz'.mult(1), 'xyz');
  equal('xyz'.mult(2), 'xyzxyz');
});

test('CSS escaping a string', function () {
  equal('AnHtmlId...WithSome:Problematic::Characters'.escapeCssIdForSelector(), 'AnHtmlId\\.\\.\\.WithSome\\:Problematic\\:\\:Characters', 'should be escaped');
  equal('AnHtmlIdWithNormalCharacters'.escapeCssIdForSelector(), 'AnHtmlIdWithNormalCharacters', 'should be escaped, with no effect');
});

});minispade.register('sproutcore-foundation/~tests/system/browser', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


test("SC.browser.compare()", function() {
  var browser;

  // Use SC.browser.compare() to determine if the given OS is Mac OS 10.7 "Lion"
  // like as was/is in use in SC.TextFieldView.
  equal(SC.browser.compare('10.6.8', '10.7'), -1, "'10.6.8' compared to '10.7' should be -1");
  equal(SC.browser.compare('10.7', '10.7'), 0, "'10.7' compared to '10.7' should be 0");
  equal(SC.browser.compare('10.7.1', '10.7'), 0, "'10.7.1' compared to '10.7' should be 0");
  equal(SC.browser.compare('10.8', '10.7'), 1, "'10.8' compared to '10.7' should be 1");

  equal(SC.browser.compare('10.6.8', 10.7), -1, "'10.6.8' compared to 10.7 should be -1");
  equal(SC.browser.compare('10.7', 10.7), 0, "'10.7' compared to 10.7 should be 0");
  equal(SC.browser.compare('10.7.1', 10.7), 0, "'10.7.1' compared to 10.7 should be 0");
  equal(SC.browser.compare('10.8', 10.7), 1, "'10.8' compared to 10.7 should be 1");

  // Use SC.browser.compare() to determine if the given browser is Firefox 3.5
  // like as was/is in use in SC.RootResponder.
  equal(SC.browser.compare('1.8.10', '1.9.1'), -1, "'1.8.10' compared to '1.9.1' should be -1");
  equal(SC.browser.compare('1.9.0', '1.9.1'), -1, "'1.9.0' compared to '1.9.1' should be -1");
  equal(SC.browser.compare('1.9', '1.9.1'), 0, "'1.9' compared to '1.9.1' should be 0");
  equal(SC.browser.compare('1.9.1', '1.9.1'), 0, "'1.9.1' compared to '1.9.1' should be 0");
  equal(SC.browser.compare('1.10', '1.9.1'), 1, "'1.10' compared to '1.9.1' should be 1");

  equal(SC.browser.compare('1.9.0', 1.9), 0, "'1.9.0' compared to 1.9 should be 0");
  equal(SC.browser.compare('1.9', 1.9), 0, "'1.9' compared to 1.9 should be 0");
  equal(SC.browser.compare('1.9.1', 1.9), 0, "'1.9.1' compared to 1.9 should be 0");
  equal(SC.browser.compare('1.10', 1.9), 1, "'1.10' compared to 1.9 should be 1");

  // Use SC.browser.compare() to determine if the given browser is Safari 5.0.1
  // like as was/is in use in SC.Event.
  equal(SC.browser.compare('532.7', '533.7'), -1, "'532.7' compared to '533.7' should be -1");
  equal(SC.browser.compare('533.6', '533.7'), -1, "'533.6' compared to '533.7' should be -1");
  equal(SC.browser.compare('533.7', '533.7'), 0, "'533.7' compared to '533.7' should be 0");
  equal(SC.browser.compare('533', '533.7'), 0, "'533' compared to '533.7' should be 0");
  equal(SC.browser.compare('533.8', '533.7'), 1, "'533.8' compared to '533.7' should be 1");
  equal(SC.browser.compare('534.7', '533.7'), 1, "'534.7' compared to '533.7' should be 1");

  equal(SC.browser.compare('532.7', 533.7), -1, "'532.7' compared to 533.7 should be -1");
  equal(SC.browser.compare('533.6', 533.7), -1, "'533.6' compared to 533.7 should be -1");
  equal(SC.browser.compare('533.7', 533.7), 0, "'533.7' compared to 533.7 should be 0");
  equal(SC.browser.compare('533', 533.7), 0, "'533' compared to 533.7 should be 0");
  equal(SC.browser.compare('533.8', 533.7), 1, "'533.8' compared to 533.7 should be 1");
  equal(SC.browser.compare('534.7', 533.7), 1, "'534.7' compared to 533.7 should be 1");

  // Use SC.browser.compare() to determine if the given OS is IE7 like as
  // was/is in use in SC.Pane.
  equal(SC.browser.compare('6.0', '7.0'), -1, "'6.0' compared to '7.0' should be -1");
  equal(SC.browser.compare('7.0', '7.0'), 0, "'7.0' compared to '7.0' should be 0");
  equal(SC.browser.compare('7', '7.0'), 0, "'7' compared to '7.0' should be 0");
  equal(SC.browser.compare('7.1', '7.0'), 1, "'7.1' compared to '7.0' should be 1");
  equal(SC.browser.compare('8.0', '7.0'), 1, "'8.0' compared to '7.0' should be 1");

  equal(SC.browser.compare('6.0', 7.0), -1, "'6.0' compared to `7.0 should be -1");
  equal(SC.browser.compare('7.0', 7.0), 0, "'7.0' compared to 7.0 should be 0");
  equal(SC.browser.compare('7', 7.0), 0, "'7' compared to 7.0 should be 0");
  equal(SC.browser.compare('7.1', 7.0), 0, "'7.1' compared to 7.0 should be 0");
  equal(SC.browser.compare('8.0', 7.0), 1, "'8.0' compared to 7.0 should be 1");
});

});minispade.register('sproutcore-foundation/~tests/system/builder', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// ========================================================================
// SC.Builder Base Tests
// ========================================================================
/*globals module test ok isObj equals expects */

var obj; //global variables

// Test cases for pushStack and end functions
module("Builder",{

	  setup: function(){
	  	obj = [1,2,3,4];

	}
});

test("To check if the set of array elements are pushed into stack",function(){

    var c = SC.Builder.fn.pushStack(obj);
    equal(4,obj.length = c.length,'No Of elements in the stack');
    equal(YES,obj[0]==c[0],'First element');
    equal(YES,obj[1]==c[1],'Second element');
    equal(YES,obj[2]==c[2],'Third element');
    equal(YES,obj[3]==c[3],'Fourth element');

    var d = SC.Builder.fn.end();
    equal(YES,SC.typeOf(d) == SC.T_HASH,'Previous item returned');
});

test("create a new builder subclass with any passed properties copied to the builder's 'fn' property",function(){
	obj =SC.Builder.create({ name : 'Charles'});
	var fn_name =obj.fn.name;
	equal(fn_name,"Charles","name should match");
});

test("instantiate the builder, any passed args will be forwarded onto an internal init() method",function(){
	obj = new SC.Builder({name : 'Charles',age :23, sex :'M'});
	var objA =obj.fn.init();
	equal(objA.name,obj.fn.name);
	equal(objA.age,obj.fn.age);
	equal(objA.sex,obj.fn.sex);
});
});minispade.register('sproutcore-foundation/~tests/system/color', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// ...............................................
// SC.Color.from parsing
//

module("SC.Color");

function matches(c, r, g, b, a, msg) {
  var isEqual = c.get('r') === r &&
                c.get('g') === g &&
                c.get('b') === b &&
                c.get('a') === a;
  ok(isEqual, msg + " [rgba(%@, %@, %@, %@) === rgba(%@, %@, %@, %@)]".fmt(r, g, b, a,
                                                                     c.get('r'), c.get('g'), c.get('b'), c.get('a')));
};

test("from(rgb)", function () {
  matches(SC.Color.from("rgb(212, 15, 2)"),
                             212, 15, 2, 1,
                        "rgb() colors should be parseable");
  matches(SC.Color.from("rgb(10000, 20, 256)"),
                             255, 20, 255, 1,
                        "Colors should be clamped to the device gamut");

  matches(SC.Color.from("rgb(10%, 20%, 30%)"),
                             26, 51, 77, 1,
                        "rgb should allow percents as values");

  matches(SC.Color.from("rgb(140%, 200%, 350%)"),
                             255, 255, 255, 1,
                        "rgb percents should be clamped to the device gamut");

  ok(SC.Color.from("rgb(1,2,3)"), "Whitespace shouldn't matter");
  ok(SC.Color.from("rgb(1   ,           2   ,   3  )"), "Whitespace shouldn't matter");
});

test("from(rgba)", function () {
  matches(SC.Color.from("rgba(212, 15, 2, .2)"),
                              212, 15, 2, .2,
                        "rgba() colors should be parseable");
  matches(SC.Color.from("rgba(260, 255, 20, 1.5)"),
                              255, 255, 20, 1,
                        "Alpha should be clamped to 1");

  matches(SC.Color.from("rgba(10%, 20%, 30%, .5)"),
                             26, 51, 77, .5,
                        "rgba should allow percents as values");

  matches(SC.Color.from("rgba(140%, 200%, 350%, .5)"),
                             255, 255, 255, .5,
                        "rgba percents should be clamped to the device gamut");

  ok(!SC.ok(SC.Color.from("rgba(255, 255, 255, -.2)")),
     "Invalid alpha should create an SC.Color in error state");

  ok(SC.Color.from("rgba(1,2,3,1)"), "Whitespace shouldn't matter");
  ok(SC.Color.from("rgba(1   ,           2   ,   3 , 1 )"), "Whitespace shouldn't matter");
});

test("from() with invalid rgb colors", function () {
  ok(!SC.ok(SC.Color.from("rgb(0, 0, 0, 0)")), "Too many arguments");

  ok(!SC.ok(SC.Color.from("rgba(0, 0, 0)")), "Too few arguments");
  ok(!SC.ok(SC.Color.from("rgb(0, 0)")), "Too few arguments");

  ok(!SC.ok(SC.Color.from("rgb(0.0, 0.0, 0.0)")), "Floats are not allowed");

  ok(!SC.ok(SC.Color.from("rgb(0, 0, 0")), "Missing parenthesis");

  ok(!SC.ok(SC.Color.from("rgb(260, -10, 5)")), "Negative numbers");
});

test("from(#rgb)", function () {
  matches(SC.Color.from("#21a"),
          34, 17, 170, 1,
          "#rgb colors should be parseable");

  ok(SC.Color.from("#ABC").isEqualTo(
     SC.Color.from("#abc")),
     "Character casing should not matter with hex colors");
});

test("from(#rrggbb)", function () {
  matches(SC.Color.from("#ABCDEF"),
          171, 205, 239, 1,
          "#rrggbb colors should be parseable");

  ok(SC.Color.from("#ABCDEF").isEqualTo(
     SC.Color.from("#abcdef")),
     "Character casing should not matter with hex colors");
});

test("from(#aarrggbb)", function () {
  matches(SC.Color.from("#00ABCDEF"),
          171, 205, 239, 0,
          "#aarrggbb colors should be parseable");

  ok(SC.Color.from("#BAABCDEF").isEqualTo(
     SC.Color.from("#baabcdef")),
     "Character casing should not matter with hex colors");
});

test("from() with invalid hex colors", function () {
  ok(!SC.ok(SC.Color.from("#GAB")), "Invalid character");

  ok(!SC.ok(SC.Color.from("#0000")), "Invalid length");
  ok(!SC.ok(SC.Color.from("#00000")), "Invalid length");
  ok(!SC.ok(SC.Color.from("#0000000")), "Invalid length");
});

test("SC.Color error state", function() {
  var color = SC.Color.create(); // black
  color.set('r', 255); // red
  matches(color, 255, 0, 0, 1, "PRELIM: Color is as expected");
  color.set('cssText', 'nonsense'); //error (transparent)
  ok(color.get('isError'), "Setting cssText to nonsense puts the color in an error state.");
  equal(color.get('errorValue'), 'nonsense', "Errored color's errorValue property should be");
  equal(color.get('cssText'), 'nonsense', "Errored color's cssText should be");
  equal(color.get('validCssText'), 'transparent', "Errored color's validCssText should be");
  color.set('g', 255); // shouldn't work
  equal(color.get('g'), 0, "Color values become read-only while in error state");
  color.reset(); // back to red
  ok(!color.get('isError'), "Resetting an errored color should remove the error flag.");
  matches(color, 255, 0, 0, 1, "Resetting an errored color should reset its values to last-good values");
})

test("from(hsl)", function () {
  matches(SC.Color.from("hsl(330, 60%, 54%)"),
          208, 67, 138, 1,
          "hsl() colors should be parseable");

  matches(SC.Color.from("hsl(-90, 50%, 44%)"),
          112, 56, 168, 1,
          "negative hues should be allowed");

  matches(SC.Color.from("hsl(-810, 50%, 44%)"),
          112, 56, 168, 1,
          "negative hues should be allowed");

  matches(SC.Color.from("hsl(690, 60%, 54%)"),
          208, 67, 138, 1,
          "hues above 360 degrees should be valid");

  matches(SC.Color.from("hsl(1050, 60%, 54%)"),
          208, 67, 138, 1,
          "hues above 360 degrees should be valid");

  matches(SC.Color.from("hsl(1050, 150%, 190%)"),
          255, 255, 255, 1,
          "luminosity and saturation should be clamped between 0 and 100");

  ok(SC.Color.from("hsl(1,2%,3%)"), "Whitespace shouldn't matter");
  ok(SC.Color.from("hsl(1   ,           2%   ,   3% )"), "Whitespace shouldn't matter");
});

test("from(hsla)", function () {
  matches(SC.Color.from("hsla(210, 87%, 55%, 0.4)"),
          40, 140, 240, .4,
          "hsla() colors should be parseable");

  matches(SC.Color.from("hsla(-150, 87%, 55%, 0.4)"),
          40, 140, 240, .4,
          "negative hues should be allowed");

  matches(SC.Color.from("hsla(-510, 87%, 55%, 0.4)"),
          40, 140, 240, .4,
          "negative hues should be allowed");

  matches(SC.Color.from("hsla(570, 87%, 55%, 0.4)"),
          40, 140, 240, .4,
          "hues above 360 degrees should be valid");

  matches(SC.Color.from("hsla(930, 87%, 55%, 0.4)"),
          40, 140, 240, .4,
          "hues above 360 degrees should be valid");

  matches(SC.Color.from("hsla(930, 0427%, 200%, 0.4)"),
          255, 255, 255, .4,
          "luminosity and saturation should be clamped between 0 and 100");

  ok(SC.Color.from("hsla(1,2%,3%,1)"), "Whitespace shouldn't matter");
  ok(SC.Color.from("hsla(1   ,           2%   ,   3% , 1 )"), "Whitespace shouldn't matter");
});

test("from(transparent)", function () {
  matches(SC.Color.from("transparent"),
          0, 0, 0, 0,
          "transparent should be black with an alpha of 0");
});

test("from(white, black)", function () {
  matches(SC.Color.from("white"),
          255, 255, 255, 1,
          "white should convert to rgb(255, 255, 255)");

  matches(SC.Color.from("black"),
          0, 0, 0, 1,
          "black should convert to rgb(0, 0, 0)");
});

// ...............................................
// SC.Color helper functions
//

test("clamp", function () {
  equal(SC.Color.clamp(0, 0, 1), 0);
  equal(SC.Color.clamp(.5, 0, 1), .5);
  equal(SC.Color.clamp(1, 0, 1), 1);

  equal(SC.Color.clamp(-1, 0, 1), 0);
  equal(SC.Color.clamp(2, 0, 1), 1);
});

test("clampInt", function () {
  equal(SC.Color.clampInt(0, 0, 1), 0);
  equal(SC.Color.clampInt(.5, 0, 1), 1);
  equal(SC.Color.clampInt(1, 0, 1), 1);

  equal(SC.Color.clampInt(-1, 0, 1), 0);
  equal(SC.Color.clampInt(2, 0, 1), 1);
});

test("clampToDeviceGamut", function () {
  equal(SC.Color.clampToDeviceGamut(250.25), 250);
  equal(SC.Color.clampToDeviceGamut(260), 255);
  equal(SC.Color.clampToDeviceGamut(-20), 0);
});

test("supportsArgb", function () {
  ok(SC.Color.hasOwnProperty('supportsArgb'),
     "supportsARGB should exist on SC.Color");
});

test("supportsRgba", function () {
  ok(SC.Color.hasOwnProperty('supportsRgba'),
     "supportsRGBA should exist on SC.Color");
});

// ...............................................
// SC.Color color space conversion functions
//

test("hsvToRgb", function () {
  var rgb = SC.Color.hsvToRgb(252, .94, .7843),
      isValid;

  isValid = rgb[0] === 50 &&
            rgb[1] === 12 &&
            rgb[2] === 200;
  ok(isValid, "[rgb(50, 12, 200) === rgb(" + rgb.join(', ') + ")");
});

test("rgbToHsv", function () {
  var hsv = SC.Color.rgbToHsv(50, 12, 200),
      isValid;

  hsv[0] = Math.round(hsv[0]);
  hsv[1] = Math.round(hsv[1] * 100);
  hsv[2] = Math.round(hsv[2] * 100);

  isValid = hsv[0] === 252 &&
            hsv[1] === 94 &&
            hsv[2] === 78;
  ok(isValid, "[rgb(50, 12, 200) === hsv(212, 75%, 49%) === hsv(" + hsv.join(', ') + ")]");
});

test("Converting between color spaces doesn't reduce accuracy", function () {
  var rgb = [20, 145, 42],
      cRgb = SC.Color.hsvToRgb.apply(null, SC.Color.rgbToHsv.apply(null, rgb));

  ok(rgb[0] === cRgb[0] &&
     rgb[1] === cRgb[1] &&
     rgb[2] === cRgb[2]);

  cRgb = SC.Color.hslToRgb.apply(null, SC.Color.rgbToHsl.apply(null, rgb));

  ok(rgb[0] === cRgb[0] &&
     rgb[1] === cRgb[1] &&
     rgb[2] === cRgb[2]);
});

// ...............................................
// SC.Copyable
//

test("isCopyable", function () {
  ok(SC.Copyable.detect(SC.Color.create()));
});

test("SC.Color copy() creates a clone of the current color", function () {
  var teal = SC.Color.from("teal"),
      cTeal = teal.copy();

  ok(teal.isEqualTo(cTeal), "the colors should be equivalent");
  teal.incrementProperty('hue', 30);
  ok(!teal.isEqualTo(cTeal), "mutating one color should not affect the other");
});

// ...............................................
// SC.Color properties
//

test("cssText", function () {
  var color = SC.Color.create({
    r: 255, g: 255, b: 255
  });
  equal(color.get('cssText'), '#ffffff');

  color.set('r', 0);
  equal(color.get('cssText'), '#00ffff');

  color.set('g', 128);
  equal(color.get('cssText'), '#0080ff');

  color.set('b', 128);
  equal(color.get('cssText'), '#008080');

  color.set('a', 0.5);
  ok(color.get('cssText') !== '#008080');
});

test("hue", function () {
  var color = SC.Color.from("hsl(330, 60%, 54%)"),
      round = Math.round;

  equal(round(color.get('hue')), 330);

  color.set('hue', 300);

  equal(color.get('r'), 208);
  equal(color.get('g'), 67);
  equal(color.get('b'), 208);

  equal(round(color.get('hue')), 300);
});

test("saturation", function () {
  var color = SC.Color.from("hsl(330, 60%, 54%)"),
      round = Math.round;

  equal(round(color.get('saturation') * 100), 60);

  color.set('saturation', .5);

  equal(color.get('r'), 196);
  equal(color.get('g'), 79);
  equal(color.get('b'), 138);

  equal(round(color.get('saturation') * 100), 50);
});

test("luminosity", function () {
  var color = SC.Color.from("hsl(330, 60%, 54%)"),
      round = Math.round;

  equal(round(color.get('luminosity') * 100), 54);

  color.set('luminosity', .74);

  equal(color.get('r'), 228);
  equal(color.get('g'), 149);
  equal(color.get('b'), 189);

  equal(round(color.get('luminosity') * 100), 74);
});

test("isEqualTo", function () {
  var white = SC.Color.from("white"),
      cWhite = SC.Color.create({ r: 255, g: 255, b: 255 });

  ok(white.isEqualTo(cWhite));
});

test("toRgb", function () {
  equal(SC.Color.create({ r: 50, g: 240, b: 250, a: .4 }).toRgb(),
         "rgb(50,240,250)");

  equal(SC.Color.create({ r: -50, g: 270, b: 250 }).toRgb(),
         "rgb(0,255,250)",
         "Color clamping should occur");
});

test("toRgba", function () {
  equal(SC.Color.create({ r: 50, g: 240, b: 250, a: .4 }).toRgba(),
         "rgba(50,240,250,0.4)");

  equal(SC.Color.create({ r: -50, g: 270, b: 250 }).toRgba(),
         "rgba(0,255,250,1)",
         "Color clamping should occur");
});

test("toHex", function () {
  equal(SC.Color.create({ r: 50, g: 240, b: 250, a: .4 }).toHex(),
         "#32f0fa");

  equal(SC.Color.create({ r: -50, g: 270, b: 250 }).toHex(),
         "#00fffa",
         "Color clamping should occur");
});

test("toArgb", function () {
  equal(SC.Color.create({ r: 50, g: 240, b: 250, a: .4 }).toArgb(),
         "#6632f0fa");

  equal(SC.Color.create({ r: -50, g: 270, b: 250 }).toArgb(),
         "#ff00fffa",
         "Color clamping should occur");
});

test("toHsl", function () {
  equal(SC.Color.create({ r: 50, g: 240, b: 250, a: .4 }).toHsl(),
         "hsl(183,95%,59%)");

  equal(SC.Color.create({ r: -50, g: 270, b: 250 }).toHsl(),
         "hsl(179,100%,50%)",
         "Color clamping should occur");
});

test("toHsla", function () {
  equal(SC.Color.create({ r: 50, g: 240, b: 250, a: .4 }).toHsla(),
         "hsla(183,95%,59%,0.4)");

  equal(SC.Color.create({ r: -50, g: 270, b: 250 }).toHsla(),
         "hsla(179,100%,50%,1)",
         "Color clamping should occur");
});

test("add", function () {
  var white = SC.Color.create({ r: 255, g: 255, b: 255 }),
      red = SC.Color.create({ r: 255, g: 0, b: 25, a: .4 }),
      c;

  c = white.add(red);
  equal(c.get('r'), 510);
  equal(c.get('g'), 255);
  equal(c.get('b'), 280);
  equal(c.get('a'), 1.4);
});

test("sub", function () {
  var white = SC.Color.create({ r: 255, g: 255, b: 255 }),
      red = SC.Color.create({ r: 255, g: 0, b: 25, a: .4 }),
      c;

  c = white.sub(red);
  equal(c.get('r'), 0);
  equal(c.get('g'), 255);
  equal(c.get('b'), 230);
  equal(c.get('a'), .6);
});

test("mult", function () {
  var c = SC.Color.create({ r: 10, g: 20, b: 30 });

  c = c.mult(.5);
  equal(c.get('r'), 5);
  equal(c.get('g'), 10);
  equal(c.get('b'), 15);
  equal(c.get('a'), .5);
});

});minispade.register('sproutcore-foundation/~tests/system/core_query/within', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ========================================================================
// CoreQuery Tests
// ========================================================================

// This file tests additions to CoreQuery.  These should function even if you use
// jQuery
module("CoreQuery.within() && within()");

test("should return if passed RAW element that is child", function() {
  var cq = SC.$('<div class="root">\
    <div class="middle">\
      <div class="child1"></div>\
      <div class="child2"></div>\
    </div>\
  </div>') ;

  var child = cq.find('.child1');
  equal(cq.within(child.get(0)), YES, "cq.within(DOMElement) = YES") ;

  var notChild = SC.$('<div class="not-child"></div>') ;
  equal(cq.within(notChild.get(0)), NO, "cq.hadChild(DOMElement) = NO");
  child = notChild = cq = null ;
}) ;

test("should return if passed CQ with element that is child", function() {
  var cq = SC.$('<div class="root">\
    <div class="middle">\
      <div class="child1"></div>\
      <div class="child2"></div>\
    </div>\
  </div>') ;

  var child = cq.find('.child1');
  equal(cq.within(child), YES, "cq.within(DOMElement) = YES") ;

  var notChild = SC.$('<div class="not-child"></div>') ;
  equal(cq.within(notChild), NO, "cq.hadChild(DOMElement) = NO");
  child = notChild = cq = null ;
}) ;

test("should work if matched set has multiple element", function() {
  var cq = SC.$('<div class="wrapper">\
    <div class="root"></div>\
    <div class="root"></div>\
    <div class="root">\
      <div class="middle">\
        <div class="child1"></div>\
        <div class="child2"></div>\
      </div>\
    </div>\
  </div>').find('.root') ;
  equal(cq.length, 3, "should have three element in matched set");

  var child = cq.find('.child1');
  equal(cq.within(child), YES, "cq.within(DOMElement) = YES") ;

  var notChild = SC.$('<div class="not-child"></div>') ;
  equal(cq.within(notChild), NO, "cq.hadChild(DOMElement) = NO");
  child = notChild = cq = null ;
}) ;

test("should return YES if matching self", function() {
  var cq = SC.$('<div></div>');
  equal(cq.within(cq), YES, "should not match");
});

});minispade.register('sproutcore-foundation/~tests/system/cursor', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module, test, htmlbody*/

module("SC.Cursor", {
  setup: function () {
    htmlbody('<style title="wrong-style"></style>');
  },

  teardown: function () {
    clearHtmlbody();
  }
});

/**
  There was a bug that if any additional style elements exist in the body
  the cursor would create a stylesheet in the head, but then retrieve the
  last stylesheet object which would be wrong.
*/
test("The cursor's stylesheet object should be the right object.", function () {
  var actual = SC.Cursor.sharedStyleSheet(),
    wrong;

  wrong = document.styleSheets[document.styleSheets.length - 1];
  ok(actual !== wrong, "The last stylesheet is not correct.");
});

});minispade.register('sproutcore-foundation/~tests/system/event', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// // ========================================================================
// SC.Event Tests
// ========================================================================
(function () {
  module("SC.Event");

  // WebKit browsers have equal values for keyCode and charCode on keypress event
  test("commandCodes() : should handle equal keyCode and charCode on keypress", function () {
    // 115 is also keyCode for F4 button
    var codes = new SC.Event({ type: 'keypress', keyCode: 115, charCode: 115 }).commandCodes();
    equal(codes[0], null, 'command');
    equal(codes[1], 's', 'char');
  });  
})();


});minispade.register('sproutcore-foundation/~tests/system/locale', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var LocaleObject;
module("object.SC.Locale()", {
		setup: function() {

			LocaleObject = SC.Locale.createWithMixins({
				init: function(){
					this._super();
					//hash of new languages
					var newLocales = { deflang: 'dl', empty: '' };

					//Added the new languages to the existing list of locales
					SC.Locale.addStrings(newLocales);
				}
			});

		}
	});

test("Locale.init() : Should return a flag if the language has been set during the locale initialization", function() {
	// As the locale is added during initialization the value of hasString is true
	equal(LocaleObject.hasStrings, true) ;

	//check the string values.
	equal(LocaleObject.strings.deflang, 'dl') ;
});


test("Locale.locWithDefault() : localized version of the string or the string if no match was found", function() {
	//Based on the input passed it should return the default locale
	equal(LocaleObject.locWithDefault("en"), "en") ;
	equal(LocaleObject.locWithDefault("jp", "Japanese"), "Japanese") ;
	equal(LocaleObject.locWithDefault('deflang'), "dl") ;
});

test("Locale.locWithDefault() : localized version of the string even if localized version is blank", function() {
  equal(LocaleObject.locWithDefault("empty"), "");
  equal(LocaleObject.locWithDefault("empty", "Empty"), "");
});

test("Locale.addStrings() : Should be able to add the passed hash of strings to the locale's strings table", function() {

	//Check for the new languages. This should be false as these are not added to the list of locales
	equal(false, SC.Locale.options().strings.chinese === 'zh' && SC.Locale.options().strings.dutch === 'nl') ;

	//hash of new languages
	var newLocales = { chinese: 'zh', czech: 'cs', dutch: 'nl'};

	//Added the new languages to the existing list of locales
	SC.Locale.addStrings(newLocales);

	//Result should be true as the new locales added to the list of default locales
	equal(true, SC.Locale.options().strings.chinese === 'zh' && SC.Locale.options().strings.dutch === 'nl') ;
});

/**
	There was a bug in SC.Locale where the `strings` object was cloned for each
	subclass but then the original `strings` object was used to mix in new strings
	and applied back.  This meant that each subclass ended up sharing the
	`strings` object and only one set of localizations (the last one) would exist.
*/
test("Locale.extend.addStrings() : Subclasses should not share the strings object.", function() {
	var strings;

	strings = { 'hello': 'Hello' };
	SC.Locale.locales.en.addStrings(strings);

	strings = { 'hello': 'Bonjour' };
	SC.Locale.locales.fr.addStrings(strings);

	//Result should be true as the new locales added to the list of default locales
	ok(SC.Locale.locales.en.prototype.strings !== SC.Locale.locales.fr.prototype.strings, "The strings object should not be shared between subclasses.");
});

test("Locale.options() : Should provide the registered locales that have not been instantiated", function() {

		//hash of new languages
		var newLocales = { jamaican: 'ji', korean: 'ko'};

		//Added the new languages to the existing list of locales
		SC.Locale.addStrings(newLocales);

		//Options should return the list of registered locales, so checking if the returned object has strings.
		equal(SC.Locale.options().hasStrings, true) ;

		//Checking the strings with default locales.
		equal(true, SC.Locale.options().strings.jamaican === 'ji' && SC.Locale.options().strings.korean === 'ko') ;
	});

test("Locale.normalizeLanguage() : Should provide the two character language code for the passed locale", function() {
	//If nothing is passed this will return the default code as 'en'
	equal(SC.Locale.normalizeLanguage(), 'en') ;

	//If the language is passed as 'English' this will return the code as 'en'
	equal(SC.Locale.normalizeLanguage('English'), 'en') ;

	//For any other code passed which is not in the default code it should return as it was passed
	equal(SC.Locale.normalizeLanguage('ab'), 'ab') ;
});

// test("Locale.toString() : Should return the current language set with the guid value", function() {
//   //TODO test does not match description
//   // Creating the new locale by extending an existing Locale object
//   SC.Locale.locales['mx'] = SC.Locale.extend({ _deprecatedLanguageCodes: ['mexican'] }) ;
//
//   ok(SC.Locale.locales.mx.currentLocale) ;
// });

test("Locale.createCurrentLocale() : Should create the Locale Object for the language selected", function() {
	//This will match the browser language with the SC language and create the object accordingly
	// This test will pass only for the default languages i.e en, fr, de, ja, es, it.
	equal(true, SC.Locale.createCurrentLocale().language === SC.browser.language) ;

	//Resetting the default browser language
	SC.browser.language='kn';

	//This is false as currentLocale will be created as 'en'
	equal(false, SC.Locale.createCurrentLocale().language===SC.browser.language) ;
});

test("Locale.localeClassFor() : Should find the locale class for the names language code or creates on based on its most likely parent", function() {
 		// Local Class for any language other than default languages will be 'en'. Therefore this condition is false
	equal(false, SC.Locale.localeClassFor('nl').create().language === "nl") ;

	// This adds the new language with the parent language to the default list
	SC.Locale.locales['nl'] = SC.Locale.extend({ _deprecatedLanguageCodes: ['Dutch'] }) ;

	//This condition is true as the local class now exists for 'nl'
	equal(true, SC.Locale.localeClassFor('nl').create().language==="nl") ;
});

test("Locale.define() : Should be able to define a particular type of locale", function() {
 		SC.Locale.define('xy', {
		longNames: 'Charles John Romonoski Gregory William'.split(' '),
		shortNames: ['C','A','Y','N']
	});

	//Result should return the new locale object
	equal(SC.Locale.locales.xy.isClass, true) ;
});

test("Locale.extend() : Should make sure important properties of Locale object are copied to a new class", function() {
	SC.Locale.locales['mn'] = SC.Locale.extend({ _deprecatedLanguageCodes: ['newlang'] }) ;

	//hash of new languages
	var testLocales = { test: 'te', newtest: 'nt'};
	//Added the new languages to the existing list of locales through the new locale object
	SC.Locale.locales.mn.addStrings(testLocales);

	//Result should be true as the new locales added to the list of default locales
	equal(SC.Locale.locales.mn.options().strings.test,'te') ;
});

});minispade.register('sproutcore-foundation/~tests/system/platform', function() {// ==========================================================================
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

});minispade.register('sproutcore-foundation/~tests/system/ready/done', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var realMainFunction, realApplicationMode, timesMainCalled;
module("SC.onReady.done", {
  setup: function() {
    timesMainCalled = 0;

    realMainFunction = window.main;
    window.main = function() {
      timesMainCalled += 1;
    };

    realApplicationMode = SC.mode;
  },

  teardown: function() {
    window.main = realMainFunction;
    SC.mode = realApplicationMode;
    SC.isReady = false;
  }
});

test("When the application is done loading in test mode", function() {
  SC.mode = SC.TEST_MODE;
  SC.onReady.done();

  equal(timesMainCalled, 0, "main should not have been called");
});

test("When the application is done loading in application mode", function() {
  SC.mode = SC.APP_MODE;
  SC.onReady.done();

  equal(timesMainCalled, 1, "main should have been called");
});

});minispade.register('sproutcore-foundation/~tests/system/render_context/begin', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok */

var context = null;

module("SC.RenderContext#begin", {
  setup: function() {
    context = SC.RenderContext();
  }
});

test("should return a new context with parent context as prevObject", function() {
  var c2 = context.begin();
  ok(c2 !== context, "new context");
  equal(c2.prevObject, context, 'previous context');
});

test("should set offset for new context equal to length of previous context", function() {
  context.push("line1");
  var expected = context.length ;
  var c2 = context.begin();
  equal(c2.offset, expected, "offset");
});

test("should copy same strings array to new child context", function() {
  context.push("line1");
  var c2 =context.begin();
  equal(c2.strings, context.strings);
});

test("should start new context with length of 1 (reserving a space for opening tag)", function() {
  context.push("line1");
  var c2 = context.begin() ;
  equal(c2.length, 1, 'has empty line');
  equal(c2.strings.length, 3, "parent empty line + parent line + empty line");
});

test("should assign passed tag name to new context", function() {
  var c2 = context.begin('foo');
  equal(c2.tagName(), 'foo', 'tag name');
});

});minispade.register('sproutcore-foundation/~tests/system/render_context/element', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok */

var context = null;

module("SC.RenderContext#element", {
  setup: function() {
    context = SC.RenderContext() ;
  },
  
  teardown: function() {
    context = null;
  }
});

test("converts context to a DOM element and returns root element if there is one", function() {
  context.id('foo');
  var elem = context.element();
  ok(elem, 'elem not null');
  equal(elem.tagName.toString().toLowerCase(), 'div', 'is div');
  equal(elem.id.toString(), 'foo', 'is id=foo');
  elem = null ;
});

test("returns null if context does not generate valid element", function() {
  context = SC.RenderContext(null);
  var elem = context.element();
  equal(elem, null, 'should be null');
  elem = null;
});

test("returns first element if context renders multiple element", function() {
  context.tag('div').tag('span');
  var elem = context.element();
  ok(elem, 'elem not null');
  equal(elem.tagName.toString().toLowerCase(), 'div', 'is div');
  elem = null;
});

});minispade.register('sproutcore-foundation/~tests/system/render_context/end', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok */

var context = null;

module("SC.RenderContext#end", {
  setup: function() {
    context = SC.RenderContext();
  }
});

test("should replace opening tag with string and add closing tag, leaving middle content in place", function() {
  context.push("line1").end();
  equal(context.get(0), "<div>", "opening tag");
  equal(context.get(1), "line1", "opening tag");
  equal(context.get(2), "</div>", "closing tag");
});

test("should emit any CSS class names included in the tag opts.addClass array", function() {
  context.addClass("foo bar".w()).end();
  ok(context.get(0).match(/class=\"(?:bar|foo)\s*(?:foo|bar)\s*\"/), '<div> has classes foo bar') ;
});

test("should emit id in tag opts.id", function() {
  context.id("foo").end();
  ok(context.get(0).match(/id=\"foo\"/), "<div> has id attr");
});

test("should emit style in tag if opts.styles is defined", function() {
  context.setStyle({ alpha: "beta", foo: "bar" }).end();
  ok(context.get(0).match(/style=\"alpha: beta; foo: bar; \"/), '<div> has style="alpha: beta; foo: bar; "');
});

test("should emit style with custom browser attributes", function() {
  context.setStyle({ mozColumnCount: '3', webkitColumnCount: '3', oColumnCount: '3', msColumnCount: '3' }).end();
  ok(context.get(0).match('<div style="-moz-column-count: 3; -webkit-column-count: 3; -o-column-count: 3; -ms-column-count: 3; " >'),
                            '<div> has style="-moz-column-count: 3; -webkit-column-count: 3, -o-column-count: 3, -ms-column-count: 3; "');
});

test("should write arbitrary attrs has in opts", function() {
  context.setAttr({ foo: "bar", bar: "baz" }).end();
  ok(context.get(0).match(/foo=\"bar\"/), 'has foo="bar"');
  ok(context.get(0).match(/bar=\"baz\"/), 'has bar="baz"');
});

test("addClass should override attrs.class", function() {
  context.addClass("foo".w()).setAttr({ "class": "bar" }).end();
  ok(context.get(0).match(/class=\"foo\"/), 'has class="foo"');
});

test("opts.id should override opts.attrs.id", function() {
  context.id("foo").setAttr({ id: "bar" }).end();
  ok(context.get(0).match(/id=\"foo\"/), 'has id="foo"');
});

test("opts.styles should override opts.attrs.style", function() {
  context.setStyle({ foo: "foo" }).setAttr({ style: "bar: bar" }).end();
  ok(context.get(0).match(/style=\"foo: foo; \"/), 'has style="foo: foo; "');
});

test("should return receiver if receiver has no prevObject", function() {
  ok(!context.prevObject, 'precondition - prevObject is null');
  equal(context.end(), context, 'ends as self');
});

test("should return prevObject if receiver has prevObject", function() {
  var c2 = context.begin();
  equal(c2.end(), context, "should return prevObject");
});

test("emits self closing tag if tag has no content and c._selfClosing !== NO", function() {
  var c2 = context.begin('input');
  c2.end();
  equal(c2.get(0), "<input />");
});

test("emits two tags even if tag has no content if opts.selfClosing == NO", function() {
  context._selfClosing = NO;

  context.end();
  equal(context.length, 2, "has two lines");
  equal(context.get(0), "<div>", "has opening tag");
  equal(context.get(1), "</div>", "has closing tag");
});

test("does NOT emit self closing tag if it has content, even if opts.selfClosing == YES (because that would yield invalid HTML)", function() {
  context._selfClosing = YES;
  context.push("line").end();
  equal(context.length, 3, "has 3 lines");
  equal(context.get(2), "</div>", "has closing tag");
});

test("it should make sure to clear reused temporary attributes object", function() {

  // generate one tag...
  context.begin('input')
    .id("foo")
    .setStyle({ foo: "bar" })
    .addClass("foo bar".w())
    .push("line")
  .end();

  // generate second tag...will reuse internal temporary attrs object.
  context.begin('input').id("bar").end();
  var str = context.get(context.length-1);
  equal(str, "<input id=\"bar\"  />");
});

test("it should work when nested more than one level deep", function() {
  context.begin().id("foo")
    .begin().id("bar").end()
  .end();

  var str = context.join('');
  ok(str.match(/id="foo"/), 'has foo');
  ok(str.match(/id="bar"/), 'has bar');
});


});minispade.register('sproutcore-foundation/~tests/system/render_context/escape_html', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context */
module("Render Context--Escaping HTML");
test("Escaping HTML", function() {
  var input = "<p>HTML!</p><script>alert('hi');<" + "/script> & Hello, World!";
  var output = SC.RenderContext.escapeHTML(input);
  
  equal(output, '&lt;p&gt;HTML!&lt;/p&gt;&lt;script&gt;alert(\'hi\');&lt;/script&gt; &amp; Hello, World!', "Properly escapes HTML");
});

module("Render Context--Escaping , preserve HTML entities like &apos;");
test("Escaping HTML, preserve HTML entities", function() {
  var input = "<p>HTML!</p><script>alert('hi');<" + "/script> &illegalese; & &amp; Hello, World!";
  var output = SC.RenderContext.escapeHTML(input);
  
  equal(output, '&lt;p&gt;HTML!&lt;/p&gt;&lt;script&gt;alert(\'hi\');&lt;/script&gt; &amp;illegalese; &amp; &amp; Hello, World!', "Properly escapes HTML");
});

test("Tests stolen from Prototype.js", function() {
  var largeTextEscaped = '&lt;span&gt;test&lt;/span&gt;', 
      largeTextUnescaped = '<span>test</span>';
  for (var i = 0; i < 2048; i++) { 
    largeTextEscaped += ' ABC';
    largeTextUnescaped += ' ABC';
  }
  
  
  var tests = [
    'foo bar', 'foo bar',
    'foo <span>bar</span>', 'foo &lt;span&gt;bar&lt;/span&gt;',
    'foo ß bar', 'foo ß bar',
    'ウィメンズ2007\nクルーズコレクション', 'ウィメンズ2007\nクルーズコレクション',
    'a<a href="blah">blub</a>b<span><div></div></span>cdef<strong>!!!!</strong>g',
      'a&lt;a href="blah"&gt;blub&lt;/a&gt;b&lt;span&gt;&lt;div&gt;&lt;/div&gt;&lt;/span&gt;cdef&lt;strong&gt;!!!!&lt;/strong&gt;g',
    '1\n2', '1\n2',
    
    largeTextUnescaped, largeTextEscaped
  ];
  
  for (var idx = 0; idx < tests.length; idx++) {
    // some of these strings are REALLY LONG so we don't want to write them out
    ok(SC.RenderContext.escapeHTML(tests[idx++]) === tests[idx]);
  }
});

test("Should accept number argument", function() {
  var number = 12345.6789,
      numStr = number.toString();
  
  equal(numStr, SC.RenderContext.escapeHTML(number), "Properly produces string when invoked with a number argument");
});

});minispade.register('sproutcore-foundation/~tests/system/render_context/get', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context */

var context = null;

module("SC.RenderContext#get", {
  setup: function() {
    context = SC.RenderContext();
  },
  
  teardown: function() {
    context = null;
  }
});

test("it should return strings array with space for top tag if no params passed and no strings pushed yet", function() {
  deepEqual(context.get(), [null]);
});

test("it should return full strings array if no params passed and no strings pushed yet", function() {
  context.push("line1");
  deepEqual(context.get(), [null, "line1"]);
});

test("it should return individual string if index passed that is within current length", function() {
  context.push("line1");
  equal(context.get(1), "line1");
});

test("it should return undefined if index passed that is outside of current range", function() {
  context.push("line1");
  equal(context.get(3), undefined);
});

// test this special case since the internal strings array is created lazily.
test("it should return undefined if index passed and no strings set yet", function() {
  equal(context.get(2), undefined);
});

test("it should return the value based on an index from the context offset of the context is chained", function() {
  context.push('line1', 'line2');
  var childContext = context.begin();
  childContext.push("NEXT");
  equal(childContext.get(1), "NEXT", 'gets child line');
}) ;

});minispade.register('sproutcore-foundation/~tests/system/render_context/helpers_attr', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same same */

var context = null;



// ..........................................................
// attr
//
module("SC.RenderContext#attr", {
  setup: function() {
    context = SC.RenderContext().setAttr({ foo: 'foo' }) ;
  }
});

test("should add passed name to value", function() {
  context.setAttr('bar', 'bar');
  equal(context._attrs.bar, 'bar', 'verify attr name');
});

test("should replace passed name  value in attrs", function() {
  context.setAttr('foo', 'bar');
  equal(context._attrs.foo, 'bar', 'verify attr name');
});

test("should return receiver", function() {
  equal(context, context.setAttr('foo', 'bar'));
});

test("should create attrs hash if needed", function() {
  context = SC.RenderContext().begin();
  equal(context._attrs, null, 'precondition - has no attrs');

  context.setAttr('foo', 'bar');
  equal(context._attrs.foo, 'bar', 'has styles');
});

test("should assign all attrs if a hash is passed", function() {
  context.setAttr({ foo: 'bar', bar: 'bar' });
  deepEqual(context._attrs, { foo: 'bar', bar: 'bar' }, 'has same styles');
});



});minispade.register('sproutcore-foundation/~tests/system/render_context/helpers_basic', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

var context = null;

// ..........................................................
// id()
// 
module("SC.RenderContext#id", {
  setup: function() {
    context = SC.RenderContext().id('foo') ;
  }
});

test("id() returns the current id for the tag", function() {
  equal(context.id(), 'foo', 'get id');
});

test("id(bar) alters the current id", function() {
  equal(context.id("bar"), context, "Returns receiver");
  equal(context.id(), 'bar', 'changed to bar');
});

});minispade.register('sproutcore-foundation/~tests/system/render_context/helpers_className', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

var context = null;

// ..........................................................
// classes()
//
module("SC.RenderContext#classes", {
  setup: function() {
    context = SC.RenderContext() ;
  }
});

test("returns empty array if no current class names", function() {
  deepEqual(context.classes(), [], 'classes') ;
});

test("addClass(array) updates class names", function() {
  var cl = 'bar baz'.w();
  equal(context.addClass(cl), context, "returns receiver");
  deepEqual(context.classes(), cl, 'class names');
});

test("returns classes if set", function() {
  context.addClass('bar');
  deepEqual(context.classes(), ['bar'], 'classNames');
});

test("clone on retrieval if addClass(array) set", function() {
  var cl = 'foo bar'.w();
  context.addClass(cl);

  var result = context.classes();
  ok(result !== cl, "class name is NOT same instance");
  deepEqual(result, cl, "but arrays are equivalent");

  equal(result, context.classes(), "2nd retrieval is same instance");
});

test("extracts class names from element on first retrieval", function() {
  var elem = document.createElement('div');
  SC.$(elem).attr('class', 'foo bar');
  context = SC.RenderContext(elem);

  var result = context.classes();
  deepEqual(result, ['foo', 'bar'], 'extracted class names');
});

// ..........................................................
// hasClass()
//
module("SC.RenderContext#hasClass", {
  setup: function() {
    context = SC.RenderContext().addClass('foo bar'.w()) ;
  }
});

test("should return true if context classNames has class name", function() {
  equal(YES, context.hasClass('foo'), 'should have foo');
});

test("should return false if context classNames does not have class name", function() {
  equal(NO, context.hasClass('imaginary'), "should not have imaginary");
});

test("should return false if context has no classNames", function() {
  context = context.begin('div');
  ok(context.classes().length === 0, 'precondition - context has no classNames');
  equal(NO, context.hasClass('foo'), 'should not have foo');
});

// ..........................................................
// addClass()
//
module("SC.RenderContext#addClass", {
  setup: function() {
    context = SC.RenderContext().addClass('foo') ;
  }
});

test("should return receiver", function() {
  equal(context.addClass('foo'), context, "receiver");
});

test("should add class name to existing classNames array on currentTag", function() {
  context.addClass('bar');
  deepEqual(context.classes(), ['foo', 'bar'], 'has classes');
  equal(context._classesDidChange, YES, "note did change");
});

test("should only add class name once - does nothing if name already in array", function() {
  deepEqual(context.classes(), ['foo'], 'precondition - has foo classname');
  context._classesDidChange = NO; // reset  to pretend once not modified

  context.addClass('foo');
  deepEqual(context.classes(), ['foo'], 'no change');
  equal(context._classesDidChange, NO, "note did not change");
});

// ..........................................................
// removeClass()
//
module("SC.RenderContext#removeClass", {
  setup: function() {
    context = SC.RenderContext().addClass(['foo', 'bar']) ;
  }
});

test("should remove class if already in classNames array", function() {
  ok(context.classes().indexOf('foo')>=0, "precondition - has foo");

  context.removeClass('foo');
  ok(context.classes().indexOf('foo')<0, "does not have foo");
});

test('should return receiver', function() {
  equal(context.removeClass('foo'), context, 'receiver');
});

test("should do nothing if class name not in array", function() {
  context._classesDidChange = NO; // reset to pretend not modified
  context.removeClass('imaginary');
  deepEqual(context.classes(), 'foo bar'.w(), 'did not change');
  equal(context._classesDidChange, NO, "note did not change");
});

test("should do nothing if there are no class names", function() {
  context = context.begin();
  deepEqual(context.classes(), [], 'precondition - no class names');
  context._classesDidChange = NO; // reset to pretend not modified

  context.removeClass('foo');
  deepEqual(context.classes(), [], 'still no class names -- and no errors');
  equal(context._classesDidChange, NO, "note did not change");
});

// ..........................................................
// setClass
//
module("SC.RenderContext#setClass", {
  setup: function() {
    context = SC.RenderContext().addClass('foo') ;
  }
});

test("should add named class if shouldAdd is YES", function() {
  ok(!context.hasClass("bar"), "precondition - does not have class bar");
  context.setClass("bar", YES);
  ok(context.hasClass("bar"), "now has bar");
});

test("should remove named class if shouldAdd is NO", function() {
  ok(context.hasClass("foo"), "precondition - has class foo");
  context.setClass("foo", NO);
  ok(!context.hasClass("foo"), "should not have foo ");
});

test("should return receiver", function() {
  equal(context, context.setClass("bar", YES), "returns receiver");
});

test("should add/remove all classes if a hash of class names is passed", function() {
  ok(context.hasClass("foo"), "precondition - has class foo");
  ok(!context.hasClass("bar"), "precondition - does not have class bar");

  context.setClass({ foo: NO, bar: YES });

  ok(context.hasClass("bar"), "now has bar");
  ok(!context.hasClass("foo"), "should not have foo ");
});

});minispade.register('sproutcore-foundation/~tests/system/render_context/helpers_style', function() {// ==========================================================================
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


});minispade.register('sproutcore-foundation/~tests/system/render_context/init', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context */

var context = null;

module("SC.RenderContext#init");

test("it should return a new context object with the passed tag name", function() {
  equal(SC.RenderContext('foo').tagName(), 'foo', 'tag name');
});

test("it should use a default tag name of div if not passed", function() {
  equal(SC.RenderContext().tagName(), 'div', 'tag name');
});

test("it should lowercase any tag name passed in", function() {
  equal(SC.RenderContext('DIV').tagName(), 'div', 'lowercase tag name');
});

test("it should have a length of 1 with a null value for the first time, saving space for the opening tag", function() {
  var context = SC.RenderContext();
  equal(context.length, 1, 'context length');
  equal(context.get(0), null, 'first item');
});

test("if script tag is passed, should mark context._selfClosing as NO" ,function() {
  var context = SC.RenderContext('script');
  ok(context._selfClosing === NO, "selfClosing MUST be no");
  
  context = SC.RenderContext('SCRIPT');
  ok(context._selfClosing === NO, "selfClosing MUST be no 2");
});

test("if element is passed, it should save element and not reserve space for string output", function() {
  var elem = document.createElement('div');
  var context = SC.RenderContext(elem);
  equal(context.length, 0, 'no length');
  equal(context._elem, elem, 'element');
  elem = context._elem = null; //cleanup
});

test("offset should should use offset + length of parent for self", function() {
  var context =SC.RenderContext('div');
  context.offset = 2;
  context.length = 3;
  var newContext = SC.RenderContext('div', context);
  equal(newContext.offset, 5, 'has proper offset');
});


});minispade.register('sproutcore-foundation/~tests/system/render_context/join', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context */

var context = null;

module("SC.RenderContext#join", {
  setup: function() {
    context = SC.RenderContext().push("line1", "line2") ;
  },
  
  teardown: function() {
    context = null;
  }
});

test("it should return joined lines with no separator string by default", function() {
  equal(context.join(), '<div>line1line2</div>');
});

test("it should return joined lines with separator string if passed", function() {
  equal(context.join(","), "<div>,line1,line2,</div>") ;
});

});minispade.register('sproutcore-foundation/~tests/system/render_context/push_text', function() {// ==========================================================================
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



});minispade.register('sproutcore-foundation/~tests/system/render_context/tag', function() {// ==========================================================================
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

});minispade.register('sproutcore-foundation/~tests/system/render_context/update', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok */

var context = null, elem = null;

module("SC.RenderContext#update", {
  setup: function() {
    elem = document.createElement('div');
    context = SC.RenderContext(elem) ;
  },

  teardown: function() {
    elem = context = null; // avoid memory leaks
  }
});

test("should replace innerHTML of DIV if strings were pushed", function() {
  elem.innerHTML = "initial";
  context.push("changed").update();
  equal(elem.innerHTML, "changed", "innerHTML did change");
});

test("should NOT replace innerHTML of DIV if no strings were pushed", function() {
  elem.innerHTML = "initial";
  context.update();
  equal(elem.innerHTML, "initial", "innerHTML did NOT change");
});

test("returns receiver if no prevObject", function() {
  equal(context.update(), context, "return value");
});

test("returns previous context if there is one", function() {
  var c2 = context.begin(elem);
  equal(c2.update(), context, "returns prev context");
});

test("clears internal _elem to avoid memory leaks on update", function() {
  ok(!!context._elem, 'precondition - has element')  ;
  context.update();
  ok(!context._elem, "no longer an element");
});

// ..........................................................
// Attribute Editing
//
module("SC.RenderContext#update - attrs", {
  setup: function() {
    elem = document.createElement('div');
    SC.$(elem).attr("foo", "initial");
    context = SC.RenderContext(elem);
  },

  teardown: function() {
    elem = context = null ;
  }
});

test("does not change attributes if attrs were not actually changed", function() {
  context.update();
  equal(elem.getAttribute("foo"), "initial", "attribute");
});

test("updates attribute if attrs changed", function() {
  context.setAttr('foo', 'changed');
  context.update();
  equal(elem.getAttribute("foo"), "changed", "attribute");
});

test("adds attribute if new", function() {
  context.setAttr('bar', 'baz');
  context.update();
  equal(elem.getAttribute("bar"), "baz", "attribute");
});

test("removes attribute if value is null", function() {
  context.setAttr('foo', null);
  context.update();
  equal(elem.getAttribute("foo"), null, "attribute");
});

// ..........................................................
// ID
//
module("SC.RenderContext#update - id", {
  setup: function() {
    elem = document.createElement('div');
    SC.$(elem).attr("id", "foo");
    context = SC.RenderContext(elem);
  },

  teardown: function() {
    elem = context = null ;
  }
});

test("does not change id if retrieved but not edited", function() {
  context.id();
  context.update();
  equal(elem.getAttribute("id"), "foo", "id");
});

test("replaces id if edited", function() {
  context.id('bar');
  context.update();
  equal(elem.getAttribute("id"), "bar", "id");
});

test("set id overrides attr", function() {
  context.setAttr("id", "bar");
  context.id('baz');
  context.update();
  equal(elem.getAttribute("id"), "baz", "should use id");
});

// ..........................................................
// Class Name Editing
//
module("SC.RenderContext#update - className", {
  setup: function() {
    elem = document.createElement('div');
    SC.$(elem).attr("class", "foo bar");
    context = SC.RenderContext(elem);
  },

  teardown: function() {
    elem = context = null ;
  }
});

test("does not change class names if retrieved but not edited", function() {
  context.classes();
  context.update();
  equal(SC.$(elem).attr("class"), "foo bar", "class");
});


// ..........................................................
// Style Editing
//
module("SC.RenderContext#update - style", {
  setup: function() {
    elem = document.createElement('div');
    SC.$(elem).attr("style", "color: red;");
    context = SC.RenderContext(elem);
  },

  teardown: function() {
    elem = context = null ;
  }
});

test("does not change styles if retrieved but not edited", function() {
  context.styles();
  context.update();
  var style = SC.$(elem).attr("style").trim();
  if (!style.match(/;$/)) style += ';' ;

  equal(style.toLowerCase(), "color: red;", "style");
});

test("replaces style name if styles edited", function() {
  context.setStyle({ color: "black" });
  context.update();

  // Browsers return single attribute styles differently, sometimes with a trailing ';'
  // sometimes, without one. Normalize it here.
  var style = SC.$(elem).attr("style").trim();
  if (!style.match(/;\s{0,1}$/)) style += ';' ;

  equal(style.toLowerCase(), "color: black;", "attribute");
});


test("set styles override style attr", function() {
  context.setAttr("style", "color: green");
  context.setStyle({ color: "black" });
  context.update();

  // Browsers return single attribute styles differently, sometimes with a trailing ';'
  // sometimes, without one. Normalize it here.
  var style = SC.$(elem).attr("style").trim();
  if (!style.match(/;$/)) style += ';' ;

  equal(style.toLowerCase(), "color: black;", "attribute");
});

test("set styles handle custom browser attributes", function() {
  context.resetStyles();
  context.setStyle({ columnCount: '3', mozColumnCount: '3', webkitColumnCount: '3', oColumnCount: '3', msColumnCount: '3' });
  context.update();

  // Browsers return single attribute styles differently, sometimes with a trailing ';'
  // sometimes, without one. Normalize it here.
  var style = SC.$(elem).attr("style").trim();
  if (!style.match(/;$/)) style += ';' ;

  // Older Gecko completely ignores css attributes that it doesn't understand.
  if(SC.browser.isMozilla) equal(style, "-moz-column-count: 3;");
  else if (SC.browser.isIE) equal(style, "-ms-column-count: 3;");
  else if (SC.browser.engine === SC.ENGINE.webkit) equal(style, "-webkit-column-count: 3;");
});

});minispade.register('sproutcore-foundation/~tests/system/selection_set/add', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var set, array, array2;
module("SC.SelectionSet#add", {
  setup: function() {
    set = SC.SelectionSet.create();
    array = '0 1 2 3 4 5 6 7 8 9'.w();
    array2 = 'a b c d e f g h i k l m'.w();
  }
});

/* 
  validates that the selection set has the expected content.  pass index sets
  with sources set appropriately.  The order of the array is not important.
*/
function validate(set, expected, defaultSource) {
  var sources = set.get('sources'),
      len  = expected.length,
      idx, cur, actual ;
      
  equal(sources.length, expected.length, 'should have same number of sources (actual sources: %@)'.fmt(sources));  
  
  for(idx=0;idx<len;idx++) {
    cur = expected[idx];
    if (!cur.source) cur.source =defaultSource; 
    actual = set.indexSetForSource(cur.source, NO);
    ok(actual, 'should have indexSet for source: %@'.fmt(cur.source));
    equal(actual.source, cur.source, 'indexSet.source should match source');
    ok(actual.isEqual(cur), 'indexSet should match for source %@ (actual: %@ expected: %@)'.fmt(cur.source, actual, cur));
  }
}

// ..........................................................
// BASIC ADDS
// 

test("Adding indexes for single source", function() {
  set.add(array, 4, 3);
  validate(set, [SC.IndexSet.create(4,3)], array);

  set.add(array, 1);
  validate(set, [SC.IndexSet.create(1).add(4,3)], array);
});

test("Adding multiple sources", function() {
  var expected = SC.IndexSet.create(4,3);
  var expected2 = SC.IndexSet.create(1);
  expected.source = array;
  expected2.source = array2;
  
  set.add(array, 4, 3);
  validate(set, [expected]);

  set.add(array2, 1);
  validate(set, [expected, expected2]);
});

test("Adding IndexSet with source", function() {
  var expected = SC.IndexSet.create(4,3);
  expected.source = array;
  
  set.add(expected);
  validate(set, [expected]);
});

test("Adding another SelectionSet", function() {
  var expected = SC.IndexSet.create(4,3);
  var expected2 = SC.IndexSet.create(1,5);
  expected.source = array;
  expected2.source = array2;
  
  set.add(array, 4, 3);
  validate(set, [expected]);

  var set2 = SC.SelectionSet.create().add(array2, 1, 5);
  validate(set2, [expected2]);
  
  set.add(set2);
  validate(set, [expected, expected2]);
});

test("Adding indexes with range object !!", function() {
  set.add(array, { start: 4, length: 3 });
  validate(set, [SC.IndexSet.create(4,3)], array);
});




});minispade.register('sproutcore-foundation/~tests/system/selection_set/copy', function() {// ==========================================================================
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

});minispade.register('sproutcore-foundation/~tests/system/selection_set/indexSetForSource', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var set, array, array2;
module("SC.SelectionSet#indexSetForSource", {
  setup: function() {
    set = SC.SelectionSet.create();
    array = '0 1 2 3 4 5 6 7 8 9'.w();
    array2 = 'a b c d e f g h i k l m'.w();
  }
});

test("empty selection set", function() {
  equal(set.indexSetForSource(array), null, 'should return null for source not in set');
  equal(set.indexSetForSource(array2), null, 'should return null for source not in set (2)');
});

test("selection set if index range is added", function() {
  var ret;

  set.add(array, 3,4);
  ret = set.indexSetForSource(array);
  ok(ret, 'should return an index set for the array');
  ok(ret.isEqual(SC.IndexSet.create(3,4)), 'should be index set that was added');

  set.remove(array,3,1);
  ret = set.indexSetForSource(array);
  ok(ret.isEqual(SC.IndexSet.create(4,3)), 'should return new index set when membership changes');

  set.add(array,10,1);
  ret = set.indexSetForSource(array);
  ok(ret.isEqual(SC.IndexSet.create(4,3).add(10,1)), 'should return combined index set when multiple items are added');
});

test("selection set if objects in index set are added", function() {
  var ret ;
  set.addObjects(["0", 'a']);

  ret = set.indexSetForSource(array);
  ok(ret.isEqual(SC.IndexSet.create(0,1)), 'should return index set with objects found in set interpolated');

  ret = set.indexSetForSource(array2);
  ok(ret.isEqual(SC.IndexSet.create(0,1)), 'should return index set with objects found in set interpolated (2)');

  set.removeObject("0");
  ret = set.indexSetForSource(array);
  equal(ret, null, 'should return null when matching objects are removed');

  ret = set.indexSetForSource(array2);
  ok(ret.isEqual(SC.IndexSet.create(0,1)), 'removing other objects should not effect');

});


test("selection set if objects and ranged are added", function() {
  var ret ;
  set.add(array, 4,3).addObjects(["0", 'a']);

  ret = set.indexSetForSource(array);
  ok(ret.isEqual(SC.IndexSet.create(0,1).add(4,3)), 'should return index set with objects found in set interpolated');

  ret = set.indexSetForSource(array2);
  ok(ret.isEqual(SC.IndexSet.create(0,1)), 'should return index set with objects found in set interpolated (2)');

  set.removeObject("0");
  ret = set.indexSetForSource(array);
  ok(ret.isEqual(SC.IndexSet.create(4,3)), 'should return just range when objects are removed');

  ret = set.indexSetForSource(array2);
  ok(ret.isEqual(SC.IndexSet.create(0,1)), 'removing other objects should not effect');

});


// ..........................................................
// SPECIAL CASES
//

test("add and remove source", function() {
  set.add(array, 3,4).remove(array, 3,4);
  equal(set.indexSetForSource(array), null, 'should return null for source not in set');
});

test("looking up indexSet for source when objects are added should recache when source content changes", function() {
  var obj = array.objectAt(0), ret;

  set = SC.SelectionSet.create().addObject(obj);
  ret = set.indexSetForSource(array);
  ok(ret.isEqual(SC.IndexSet.create(0)), 'should return index set with item at 0');

  array.removeObject(obj).pushObject(obj); // move obj to end.
  ret = set.indexSetForSource(array) ;
  var newSet = SC.IndexSet.create(array.indexOf(obj));
  ok(ret.isEqual(newSet), 'should return index set with item at end [expected: %@, got: %@]'.fmt(ret.inspect(), newSet.inspect()));

});

});minispade.register('sproutcore-foundation/~tests/system/selection_set/isEqual', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// TODO: Make these unit tests more complete.

var set1, set2, content;
module("SC.SelectionSet.isEqual", {
  setup: function() {
    content = '1 2 3 4 5 6 7 8 9 0'.w();
    set1 = SC.SelectionSet.create();
    set2 = SC.SelectionSet.create();
  }
});

test("set.isEqual(same instance)", function() {
  ok(set1.isEqual(set1), 'same instance should return YES');
});

test("set.isEqual(null)", function() {
  ok(!set1.isEqual(null), 'null should return NO');
});


test("set1.isEqual(set2)", function() {
  ok(set1.isEqual(set2), 'same content should return YES');
  
  set1.add(content, 4,4);
  set2.add(content, 4,4);
  ok(set1.isEqual(set2), 'same content should return YES');

  set1.remove(content, 6);
  set2.remove(content, 6);
  ok(set1.isEqual(set2), 'same content should return YES');

  set1.remove(content, 4,4);
  set2.remove(content, 4,4);
  ok(set1.isEqual(set2), 'same content should return YES');
  
});

test("multiple content objects", function() {
  var content2 = "1 2 3 4 5".w();
  set1.add(content, 4,4).add(content2, 3);
  ok(!set1.isEqual(set2), 'should not be same when set2 is empty');

  set2.add(content2, 3);
  ok(!set1.isEqual(set2), 'should not be same when set2 has only one content');

  set2.add(content,4,4);
  ok(set1.isEqual(set2), 'should not be same when set2 has both content');
  
});

test("set1.isEqual(set2) after set2 is filled and emptied", function() {
  set2.add(content,4,4).remove(content,4,4);
  ok(set1.isEqual(set2), 'same content should return YES');
});

});minispade.register('sproutcore-foundation/~tests/system/selection_set/remove', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var set, array, array2, expected, expected2 ;
module("SC.SelectionSet#remove", {
  setup: function() {
    set = SC.SelectionSet.create();
    array = '0 1 2 3 4 5 6 7 8 9'.w();
    array2 = 'a b c d e f g h i k l m'.w();

    expected = SC.IndexSet.create(4,3);
    expected2 = SC.IndexSet.create(1);
    expected.source = array;
    expected2.source = array2;
  }
});

/*
  validates that the selection set has the expected content.  pass index sets
  with sources set appropriately.  The order of the array is not important.
*/
function validate(set, expected, defaultSource) {
  var sources = set.get('sources'),
      len  = expected.length,
      idx, cur, actual ;

  equal(sources.length, expected.length, 'should have same number of sources (actual sources: %@)'.fmt(sources));

  for(idx=0;idx<len;idx++) {
    cur = expected[idx];
    if (!cur.source) cur.source =defaultSource;
    actual = set.indexSetForSource(cur.source, NO);
    ok(actual, 'should have indexSet for source: %@'.fmt(cur.source));
    equal(actual.source, cur.source, 'indexSet.source should match source');
    ok(actual.isEqual(cur), 'indexSet should match for source %@ (actual: %@ expected: %@)'.fmt(cur.source, actual, cur));
  }
}
// ..........................................................
// BASIC REMOVES
//

test("Removed indexes for single source", function() {
  set.add(array, 4, 3);
  validate(set, [SC.IndexSet.create(4,3)], array); // precondition

  set.remove(array, 4, 1);
  validate(set, [SC.IndexSet.create(5,2)], array);
});

test("Removed multiple sources", function() {

  set.add(array, 4, 3).add(array2, 1);
  validate(set, [expected, expected2]); // precondition

  set.remove(array, 4,1).remove(array2, 1);
  expected.remove(4,1);
  validate(set, [expected]); // precondition
});

test("Remove IndexSet with source", function() {
  set.add(array, 4, 3);
  validate(set, [SC.IndexSet.create(4,3)], array); // precondition

  var s = SC.IndexSet.create(4,1);
  s.source = array;
  set.remove(s);
  validate(set, [SC.IndexSet.create(5,2)], array);
});

test("Adding another SelectionSet", function() {

  set.add(array, 4, 3).add(array2, 1);
  validate(set, [expected, expected2]); // precondition

  var x = SC.SelectionSet.create().add(array, 4,1).add(array2, 1);
  set.remove(x);

  expected.remove(4,1);
  validate(set, [SC.IndexSet.create(5,2)], array);
});


// ..........................................................
// SPECIAL CASES
//

test("removing index set should also remove individually added objects", function() {
  var objToRemove = array[3]; // item from one array...
  var objToNotRemove = array2[3]; // item from array we won't remove..

  // add both objects.
  set.addObject(objToRemove).addObject(objToNotRemove);
  set.add(array, 4, 3);

  ok(set.contains(objToRemove), 'set should contain objToRemove');
  ok(set.contains(objToNotRemove), 'set should contain objToNotRemove');
  equal(set.get('length'), 5, 'set.length should == two objects + index.length');

  // now remove from array set
  set.remove(array, 2, 4);

  SC.stopIt = NO ;

  ok(!set.contains(objToRemove), 'set should NOT contain objToRemove');
  ok(set.contains(objToNotRemove), 'set should contain objToNotRemove');
  equal(set.get('length'), 2, 'set.length should == 1 object + index.length');
});


module("SC.SelectionSet#constrain", {
  setup: function() {
    set = SC.SelectionSet.create();
    array = '0 1 2 3 4 5 6 7 8 9'.w();
    array2 = 'a b c d e f g h i k l m'.w();

    expected = SC.IndexSet.create(4,3);
    expected2 = SC.IndexSet.create(1);
    expected.source = array;
    expected2.source = array2;
  }
});

/**
  After cleaning up a memory leak in SC.Set, it was discovered that the constrain
  method of SC.SelectionSet doesn't work properly.  It was naively using forEach
  to iterate through the objects while mutating the array so that the last
  object would never be constrained.

  This test shows that you can constrain more than one object using the method.
*/
test("Tests constrain helper method.", function () {
  var objToRemove1 = 'a',
    objToRemove2 = 'b';

  set.add(array, 4, 3);
  set.addObject(objToRemove1);
  set.addObject(objToRemove2);
  ok(set.contains(objToRemove1), 'Set should contain objToRemove1');
  ok(set.contains(objToRemove2), 'Set should contain objToRemove2');
  set.constrain(array);
  ok(!set.contains(objToRemove1), 'Set should not contain objToRemove1');
  ok(!set.contains(objToRemove2), 'Set should not contain objToRemove2');
});


});minispade.register('sproutcore-foundation/~tests/system/sparse_array', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// // ========================================================================
// SC.SparseArray Tests
// ========================================================================
/*globals module test ok isObj equals expects */
var objectA = 23, objectB = 12, objectC = 31, numbers, new_numbers;
module("SC.SparseArray") ;

test("new SparseArray has expected length", function() {
  var ary = SC.SparseArray.array(10000) ;
  equal(10000, ary.get('length'), "length") ;
});

test("fetching the object at index", function() {
	var ary = SC.SparseArray.array(10);
	var arr = ["I'll","be","there","4u"];
	ary = arr;
	equal(2 ,ary.indexOf('there'), "Index of 'there' is");
});

test("Update the sparse array using provideObjectAtIndex", function() {
	var ary = SC.SparseArray.array(2);
	var obj = "not";
	ary.provideObjectAtIndex(0, obj);
	equal(obj, ary._sa_content[0],"Content at 0th index");
	obj = "now";
	ary.provideObjectAtIndex(1, obj);
	equal(obj, ary._sa_content[1],"Content at 1st index");
});

test("objectAt() should get the object at the specified index",function() {
	var spArray = SC.SparseArray.array(4) ;
	var arr = [SC.Object.create({ dummy: YES }),"Sproutcore",2,true];
	spArray = arr;
	equal(4,spArray.length,'the length');
	equal(arr[0],spArray.objectAt(0),'first object');
	equal(arr[1],spArray.objectAt(1),'second object');
	equal(arr[2],spArray.objectAt(2),'third object');
	equal(arr[3],spArray.objectAt(3),'fourth object');
});

test("objectAt() beyond the length should return undefined and not attempt to retrieve the index.", function () {
  var delegateObject = {
        count: 0,

        sparseArrayDidRequestIndex: function(sparseArray, idx) {
          this.count++;
          sparseArray.provideObjectAtIndex(idx, "foo");
        }

      },
    sparseArray = SC.SparseArray.create({
      delegate: delegateObject
    });

  equal(sparseArray.objectAt(0), undefined, "There should not be an item beyond the length of the sparse array.");
  equal(delegateObject.count, 0, "The index beyond the length should not be requested on the delegate.");

  // Update the length. count goes up one because arrayContentDidChange checks objectAt on the last index in order
  // to update lastObject property
  sparseArray.provideLength(100);
  equal(sparseArray.objectAt(0), 'foo', "There should be an item within the length of the sparse array.");
  equal(delegateObject.count, 2, "The index within the length should be requested on the delegate.");

  equal(sparseArray.objectAt(100), undefined, "There should not be an item beyond the length of the sparse array.");
  equal(delegateObject.count, 2, "The index beyond the length should not be requested on the delegate.");
});

module("SC.SparseArray.replace",{
	setup: function() {
		// create objects...
		numbers= [1,2,3] ;
		new_numbers = [4,5,6];
	}
});

test("element to be added is at idx > length of array ", function() {
	var ary = SC.SparseArray.array(5) ;
	equal(5, ary.get('length'), "length") ;
	ary = numbers;
	ary.replace(7,3,new_numbers,"put the new number at idx>len ");
	equal(6, ary.get('length'), "length") ;
});

test("element to be added is such that amt + idx > length of array ", function() {
	var ary = SC.SparseArray.array(5) ;
	equal(5, ary.get('length'), "length") ;
	ary = numbers;
	ary.replace(4,3,new_numbers,"put the new number at idx < len ");
	equal(6, ary.get('length'), "length") ;
});

test("element to be added is at idx < length of array ", function() {
	var ary = SC.SparseArray.array(5) ;
	equal(5, ary.get('length'), "length") ;
	ary = numbers;
	ary.replace(2,3,new_numbers,"put the new number overlapping existing numbers ");
	equal(5, ary.get('length'), "length") ;
});

// test("should work with @each dependent keys");
// Reduced this test to a warning, because we are not going to support using
// @each with SC.SparseArray at this time.  It likely doesn't work as an observer
// and certainly not as a property chain.
// There is some code that will support this, but it would need to be refactored
// to avoid loading every item in the sparse array in order to add observers
// to them.
// Checkout the team/publickeating/enumerable-property-chains-support branch for the relevant code.

// , function() {
//   var array = SC.SparseArray.create();

//   array.pushObject(SC.Object.create({
//     value: 5
//   }));
//   array.provideLength(1);

//   var obj = SC.Object.create({
//     total: function() {
//       return this.get('content').reduce(function(prev, item) {
//         return prev + item.get('value');
//       }, 0);
//     }.property('content.@each.value').cacheable(),

//     content: array
//   });

//   equal(obj.get('total'), 5, "precond - computes total of all objects");

//   array.pushObject(SC.Object.create({
//     value: 10
//   }));

//   equal(obj.get('total'), 15, "recomputes when a new object is added");

//   array.objectAt(1).set('value', 15);

//   equal(obj.get('total'), 20, "recomputes when value property on child object changes");

// });


test("modifying a range should not require the rest of the array to refetch", function() {
  var del = {
    cnt: 0,

    sparseArrayDidRequestIndex: function(sparseArray, idx) {
      this.cnt++;
      sparseArray.provideObjectAtIndex(idx, "foo");
    },

    sparseArrayDidRequestLength: function(sparseArray) {
      sparseArray.provideLength(100);
    },

    // make editable
    sparseArrayShouldReplace: function() { return YES; }

  };

  var ary = SC.SparseArray.create({
    delegate: del
  });

  equal(ary.objectAt(10), 'foo', 'precond - should provide foo');
  equal(del.cnt, 1, 'precond - should invoke sparseArrayDidRequestIndex() one time');

  del.cnt = 0;

  ary.removeAt(5); // delete an item before 10
  equal(ary.objectAt(9), 'foo', 'should provide foo at index after delete');
  equal(del.cnt, 0, 'should NOT invoke sparseArrayRequestIndex() since it was provided already');
});

test("Check that requestIndex works with a rangeWindowSize larger than 1", function() {
	var ary = SC.SparseArray.array(10) ;
	var didRequestRange=NO;

	var DummyDelegate = SC.Object.extend({
    content: [], // source array

    sparseArrayDidRequestLength: function(sparseArray) {
      sparseArray.provideLength(this.content.length);
    },

    sparseArrayDidRequestIndex: function(sparseArray, index) {
      sparseArray.provideObjectAtIndex(index, this.content[index]);
    },

    sparseArrayDidRequestIndexOf: function(sparseArray, object) {
      return this.content.indexOf(object);
    },

    sparseArrayShouldReplace: function(sparseArray, idx, amt, objects) {
      this.content.replace(idx, amt, objects) ; // keep internal up-to-date
      return YES ; // allow anything
    },
    sparseArrayDidRequestRange: function(sparseArray, range) {
       didRequestRange=YES;
     }

  });
  ary.set('delegate', DummyDelegate.create());
	ary.set('rangeWindowSize', 4);
	equal(10, ary.get('length'), "length") ;
	ary.objectAt(7);
	equal(didRequestRange, YES, "The range was requested") ;
});


// ..........................................................
// definedIndexes
//

test("definedIndexes", function() {
  var ary = SC.SparseArray.array(10);
  ary.provideObjectAtIndex(5, "foo");

  var expected = SC.IndexSet.create().add(5);
  ok(ary.definedIndexes().isEqual(expected), 'definedIndexes() should return all defined indexes');

  ok(ary.definedIndexes(SC.IndexSet.create().add(2, 10)).isEqual(expected), 'definedIndexes([2..11]) should return indexes within');

  ok(ary.definedIndexes(SC.IndexSet.create().add(2)).isEqual(SC.IndexSet.EMPTY), 'definedIndexes([2]) should return empty set (since does not overlap with defined index)');

});

// ..........................................................
// TEST SC.ARRAY COMPLIANCE
//

var DummyDelegate = SC.Object.extend({
  content: [], // source array

  sparseArrayDidRequestLength: function(sparseArray) {
    sparseArray.provideLength(this.content.length);
  },

  sparseArrayDidRequestIndex: function(sparseArray, index) {
    sparseArray.provideObjectAtIndex(index, this.content[index]);
  },

  sparseArrayDidRequestIndexOf: function(sparseArray, object) {
    return this.content.indexOf(object);
  },

  sparseArrayShouldReplace: function(sparseArray, idx, amt, objects) {
    this.content.replace(idx, amt, objects) ; // keep internal up-to-date
    return YES ; // allow anything
  }

});

// SC.ArraySuite.generate("SC.SparseArray", {
//   newObject: function(amt) {
//     if (amt === undefined || typeof amt === SC.T_NUMBER) {
//       amt = this.expected(amt);
//     }
//
//     var del = DummyDelegate.create({ content: amt });
//     return SC.SparseArray.create({ delegate: del });
//   }
// });

test("should notify enumerable property", function() {
    var arr = SC.SparseArray.create();
    var count = 0;
    function counter() {
        count++;
    }

    arr.provideLength(1);
    arr.addObserver('[]', this, counter);
    arr.provideObjectAtIndex(0, 'one');
    equal(count, 1, "observer should have fired once");
});

test("test updating SparseArray length via delegate", function() {
    var delegate = SC.Object.create({
        arrlen: null,
        sparseArrayDidRequestLength: function(arr) {
            arr.provideLength(this.arrlen);
        }
    });

    var arr = SC.SparseArray.create({delegate: delegate});
    delegate.arrlen = 5;
    equal(arr.get('length'), 5)
    arr.provideLength(null);
    delegate.arrlen = 50;
    equal(arr.get('length'), 50)
});

test("test updating SparseArray length explictly", function() {
    var arr = SC.SparseArray.create();
    arr.provideLength(5);
    equal(arr.get('length'), 5)
    arr.provideLength(50);
    equal(arr.get('length'), 50)
});


});minispade.register('sproutcore-foundation/~tests/system/utils/normalizeURL', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ========================================================================
// SC.normalizeURL Tests
// ========================================================================

var url,url1,url2;

module("SC.normalizeURL");

test("should normalize the url passed as the parameter",function(){
 url = '/desktop/mydocuments/music';
 equal(SC.normalizeURL(url), 'http://'+window.location.host+'/desktop/mydocuments/music','Path with slash');
 
 url1 = 'desktop/mydocuments/music';
 equal(SC.normalizeURL(url1), '%@/desktop/mydocuments/music'.fmt(window.location.href),'Path without slash');  

 url2 = 'http:';
 equal(YES,SC.normalizeURL(url2) === url2,'Path with http:');	
});
});minispade.register('sproutcore-foundation/~tests/system/utils/rect', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ========================================================================
// Rect utility Tests
// ========================================================================


module("Rect utilities");

test("Get the X & Y points of a rect", function() {
  var frame = { x: 50, y: 40, width: 700, height: 9000 };
  expect(6);
  equal(SC.minX(frame),50,'Left edge');
  equal(SC.maxX(frame),750,'Right edge');
  equal(SC.midX(frame),400,'Horizontal midpoint');
  
  equal(SC.minY(frame),40, 'Top edge');
  equal(SC.maxY(frame),9040,'Bottom edge');
  equal(SC.midY(frame),4540,'Vertical midpoint');
});

test("Treat empty object as frame with 0 width and height", function() {
  var frame = { };
  expect(6);
  equal(SC.minX(frame),0,'Left edge');
  equal(SC.maxX(frame),0,'Right edge');
  equal(SC.midX(frame),0,'Horizontal midpoint');
  
  equal(SC.minY(frame),0,'Top edge');
  equal(SC.maxY(frame),0,'Bottom edge');
  equal(SC.midY(frame),0,'Vertical midpoint');
});

test("pointInRect() to test if a given point is inside the rect", function(){
  var frame = { x: 50, y: 40, width: 700, height: 9000 };
  
  ok(SC.pointInRect({ x: 100, y: 100 }, frame), "Point in rect");
  equal(NO, SC.pointInRect({ x: 40, y: 100 }, frame), "Point out of rect horizontally");
  equal(NO, SC.pointInRect({ x: 600, y: 9100 }, frame), "Point out of rect vertically");
  equal(NO, SC.pointInRect({ x: 0, y: 0 }, frame), "Point up and left from rect");
  equal(NO, SC.pointInRect({ x: 800, y: 9500 }, frame), "Point down and right from rect");
});

test("rectsEqual() tests equality with default delta", function() {
  var frame = { x: 50, y: 50, width: 100, height: 100 };
  
  equal(SC.rectsEqual(frame, frame), YES, "Frames are same object");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100 }), YES, "Frames have same position and dimensions");
  equal(SC.rectsEqual(frame, { x: 50.08, y: 50, width: 100, height: 100 }), YES, "Frame.x above, within delta");
  equal(SC.rectsEqual(frame, { x: 49.92, y: 50, width: 100, height: 100 }), YES, "Frame.x below, within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50.099, width: 100, height: 100 }), YES, "Frame.y within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100.001, height: 100 }), YES, "Frame.width within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100.09999 }), YES, "Frame.height within delta");
  equal(SC.rectsEqual(frame, { x: 55, y: 50, width: 100, height: 100 }), NO, "Frame.x not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 55, width: 100, height: 100 }), NO, "Frame.y not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 105, height: 100 }), NO, "Frame.width not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 105 }), NO, "Frame.height not equal");
});

test("rectsEqual() tests equality with null delta", function() {
  var frame = { x: 50, y: 50, width: 100, height: 100 };
  
  equal(SC.rectsEqual(frame, frame), YES, "Frames are same object");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100 }, null), YES, "Frames have same position and dimensions");
  equal(SC.rectsEqual(frame, { x: 50.08, y: 50, width: 100, height: 100 }, null), YES, "Frame.x above, within delta");
  equal(SC.rectsEqual(frame, { x: 49.92, y: 50, width: 100, height: 100 }, null), YES, "Frame.x below, within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50.099, width: 100, height: 100 }, null), YES, "Frame.y within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100.001, height: 100 }, null), YES, "Frame.width within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100.01 }, null), YES, "Frame.height within delta");
  equal(SC.rectsEqual(frame, { x: 55, y: 50, width: 100, height: 100 }, null), NO, "Frame.x not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 55, width: 100, height: 100 }, null), NO, "Frame.y not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 105, height: 100 }, null), NO, "Frame.width not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 105 }, null), NO, "Frame.height not equal");
});

test("rectsEqual() tests equality with delta of 10", function() {
  var frame = { x: 50, y: 50, width: 100, height: 100 };
  
  equal(SC.rectsEqual(frame, frame), YES, "Frames are same object");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100 }, 10), YES, "Frames have same position and dimensions");
  equal(SC.rectsEqual(frame, { x: 59.99, y: 50, width: 100, height: 100 }, 10), YES, "Frame.x above, within delta");
  equal(SC.rectsEqual(frame, { x: 41, y: 50, width: 100, height: 100 }, 10), YES, "Frame.x below, within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 59, width: 100, height: 100 }, 10), YES, "Frame.y within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 109, height: 100 }, 10), YES, "Frame.width within delta");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100.000002 }, 10), YES, "Frame.height within delta");
  equal(SC.rectsEqual(frame, { x: 61, y: 50, width: 100, height: 100 }, 10), NO, "Frame.x not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 92, width: 100, height: 100 }, 10), NO, "Frame.y not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 89, height: 100 }, 10), NO, "Frame.width not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 89.99999 }, 10), NO, "Frame.height not equal");
});

test("rectsEqual() tests equality with delta of 0", function() {
  var frame = { x: 50, y: 50, width: 100, height: 100 };
  
  equal(SC.rectsEqual(frame, frame), YES, "Frames are same object");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 100 }, 0), YES, "Frames have same position and dimensions");
  equal(SC.rectsEqual(frame, { x: 50.0001, y: 50, width: 100, height: 100 }, 0), NO, "Frame.x not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 51, width: 100, height: 100 }, 0), NO, "Frame.y not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 99, height: 100 }, 0), NO, "Frame.width not equal");
  equal(SC.rectsEqual(frame, { x: 50, y: 50, width: 100, height: 102 }, 0), NO, "Frame.height not equal");
});
});minispade.register('sproutcore-runtime/~tests/system/index_set/add', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same should_throw*/
var set ;
module("SC.IndexSet#add", {
  setup: function() {
    set = SC.IndexSet.create();
  }
});

function iter(s) {
  var ret = [];
  set.forEach(function(k) { ret.push(k); });
  return ret ;
}

// ..........................................................
// BASIC ADDS
//

test("add range to end of set", function() {
  set.add(1000,5);
  equal(set.get('length'), 5, 'should have correct index count');
  equal(set.get('max'), 1005, 'max should return 1 past last index');
  deepEqual(iter(set), [1000,1001,1002,1003,1004]);
});

test("add range into middle of empty range", function() {
  set.add(100,2); // add initial set.
  equal(iter(set)[0], 100, 'precond - first index is 100');

  // now add second range
  set.add(10,1);
  equal(set.get('length'), 3, 'should have extra length');
  equal(set.get('max'), 102, 'max should return 1 past last index');
  deepEqual(iter(set), [10, 100, 101]);
});

test("add range overlapping front edge of range", function() {
  set.add(100,2); // add initial set.
  equal(iter(set)[0], 100, 'precond - first index is 100');

  // now add second range
  set.add(99,2);
  equal(set.get('length'), 3, 'should have extra length');
  equal(set.get('max'), 102, 'max should return 1 past last index');
  deepEqual(iter(set), [99, 100, 101]);
});

test("add range overlapping last edge of range", function() {
  set.add(100,2).add(200,2);
  deepEqual(iter(set), [100,101,200,201], 'should have two sets');

  // now add overlapping range
  set.add(101,2);
  equal(set.get('length'), 5, 'new set.length');
  equal(set.get('max'), 202, 'max should return 1 past last index');
  deepEqual(iter(set), [100,101,102,200,201], 'should include 101-102');
});

test("add range overlapping two ranges, merging into one", function() {
  set.add(100,2).add(110,2);
  deepEqual(iter(set), [100,101,110,111], 'should have two sets');

  // now add overlapping range
  set.add(101,10);
  equal(set.get('length'), 12, 'new set.length');
  equal(set.get('max'), 112, 'max should return 1 past last index');
  deepEqual(iter(set), [100,101,102,103,104,105,106,107,108,109,110,111], 'should include one range 100-111');
});

test("add range overlapping three ranges, merging into one", function() {
  set.add(100,2).add(105,2).add(110,2);
  deepEqual(iter(set), [100,101,105,106,110,111], 'should have two sets');

  // now add overlapping range
  set.add(101,10);
  equal(set.get('length'), 12, 'new set.length');
  equal(set.get('max'), 112, 'max should return 1 past last index');
  deepEqual(iter(set), [100,101,102,103,104,105,106,107,108,109,110,111], 'should include one range 100-111');
});

test("add range partially overlapping one range and replacing another range, merging into one", function() {
  set.add(100,2).add(105,2);
  deepEqual(iter(set), [100,101,105,106], 'should have two sets');

  // now add overlapping range
  set.add(101,10);
  equal(set.get('length'), 11, 'new set.length');

  equal(set.get('max'), 111, 'max should return 1 past last index');
  deepEqual(iter(set), [100,101,102,103,104,105,106,107,108,109,110], 'should include one range 100-110');
});

test("add range overlapping last index", function() {
  set.add(100,2); // add initial set.
  equal(iter(set)[0], 100, 'precond - first index is 100');

  // now add second range
  set.add(101,2);
  equal(set.get('length'), 3, 'should have extra length');
  equal(set.get('max'), 103, 'max should return 1 past last index');
  deepEqual(iter(set), [100, 101, 102]);
});

test("add range matching existing range", function() {
  set.add(100,5); // add initial set.
  equal(iter(set)[0], 100, 'precond - first index is 100');

  // now add second range
  set.add(100,5);
  equal(set.get('length'), 5, 'should not change');
  equal(set.get('max'), 105, 'max should return 1 past last index');
  deepEqual(iter(set), [100, 101, 102, 103, 104]);
});

// ..........................................................
// NORMALIZED PARAMETER CASES
//

test("add with no params should do nothing", function() {
  set.add();
  deepEqual(iter(set), []);
});

test("add with single number should add index only", function() {
  set.add(2);
  deepEqual(iter(set), [2]);
});

test("add with range object should add range only", function() {
  set.add({ start: 2, length: 2 });
  deepEqual(iter(set), [2,3]);
});

test("add with index set should add indexes in set", function() {
  set.add(SC.IndexSet.create().add(2,2).add(10,2));
  deepEqual(iter(set), [2,3,10,11]);
});

// ..........................................................
// OTHER BEHAVIORS
//

test("adding a range should trigger an observer notification", function() {
  var callCnt = 0;
  set.addObserver('[]', function() { callCnt++; });
  set.add(10,10);
  equal(callCnt, 1, 'should have called observer once');
});

test("adding a range over an existing range should not trigger an observer notification", function() {
  var callCnt = 0;
  set.add(10,10);
  set.addObserver('[]', function() { callCnt++; });
  set.add(15,5);
  equal(callCnt, 0, 'should not have called observer');
});

test("appending a range to end should merge into last range", function() {
  set = SC.IndexSet.create(2).add(3);
  equal(set.rangeStartForIndex(3), 2, 'last two range should merge together (%@)'.fmt(set.inspect()));
  equal(set.get('max'), 4, 'should have max');
  equal(set.get('length'), 2, 'should have length');

  set = SC.IndexSet.create(2000, 1000).add(3000, 1000);
  equal(set.rangeStartForIndex(3990), 2000, 'last two range should merge together (%@)'.fmt(set.inspect()));
  equal(set.get('max'), 4000, 'should have max');
  equal(set.get('length'), 2000, 'should have length');

});

test("appending range to start of empty set should create a single range", function() {
  set = SC.IndexSet.create().add(0,2);
  equal(set.rangeStartForIndex(1), 0, 'should have single range (%@)'.fmt(set.inspect()));
  equal(set.get('length'), 2, 'should have length');
  equal(set.get('max'), 2, 'should have max');

  set = SC.IndexSet.create().add(0,2000);
  equal(set.rangeStartForIndex(1998), 0, 'should have single range (%@)'.fmt(set.inspect()));
  equal(set.get('length'), 2000, 'should have length');
  equal(set.get('max'), 2000, 'should have max');

});

test("add raises exception when frozen", function() {
  throws(function() {
    set.freeze().add(0,2);
  }, SC.FROZEN_ERROR);
});

// ..........................................................
// SPECIAL CASES
//
// demonstrate fixes for specific bugs here.

test("adding in the same range should keep length consistent", function() {
  set = SC.IndexSet.create();
  set.add(1,4);
  equal(set.length, 4, 'set length should be 4');

  set.add(1,3); // should be like a no-op
  equal(set.length, 4, 'set length should remain 4 after set.add(1,3)');

  set.add(1,2); // should be like a no-op
  equal(set.length, 4, 'set length should remain 4 after set.add(1,2)');

});

});minispade.register('sproutcore-runtime/~tests/system/index_set/addEach', function() {// // ==========================================================================
// // Project:   SproutCore - JavaScript Application Framework
// // Copyright: ©2006-2011 Apple Inc. and contributors.
// // License:   Licensed under MIT license (see license.js)
// // ==========================================================================
//
// /*global module test equals context ok same */
var set ;
module("SC.IndexSet#addEach", {
  setup: function() {
    set = SC.IndexSet.create();
  }
});

function iter(s) {
  var ret = [];
  set.forEach(function(k) { ret.push(k); });
  return ret ;
}

// ..........................................................
// BASIC ADDS
//

test("adding should iterate over an array", function() {
  set.addEach([1000, 1010, 1020, 1030]);
  equal(set.get('length'), 4, 'should have correct index count');
  equal(set.get('max'), 1031, 'max should return 1 past last index');
  deepEqual(iter(set), [1000, 1010, 1020, 1030]);
});//
//
test("adding should iterate over a set", function() {
  // add out of order...
  var input = SC.Set.create().add(1030).add(1010).add(1020).add(1000);
  set.addEach(input);
  equal(set.get('length'), 4, 'should have correct index count');
  equal(set.get('max'), 1031, 'max should return 1 past last index');
  deepEqual(iter(set), [1000, 1010, 1020, 1030]);
});


test("adding should iterate over a indexset", function() {
  // add out of order...
  var input = SC.IndexSet.create().add(1000,2).add(1010).add(1020).add(1030);
  set.addEach(input);
  equal(set.get('length'), 5, 'should have correct index count');
  equal(set.get('max'), 1031, 'max should return 1 past last index');
  deepEqual(iter(set), [1000, 1001, 1010, 1020, 1030]);
});

});minispade.register('sproutcore-runtime/~tests/system/index_set/clone', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest */
var set ;
module("SC.IndexSet#clone", {
  setup: function() {
    set = SC.IndexSet.create();
  }
});

test("clone should return new object with same key properties", function() {
  set.add(100,100).add(200,100);
  set.source = "foo";
  
  var set2 = set.clone();
  ok(set2 !== null, 'return value should not be null');
  ok(set2 !== set, 'cloned set should not be same instance as set');
  ok(set.isEqual(set2), 'set.isEqual(set2) should be true');
  
  equal(set2.get('length'), set.get('length'), 'clone should have same length');
  equal(set2.get('min'), set.get('min'), 'clone should have same min');
  equal(set2.get('max'), set.get('max'), 'clone should have same max');
  equal(set2.get('source'), set.get('source'), 'clone should have same source');

});

test("cloning frozen object returns unfrozen", function() {
  var set2 = set.freeze().clone();
  equal(set2.get('isFrozen'), NO, 'set2.isFrozen should be NO');
});

test("copy works like clone", function() {
  deepEqual(set.copy(), set, 'should return copy');
  ok(set.copy() !== set, 'should not return same instance');
  
  set.freeze();
  equal(set.frozenCopy(), set, 'should return same instance when frozen');
});


});minispade.register('sproutcore-runtime/~tests/system/index_set/contains', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest */

var set ;
module("SC.IndexSet#contains", {
  setup: function() {
    set = SC.IndexSet.create().add(1000, 10).add(2000,1);
  }
});

// ..........................................................
// SINGLE INDEX
// 

test("handle index in set", function() {
  equal(set.contains(1001), YES, 'index 1001 should be in set %@'.fmt(set));
  equal(set.contains(1009), YES, 'index 1009 should be in set %@'.fmt(set));
  equal(set.contains(2000), YES, 'index 2000 should be in set %@'.fmt(set));
});

test("handle index not in set", function() {
  equal(set.contains(0), NO, 'index 0 should not be in set');
  equal(set.contains(10), NO, 'index 10 should not be in set');
  equal(set.contains(1100), NO, 'index 1100 should not be in set');
});

test("handle index past end of set", function() {
  equal(set.contains(3000), NO, 'index 3000 should not be in set');
});

// ..........................................................
// RANGE
// 

test("handle range inside set", function() {
  equal(set.contains(1001,4), YES, '1001..1003 should be in set');
});

test("handle range outside of set", function() {
  equal(set.contains(100,4), NO, '100..1003 should NOT be in set');
});

test("handle range partially inside set", function() {
  equal(set.contains(998,4), NO,'998..1001 should be in set');
});

// ..........................................................
// INDEX SET
// 

test("handle set inside IndexSet", function() {
  var test = SC.IndexSet.create().add(1001,4).add(1005,2);
  equal(set.contains(test), YES, '%@ should be in %@'.fmt(test, set));
});

test("handle range outside of IndexSet", function() {
  var test = SC.IndexSet.create().add(100,4).add(105,2);
  equal(set.contains(test), NO, '%@ should be in %@'.fmt(test, set));
});

test("handle range partially inside IndexSet", function() {
  var test = SC.IndexSet.create().add(1001,4).add(100,2);
  equal(set.contains(test), NO, '%@ should be in %@'.fmt(test, set));
});

test("handle self", function() {
  equal(set.contains(set), YES, 'should return YES when passed itself');  
});


});minispade.register('sproutcore-runtime/~tests/system/index_set/create', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest */

module("SC.IndexSet#create");

test("create with no params", function() {
  var set = SC.IndexSet.create();
  equal(set.get('length'), 0, 'should have no indexes');
});

test("create with just index", function() {
  var set = SC.IndexSet.create(4);
  equal(set.get('length'),1, 'should have 1 index');
  equal(set.contains(4), YES, 'should contain index');
  equal(set.contains(5), NO, 'should not contain 5');
});

test("create with index and length", function() {
  var set = SC.IndexSet.create(4, 2);
  equal(set.get('length'),2, 'should have 2 indexes');
  equal(set.contains(4), YES, 'should contain 4');
  equal(set.contains(5), YES, 'should contain 5');
});

test("create with other set", function() {
  var first = SC.IndexSet.create(4,2);

  var set = SC.IndexSet.create(first);
  equal(set.get('length'),2, 'should have same number of indexes (2)');
  equal(set.contains(4), YES, 'should contain 4, just like first');
  equal(set.contains(5), YES, 'should contain 5, just like first');
});






});minispade.register('sproutcore-runtime/~tests/system/index_set/indexAfter', function() {// ==========================================================================
// Project:   SproutCore Costello - Property Observing Library
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var set ;

module("SC.IndexSet.indexAfter", {
  setup: function() {
    set = SC.IndexSet.create(5).add(10,5).add(100);
  }
});

test("no earlier index in set", function(){ 
  equal(set.indexAfter(3), 5, 'set.indexAfter(3) in %@ should start of first index range'.fmt(set));
});

test("with index after end of set", function() {
  equal(set.indexAfter(1000), -1, 'set.indexAfter(1000) in %@ should return -1'.fmt(set));
});

test("inside of multi-index range", function() {
  equal(set.indexAfter(12), 13, 'set.indexAfter(12) in %@ should return next index'.fmt(set));
});

test("end of multi-index range", function() {
  equal(set.indexAfter(14), 100, 'set.indexAfter(14) in %@ should start of next range'.fmt(set));
});


test("single index range", function() {
  equal(set.indexAfter(5), 10, 'set.indexAfter(5) in %@ should start of next range multi-index range'.fmt(set));
});




});minispade.register('sproutcore-runtime/~tests/system/index_set/indexBefore', function() {// ==========================================================================
// Project:   SproutCore Costello - Property Observing Library
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var set ;

module("SC.IndexSet.indexBefore", {
  setup: function() {
    set = SC.IndexSet.create(5).add(10,5).add(100);
  }
});

test("no earlier index in set", function(){ 
  equal(set.indexBefore(4), -1, 'set.indexBefore(4) in %@ should not have index before it'.fmt(set));
});

test("with index after end of set", function() {
  equal(set.indexBefore(1000), 100, 'set.indexBefore(1000) in %@ should return last index in set'.fmt(set));
});

test("inside of multi-index range", function() {
  equal(set.indexBefore(12), 11, 'set.indexBefore(12) in %@ should return previous index'.fmt(set));
});

test("beginning of multi-index range", function() {
  equal(set.indexBefore(10), 5, 'set.indexBefore(10) in %@ should end of previous range'.fmt(set));
});


test("single index range", function() {
  equal(set.indexBefore(100), 14, 'set.indexBefore(100) in %@ should end of previous range multi-index range'.fmt(set));
});




});minispade.register('sproutcore-runtime/~tests/system/index_set/infinite', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*global module test equals ok */


var set;

module("SC.IndexSet Infinite Ranges", {
  setup: function () {
    set = SC.IndexSet.create();
  }
});


test("Able to add an infinite range.", function () {
  set.add(100, Infinity);

  equal(set.get('length'), Infinity, 'The length should be');
  equal(set.get('max'), Infinity, 'The max index should be');
});

test("The infinite range contains all indexes.", function () {
  set.add(100, 2000);
  set.add(5000, Infinity);

  ok(!set.contains(99), "The set does not contain 99.");
  ok(set.contains(100), "The set does contain 100.");
  ok(set.contains(2099), "The set does contain 2099.");
  ok(!set.contains(4999), "The set does not contain 4999.");
  ok(set.contains(5000), "The set does contain 5000.");
  ok(set.contains(99999999999), "The set does contain 99999999999.");
  ok(set.contains(Number.MAX_VALUE), "The set does contain Number.MAX_VALUE.");
  ok(set.contains(Infinity), "The set does contain Infinity.");
});

test("Able to remove an infinite range.", function () {
  set.add(100, Infinity);
  set.remove(1000, Infinity);

  ok(set.contains(900), "The set does contain 900.");
  ok(!set.contains(1000), "The set does not contain 1000.");
  ok(!set.contains(Infinity), "The set does not contain Infinity.");
});

test("Attempting to iterate over an infinite range throws an exception.", function () {
  set.add(0, Infinity);

  try {
    set.forEach(function () { });
  } catch (ex) {
    ok(true, 'forEach threw an exception.');
  }
});

test("Able to add an infinite range over an existing range.", function () {
  set.add(100, 2); // add initial set.
  equal(set.get('firstObject'), 100, 'The first index is');
  equal(set.get('length'), 2, 'The length should be');
  equal(set.get('max'), 102, 'The max index should be');

  set.add(50, Infinity);
  equal(set.get('firstObject'), 50, 'The first index is now');
  equal(set.get('length'), Infinity, 'The length should now be');
  equal(set.get('max'), Infinity, 'The max index should now be');
});

test("Infinite ranges may be equal.", function () {
  var secondSet = SC.IndexSet.create();

  set.add(50, Infinity);
  secondSet.add(50, Infinity);
  ok(set.isEqual(secondSet), 'The two infinite sets are equal.');

  secondSet.add(10, 10);
  ok(!set.isEqual(secondSet), 'The two infinite sets are no longer equal.');
});

test("The range start for the infinite range is correct.", function () {
  set.add(100, 2000);

  equal(set.rangeStartForIndex(1234), 100, "The range for 1234 starts at");
  equal(set.rangeStartForIndex(2234), 2100, "The range for 2234 starts at");
  equal(set.rangeStartForIndex(99999999999), 2100, "The range for 99999999999 starts at");
  equal(set.rangeStartForIndex(Number.MAX_VALUE), 2100, "The range for Number.MAX_VALUE starts at");
  equal(set.rangeStartForIndex(Infinity), 2100, "The range for Infinity starts at");

  set.add(5000, Infinity);

  equal(set.rangeStartForIndex(1234), 100, "The range for 1234 starts at");
  equal(set.rangeStartForIndex(2234), 2100, "The range for 2234 starts at");
  equal(set.rangeStartForIndex(99999999999), 5000, "The range for 99999999999 starts at");
  equal(set.rangeStartForIndex(Number.MAX_VALUE), 5000, "The range for Number.MAX_VALUE starts at");
  equal(set.rangeStartForIndex(Infinity), Infinity, "The range for Infinity starts at");
});

test("The indexBefore for the infinite range is correct.", function () {
  set.add(10, 10);

  equal(set.indexBefore(100), 19, "The indexBefore 100 is");
  equal(set.indexBefore(Infinity), 19, "The indexBefore Infinity is");

  set.add(50, Infinity);

  equal(set.indexBefore(100), 99, "The indexBefore 100 is");
  equal(set.indexBefore(Infinity), Infinity, "The indexBefore Infinity is");
});

test("The indexAfter for the infinite range is correct.", function () {
  set.add(10, 1000);

  equal(set.indexAfter(100), 101, "The indexAfter 100 is");
  equal(set.indexAfter(2000), -1, "The indexAfter 2000 is");
  equal(set.indexAfter(Infinity), -1, "The indexAfter Infinity is");

  set.add(5000, Infinity);

  equal(set.indexAfter(100), 101, "The indexAfter 100 is");
  equal(set.indexAfter(2000), 5000, "The indexAfter 2000 is");
  equal(set.indexAfter(Infinity), -1, "The indexAfter Infinity is");
});

test("The infinite range intersects all indexes.", function () {
  set.add(100, 2000);
  set.add(5000, Infinity);

  ok(!set.intersects(0, 99), "The set does not intersect 0 - 99.");
  ok(set.intersects(99, 2), "The set does intersect 99 - 101.");
  ok(!set.intersects(2100, 99), "The set does not intersect 2100 - 2199.");
  ok(set.intersects(4999, 2), "The set does intersect 4999 - 5001.");
  ok(set.intersects(99999999999, 900000000000), "The set does intersect 99999999999 - 999999999999.");
  ok(set.intersects(0, Number.MAX_VALUE), "The set does intersect 0 - Number.MAX_VALUE.");
  ok(set.intersects(0, Infinity), "The set does intersect 0 - Infinity.");
});

test("The infinite range works with without().", function () {
  set.add(100, 2000);
  set.add(5000, Infinity);

  set = set.without(10000, 1000);

  ok(set.contains(9999), "The set does contain 9999.");
  ok(!set.contains(10000), "The set does not contain 10000.");
  ok(set.contains(11000), "The set does contain 11000.");

  set = set.without(99999, 900000);

  ok(set.contains(99998), "The set does contain 99998.");
  ok(!set.contains(99999), "The set does not contain 99999.");
  ok(set.contains(10000000), "The set does contain 10000000.");

  // Hinting makes this too slow to use.
  // set = set.without(0, Number.MAX_VALUE);
  //
  // ok(!set.contains(Number.MAX_VALUE), "The set does not contain Number.MAX_VALUE.");
  // ok(set.contains(Infinity), "The set does contain Infinity.");

  set = set.without(0, Infinity);

  ok(!set.contains(Number.MAX_VALUE), "The set does not contain Number.MAX_VALUE.");
  ok(!set.contains(Infinity), "The set does not contain Infinity.");
});

test("The infinite range works with replace().", function () {
  set.add(100, 2000);
  set.add(5000, Infinity);

  set = set.replace(10000, 1000);

  ok(!set.contains(9999), "The set does not contain 9999.");
  ok(set.contains(10000), "The set does contain 10000.");
  ok(!set.contains(11000), "The set does not contain 11000.");
  ok(!set.contains(Infinity), "The set does not contain Infinity.");

  set = set.replace(10000, Infinity);

  ok(!set.contains(9999), "The set does not contain 9999.");
  ok(set.contains(10000), "The set does contain 10000.");
  ok(set.contains(Number.MAX_VALUE), "The set does contain Number.MAX_VALUE.");
  ok(set.contains(Infinity), "The set does contain Infinity.");
});


});minispade.register('sproutcore-runtime/~tests/system/index_set/intersects', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest */

var set ;
module("SC.IndexSet#intersects", {
  setup: function() {
    set = SC.IndexSet.create().add(1000, 10).add(2000,1);
  }
});

// ..........................................................
// SINGLE INDEX
// 

test("handle index in set", function() {
  equal(set.intersects(1001), YES, 'index 1001 should be in set %@'.fmt(set));
  equal(set.intersects(1009), YES, 'index 1009 should be in set %@'.fmt(set));
  equal(set.intersects(2000), YES, 'index 2000 should be in set %@'.fmt(set));
});

test("handle index not in set", function() {
  equal(set.intersects(0), NO, 'index 0 should not be in set');
  equal(set.intersects(10), NO, 'index 10 should not be in set');
  equal(set.intersects(1100), NO, 'index 1100 should not be in set');
});

test("handle index past end of set", function() {
  equal(set.intersects(3000), NO, 'index 3000 should not be in set');
});

// ..........................................................
// RANGE
// 

test("handle range inside set", function() {
  equal(set.intersects(1001,4), YES, '1001..1003 should be in set');
});

test("handle range outside of set", function() {
  equal(set.intersects(100,4), NO, '100..1003 should NOT be in set');
});

test("handle range partially inside set", function() {
  equal(set.intersects(998,4), YES,'998..1001 should be in set');
});

// ..........................................................
// INDEX SET
// 

test("handle set inside IndexSet", function() {
  var test = SC.IndexSet.create().add(1001,4).add(1005,2);
  equal(set.intersects(test), YES, '%@ should be in %@'.fmt(test, set));
});

test("handle range outside of IndexSet", function() {
  var test = SC.IndexSet.create().add(100,4).add(105,2);
  equal(set.intersects(test), NO, '%@ should be in %@'.fmt(test, set));
});

test("handle range partially inside IndexSet", function() {
  var test = SC.IndexSet.create().add(1001,4).add(100,2);
  equal(set.intersects(test), YES, '%@ should be in %@'.fmt(test, set));
});

test("handle self", function() {
  equal(set.contains(set), YES, 'should return YES when passed itself');  
});


});minispade.register('sproutcore-runtime/~tests/system/index_set/max', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest */

module("SC.IndexSet#max");

test("newly created index", function() {
  var set = SC.IndexSet.create();
  equal(set.get('max'), 0, 'max should be 0');
});

test("after adding one range", function() {
  var set = SC.IndexSet.create().add(4,2);
  equal(set.get('max'),6, 'max should be one greater than max index');
});

test("after adding range then removing part of range", function() {
  var set = SC.IndexSet.create().add(4,4).remove(6,4);
  equal(set.get('max'),6, 'max should be one greater than max index');
});

test("after adding range several disjoint ranges", function() {
  var set = SC.IndexSet.create().add(4,4).add(6000);
  equal(set.get('max'),6001, 'max should be one greater than max index');
});

test("after removing disjoint range", function() {
  var set = SC.IndexSet.create().add(4,2).add(6000).remove(5998,10);
  equal(set.get('max'),6, 'max should be one greater than max index');
});

test("after removing all ranges", function() {
  var set = SC.IndexSet.create().add(4,2).add(6000).remove(3,6200);
  equal(set.get('max'), 0, 'max should be back to 0 with no content');
});


});minispade.register('sproutcore-runtime/~tests/system/index_set/min', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest */

module("SC.IndexSet#min");

test("newly created index", function() {
  var set = SC.IndexSet.create();
  equal(set.get('min'), -1, 'min should be -1');
});

test("after adding one range", function() {
  var set = SC.IndexSet.create().add(4,2);
  equal(set.get('min'),4, 'min should be lowest index');
});

test("after adding range then removing part of range", function() {
  var set = SC.IndexSet.create().add(4,4).remove(2,4);
  equal(set.get('min'),6, 'min should be lowest index');
});

test("after adding range several disjoint ranges", function() {
  var set = SC.IndexSet.create().add(6000).add(4,4);
  equal(set.get('min'),4, 'min should be lowest index');
});

test("after removing disjoint range", function() {
  var set = SC.IndexSet.create().add(4,2).add(6000).remove(2,10);
  equal(set.get('min'),6000, 'min should be lowest index');
});

test("after removing all ranges", function() {
  var set = SC.IndexSet.create().add(4,2).add(6000).remove(3,6200);
  equal(set.get('min'), -1, 'min should be back to -1 with no content');
});


test("newly created index, clearing and then adding", function() {
  var set = SC.IndexSet.create().add(4,2);
  equal(set.get('min'), 4, 'min should be lowest index');
	set.clear()
  equal(set.get('min'), -1, 'min should be back to -1 with no content');
	set.add(7, 3)
  equal(set.get('min'), 7, 'min should be lowest index');
});


});minispade.register('sproutcore-runtime/~tests/system/index_set/rangeStartForIndex', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */
var set, start, len ;
module("SC.IndexSet#rangeStartForIndex", {
  setup: function() {
    start = SC.IndexSet.HINT_SIZE*2 + 10 ;
    len  = Math.floor(SC.IndexSet.HINT_SIZE * 1.5);
    set = SC.IndexSet.create().add(start, len);
  }
});

test("index is start of range", function() {
  equal(set.rangeStartForIndex(start), start, 'should return start');
  equal(set.rangeStartForIndex(0), 0, 'should return first range');
});

test("index is middle of range", function() {
  equal(set.rangeStartForIndex(start+20), start, 'should return start');
  equal(set.rangeStartForIndex(start+SC.IndexSet.HINT_SIZE), start, 'should return start');
  equal(set.rangeStartForIndex(20), 0, 'should return first range');
});

test("index last index", function() {
  equal(set.rangeStartForIndex(start+len), start+len, 'should return end of range');
});

test("index past last index", function() {
  equal(set.rangeStartForIndex(start+len+20), start+len, 'should return end of range');
});

test("creating holes by appending to an existing range should not affect the range start", function () {
  var hintSize = SC.IndexSet.HINT_SIZE,
      start, set;

  set = SC.IndexSet.create();

  set.add(1);
  set.add(hintSize + 1);

  // Before adding 2,
  // the internal data structure looks like:
  // {
  //   0  : -  1,   // Hole until 1
  //   1  :    2,   // End of range is 2
  //   2  : -257,   // Hole until 257
  //   256:    2,   // Hint points at index 2, which is ok.
  //   257:  258,   // End of range is 258
  //   258:    0    // End of index set
  // }
  equal(set.rangeStartForIndex(hintSize),
         set.rangeStartForIndex(hintSize - 1));

  set.add(2);

  // Assuming SC.IndexSet.HINT_SIZE is 256,
  // the internal data structure looks like:
  // {
  //   0  : -  1,   // Hole until 1
  //   1  :    3,   // End of range is 3
  //   3  : -257,   // Hole until 257
  //   256:    2,   // Hint points at index 2, which is invalid.
  //   257:  258,   // End of range is 258
  //   258:    0    // End of index set
  // }

  equal(set.rangeStartForIndex(hintSize),
         set.rangeStartForIndex(hintSize - 1));
});

});minispade.register('sproutcore-runtime/~tests/system/index_set/remove', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest should_throw*/
var set ;
module("SC.IndexSet#remove", {
  setup: function() {
    set = SC.IndexSet.create();
  }
});

function iter(s) {
  var ret = [];
  set.forEach(function(k) { ret.push(k); });
  return ret ;
}

// ..........................................................
// BASIC REMOVES
//

test("remove a range after end of set", function() {
  equal(set.get('length'), 0, 'precond - should be empty');

  set.remove(1000, 5);
  equal(set.get('length'), 0, 'should still be empty');
  equal(set.get('max'), 0, 'max should return 1 past last index');
  deepEqual(iter(set), [], 'should be empty');
});

test("remove range in middle of an existing range", function() {
  set.add(100,4);
  deepEqual(iter(set), [100, 101, 102, 103], 'precond - should have range');

  set.remove(101,2);
  equal(set.get('length'), 2, 'new length should not include removed range');
  equal(set.get('max'), 104, 'max should return 1 past last index');
  deepEqual(iter(set), [100,103], 'should remove range in the middle');
});

test("remove range overlapping front edge of range", function() {
  set.add(100,2); // add initial set.
  equal(iter(set)[0], 100, 'precond - first index is 100');

  // now add second range
  set.remove(99,2);
  equal(set.get('length'), 1, 'should have extra length');
  equal(set.get('max'), 102, 'max should return 1 past last index');
  deepEqual(iter(set), [101]);
});

test("remove range overlapping last edge of range", function() {
  set.add(100,2).add(200,2); // make sure not last range
  deepEqual(iter(set), [100,101,200,201], 'should have two sets');

  // now add overlapping range
  set.remove(101,2);
  equal(set.get('length'), 3, 'new set.length');
  equal(set.get('max'), 202, 'max should return 1 past last index');
  deepEqual(iter(set), [100,200,201], 'should remove 101-102');
});

test("remove range overlapping two ranges, remove parts of both", function() {
  set.add(100,2).add(110,2);
  deepEqual(iter(set), [100,101,110,111], 'should have two sets');

  // now add overlapping range
  set.remove(101,10);
  equal(set.get('length'), 2, 'new set.length');
  equal(set.get('max'), 112, 'max should return 1 past last index');
  deepEqual(iter(set), [100,111], 'should remove range 101-110');
});

test("remove range overlapping three ranges, removing one and parts of the others", function() {
  set.add(100,2).add(105,2).add(110,2);
  deepEqual(iter(set), [100,101,105,106,110,111], 'should have two sets');

  // now add overlapping range
  set.remove(101,10);
  equal(set.get('length'), 2, 'new set.length');
  equal(set.get('max'), 112, 'max should return 1 past last index');
  deepEqual(iter(set), [100,111], 'should remove range 101-110');
});

test("remove range partially overlapping one range and replacing another range", function() {
  set.add(100,2).add(105,2);
  deepEqual(iter(set), [100,101,105,106], 'should have two sets');

  // now add overlapping range
  set.remove(101,10);
  equal(set.get('length'), 1, 'new set.length');

  equal(set.get('max'), 101, 'max should return 1 past last index');
  deepEqual(iter(set), [100], 'should include one range 100-110');
});

test("remove range overlapping last index", function() {
  set.add(100,2); // add initial set.
  equal(iter(set)[0], 100, 'precond - first index is 100');

  // now add second range
  set.remove(101,2);
  equal(set.get('length'), 1, 'should have extra length');
  equal(set.get('max'), 101, 'max should return 1 past last index');
  deepEqual(iter(set), [100]);
});

test("remove range matching existing range", function() {
  set.add(100,5); // add initial set.
  deepEqual(iter(set), [100, 101, 102, 103, 104]);

  // now add second range
  set.remove(100,5);
  equal(set.get('length'), 0, 'should be empty');
  equal(set.get('max'), 0, 'max should return 1 past last index');
  deepEqual(iter(set), []);
});

// ..........................................................
// NORMALIZED PARAMETER CASES
//

test("remove with no params should do nothing", function() {
  set.add(10,2).remove();
  deepEqual(iter(set), [10,11]);
});

test("remove with single number should remove index only", function() {
  set.add(10,2).remove(10);
  deepEqual(iter(set), [11]);
});

test("remove with range object should remove range only", function() {
  set.add(10,5).remove({ start: 10, length: 2 });
  deepEqual(iter(set), [12,13,14]);
});

test("remove with index set should add indexes in set", function() {
  set.add(0,14).remove(SC.IndexSet.create().add(2,2).add(10,2));
  deepEqual(iter(set), [0,1,4,5,6,7,8,9,12,13]);
});


// ..........................................................
// OTHER BEHAVIORS
//
test("remove a range should trigger an observer notification", function() {
  var callCnt = 0;
  set.add(10, 20);

  set.addObserver('[]', function() { callCnt++; });
  set.remove(10,10);
  equal(callCnt, 1, 'should have called observer once');
});

test("removing a non-existent range should not trigger observer notification", function() {
  var callCnt = 0;

  set.addObserver('[]', function() { callCnt++; });
  set.remove(10,10); // 10-20 are already empty
  equal(callCnt, 0, 'should NOT have called observer');
});

test("removing a clone of the same index set should leave an empty set", function() {
  var set = SC.IndexSet.create(0,2), set2 = set.clone();
  ok(set.isEqual(set2), 'precond - clone is equal to receiver');
  set.remove(set2);
  equal(set.get('length'), 0, 'set should now be empty');
});

test("removing an index range outside of target range (specific bug)", function() {

  var set = SC.IndexSet.create(10,3);
  var set2 = SC.IndexSet.create(0,3);

  // removing set2 from set should not changed set at all because it is
  // before the first range, but it causes a problem with the length.
  set.remove(set2);
  equal(set.get('length'), 3, 'length should not change');
});

test("remove() raises exception when frozen", function() {
  throws(function() {
    set.freeze().remove(0,2);
  }, SC.FROZEN_ERROR);
});

});minispade.register('sproutcore-runtime/~tests/system/index_set/removeEach', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */
var set ;
module("SC.IndexSet#removeEach", {
  setup: function() {
    set = SC.IndexSet.create().add(1000,2).add(1010).add(1020).add(1030);
  }
});

function iter(s) {
  var ret = [];
  set.forEach(function(k) { ret.push(k); });
  return ret ;
}

// ..........................................................
// BASIC ADDS
//

test("should iterate over an array", function() {
  set.removeEach([1000, 1010, 1020, 1030]);
  equal(set.get('length'), 1, 'should have correct index count');
  equal(set.get('max'), 1002, 'max should return 1 past last index');
  deepEqual(iter(set), [1001]);
});

test("adding should iterate over a set", function() {
  // add out of order...
  var input = SC.Set.create().add(1030).add(1010).add(1020).add(1000);
  set.removeEach(input);
  equal(set.get('length'), 1, 'should have correct index count');
  equal(set.get('max'), 1002, 'max should return 1 past last index');
  deepEqual(iter(set), [1001]);
});


test("adding should iterate over a indexset", function() {
  // add out of order...
  var input = SC.IndexSet.create().add(1000).add(1010).add(1020).add(1030);
  set.removeEach(input);
  equal(set.get('length'), 1, 'should have correct index count');
  equal(set.get('max'), 1002, 'max should return 1 past last index');
  deepEqual(iter(set), [1001]);
});

});minispade.register('sproutcore-runtime/~tests/system/index_set/without', function() {// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same notest */
var set, ret ;
module("SC.IndexSet#without", {
  setup: function() {
    set = SC.IndexSet.create(1,9);
  }
});

function iter(s) {
  var ret = [];
  s.forEach(function(k) { ret.push(k); });
  return ret ;
}

test("should return empty set when removing self", function() {
  ret = set.without(set);
  ok(ret !== set, 'is not same instance');
  deepEqual(iter(ret), []);
});

test("should return set with range removed from middle", function() {
  ret = SC.IndexSet.create(2,6);
  ret = set.without(ret);
  ok(ret !== set, 'is not same instance');
  deepEqual(iter(ret), [1,8,9]);
});

test("should return set with range removed overlapping end", function() {
  ret = set.without(SC.IndexSet.create(6,6));
  ok(ret !== set, 'is not same instance');
  deepEqual(iter(ret), [1,2,3,4,5]);
});

test("should return set with range removed overlapping beginning", function() {
  ret = set.without(SC.IndexSet.create(0,6));
  ok(ret !== set, 'is not same instance');
  deepEqual(iter(ret), [6,7,8,9]);
});


test("should return set with multiple ranges removed", function() {
  ret = set.without(SC.IndexSet.create(2,2).add(6,2));
  ok(ret !== set, 'is not same instance');
  deepEqual(iter(ret), [1,4,5,8,9]);
});

test("using without should properly hint returned index set", function() {
  var set = SC.IndexSet.create(10000,5),
      set2 = SC.IndexSet.create(10000),
      actual = set.without(set2),
      loc = SC.IndexSet.HINT_SIZE;
      
  while(loc<2000) { // spot check
    equal(actual._content[loc], 0, 'index set should have hint at loc %@ - set: %@'.fmt(loc, actual.inspect()));
    loc += SC.IndexSet.HINT_SIZE;
  }
});

// ..........................................................
// NORMALIZED PARAMETER CASES
// 

test("passing no params should return clone", function() {
  ret = set.without();
  ok(ret !== set, 'is not same instance');
  ok(ret.isEqual(set), 'has same content');
});

test("passing single number should remove just that index", function() {
  ret = set.without(5);
  deepEqual(iter(ret), [1,2,3,4,6,7,8,9]);
});

test("passing two numbers should remove range", function() {
  ret = set.without(2,6);
  deepEqual(iter(ret), [1,8,9]);
});

test("passing range object should remove range", function() {
  ret = set.without({ start: 2, length: 6 });
  deepEqual(iter(ret), [1,8,9]);
});


});