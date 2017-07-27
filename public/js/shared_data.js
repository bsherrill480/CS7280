/**
 * Created by brian on 7/26/17.
 */

(function () {
    var consts = window.consts;
    var CRIME_TYPES = consts.ALL_CRIME_TYPES;
	var uiShowCrimeTime = {};
	CRIME_TYPES.forEach(function (crimeType) {
		uiShowCrimeTime[crimeType] = true;
	});
    
    var sharedData = window.sharedData = {};
    sharedData.crimeUI = {
        showCrimes: uiShowCrimeTime,
    };
})();
