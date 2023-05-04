function createLabeledChart() {
// set the dimensions and margins of the graph


      const width = document.querySelector('.all-content-center').clientWidth * 0.8; // this will help ensure bar chart is centered
            height = window.innerHeight * 0.5, //reduced height since it looked too long after centering
            margin = { top: 50, bottom: 50, left: 70, right: 70 },
            radius = 5;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

// Read the data
d3.csv("incomeByRaceNew.csv").then(function(data) {

    // List of groups (here I have one group per column)
    const allGroup = ["asian", "white", "hispanic", "black"]

    // Reformat the data: we need an array of arrays of {x, y} tuples
    const dataReady = allGroup.map( function(grpName) {
      return {
        name: grpName,
        values: data.map(function(d) {
          return {year: d.year, value: +d[grpName]};
        })
      };
    });

    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => +d.year))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([10000, d3.max(data, d => Math.max(d.white, d.asian, d.hispanic, d.black))])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

          //adding an area chart for down-payment
          svg.append("path")
             .datum(data)
             .attr("fill", "yellow")
             .attr("opacity", 0.3)
             //.attr("stroke", "black")
             //.attr("stroke-width", 1.5)
             .attr("d", d3.area()
                .x(d => x(+d.year))
                .y0(height)
                .y1(d => y(+d["down-payment"]))
                );

    // Add the lines
    const line = d3.line()
      .x(d => x(+d.year))
      .y(d => y(+d.value))
    svg.selectAll("myLines")
      .data(dataReady)
      .join("path")
        .attr("class", d => d.name)
        .attr("d", d => line(d.values))
        .attr("stroke", d => myColor(d.name))
        .style("stroke-width", 2)
        .style("fill", "none")

    // Add the points
    svg
      .selectAll("myDots")
      .data(dataReady)
      .join('g')
        .style("fill", d => myColor(d.name))
        .attr("class", d => d.name)
      .selectAll("myPoints")
      .data(d => d.values)
      .join("circle")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.value))
                .attr("r", 3.5)
        .attr("stroke", "white")

    // Add a label at the end of each line
    svg
      .selectAll("myLabels")
      .data(dataReady)
      .join('g')
        .append("text")
          .attr("class", d => d.name)
          .datum(d => { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
          .attr("transform", d => `translate(${x(d.value.year)},${y(d.value.value)})`) // Put the text at the position of the last point
          .attr("x", 12) // shift the text a bit more right
          .text(d => d.name)
          .style("fill", d => myColor(d.name))
          .style("font-size", 15)

    

    // Add a legend (interactive)
    svg
      .selectAll("myLegend")
      .data(dataReady)
      .join('g')
        .append("text")
          .attr('x', (d,i) => 30 + i*60)
          .attr('y', 30)
          .text(d => d.name)
          .style("fill", d => myColor(d.name))
          .style("font-size", 15)
        .on("click", function(event, d){
          // is the element currently visible ?
          currentOpacity = d3.selectAll("." + d.name).style("opacity")
          // Change the opacity: from 0 to 1 or from 1 to 0
          d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)
        })
})
}

createLabeledChart();