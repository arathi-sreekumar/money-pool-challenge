'use strict';

var moneyPool = {poolShares: [], hasPools: false, totalPoolShareValue: 0, total: 0, poolSharePercents: []};

(function () {

    document.getElementById('total-money-form').onsubmit = function(e) {
        e.preventDefault();
    };

    document.getElementById('total-money').onchange = function (e) {
        e.preventDefault();
        moneyPool.total = this.value;
        if (moneyPool.total > 0) {
            hideElementById('total-money-info-msg');
            showElementById('reset-money-pool');

            if (moneyPool.totalPoolShareValue === 100) {
                showElementById('get-pools');
            }
        }
    };

    document.getElementById('create-pool').onclick = function (e) {
        e.preventDefault();
        var poolValue = parseFloat(document.getElementById('pool-percent').value);
        if (validatePoolValue(poolValue) === true) {
            moneyPool.poolShares.push(poolValue);
            moneyPool.poolSharePercents.push(poolValue/100);
            moneyPool.totalPoolShareValue += poolValue;
            //update remaining percentage display
            document.getElementById('percent-remaining').innerHTML = (100 - moneyPool.totalPoolShareValue);

            document.getElementById('pool-percent').value = '';
            if (!moneyPool.hasPools) {
                moneyPool.hasPools = true;
                showElementByClassName('pool-shares');
                showElementById('reset-money-pool');
            }

            createNewPoolRow(poolValue);

            if (moneyPool.totalPoolShareValue === 100) {
                document.getElementById('percentage-form').className = 'hide'; //hide percentage form

                if (moneyPool.total !== 0) {
                    showElementById('get-pools');
                } else {
                    showElementById('total-money-info-msg');
                }
            }
        }
    };

    document.getElementById('view-money-pool-input').onclick = function () {
        hideElementByClassName('money-pool-display');
        showElementById('money-pool-input');
    };

    document.getElementById('get-pools').onclick = function () {
        showElementByClassName('money-pool-display');
        hideElementById('money-pool-input');
        moneyPool.createMoneyPoolView();
    };

    document.getElementById('reset-money-pool').onclick = function () {
        hideElementByClassName('money-pool-display');
        showElementById('money-pool-input');
        moneyPool.resetMoneyPool();
    };

    moneyPool.resetMoneyPool = function () {
        document.getElementById('created-pool-shares').innerHTML = '';
        hideElementByClassName('pool-shares');
        hideElementById('reset-money-pool');
        hideElementById('get-pools');
        document.getElementById('percentage-form').className = ''; //show percentage form
        document.getElementById('total-money').value = '';
        document.getElementById('percent-remaining').innerHTML = '100';

        //reset all money pool attributes
        moneyPool.poolShares = [];
        moneyPool.poolSharePercents = [];
        moneyPool.hasPools = false;
        moneyPool.totalPoolShareValue = 0;
        moneyPool.total = 0;
    };

    moneyPool.createMoneyPoolView = function () {
        moneyPool.poolShareValues = moneyPool.divideIntoPools(moneyPool.total, moneyPool.poolSharePercents);
        var poolViewContainer = document.getElementById('created-money-pools');
        poolViewContainer.innerHTML = '';
        for (var i = 0; i < moneyPool.poolShareValues.length; i++) {
            var newShareElement = document.createElement('LI');
            newShareElement.innerHTML = '<span class="share-money">&pound;' + moneyPool.poolShareValues[i].toFixed(2) + '</span>' +
                                        '<span class="share-percent">' + moneyPool.poolShares[i] + '%</span>' +
                                        '<span class="share-display"><span class="bar" style="width: ' +  moneyPool.poolShares[i] + '%;"></span></span>';
            poolViewContainer.appendChild(newShareElement);
        }
        document.getElementById('display-total-money').innerHTML = moneyPool.total;
    };

    function createNewPoolRow (poolValue) {
        var newShareElement = document.createElement('LI');
        newShareElement.innerHTML = '<span>Share percentage: ' + poolValue + '%</span>';
        newShareElement.className = 'clearfix';
        var removeButton = document.createElement('BUTTON');
        removeButton.className = 'remove-share btn-remove';
        removeButton.setAttribute('data-share', poolValue);
        removeButton.innerHTML = 'Remove';
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

    function hideElementByClassName(className) {
        var elementList = document.getElementsByClassName(className);

        [].forEach.call(elementList, function (element) {
            element.className = element.className.replace(/\bhide\b/,'') + ' hide';
        });
    }

    function hideElementById(id) {
        document.getElementById(id).className = document.getElementById(id).className.replace(/\bhide\b/,'') + ' hide';
    }

    function showElementByClassName(className) {
        var elementList = document.getElementsByClassName(className);

        [].forEach.call(elementList, function (element) {
            element.className = element.className.replace(/\bhide\b/,'');
        });
    }

    function showElementById(id) {
        document.getElementById(id).className = document.getElementById(id).className.replace(/\bhide\b/,'');
    }

    moneyPool.validatePoolValue = function (poolValue) {
        var errorMsg = '', isValid = true;

        if (isNaN(poolValue)) {
            errorMsg = 'Pool has to be a number';
            isValid = false;
        } else if (poolValue === 0) {
            errorMsg = 'Pool value cannot be 0';
            isValid = false;
        } else if ((poolValue + moneyPool.totalPoolShareValue) > 100) {
            errorMsg = 'Total pool share cannot exceed 100%, you have ' + (100 - moneyPool.totalPoolShareValue) + '% left';
            isValid = false;
        }
        if (errorMsg !== '') {
            document.getElementById('pool-share-error').innerHTML = errorMsg;
        }
        return isValid;
    }

    moneyPool.divideIntoPools = function(money, percentage) {

        console.log(percentage);
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
