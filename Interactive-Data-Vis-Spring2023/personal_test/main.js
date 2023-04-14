/* CONSTANTS AND GLOBALS */
const width = document.querySelector('.all-content-center').clientWidth * 0.8;
      height = window.innerHeight * 0.5,
      margin = { top: 20, bottom: 50, left: 70, right: 20 },
      radius = 5;

/* LOAD DATA */
d3.csv("incomeHousing.csv").then(data => {
  // Parse numeric columns
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
  .attr("y", height - margin.bottom/2)
  .attr("fill", "black")
  .attr("text-anchor", "middle")
  .text("Year");

   svg.append("text")
  .attr("class", "axis-label")
  .attr("x", -height/2)
  .attr("y", margin.left/200)
  .attr("transform", "rotate(-90)")
  .attr("fill", "black")
  .attr("text-anchor", "middle")
  .text("Dollars ($)");

  // Add bars for income
  svg.selectAll(".income-bar")
    .data(data)
    .join("rect")
    .attr("class", "income-bar")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.income))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d.income))
    .attr("fill", "blue");

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
    .attr("fill-opacity", 0.7); // 70% opacity can help improve understanding a bit
});
