// ==========================================================================
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
