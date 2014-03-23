// ==========================================================================
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

