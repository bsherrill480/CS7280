/**
 * 
 * Created by brian on 7/22/17.
 */
(function () {

	// "Imports"
	var consts = window.consts;
	var CRIME_TYPE_GROUPED = consts.CRIME_TYPE_GROUPED;
	var projection = consts.projection;

	
	function crimeTypeToClass(crimeType) {
		return crimeType.replace(/[^a-zA-Z]/g, '')
	}

	function processDots(data) {
		return data.map(function (item) {
			return {
				crimeType: item['Event Clearance Group'],
				loc: [item['Longitude'], item['Latitude']],
			};
		})
	}

	var renderPoliceDots = null;
	
	// set on init
	var dotLayer;

	function renderFilterPoliceDotsUI() {
		var rootEl = document.getElementById('crime-types-ui');

		CRIME_TYPE_GROUPED.forEach(function (crimeCategory) {
			var categoryName = crimeCategory.name;
			var crimeTypes = crimeCategory.crime;
			var crimeGroupContainer = document.createElement('div');
			var crimeGroupLabel = document.createElement('label');
			var crimeGroupOption = document.createElement('input');
			crimeGroupOption.setAttribute('type', 'checkbox');
			crimeGroupLabel.innerText = categoryName;
			crimeGroupLabel.className += ' crime-type-header';
			crimeGroupContainer.appendChild(crimeGroupOption);
			crimeGroupContainer.appendChild(crimeGroupLabel);
			var crimeGroupTypesContainer = document.createElement('div');
			crimeGroupTypesContainer.className += ' crime-group-types';

			crimeTypes.forEach(function(crime_type) {
				var option = document.createElement('input');
				var label = document.createElement('label');
				var crimeTypeContainer = document.createElement('div');
				crimeTypeContainer.appendChild(label);
				crimeTypeContainer.appendChild(option);
				label.innerText = crime_type;
				option.setAttribute('type', 'checkbox');
				option.checked = true;
				option.addEventListener('click', function () {
					console.log('clicked!', crime_type, option.checked);
					var className = crimeTypeToClass(crime_type);
					var isChecked = option.checked;
					var dotsToManipulate = document.getElementsByClassName(className);
					console.log('dotsTo', dotsToManipulate)
					var el;
					for(var i = 0; i < dotsToManipulate.length; i++) {
						el = dotsToManipulate[i];
						if (isChecked) {
							el.style.display = 'block'
						} else {
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
				return 'dot ' + crimeTypeToClass(d.crimeType);
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

