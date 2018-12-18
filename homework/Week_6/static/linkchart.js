d3.json("../data/data.json").then(function(jsonfile) {

    barchart()
    piechart(0, 0)

    function changes(change_mark, change_order) {
        // implement changes

        d3.select(".pie").remove()
        piechart(change_mark, change_order);
    }

    function piechart(change_mark, change_order) {
        // change mark represents if the pie_chart change. 0 for none, 1 for add, 2 for delete.

        dataset_pie = jsonfile.filter(function(e) { return (e.INDICATOR == "JE_LMIS" && e.Country != "OECD - Total"); });

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

        // size of pie chart
        var arc = d3.arc()
                    .outerRadius(outerRadius)
                    .innerRadius(innerRadius);

        var colors = d3.scaleSequential(d3.interpolatePiYG);

        var svg_pie = d3.select('body')
                        .append('svg')
                        .attr("class", "pie")
                        .attr('width', width)
                        .attr('height', height);
        
        // title
        svg_pie.append("text")
            .attr("class", "title")
            .attr("x", width / 2)
            .attr("y", padding.top * 2)
            .attr("text-anchor", "middle")
            .text("Labour market insecurity")

        var arcs = svg_pie.selectAll('g')
                        .data(pie_data)
                        .enter()
                        .append('g')
                        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
        
        // make the color readable
        function color_rbg(i) {
            if (i % 2) return 0.15 + i / 38;
            else return 1 - i / 38;
        }
        
        arcs.append('path')
                .attr('fill', function(d, i) { return colors(color_rbg(i + 1))})
                .attr('d', function(d) { return arc(d);});

        function certain_country_add(order_number) {
            // the text of certain arc
            arcs.append('text')
                .attr("class", "percent")
                .attr('transform', function(d, i) {
                    // get the proper position
                    var x = arc.centroid(d)[0] * 3.0;
                    var y = arc.centroid(d)[1] * 3.0;
                    if (i < 9 || i > 33)
                        y = y + 20;
                    return 'translate(' + x + ', ' + y + ')';
                })
                .attr('text-anchor', 'middle')
                .text(function(d, i) {
                    if (i != order_number)
                        return;
                    var percent = Number(d.value) / d3.sum(dataset_pie, function(d){
                        return d.Value;
                    }) * 100;
                    return d.data.LOCATION + ' ' + percent.toFixed(1) + '%';
                })
            
            // the line of certain arc
            arcs.append('line')
                .attr("class", "relation")
                .attr("opacity", function(d, i) { if (i == order_number) return 1; else return 0; })
                .attr('x1', function(d) { return arc.centroid(d)[0] * 2; })
                .attr('y1', function(d) { return arc.centroid(d)[1] * 2; })
                .attr('x2', function(d) { return arc.centroid(d)[0] * 2.5; })
                .attr('y2', function(d) { return arc.centroid(d)[1] * 2.5; });
        }

        // delete the text and the line of pie_chart
        function certain_country_del() {
            arcs.selectAll("text")
                .remove();
            arcs.selectAll("line")
                .remove();
        }

        if (change_mark != 0) {
            if (change_mark == 1) certain_country_add(change_order);
            if (change_mark == 2) certain_country_del();
        }
    }

    function barchart() {
        // get the dataset_bar from json
        var dataset_bar = jsonfile.filter(function(e) { return (e.INDICATOR == "CG_SENG" && e.INEQUALITY == "TOT"
                                                            && e.Country != "OECD - Total");});

        var width = 1200; // visual area width of svg
        var height = 400;   // visual area height of svg

        /* initialize the svg */
        var svg = d3.select("body")
                    .append("svg")
                    .attr("class", "bar")
                    .attr("width", width)
                    .attr("height", height);
        
        var padding = {top: 20, right: 20, bottom: 20, left: 50}; // margin of canvas
        
        var xAxisWidth = width - 200; // width of x-axis
        var yAxisWidth = height - 100; // height of y-axis
        var bar_num = dataset_bar.length; // the number of columnar bodys
        
        // x-axis scale (ordinal scale)
        var xScale = d3.scaleBand()
                        .domain(dataset_bar.map(function(d) { return d.LOCATION; }))
                        .range([0, xAxisWidth], 0.3);

        // y-axis scale (ordinal scale)
        var yScale = d3.scaleLinear()
                        .domain([0, d3.max(dataset_bar, function(d) { return d.Value; })])
                        .range([yAxisWidth, 0]);
        
        // y-bar-axis scale (ordinal scale)
        var yBarScale = d3.scaleLinear()
                        .domain([0, d3.max(dataset_bar, function(d) { return d.Value; })])
                        .range([0, yAxisWidth]); // range is reversed from y-axis
        
        // title of the bar chart, on the middle and top of total figure
        svg.append("text")
            .attr("class", "title")
            .attr("x", width / 2 + padding.left)
            .attr("y", padding.top * 2)
            .attr("text-anchor", "middle")
            .text("Country life quality")

        // rect
        var rect = svg.selectAll("rect")
                        .data(dataset_bar)
                        .enter()
                        .append("rect")
                        .call(rectFun) // call rectFun for each selection
                        .on("mouseover",function(d, i) { // the cursor is placed on the rectangle
                            d3.select(this)
                                .attr("fill","purple"); // set the new color of current rectangle
                            
                            //  show a red line as the highlight 
                            svg.append("line")
                                .attr("id", "highlight") // set the id for disappearance
                                .attr("x1", padding.left)
                                .attr("y1", height - padding.bottom - yBarScale(d.Value))
                                .attr("x2", width)
                                .attr("y2", height - padding.bottom - yBarScale(d.Value))
                                .attr("stroke", "red");
                            
                            // show the number of wind speed for current ba
                            svg.append("text")
                                .attr("class", "bar-number")
                                .attr("id", "currentnum") // set the id for disappearance
                                .attr("x", 0.75 * padding.left + xScale(d.LOCATION))
                                .attr("y", height - 2 * padding.bottom - yBarScale(d.Value))
                                .attr("dx", xAxisWidth / bar_num)
                                .attr("dy", "1em")
                                .text(d.Value);

                            changes(1, i);
                            
                        })
                        .on("mouseout",function() { // the cursor leaves the rectangle.
                            d3.select(this)
                                .transition()
                                .duration(500) // gradual change with animation effects
                                .attr("fill","steelblue"); // change to original color

                            d3.selectAll("#highlight").attr("opacity", 0); // display the highlight
                            d3.selectAll("#currentnum").attr("opacity", 0); // display the number
                        })
        
        // add axis using the scales above
        var xAxis = d3.axisBottom(xScale).ticks(bar_num);
        var yAxis = d3.axisLeft(yScale);
        
        // find proper position to draw x-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding.left + ", " + (height - padding.bottom) + ")")
            .call(xAxis);
        
        // find proper position to draw the label of x-axis
        svg.append("text")
            .attr("class", "label")
            .text("Contry name")
            .attr("transform", "translate(" + (xAxisWidth + padding.right + padding.left) + 
                                                "," + (height - padding.bottom) + ")");

        //  find proper position to draw y-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom - yAxisWidth) + ")")
            .call(yAxis);
        
        // find proper position to draw the label of y-axis
        svg.append("text")
            .attr("class", "label")
            .text("Life quality")
            .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom - yAxisWidth) + ")");

        // rect processing function
        function rectFun(selection) { // use this function for each selection
            selection.attr("fill", "steelblue")
                        .attr("x", function(d) { return 1.1 * padding.left + xScale(d.LOCATION); }) // align coordinate numbers with tick marks
                        .attr("y", function(d) { return height - padding.bottom - yBarScale(d.Value); })
                        .attr("width", xAxisWidth / bar_num / 1.5) // appropriate rectangular width to ensure the visibility of the blank and the appearance of the rectangle
                        .attr("height", function(d) { return yBarScale(d.Value); });
        }
    }
});