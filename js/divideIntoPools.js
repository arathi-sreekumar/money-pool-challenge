'use strict';

var moneyPool = {poolShares: [], hasPools: false, totalPoolShareValue: 0, total: 0, poolSharePercents: []};

(function () {

    //Prevent total money form submission to avoid page refresh
    document.getElementById('total-money-form').onsubmit = function(e) {
        e.preventDefault();
    };

    //Total money is stored to moneyPool object when 'total-money' field changes value
    document.getElementById('total-money').onchange = function (e) {
        e.preventDefault();

        //Number validation for total money
        if (isNaN(this.value)) {
            showElementById('total-money-error');
            return;
        }
        //if valid hide error message for total field
        hideElementById('total-money-error');

        //Accept only upto two decimal places for total, remove the rest and update field
        moneyPool.total = +(parseFloat(this.value).toFixed(2));
        this.value = moneyPool.total;

        if (moneyPool.total > 0) {
            hideElementById('total-money-info-msg'); //Hiding info message on how to fill total money when value is present
            showElementById('reset-money-pool'); //Showing reset button once form is changed

            if (moneyPool.totalPoolShareValue === 100) {
                showElementById('get-pools'); //If both total and percentage inputs are complete and valid show 'show pools' button
            }
        }
    };

    //Each pool value entry is taken as input and added to pool list
    document.getElementById('create-pool').onclick = function (e) {
        e.preventDefault();
        var poolValue = parseFloat(document.getElementById('pool-percent').value);
        var validationObject = moneyPool.validatePoolValue(poolValue);

        if (validationObject.isValid === false) { // If invalid pool value exit
            document.getElementById('pool-share-error').innerHTML = validationObject.message;
            return;
        }

        //Adding pool value to money pool and updating the total
        moneyPool.poolShares.push(poolValue);
        moneyPool.poolSharePercents.push(poolValue/100);
        moneyPool.totalPoolShareValue += poolValue;
        document.getElementById('pool-share-error').innerHTML = '';

        //update remaining percentage display
        document.getElementById('percent-remaining').innerHTML = (100 - moneyPool.totalPoolShareValue);

        //Show the pool percentage shares listing section
        document.getElementById('pool-percent').value = '';
        if (!moneyPool.hasPools) {
            moneyPool.hasPools = true;
            showElementByClassName('pool-shares');
            showElementById('reset-money-pool'); //show reset button if there is an input
        }

        // Add pool to listing section
        createNewPoolRow(poolValue);

        if (moneyPool.totalPoolShareValue === 100) {
            document.getElementById('percentage-form').className = 'hide'; //hide percentage form

            if (moneyPool.total !== 0) {
                showElementById('get-pools'); // If all valid inputs are present then show 'show pool' buton
            } else {
                showElementById('total-money-info-msg'); //If total field is missing prompt user
            }
        }
    };

    //Swap back to input view on click of this button
    document.getElementById('view-money-pool-input').onclick = function () {
        hideElementByClassName('money-pool-display');
        showElementById('money-pool-input');
    };

    //When get pools button is clicked, generate pools and display the result
    document.getElementById('get-pools').onclick = function () {
        showElementByClassName('money-pool-display');
        hideElementById('money-pool-input');
        moneyPool.createMoneyPoolView();
    };

    //When reset button is clicked reset the display to initial input display
    document.getElementById('reset-money-pool').onclick = function () {
        hideElementByClassName('money-pool-display');
        showElementById('money-pool-input');
        moneyPool.resetMoneyPool();
    };

    //Function to reset inputs
    moneyPool.resetMoneyPool = function () {
        document.getElementById('created-pool-shares').innerHTML = ''; //Remove all pools added
        hideElementByClassName('pool-shares'); // hide pools listing section
        hideElementById('reset-money-pool'); // hide reset button
        hideElementById('get-pools'); // hide get pools button
        document.getElementById('percentage-form').className = ''; //show percentage form
        document.getElementById('total-money').value = ''; //Reset total to empty
        document.getElementById('percent-remaining').innerHTML = '100'; //Reset total pool percent available to 100
        document.getElementById('pool-share-error').innerHTML = ''; // reset error message of percent
        hideElementById('total-money-error'); // reset the error message of total amount

        //reset all money pool object attributes
        moneyPool.poolShares = [];
        moneyPool.poolSharePercents = [];
        moneyPool.hasPools = false;
        moneyPool.totalPoolShareValue = 0;
        moneyPool.total = 0;
    };

    // Creating a money pool view when all inputs are valid
    moneyPool.createMoneyPoolView = function () {
        //generate money pools using the divide into pools function
        moneyPool.poolShareValues = moneyPool.divideIntoPools(moneyPool.total, moneyPool.poolSharePercents);
        var poolViewContainer = document.getElementById('created-money-pools');
        poolViewContainer.innerHTML = ''; // Reset the pools view

        //Create each pools display element and show in pool list
        for (var i = 0; i < moneyPool.poolShareValues.length; i++) {
            var newShareElement = document.createElement('LI');
            newShareElement.innerHTML = '<span class="share-money">&pound;' + moneyPool.poolShareValues[i].toFixed(2) + '</span>' +
                                        '<span class="share-percent">' + moneyPool.poolShares[i] + '%</span>' +
                                        '<span class="share-display"><span class="bar" style="width: ' +  moneyPool.poolShares[i] + '%;"></span></span>';
            poolViewContainer.appendChild(newShareElement);
        }
        //Show total money in the view
        document.getElementById('display-total-money').innerHTML = moneyPool.total;
    };

    // Function to create a pool percentage row for each input pool percent
    function createNewPoolRow (poolValue) {
        var newShareElement = document.createElement('LI');
        newShareElement.innerHTML = '<span>Share percentage: ' + poolValue + '%</span>';
        newShareElement.className = 'clearfix';
        var removeButton = document.createElement('BUTTON');
        removeButton.className = 'remove-share btn-remove';
        removeButton.setAttribute('data-share', poolValue);
        removeButton.setAttribute('title', 'Remove');
        removeButton.innerHTML = 'X';
        removeButton.addEventListener('click', removeShareHandler, false);
        newShareElement.appendChild(removeButton);

        document.getElementById('created-pool-shares').appendChild(newShareElement);
    }

    //This is to remove a pool share that has been added
    var removeShareHandler = function (e) {
        var rowToRemove = this.parentNode;
        console.log(this);
        var shareValue = parseFloat(this.getAttribute('data-share'));
        var index = moneyPool.poolShares.indexOf(shareValue);
        if (index > -1) {
            moneyPool.poolShares.splice(index, 1); //remove pool share from list
            moneyPool.totalPoolShareValue -= shareValue; // update total with pool share value subtracted
        }
        index = moneyPool.poolSharePercents.indexOf(shareValue/100);
        if (index > -1) {
            moneyPool.poolSharePercents.splice(index, 1); //remove pool share from percentage list
        }
        rowToRemove.parentNode.removeChild(rowToRemove); //Remove the row displaying pool share from the ui
        document.getElementById('percentage-form').className = ''; //Remove hide class from percentage form in case its hidden
        if (moneyPool.totalPoolShareValue === 0) {
            moneyPool.hasPools = false;
            hideElementByClassName('pool-shares');
        }
        //update remaining percentage display
        document.getElementById('percent-remaining').innerHTML = (100 - moneyPool.totalPoolShareValue);
    };

    //Hide an element by classname from view by adding hide class to each element with the class
    function hideElementByClassName(className) {
        var elementList = document.getElementsByClassName(className);

        [].forEach.call(elementList, function (element) {
            element.className = element.className.replace(/\bhide\b/,'') + ' hide';
        });
    }

    //Hide an element by Id from screen, by adding hide class
    function hideElementById(id) {
        document.getElementById(id).className = document.getElementById(id).className.replace(/\bhide\b/,'') + ' hide';
    }

    // Show an element by classname by removing the hide class from each element with the class
    function showElementByClassName(className) {
        var elementList = document.getElementsByClassName(className);

        [].forEach.call(elementList, function (element) {
            element.className = element.className.replace(/\bhide\b/,'');
        });
    }

    // Show an element by id by removing the hide class
    function showElementById(id) {
        document.getElementById(id).className = document.getElementById(id).className.replace(/\bhide\b/,'');
    }

    //Pool input percentage value validation function
    moneyPool.validatePoolValue = function (poolValue) {
        var errorMsg = '', isValid = true;
        document.getElementById('pool-share-error').innerHTML = '';

        if (isNaN(poolValue)) {
            errorMsg = 'Pool share value has to be a number';
            isValid = false;
        } else if (poolValue === 0) {
            errorMsg = 'Pool share value cannot be 0';
            isValid = false;
        } else if ((poolValue + moneyPool.totalPoolShareValue) > 100) {
            errorMsg = 'Total pool share cannot exceed 100%, you have ' + (100 - moneyPool.totalPoolShareValue) + '% left';
            isValid = false;
        }
        return {isValid: isValid, message: errorMsg};
    };



    moneyPool.divideIntoPools = function(money, percentage) {

        //sanity check for percentage adding up to 1
        var percentTotal = percentage.reduce(function(a, b) {
            return +(parseFloat(a + b).toFixed(2)); //this is to resolve floating point addition correctly
        });

        if (percentTotal !== 1) {
            console.log('Error! Total percentage not equal to 100');
            return false;
        }

        //creating pools and ranking based on 3rd decimal place of the pools
        var pools = [], ranking = [], totalPools = 0;
        percentage.forEach(function (percent, index) {
            // For each percentage, the corresponding pool value is calculated upto two decimal places
            // The third decimal place is ignored
            pools[index] = +((Math.floor(money * percent * 100)) / 100).toFixed(2);

            // The third decimal place denotes the ranking, which is used to add back remaining
            //  money if the pools don't add up to the total
            ranking[index] = {
                rank: Math.floor(money * percent * 1000) % 10,
                poolIndex: index //storing pool index for assigning balance back to pool
            };

            totalPools++;
        });

        // Calculating total amount in pools
        var poolTotal = pools.reduce(function(a, b) {
            return +(parseFloat(a + b).toFixed(2)); //this is to resolve floating point addition correctly
        });

        if (poolTotal !== money) { // If pools dont add up to total
            var difference = +(money - poolTotal).toFixed(2);
            var rankingIndex = 0, poolIndex;

            // Sort ranking in descending order based on rank, and if thats equal then higher percentage value
            ranking.sort(function(a,b) {
                var diff = b.rank - a.rank;
                if (diff === 0) {
                    diff = pools[b.poolIndex] - pools[a.poolIndex];
                }
                return diff;
            });

            // We loop through the difference and add 0.01 to each pool element in decsending order of rank
            while (difference > 0) {
                poolIndex = ranking[rankingIndex].poolIndex;

                //This is just a precaution, there should never be a case of having to exceed the total
                rankingIndex = (rankingIndex === totalPools)? 0 : (rankingIndex + 1);

                pools[poolIndex] = +(pools[poolIndex] + 0.01).toFixed(2);
                difference -= 0.01;
            }
        }

        return pools;
    };

})();
