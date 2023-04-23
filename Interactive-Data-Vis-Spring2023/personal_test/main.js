/* CONSTANTS AND GLOBALS */
const width = document.querySelector('.all-content-center').clientWidth * 0.8; // this will help ensure bar chart is centered
      height = window.innerHeight * 0.5, //reduced height since it looked too long after centering
      margin = { top: 50, bottom: 50, left: 70, right: 70 },
      radius = 5;

// Tooltip being added
// I searched on Google and went through following tutorial sites (I went through some others but mainly these) to come to the code I used:
// https://d3-graph-gallery.com/graph/interactivity_tooltip.html
// https://chartio.com/resources/tutorials/how-to-show-data-on-mouseover-in-d3js/
// https://gist.github.com/d3noob/a22c42db65eb00d4e369

      const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid 1px black")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("transition", "opacity 0.2s ease-in-out");
      

/* LOAD DATA */
d3.csv("incomeHousing.csv").then(data => {
  data.forEach(d => {
    d.year = +d.Year;
    d.income = +d['Annual Median Household Income'];
    d.downPayment = +d['Down Payment (20%)'];
  });

  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Create scales
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.year))
    .range([0, width])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.income)])
    .range([height, 0]);

  // Create and append axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .style("text-anchor", "end");

  svg.append("g")
    .call(yAxis);


  //adding labels to the axes

  svg.append("text")
  .attr("class", "axis-label")
  .attr("x", (width - margin.right - margin.left) / 2 + margin.left)
  .attr("y", height - margin.bottom/2 + 70) // need to move year label down for visibility
  .attr("fill", "black")
  .attr("text-anchor", "middle")
  .text("Year");

   svg.append("text")
  .attr("class", "axis-label")
  .attr("x", -height/2)
  .attr("y", margin.left/200 - 45) // need to move dollars label left for visibility
  .attr("transform", "rotate(-90)")
  .attr("fill", "black")
  .attr("text-anchor", "middle")
  .text("Dollars ($)");

  // Tooltip mouse functions (mouseover, mouse move and mouseleave)
  function mouseover() {
    tooltip
    .style("opacity", 1);
    d3.select(this)
    .style("stroke", "black")
    .style("opacity", 1);
  }
  
  function mousemove(event, d) {
    tooltip
      .html(`Year: ${d.year}<br>Income: $${d.income}<br>Down Payment: $${d.downPayment}`)
      .style("left", event.pageX + 15 + "px")
      .style("top", event.pageY - 28 + "px");
  }
  
  
  function mouseleave() {
    tooltip
    .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // Add bars for income
  svg.selectAll(".income-bar")
    .data(data)
    .join("rect")
    .attr("class", "income-bar")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.income))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d.income))
    .attr("fill", "blue")
    .style("opacity", 0.9) // initial opacity for income
    .on("mouseover", mouseover) //event listener for mouseover
    .on("mousemove", (event, d) => mousemove(event, d)) //event listener for mousemove
    .on("mouseleave", mouseleave); //event listener for mouseleave

  // Add bars for downpayment
  svg.selectAll(".downpayment-bar")
    .data(data)
    .join("rect")
    .attr("class", "downpayment-bar")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.downPayment))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d.downPayment))
    .attr("fill", "red")
    .style("opacity", 0.7) // 70% opacity can help improve understanding a bit
    .on("mouseover", mouseover) //event listener for mouseover
    .on("mousemove", (event, d) => mousemove(event, d)) //event listener for mousemove
    .on("mouseleave", mouseleave); //event listener for mouseleave
});
