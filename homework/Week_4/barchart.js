/*
Author:             Tiancheng Guo
Student number:     12455814
Description:        Create a bar chart with the D3 library using the given data.
*/

d3.json("data.json").then(function(json) {

    var dataset = json;

    var width = 1200;    // svg可视区域宽度
    var height = 600;   // svg可视区域高度
    var svg = d3.select("body")
            .append("svg")
            .attr("width", width).attr("height", height);
    
    var padding = {top: 20, right: 20, bottom: 20, left: 50};   // 边距
    
    var xAxisWidth = width - 150; // x轴宽度
    var yAxisWidth = height - 100; // y轴宽度
    var bar_num = 31;
    
    /* x轴比例尺(序数比例尺) */
    var xScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, function(d) { return d.YYYYMMDD % 100; })])
            .range([0, xAxisWidth], 0.2);

    /* y轴比例尺(线性比例尺) */
    var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, function(d) { 
                return d.FG;
            })])
            .range([yAxisWidth, 0]);

    var yBarScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, function(d) { 
                return d.FG;
            })])
            .range([0, yAxisWidth]);
    
    /* title of the bar chart */
    svg.append('text')
        .attr('x', width / 2 + padding.left)
        .attr('y', padding.top * 2)
        .attr('text-anchor', 'middle')
        .style("font-size", "40px")
        .style("fill", "green")
        .text('Wind speed bar chart')
    
    /* 网格线 */
    /*function make_y_gridlines() {
        return d3.axisLeft(yScale).ticks(10)
    }
    svg.append("g")
        .attr("class", "grid")
        .call(make_y_gridlines()
                    .tickSize(-width) 
                    .tickFormat(""))*/

    /* rect */
    var rect = svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .call(rectFun)
            .on("mouseover",function(d,i) {
                d3.select(this)
                .attr("fill","purple");
                
                /* show a red line as the highlight */
                svg.append('line')
                    .attr('id', 'highlight')
                    .attr('x1', 0)
                    .attr('y1', height - padding.bottom - yBarScale(d.FG))
                    .attr('x2', width)
                    .attr('y2', height - padding.bottom - yBarScale(d.FG))
                    .attr('stroke', 'red');
                
                /* show the number of wind speed for current bar */
                svg.append("text")
                    .attr("id", 'currentnum')
                    .attr("fill", "white")
                    .attr("font-size", "14px").attr("text-anchor", "middle")
                    .attr("x", padding.left + xScale(i))
                    .attr("y", height - padding.bottom - yBarScale(d.FG))
                    .attr("dx", xAxisWidth / bar_num).attr("dy", "1em")
                    .text(d.FG);
                
            }) //光标放在矩形上时填充变色
            .on("mouseout",function(d,i) {
                d3.select(this)
                .transition()
                .duration(500)
                .attr("fill","steelblue");

                d3.selectAll("#highlight").attr('opacity', 0);
                d3.selectAll("#currentnum").attr('opacity', 0);
            }) //光标离开矩形上时填充变色
    
    
    /* text */
    /*var text = svg.selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .attr("opacity", 0)
            .call(textFun);*/
            /*.on("mouseover",function(d,i) {
                d3.select(this).attr("opacity", 1);
            }) //光标放在矩形上时填充变色
            .on("mouseout",function(d,i) {
                d3.select(this)
                .transition()
                .duration(500)
                .attr("opacity", 0);
            }) //光标离开矩形上时填充变色;*/
    
    /* 添加坐标轴 */
    var xAxis = d3.axisBottom(xScale).ticks(bar_num);
    var yAxis = d3.axisLeft(yScale);

    /*var str_windspeed = "WS, (0.1m/s)";
    var strs_windspeed = str_windspeed.split(',');
    var test_windspeed = svg.append("text")
                            .style("font-size", "25px")
                            .style("fill", "red");*/
    
    svg.append("g").attr("class", "axis")
            .attr("transform", "translate("+ padding.left +","+ (height - padding.bottom) +")")
            .call(xAxis);
    svg.append("text")
            .text("date")
            .style("font-size", "25px")
            .style("fill", "red")
            .attr("transform", "translate(" + (xAxisWidth + padding.right + padding.left) +","+ (height) + ")");
    
    svg.append("g").attr("class", "axis")
            .attr("transform", "translate("+ padding.left +","+ (height - padding.bottom - yAxisWidth) +")")
            .call(yAxis);
    svg.append("text")
            .text("FG")
            .style("font-size", "25px")
            .style("fill", "red")
            .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom - yAxisWidth) + ")");
    

    /* 网格 */
    /*svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom()
        .scale(xScale)
        .tickSize(-height, 0, 0)
        .tickFormat(''))*/

    /*svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft()
        .scale(yScale)
        .tickSize(-yAxisWidth, -padding.left)
        .tickFormat(''))*/

    /* rect处理函数 */
    function rectFun(selection) {
        selection.attr("fill", "steelblue")
                .attr("x", function(d, i){
                    return padding.left + xScale(i + 0.7);
                })
                .attr("y", function(d){
                    return height - padding.bottom - yBarScale(d.FG);
                })
                .attr("width", xAxisWidth / bar_num / 1.5)
                .attr("height", function(d){
                    return yBarScale(d.FG);
                });
    }
    
    /* text处理函数 */
    function textFun(selection){
        selection.attr("fill", "white")
                .attr("font-size", "14px").attr("text-anchor", "middle")
                .attr("x", function(d, i){
                    return padding.left + xScale(i);
                })
                .attr("y", function(d){
                    return height - padding.bottom - yBarScale(d.FG);
                })
                .attr("dx", xAxisWidth / bar_num).attr("dy", "1em")
                .text(function(d){
                    return d.FG;
                });
    }

});