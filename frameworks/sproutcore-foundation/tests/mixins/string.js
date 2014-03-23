// ==========================================================================
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
