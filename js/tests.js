'use strict';
var tests = [];
(function () {

    var divideIntoPools = moneyPool.divideIntoPools;
    var validateInput = moneyPool.validatePoolValue;

    function equals(arr1, arr2) {
        return arr1.length === arr2.length && arr1.map(function(value, index) {
            return arr1[index] === arr2[index];
        }).filter(function(isEqual) {
            return isEqual;
        }).length === arr1.length;
    }

    tests.push({
        expr: function() {
            return equals(divideIntoPools(100, [0.5, 0.5]), [50, 50]);
        },
        label: 'it divides into equal pools'
    });

    tests.push({
        expr: function() {
            return equals(divideIntoPools(123.45, [0.9, 0.04, 0.03, 0.02, 0.01]), [111.11, 4.94, 3.70, 2.47, 1.23]);
        },
        label: 'it handles many pools'
    });

    tests.push({
        expr: function() {
            return 123.45 === [111.11, 4.94, 3.70, 2.47, 1.23].reduce(function(a,b){return a+b;});
        },
        label: 'the total of pools equals the total'
    });

    tests.push({
        expr: function() {
            return equals(divideIntoPools(0.03, [0.51, 0.49]), [0.02, 0.01]);
        },
        label: 'it assignes reminders to the greater pool'
    });

    tests.push({
        expr: function() {
            return equals(divideIntoPools(0.03, [0.5,0.5]), [0.02, 0.01]);
        },
        label: 'it assigns reminder to first pool if two equals found'
    });

    tests.push({
        expr: function() {
            return equals(divideIntoPools(0.05, [0.3,0.1,0.29,0.31]), [0.02, 0, 0.01, 0.02]);
        },
        label: 'it assigns reminder to the better rounding off pool'
    });

    tests.push({
        expr: function() {
            return equals(divideIntoPools(0.05, [0.3,0.1,0.3,0.3]), [0.02, 0, 0.02, 0.01]);
        },
        label: 'it assigns reminder to the greater percentage pool'
    });

    tests.push({
        expr: function() {
            return equals(divideIntoPools(0.10, [0.75, 0.25]), [0.08, 0.02]);
        },
        label: 'it assignes reminders to the first pool'
    });

})();
