/*
Author:             Tiancheng Guo
Student number:     12455814
Description:        Create a bar chart with the D3 library using the given data.
*/

d3.json("data.json").then(function(json) {

    var dataset = json;

    /*var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var width = document.body.clientWidth - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var container = d3.select('body')
                        .append('svg')
                        .attr('width', width + margin.left + margin.right)
                        .attr('height', height + margin.top + margin.bottom);

    var svg = container.append('g')
                        .attr('class', 'content')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3.scaleTime()
                    .domain(d3.extent(data, function(d) { return d.YYYYMMDD.substring(6, 8); }))
                    .range([0, width]);
                
    var y = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) { return d.FG; })])
                    .range([height, 0]);

    var xAxis = d3.axisBottom(x)
                .ticks(30);
                    
    var yAxis = d3.axisLeft(y)
                .ticks(10);    
    // calculate the width of each bar
    var barWidth = width / data.length;

    var bar = svg.selectAll('g')
                    .data(data)
                    .enter()
                    .append('g')
    // 接收一个数据填充一个g元素
    // 同时为g设置位置
                    .attr('transform', function(d, i) {
                        return 'translate(' + i * barWidth + ', 0)';
    });
    
    bar.append('rect')
        // 添加一个矩形
        .attr('y', function(d) { return height - d; })
        .attr('height', function(d) { return d; })
        .attr('width', barWidth - 1);   

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .append('text')
        .text('date')
        .attr('transform', 'translate(' + width + ', 0)');
        

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .text('FG');
    
    // calculate the width of each bar
    var barWidth = width / data.length;

    var bar = svg.selectAll('g')
                    .data(data)
                    .enter()
                    .append('g')
    // 接收一个数据填充一个g元素
    // 同时为g设置位置
                    .attr('transform', function(d, i) {
                        return 'translate(' + i * barWidth + ', 0)';
    });
    
    bar.append('rect')
        // 添加一个矩形
        .attr('y', function(d) { return height - d; })
        .attr('height', function(d) { return d; })
        .attr('width', barWidth - 1);   
    */

    var width = 660;    // svg可视区域宽度
    var height = 660;   // svg可视区域高度
    var svg = d3.select("body")
            .append("svg")
            .attr("width", width).attr("height", height);
    
    var padding = {top: 20, right: 20, bottom: 20, left: 50};   // 边距
    
    var xAxisWidth = 500; // x轴宽度
    var yAxisWidth = 500; // y轴宽度
    
    /* x轴比例尺(序数比例尺) */
    var xScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, function(d) { return d.YYYYMMDD.substring(6, 8); })])
            .range([0, xAxisWidth], 0.2);
    
    console.log('--');
    console.log(d3.max(d3.values(dataset), function(d) {
            return d.TG;
        })
    );
    console.log('--');
    /* y轴比例尺(线性比例尺) */
    var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, function(d) { 
                return d.FG;
            })])
            .range([yAxisWidth, 0]);

    /* rect */
    var rect = svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .call(rectFun);
    
    /* text */
    var text = svg.selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .call(textFun);
    
    /* 添加坐标轴 */
    var xAxis = d3.axisBottom(xScale).ticks(31);
    var yAxis = d3.axisLeft(yScale);
    
    svg.append("g").attr("class", "axis")
            .attr("transform", "translate("+ padding.left +","+ (height - padding.bottom) +")")
            .call(xAxis);
    svg.append("text")
            .text("date")
            .style("font-size", "20px")
            .attr("transform", "translate(" + (xAxisWidth + padding.right + padding.left) +","+ (height) + ")");
    
    svg.append("g").attr("class", "axis")
            .attr("transform", "translate("+ padding.left +","+ (height - padding.bottom - yAxisWidth) +")")
            .call(yAxis);
    svg.append("text")
            .text("FG")
            .style("font-size", "20px")
            .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom - yAxisWidth) + ")");
    
    /* rect处理函数 */
    function rectFun(selection) {
        selection.attr("fill", "steelblue")
                .attr("x", function(d, i){
                    return padding.left + xScale(i);
                })
                .attr("y", function(d){
                    console.log(d.FG);
                    return height - padding.bottom - yScale(d.FG);
                })
                .attr("width", xScale())
                .attr("height", function(d){
                    console.log(yScale(d.FG));
                    return yScale(d.FG);
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
                    return height - padding.bottom - yScale(d);
                })
                .attr("dx", xScale()/2).attr("dy", "1em")
                .text(function(d){
                    return d;
                });
    }
});