var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// // Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

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
    .domain([d3.min(StateData, d=>d.poverty)*0.8, 
    d3.max(StateData, d => d.poverty)*1.2])
  .range([0, width]);

  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(StateData, d => d.healthcare)*1.2])
  .range([height, 0]);

    // axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

//Append the axes to the chartGroup - ADD STYLING

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .style("font-size", "18px")
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .style("font-size", "18px")
        .call(leftAxis);
  
    // do the circles
    chartGroup.selectAll("circle")
        .data(StateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 12)
        .attr("fill", "blue")
        .attr("opacity", ".3");

    // text in circles
    chartGroup.selectAll("text.text-circles")
        .data(StateData)
        .enter()
        .append("text")
        .classed("text-circles",true)
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy",5)
        .attr("text-anchor","middle")
        .attr("font-size","12px");

    // y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 30 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("aText", true)
        .text("Lacking Healthcare (%)");

    // x axis
    chartGroup.append("text")
        .attr("y", height + margin.bottom/2 - 10)
        .attr("x", width / 2)
        .attr("dy", "1em")
        .classed("aText", true)
        .text("Poverty Rate (%)");

        // Initialize tool tip
  
  /*var toolTip = d3.tip()
  .attr("class", "d3-tip")
  .offset([80, -60])
  .html(function(d) {
      return (`${d.abbr}<br>Healthcare: ${d.healthcare}%<br>Poverty: ${d.poverty}% `);
                    });


// Create tooltip in the chart

chartGroup.call(toolTip);
// Create event listeners to display and hide the tooltip
  
chartGroup.on("click", function(data) {
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
});*/


});