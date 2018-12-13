/* initialize the request */
var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
var requests = [d3.json(womenInScience), d3.json(consConf)];

window.onload = function() {
    Promise.all(requests).then(function(response) {
        /* workresponse(response)
           load data using the function written in "fetchdata.js"
           the second parameter enable both response possess a country name.
        */
        var dataset = [transformResponse(response[0], 0), transformResponse(response[1], 1)];
        var colorList = ["rgb(255,255,178)", "rgb(254,217,118)", "rgb(254,178,76)", 
                             "rgb(253,141,60)", "rgb(240,59,32)", "rgb(189,0,38)"]; // 6 blind friendly colors list
        var countryList = ["France", "Germany", "Korea", "Netherlands", "Portugal", "United Kingdom"]; // 6 countries list
        
        var width = 1600; // visual area width of svg
        var height = 700; // visual area height of svg

        var xAxisWidth = width - 500; // width of x-axis
        var yAxisWidth = height - 150; // height of y-axis

        var padding = {top: 20, right: 20, bottom:20, left:50}; // margin of canvas

        var bufferAxis = 30; // the gap for Axis
        var circleRadius = 7;

        var svg, xScale, yScale;

        function initialFigure(Inputdata, datasetNum) {
    
            /* initialize the svg */
            svg = d3.select("body")
                        .append("svg")
                        .attr("class", "test")
                        .attr("width", width)
                        .attr("height", height);

            /* x-axis scale (ordinal scale) */
            xScale = d3.scaleLinear()
                            .domain([d3.min(Inputdata, function(d) { return d.time; }),
                                    d3.max(Inputdata, function(d) { return d.time; })])
                            .range([bufferAxis, xAxisWidth]);

            /* y-axis scale (ordinal scale) */
            yScale = d3.scaleLinear()
                            .domain([d3.min(Inputdata, function(d) { return d.datapoint; }),
                                    d3.max(Inputdata, function(d) { return d.datapoint; })])
                            .rangeRound([bufferAxis, yAxisWidth]);
            
            /* title of the scatter chart, on the middle and top of total figure */
            svg.append("text")
                .attr("class", "title")
                .attr("x", width / 2 + padding.left)
                .attr("y", padding.top * 2)
                .attr("text-anchor", "middle")
                .text("Scatter Plot(Dataset" + datasetNum + ")")
        }

        function drawScale(datasetNum) {

            var xAxis = d3.axisBottom(xScale)
                          .tickFormat(d3.format("d"));

            yScale.range([yAxisWidth, bufferAxis]);  // reset the value range of the y-axis scale, as opposed to the original
            var yAxis = d3.axisLeft(yScale);
            
            /* find proper position to draw x-axis */
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
                .call(xAxis);

            /* find proper position to draw the label of x-axis*/
            svg.append("text")
                .attr("class", "label")
                .text("year")
                .attr("transform", "translate(" + (xAxisWidth + padding.right + padding.left) + "," + (height- padding.bottom) + ")");

            /* find proper position to draw y-axis */    
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate("+ padding.left + "," + (height - padding.bottom - bufferAxis- yAxisWidth) + ")")
                .call(yAxis);

            /* find proper position to draw the label of y-axis*/

            if (datasetNum == 0) {
                svg.append("text")
                    .attr("class", "label")
                    .text("percentage(%)")
                    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom - bufferAxis - yAxisWidth) + ")");
            }
            else {
                svg.append("text")
                    .attr("class", "label")
                    .text("Consumer confidence")
                    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom - bufferAxis - yAxisWidth) + ")");
            }

            // after drawing the scale, restore the scale y-axis value range
            yScale.range([bufferAxis, yAxisWidth]);
        }

        function drawCircle(Inputdata) {
        // this function draw each circle in the Figure

            var Circle = svg.selectAll("circle")
                            .data(Inputdata)
                            .enter()
                            .append("circle")
                            .attr("cx", function(d) {
                                return padding.left + xScale(d.time)
                            })
                            .attr("cy", function(d) {
                                return height - padding.bottom - bufferAxis - yScale(d.datapoint)
                            })
                            .attr("r", circleRadius)
                            .attr("fill", function(d) {
                                for (var i = 0; i < countryList.length; i++) {
                                    if (countryList[i] == d.Country) {
                                        return colorList[i];
                                    }
                                }
                                return colorList[-1];
                            });
        }

        function addLegend() {

            var bufferLegend = 30;
        
            var legend = svg.selectAll(".legend")
                            .data(countryList)
                            .enter()
                            .append("g")
                            .attr("class", "legend")
                            .attr("transform", function (d, i) { return "translate(0," + i * bufferLegend + ")"; });
                
            // show the colors of circles in right top as legends symbols
            legend.append("circle")
                    .attr("cx", function (d, i) {
                          return xAxisWidth + 200;
                    })
                    .attr("cy", function (d, i) {
                        return padding.top + bufferAxis + i * bufferLegend;
                    })
                    .attr("r", function(d) { return circleRadius; })
                    .data(countryList)
                    .style("fill", function(d, i) { 
                        return colorList[i];
                    });
            
              
            // add text for each colorful circle about which country it belongs to
            legend.append("text")
                    .attr("x", xAxisWidth + 220)
                    .attr("y", function (d, i) {
                        return padding.top + bufferAxis + i * bufferLegend;
                    })
                    .data(countryList)
                    .attr("dy", ".35em")
                    .style("text-anchor", "left")
                    .text(function (d) { return d});
        };  

        function Draw(datasetNum) {
            initialFigure(dataset[datasetNum], datasetNum);
            drawScale(datasetNum);
            drawCircle(dataset[datasetNum]);
            addLegend();

        }

        var datasetNumCurrent = 0;
        Draw(datasetNumCurrent);
        // Show the dataset 0 at the begging.

        // for each click on botton, clean current figure, change dataset and then show he new figure.
        document.getElementById("click").onclick = function ChangeDatasetNum() {
            d3.selectAll("svg")
                .remove();
            datasetNumCurrent = 1 - datasetNumCurrent;
            Draw(datasetNumCurrent);
        }
    })
    .catch(function(e) { throw(e); }); // once some errors occur in promise;
}
