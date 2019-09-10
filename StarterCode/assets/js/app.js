

//  Set up our chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// Import data from the data.csv file
d3.csv("assets/data/data.csv").then(function(StateData) {
        console.log(StateData);


  // Parse the data
    StateData.forEach(function (data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      console.log(data.poverty);
      console.log(data.healthcare);
  });

// Create Scales
var xLinearScale = d3.scaleLinear()
    .domain([d3.min(StateData, d=>d.poverty)*0.9, 
    d3.max(StateData, d => d.poverty)*1.1])
  .range([0, width]);

  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(StateData, d => d.healthcare)*1.1])
  .range([height, 0]);

  // Create Axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  
    var xMin;
    var xMax;
    var yMin;
    var yMax;

  xMin = d3.min(StateData, function(data) {
    return data.poverty;
});

xMax = d3.max(StateData, function(data) {
    return data.poverty;
});

yMin = d3.min(StateData, function(data) {
    return data.healthcare;
});

yMax = d3.max(StateData, function(data) {
    return data.healthcare;
});


xLinearScale.domain([xMin, xMax]);
yLinearScale.domain([yMin, yMax]);
console.log(xMin);
console.log(yMax);



//Append the axes to the chartGroup - ADD STYLING
  // Add bottomAxis
  chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .style("font-size", "18px")
            .call(bottomAxis);


    // CHANGE THE TEXT TO THE CORRECT COLOR
  chartGroup.append("g")
            .style("font-size", "18px") 
            .call(leftAxis);

  //  Create Circles

  var circlesGroup = chartGroup.selectAll("circle")
                              .data(StateData)
                              .enter()
                              .append("circle")
                              .attr("cx", d => xLinearScale(d.poverty +1.5))
                              .attr("cy", d => yLinearScale(d.healthcare +0.3))
                              .attr("r", "12")
                              .attr("fill", "blue")
                              .attr("opacity", .5)    

  chartGroup.selectAll("text.text-circles")
  .attr("dy",5)
  .attr("text-anchor","middle")
  .attr("font-size","12px");


  // Initialize tool tip
  
  var toolTip = d3.tip()
                  .attr("class", "d3-tip")
                  .offset([80, -60])
                  .html(function(d) {
                      return (`${d.state}<br>Healthcare: ${d.healthcare}%<br>Poverty: ${d.poverty}% `);
                                    });


  // Create tooltip in the chart

  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  
  circlesGroup.on("click", function(data) {
      toolTip.show(data, this);})
  .on("mouseover", function(d) {
    // Show the tooltip
    toolTip.show(d, this);
    // Highlight the state circle's border
    d3.select(this).style("stroke", "#323232");
  })
  .on("mouseout", function(d) {
    // Remove the tooltip
    toolTip.hide(d);
    // Remove highlight
    d3.select(this).style("stroke", "#e3e3e3");
  });


// Create axes labels

chartGroup.append("text")
          .style("font-size", "18px")
          .selectAll("tspan")
          .data(StateData)
          .enter()
          .append("tspan")
          .attr("x", function(data) {
        return xLinearScale(data.poverty +1.3);
              })
          .attr("y", function(data) {
        return yLinearScale(data.healthcare +.1);
              })
          .text(function(data) {
        return data.abbr
              });

chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 30 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("aText", true)
    .text("Lacking Healthcare (%)");

  chartGroup.append("text")
  .attr("y", height + margin.bottom/2 - 10)
  .attr("x", width / 2)
  .attr("dy", "1em")
  .classed("aText", true)
  .text("Poverty Rate (%)");
});
