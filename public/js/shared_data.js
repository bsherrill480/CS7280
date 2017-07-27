/**
 * Created by brian on 7/26/17.
 */

(function () {
    var consts = window.consts;
    var CRIME_TYPES = consts.ALL_CRIME_TYPES;
	var uiShowCrimes = {};
	CRIME_TYPES.forEach(function (crimeType) {
		uiShowCrimes[crimeType] = true;
	});
    
    function calculateCurrentShowCrimes(d) {
        var crimesShown = [];
        d['Crimes'].forEach(function (crime) {
            if (uiShowCrimes[crime]) {
                crimesShown.push(crime)
            }
        });
        return crimesShown.length;
    }
    
    function calculateCurrentShowCrimesAll(allMapDatas) {
        return allMapDatas.map(function (d) {
            return {
                d: d,
                shownCrimes: calculateCurrentShowCrimes(d),
                zhvi: d.zhvi,
                crimeOverArea: calculateCrimesByArea(d),
            };
        })
    }
    
    function calculateCrimesByArea(d) {
        const SCALING_FACTOR = 1./100000;
        return calculateCurrentShowCrimes(d) / d['Area'] * SCALING_FACTOR
    }


    
    var sharedData = window.sharedData = {};
    sharedData.crimeUI = {
        showCrimes: uiShowCrimes,
    };
    sharedData.calculateCurrentShowCrimes = calculateCurrentShowCrimes;
    sharedData.calculateCurrentShowCrimesAll = calculateCurrentShowCrimesAll;
    sharedData.calculateCrimesByArea = calculateCrimesByArea;
    
    

})();
