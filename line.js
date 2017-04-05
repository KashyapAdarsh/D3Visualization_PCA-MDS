function linePlot(data, ID) {
    
    var elements = Object.keys(data[0]);
    console.log(elements);
    
    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 40},
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    

    // Set the ranges
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);
    
    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);
    
    var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);
    
    // Define the line
    var valueline = d3.svg.line()
    .x(function(d) { return x(+d[elements[0]]); })
    .y(function(d) { return y(+d[elements[1]]); });

    
    // Adds the svg canvas
    var svg = d3.select(ID)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
    
    x.domain([0, d3.max(data, function(d) { return +d[elements[0]]; })]);
    y.domain([0, d3.max(data, function(d) { return +d[elements[1]]; })]);
    
    if(ID == "#chart2"){
        valueline = d3.svg.line()
            .x(function(d) { return x(+d[elements[0]]); })
            .y(function(d) { console.log(+d[elements[0]]); return y(+d[elements[1]]/100); });
        
         y.domain([-2000, d3.max(data, function(d) { return +d[elements[1]]/100; })]);
    }
              
    // Add the valueline path.
    svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(data));
     
    if(ID == "#chart3") {
        svg.append('line')
        .style('stroke', 'black')
        .style("stroke-dasharray", ("3, 3"))
        .attr('x1', x(3))
        .attr('y1', y(0))
        .attr('x2', x(3))
        .attr('y2', y(54));
    } else if(ID == "#chart2") {
        svg.append('line')
        .style('stroke', 'black')
        .style("stroke-dasharray", ("3, 3"))
        .attr('x1', x(1))
        .attr('y1', y(3000))
        .attr('x2', x(12))
        .attr('y2', y(3000));
    }
    
    
    // Add the X Axis
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
    
    
    // Add the Y Axis
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
 }