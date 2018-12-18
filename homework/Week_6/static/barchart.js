/*
Author:             Tiancheng Guo
Student number:     12455814
Description:        Create a bar chart with the D3 library using the given data.
*/

d3.json("../data/data.json").then(function(jsonfile) {

    // get the dataset from json
    var dataset = jsonfile.filter(function(e) { return (e.INDICATOR == "CG_SENG" && e.INEQUALITY == "TOT"
                                                         && e.Country != "OECD - Total");});

    var width = 1200; // visual area width of svg
    var height = 600;   // visual area height of svg

    /* initialize the svg */
    var svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height);
    
    var padding = {top: 20, right: 20, bottom: 20, left: 50}; // margin of canvas
    
    var xAxisWidth = width - 200; // width of x-axis
    var yAxisWidth = height - 100; // height of y-axis
    var bar_num = dataset.length; // the number of columnar bodys
    
    /* x-axis scale (ordinal scale) */
    var xScale = d3.scaleBand()
                    .domain(dataset.map(function(d) { return d.LOCATION; }))
                    .range([0, xAxisWidth], 0.3);

    /* y-axis scale (ordinal scale) */
    var yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, function(d) { return d.Value; })])
                    .range([yAxisWidth, 0]);
    
    /* y-bar-axis scale (ordinal scale) */
    var yBarScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, function(d) { return d.Value; })])
                    .range([0, yAxisWidth]); // range is reversed from y-axis
    
    /* title of the bar chart, on the middle and top of total figure */
    svg.append("text")
        .attr("class", "title")
        .attr("x", width / 2 + padding.left)
        .attr("y", padding.top * 2)
        .attr("text-anchor", "middle")
        .text("Country life quality - Total")

    /* rect */
    var rect = svg.selectAll("rect")
                    .data(dataset)
                    .enter()
                    .append("rect")
                    .call(rectFun) // call rectFun for each selection
                    .on("mouseover",function(d) { // the cursor is placed on the rectangle
                        d3.select(this)
                            .attr("fill","purple"); // set the new color of current rectangle
                        
                        /* show a red line as the highlight */
                        svg.append("line")
                            .attr("id", "highlight") // set the id for disappearance
                            .attr("x1", padding.left)
                            .attr("y1", height - padding.bottom - yBarScale(d.Value))
                            .attr("x2", width)
                            .attr("y2", height - padding.bottom - yBarScale(d.Value))
                            .attr("stroke", "red");
                        
                        /* show the number of wind speed for current bar */
                        svg.append("text")
                            .attr("class", "bar-number")
                            .attr("id", "currentnum") // set the id for disappearance
                            .attr("x", 0.75 * padding.left + xScale(d.LOCATION))
                            .attr("y", height - 2 * padding.bottom - yBarScale(d.Value))
                            .attr("dx", xAxisWidth / bar_num)
                            .attr("dy", "1em")
                            .text(d.Value);
                        
                    })
                    .on("mouseout",function() { // the cursor leaves the rectangle.
                        d3.select(this)
                            .transition()
                            .duration(500) // gradual change with animation effects
                            .attr("fill","steelblue"); // change to original color

                        d3.selectAll("#highlight").attr("opacity", 0); // display the highlight
                        d3.selectAll("#currentnum").attr("opacity", 0); // display the number
                    })
    
    /* add axis using the scales above */
    var xAxis = d3.axisBottom(xScale).ticks(bar_num);
    var yAxis = d3.axisLeft(yScale);
    
    /* find proper position to draw x-axis */
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + ", " + (height - padding.bottom) + ")")
        .call(xAxis);
    
    /* find proper position to draw the label of x-axis*/
    svg.append("text")
        .attr("class", "label")
        .text("Contry name")
        .attr("transform", "translate(" + (xAxisWidth + padding.right + padding.left) + 
                                            "," + (height - padding.bottom) + ")");

    /* find proper position to draw y-axis */    
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom - yAxisWidth) + ")")
        .call(yAxis);
    
    /* find proper position to draw the label of y-axis*/
    svg.append("text")
        .attr("class", "label")
        .text("Life quality")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom - yAxisWidth) + ")");

    /* rect processing function */
    function rectFun(selection) { // use this function for each selection
        selection.attr("fill", "steelblue")
                    .attr("x", function(d) { return 1.1 * padding.left + xScale(d.LOCATION); }) // align coordinate numbers with tick marks
                    .attr("y", function(d) { return height - padding.bottom - yBarScale(d.Value); })
                    .attr("width", xAxisWidth / bar_num / 1.5) // appropriate rectangular width to ensure the visibility of the blank and the appearance of the rectangle
                    .attr("height", function(d) { return yBarScale(d.Value); });
    }

});
