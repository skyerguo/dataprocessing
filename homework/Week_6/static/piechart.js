d3.json("../data/data.json").then(function(jsonfile) {
    // get the dataset from json
    var dataset_pie = jsonfile.filter(function(e) { return (e.INDICATOR == "JE_LMIS" && e.Country != "OECD - Total");});
    var dataset_bar = jsonfile.filter(function(e) { return (e.INDICATOR == "CG_SENG" && e.INEQUALITY == "TOT"
                                                                && e.Country != "OECD - Total");});
    // transform data for a pie chart
    var pie_trans = d3.pie()
                        .sort(null)
                        .value(function(d) { return d.Value; });
    var pie_data = pie_trans(dataset_pie);

    var width = 600;
    var height = 600;
    var padding = {top: 20, right: 20, bottom: 20, left: 50}; // margin of canvas

    // initialize the pie chart parameter
    var outerRadius = width / 4;
    var innerRadius = 0;

    var arc = d3.arc()
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);
    var colors = d3.scaleSequential(d3.interpolatePiYG);

    var svg = d3.select('body')
			        .append('svg')
			        .attr('width', width)
                    .attr('height', height);
                    
    svg.append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", padding.top * 2)
        .attr("text-anchor", "middle")
        .text("Labour market insecurity")

    var arcs = svg.selectAll('g')
                    .data(pie_data)
                    .enter()
                    .append('g')
                    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    function color_rbg(i) {
        if (i % 2) return 0.15 + i / 38;
        else return 1 - i / 38;
    }
    arcs.append('path')
            .attr('fill', function(d, i) { return colors(color_rbg(i + 1))})
            .attr('d', function(d) { return arc(d);});

    arcs.append('text')
        .attr('transform', function(d, i){
            var x = arc.centroid(d)[0] * 2.8;
            var y = arc.centroid(d)[1] * 2.8;
            return 'translate(' + x + ', ' + y + ')';
        })
        .attr('text-anchor', 'middle')
        .text(function(d) {
            var percent = Number(d.value) / d3.sum(dataset_pie, function(d){
                return d.Value;
            }) * 100;
            return d.data.LOCATION + ' ' + percent.toFixed(1) + '%';
        })

    arcs.append('line')
        .attr('stroke', 'black')
        .attr('x1', function(d){ return arc.centroid(d)[0] * 2; })
        .attr('y1', function(d){ return arc.centroid(d)[1] * 2; })
        .attr('x2', function(d){
            return arc.centroid(d)[0] * 2.5;
        })
        .attr('y2', function(d){
            return arc.centroid(d)[1] * 2.5;
        });
});