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
        console.log(dataset);
        
        var width = 800; // visual area width of svg
        var height = 800; // visual area height of svg

        var xAxisWidth = width - 150; // width of x-axis
        var yAxisWidth = height - 150; // height of y-axis

        var padding = {top: 20, right: 20, bottom:20, left:50}; // margin of canvas

        var bufferAxis = 30;
    
        /* initialize the svg */
        var svg = d3.select("body")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

        /* x-axis scale (ordinal scale) */
        var xScale = d3.scaleLinear()
                        .domain([d3.min(dataset[0], function(d) { return d.time; }),
                                 d3.max(dataset[0], function(d) { return d.time; })])
                        .range([bufferAxis, xAxisWidth]);

        /* y-axis scale (ordinal scale) */
        var yScale = d3.scaleLinear()
                        .domain([d3.min(dataset[0], function(d) { return d.datapoint; }),
                                 d3.max(dataset[0], function(d) { return d.datapoint; })])
                        .rangeRound([bufferAxis, yAxisWidth]);

        
        function drawScale() {

            var xAxis = d3.axisBottom(xScale);

            yScale.range([yAxisWidth, bufferAxis]);  // 重新设置y轴比例尺的值域,与原来的相反
            var yAxis = d3.axisLeft(yScale);
            
            /* find proper position to draw x-axis */
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate("+ padding.left +","+ (height - padding.bottom) +")")
                .call(xAxis);

            /* find proper position to draw the label of x-axis*/
            svg.append("text")
                .attr("class", "label")
                .text("year")
                .attr("transform", "translate(" + (xAxisWidth + padding.right + padding.left) +","+ (height- padding.bottom) + ")");

            /* find proper position to draw y-axis */    
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate("+ padding.left +","+ (height - padding.bottom - bufferAxis- yAxisWidth) +")")
                .call(yAxis);

            /* find proper position to draw the label of y-axis*/
            svg.append("text")
                .attr("class", "label")
                .text("percentage(%)")
                .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom - bufferAxis - yAxisWidth) + ")");

            // 绘制完比例尺,还原比例尺y轴值域
            yScale.range([bufferAxis, yAxisWidth]);
        }

        function drawCircle() {
            var colorList = ["red", "orange", "yellow", "green", "cyan", "blue", "purple"]; // 7 regular colors list
            var countryList = ["France", "Germany", "Korea", "Netherlands", "Portugal", "United Kingdom"]; // 6 countries list

            var Circle = svg.selectAll("circle").data(dataset[0])
                            .enter()
                            .append("circle")
                            .attr("cx", function(d) {
                                return padding.left + xScale(d.time)
                            })
                            .attr("cy", function(d) {
                                return height - padding.bottom - bufferAxis - yScale(d.datapoint)
                            })
                            .attr("r", 5)
                            .attr("fill", function(d) {
                                for (var i = 0; i < countryList.length; i++) {
                                    if (countryList[i] == d.Country) {
                                        return colorList[i];
                                    }
                                }
                                return colorList[-1];
                            });
        }

        drawScale();
        drawCircle();

    })
    .catch(function(e) { throw(e); }); // once some errors occur in promise;
}
