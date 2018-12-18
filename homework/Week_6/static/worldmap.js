function drawWorldMap() {
    var height = 900;
    var width = 1600;

    var svg = d3.select('#container')
                .append('svg');

    d3.json("../data/world-countries.json", function(data) {

        /* Antarctica will not shown on the map */
        var features = _.filter(data.features, function(value, key) {
            return value.properties.name != 'Antarctica';
        });

        var projection = d3.geo.mercator();
        var oldScala = projection.scale();
        var oldTranslate = projection.translate();
        
        xy = projection.scale(oldScala * (width / oldTranslate[0] / 2) * 0.9)
                       .translate([width / 2, height / 2]);
        
        path = d3.geo.path().projection(xy);
        svg.attr('width', width).attr('height', height);
        svg.selectAll('path').data(features).enter().append('svg:path')
        .attr('d', path)
        .on('mouseover', function(data) {
            d3.select(this).attr('fill', 'rgba(2,2,139,0.61)');
        })
        .on('mouseout', function(data) {
            d3.select(this).attr('fill', 'rgba(128,124,139,0.61');
        })
        .attr('fill', 'rgba(128,124,139,0.61)')
        .attr('stroke', 'rgba(255,255,255,1)')
        .attr('stroke-width', 1);
        
        var myLocation = xy([121.3997, 31.0456]);
        svg.append('circle').attr('r', 15)
        .attr('fill', 'url(#tip)')
        .attr('transform', 'translate(' + myLocation[0] + ', ' + myLocation[1] + ')');
    });var height = window.innerHeight;
    var width = window.innerWidth;
    var svg = d3.select('#container').append('svg');
    d3.json("world-countries.json", function(data) {
        /* Antarctica will not shown on the map */
        var features = _.filter(data.features, function(value, key) {
        return value.properties.name != 'Antarctica';
        });
        var projection = d3.geo.mercator();
        var oldScala = projection.scale();
        var oldTranslate = projection.translate();
        xy = projection.scale(oldScala * (width / oldTranslate[0] / 2) * 0.9)
        .translate([width / 2, height / 2]);
        
        path = d3.geo.path().projection(xy);
        svg.attr('width', width).attr('height', height);
        svg.selectAll('path').data(features).enter().append('svg:path')
        .attr('d', path)
        .on('mouseover', function(data) {
            d3.select(this).attr('fill', 'rgba(2,2,139,0.61)');
        })
        .on('mouseout', function(data) {
            d3.select(this).attr('fill', 'rgba(128,124,139,0.61');
        })
        .attr('fill', 'rgba(128,124,139,0.61)')
        .attr('stroke', 'rgba(255,255,255,1)')
        .attr('stroke-width', 1);
        
        var myLocation = xy([121.3997, 31.0456]);
        svg.append('circle').attr('r', 15)
        .attr('fill', 'url(#tip)')
        .attr('transform', 'translate(' + myLocation[0] + ', ' + myLocation[1] + ')');
    });
}