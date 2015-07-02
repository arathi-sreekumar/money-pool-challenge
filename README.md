Implement function divideIntoPools that will divide money into percentage pools, for example:

    //splitting 100 into 2 equal pools.
    divideIntoPools(100, [.5, .5])
    > [50, 50]

Since the function is only operating on a finite resource (cents/pennies) make sure that it never gives out half-cents or any other fractions that cannot be expressed in currency.

If there is an amount of money that cannot be divided because of this it should be assigned to a greater percentage pool or the first percentage pool, for example.

    divideIntoPools(0.03, [.5, .5])
    > [0.02, 0.01]

Ensure that the total of percentage passed always adds up to 100%. Otherwise the function should throw an error.

Make all tests in test.js pass, it's also fine to write some tests.

Good luck!
