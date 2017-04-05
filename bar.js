/* This function creates bar chart */		
function BarChart(data, ID) {
 features = ["humid", "humid9", "temp" ,"temp90", "h10pix", "h10pix90","trees","trees90","NoYes","Xmin","Xmax","Ymin","Ymax"]

 var elements = Object.keys(data[0]);
    
 var margin = {top: 30, right: 20, bottom: 30, left: 40},
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

 // Set the ranges
    //var x = d3.scale.linear().range([0, width]);
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);
         
    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    xAxis.tickFormat(function(d, i){
        return features[i];
    })
    
    var yAxis = d3.svg.axis().scale(y).orient("left");

var svg = d3.select(ID).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data in the domains
  x.domain([1, d3.max(data, function(d) { return +d[elements[0]]; }) + 1]);
  y.domain([0, d3.max(data, function(d) { return +d[elements[1]]; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(+d[elements[0]]); })
      .attr("width", 30)
      .attr("y", function(d) { return y(+d[elements[1]]); })
      .attr("height", function(d) { return height - y(+d[elements[1]]); });

  if(ID == "#chart4") {
        svg.append('line')
        .style('stroke', 'black')
        .style("stroke-dasharray", ("3, 3"))
        .attr('x1', x(1))
        .attr('y1', y(0.675))
        .attr('x2', x(13))
        .attr('y2', y(0.675));
    } 
    
  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(elements[0]);

  // add the y Axis
  svg.append("g")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(elements[1]);
}