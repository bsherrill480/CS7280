/**
 * Created by brian on 7/26/17.
 */

(function () {
    var $infoName = $('#info-name');
    var $infoDesc = $('#info-desc');
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
    
    function updateSelectedDescription(d) {
        console.log('d', d);
        var zhvi = d.zhvi;
        var cost = zhvi !== -1 ? '$' + zhvi.toLocaleString() : 'Not available';
        var showCrimes = calculateCurrentShowCrimes(d);
        $infoName.text(d.Name);

        var htmlList = '<ul>';
        htmlList += '<li>' + 'Median Zhvi: ' + cost + '</li>';
        htmlList += '<li>' + 'Total Number of Crimes: ' + d.NumCrimes + '</li>';
        htmlList += '<li>' + 'Number of Crimes: ' + showCrimes + '</li>';
        htmlList += '<li>' + 'Relative Crime Over Area: ' + calculateCrimesByArea(d) + '</li>';
        // htmlList += '<li>' + 'Relative Crime by Area: ' + d.CrimeOverArea + '</li>';
        htmlList += '</ul>';
        $infoDesc.html(htmlList);    
    }


    
    var sharedData = window.sharedData = {};
    sharedData.crimeUI = {
        showCrimes: uiShowCrimes,
    };
    sharedData.calculateCurrentShowCrimes = calculateCurrentShowCrimes;
    sharedData.calculateCurrentShowCrimesAll = calculateCurrentShowCrimesAll;
    sharedData.calculateCrimesByArea = calculateCrimesByArea;
    sharedData.updateSelectedDescription = updateSelectedDescription;
    sharedData.resetMapColors = function () {}; // gets sets by housing_price.js
    
    

})();
