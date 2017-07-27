/**
 * 
 * Created by brian on 7/22/17.
 */
(function () {

	// "Imports"
	var CRIME_KEY = 'Event Clearance Group';
	var consts = window.consts;
	var CRIME_TYPE_GROUPED = consts.CRIME_TYPE_GROUPED;
	var projection = consts.projection;
	var crimeUI = window.sharedData.crimeUI;
	
	function crimeTypeToClass(crimeType) {
		var r = crimeType.replace(/[^a-zA-Z]/g, '')

		return r
	}

	function processDots(data) {
		return data.map(function (item) {
			return {
				crimeType: item[CRIME_KEY],
				loc: [item['Longitude'], item['Latitude']],
			};
		})
	}

	function getGroupCrimeCount(crimeCounts, crimeTypes) {
		var count = 0;
		crimeTypes.forEach(function (crimeType) {
			count += crimeCounts[crimeType];
		});
		return count;
	}

	var renderPoliceDots = null;
	
	// set on init
	var dotLayer;

	function renderFilterPoliceDotsUI(data) {
		console.log('data', data);

		var crimeCounts = {};
		consts.ALL_CRIME_TYPES.forEach(function (crimeType) {
			crimeCounts[crimeType] = 0;
		});
		data.forEach(function (d) {
			var crime = d[CRIME_KEY];
			crimeCounts[crime] += 1;
		});

		var rootEl = document.getElementById('crime-types-ui');

		CRIME_TYPE_GROUPED.forEach(function (crimeCategory) {
			var categoryName = crimeCategory.name;
			var crimeTypes = crimeCategory.crime;
			var crimeGroupContainer = document.createElement('div');
			var crimeGroupLabel = document.createElement('label');
			var groupCrimeCount =getGroupCrimeCount(crimeCounts, crimeTypes);
			crimeGroupLabel.innerText = categoryName + ' (' + groupCrimeCount + ')';
			crimeGroupLabel.className += ' crime-type-header';
			crimeGroupContainer.appendChild(crimeGroupLabel);
			var crimeGroupTypesContainer = document.createElement('div');
			crimeGroupTypesContainer.className += ' crime-group-types';
			var options = [];

			var groupOptions = document.createElement('small');

			var checkAllLink = document.createElement('a');
			checkAllLink.innerText = '(all)';
			checkAllLink.setAttribute('href', '#');
			checkAllLink.className += ' check-all-link';

			var uncheckAllLink = document.createElement('a');
			uncheckAllLink.innerText = '(none)';
			uncheckAllLink.setAttribute('href', '#');

			checkAllLink.addEventListener('click', function () {
				options.forEach(function (option) {
					if (!option.checked) {
						option.dispatchEvent(new MouseEvent('click', {}));
					}
				});
			});
			uncheckAllLink.addEventListener('click', function () {
				options.forEach(function (option) {
					if (option.checked) {
						option.dispatchEvent(new MouseEvent('click', {}));
					}
				});
			});

			groupOptions.appendChild(checkAllLink);
			groupOptions.appendChild(uncheckAllLink);

			crimeGroupContainer.appendChild(groupOptions);

			crimeTypes.forEach(function(crime_type) {
				if (crime_type == '') {
					console.log('badCrimeType', crime_type);
				}
				var option = document.createElement('input');
				options.push(option);
				var label = document.createElement('label');
				var crimeTypeContainer = document.createElement('div');
				crimeTypeContainer.appendChild(option);
				crimeTypeContainer.appendChild(label);
				var crimeCount = crimeCounts[crime_type];
				label.innerText = crime_type + ' (' + crimeCount + ')';
				option.setAttribute('type', 'checkbox');
				option.checked = true;
				option.addEventListener('click', function () {
					var className = crimeTypeToClass(crime_type);
					var isChecked = option.checked;
					crimeUI.showCrimes[crime_type] = isChecked;
					var dotsToManipulate = document.getElementsByClassName(className);
					var el;
					for(var i = 0; i < dotsToManipulate.length; i++) {
						el = dotsToManipulate[i];
						if (isChecked) { // then display them
							el.style.display = 'block'
						} else { // else don't
							el.style.display = 'none';
						}
					}

				});
				crimeGroupTypesContainer.appendChild(crimeTypeContainer);
			});
			
			crimeGroupContainer.appendChild(crimeGroupTypesContainer);
			rootEl.appendChild(crimeGroupContainer);
			
		});
	}

	function init(g) {
		dotLayer = g.append('g')
			.classed('dot-layer', true);
	}
	
	
	renderPoliceDots = function (data) {
		var dots = processDots(data);
		dotLayer.selectAll('circle')
			.data(dots)
			.enter()
			.append('circle')
			.attr('class', function (d) {
				return 'crime-dot dot ' + crimeTypeToClass(d.crimeType);
			})
			.attr('cx', function (d) {
				var loc = d.loc;
				return projection(loc)[0];
			})
			.attr('cy', function (d) {
				var loc = d.loc;
				return projection(loc)[1];
			})
			.attr('r', '1px')
			.attr('fill', 'blue')
	};


	
	// "exports"
	var p911 = window.p911 = {};
	p911.init = init;
	p911.renderFilterPoliceDotsUI = renderFilterPoliceDotsUI;
	p911.renderPoliceDots = renderPoliceDots;


})();

