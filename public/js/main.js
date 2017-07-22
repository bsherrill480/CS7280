/**
 * Created by brian on 7/22/17.
 */

// should be last file in HTML

(function () {
	// "Imports"
	var p911 = window.p911;
	var hmap = window.hmap;
	var consts = window.consts;

	var centered;
	var width = consts.width;
	var height = consts.height;

	// Set svg width & height
	var svg = d3.select('svg')
		.attr('width', width)
        .attr('height', height);
	
    // Add background
    svg.append('rect')
        .attr('class', 'background')
        .attr('width', width)
        .attr('height', height);
//			.on('click', clicked);

	var g = svg.append('g');

	// call inits on imports so they can setup their map interactions
	p911.init(g);
	hmap.init(g);

	d3.csv('short_incident.csv', function (error, data) {
		p911.renderFilterPoliceDotsUI();
		p911.renderPoliceDots(data);
	});

	d3.json("Zillow_Zhvi_Neighborhoods_WA_Geo.json", function(error, mapData) {
		hmap.renderMap(mapData);
	});

})();
