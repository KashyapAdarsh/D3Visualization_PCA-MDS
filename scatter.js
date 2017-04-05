 
function scatterPlot(data){
    
    var elements = Object.keys(data[0]);
    
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // setup x 
    var xValue = function(d) { return +d[elements[0]];},
        xScale = d3.scale.linear().range([0, width]), 
        xMap = function(d) { return xScale(xValue(d));},
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    
    // setup y
    var yValue = function(d) { return +d[elements[1]];},
        yScale = d3.scale.linear().range([height, 0]),
        yMap = function(d) { return yScale(yValue(d));},
        yAxis = d3.svg.axis().scale(yScale).orient("left");
    
    // setup fill color
    var color = d3.scale.category10();
    
    // add the graph canvas to the body of the webpage
    var svg = d3.select("#chart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("display", "block")
    .style("margin-left","auto")
    .style("margin-right","auto")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    xScale.domain([d3.min(data, function(d) { return +d[elements[0]]; }) - 0.1, d3.max(data, function(d) { return +d[elements[0]]; })]);
    yScale.domain([d3.min(data, function(d) { return +d[elements[1]]; }) - 0.1, d3.max(data, function(d) { return +d[elements[1]]; })]);
    
    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(elements[0]);
    
    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(elements[1]);
    
    // draw dots
    svg.selectAll(".point")
        .data(data)
        .enter().append("circle")
        .attr("class", "point")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d, i) { return (i > data.length/2) ? "#FF0000":"#FFFF00";}) 
        .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
            tooltip.html("(" + xValue(d) 
                     + ", " + yValue(d) + ")")
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })
        .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });
    
   // draw legend
  var legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  // draw legend
  var legend1 = svg.append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("y", 0)
      .attr("width", 14)
      .attr("height", 14)
      .style("fill", "#FF0000")
      .attr("border",1)
  
  legend.append("rect")
      .attr("x", width - 18)
      .attr("y", 0)
      .attr("width", 14)
      .attr("height", 14)
      .style("stroke", 'black')
      .style("fill", "none")
      .style("stroke-width", 1);
    
  // draw legend colored rectangles
  legend1.append("rect")
      .attr("x", width - 18)
      .attr("y", 20)
      .attr("width", 14)
      .attr("height", 14)
      .style("fill", "#FFFF00")
      .attr("border",1);
    
  legend1.append("rect")
      .attr("x", width - 18)
      .attr("y", 20)
      .attr("width", 14)
      .attr("height", 14)
      .style("stroke", 'black')
      .style("fill", "none")
      .style("stroke-width", 1);  
  

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return "Stratified sample";});
    
      // draw legend text
  legend1.append("text")
      .attr("x", width - 24)
      .attr("y", 29)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return "Random sample";});
}