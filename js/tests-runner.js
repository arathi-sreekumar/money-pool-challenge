'use strict';

(function () {
    function runTests(tests) {
        var failed = 0;
        tests.forEach(function(test) {
            var runExpr = test.expr();
            if (!runExpr) {
                failed += 1;
            }
            console.assert(runExpr, test.label);
        });
        console.log('Passed: ' + (tests.length - failed), 'Failed: ' + failed);
        if (!failed) {
            console.log('Run all tests successfully');
        }
    }

    if (typeof tests === 'object' && tests.length) {
        runTests(tests);
    }
})();

