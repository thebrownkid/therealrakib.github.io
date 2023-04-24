function createFirstChart() {

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
      .style("opacity", 0.7)
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
    .style("opacity", 0.7) // opacity for income
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
}







function createSecondChart() {
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
d3.csv("mortgageVSincome.csv").then(data => {
data.forEach(d => {
d.year = +d.Year;
d.monthlyMortgage = +d['Monthly Mortgage Payment']; 
d.monthlyIncome28 = +d['28% of Monthly Income'];
});

const svg = d3.select("#second-container")
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
.domain([0, d3.max(data, d => Math.max(d.monthlyMortgage, d.monthlyIncome28))])
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
.html(`Year: ${d.year}<br>Monthly Mortgage Payment: $${d.monthlyMortgage}<br>28% of Monthly Income: $${d.monthlyIncome28}`)
.style("left", event.pageX + 15 + "px")
.style("top", event.pageY - 28 + "px");
}

function mouseleave() {
tooltip
.style("opacity", 0)
d3.select(this)
.style("stroke", "none")
.style("opacity", 0.7)
}

// Add bars for income
svg.selectAll(".mortgage-bar")
.data(data)
.join("rect")
.attr("class", "mortgage-bar") 
.attr("x", d => xScale(d.year))
.attr("y", d => yScale(d.monthlyMortgage)) 
.attr("width", xScale.bandwidth())
.attr("height", d => height - yScale(d.monthlyMortgage))
.attr("fill", "blue")
.style("opacity", 0.7) // opacity for income
.on("mouseover", mouseover) //event listener for mouseover
.on("mousemove", (event, d) => mousemove(event, d)) //event listener for mousemove
.on("mouseleave", mouseleave); //event listener for mouseleave

// Add bars for downpayment
svg.selectAll(".income28-bar")
.data(data)
.join("rect")
.attr("class", "income28-bar")
.attr("x", d => xScale(d.year))
.attr("y", d => yScale(d.monthlyIncome28)) 
.attr("width", xScale.bandwidth())
.attr("height", d => height - yScale(d.monthlyIncome28)) 
.attr("fill", "red")
.style("opacity", 0.7) // 70% opacity can help improve understanding a bit
.on("mouseover", mouseover) //event listener for mouseover
.on("mousemove", (event, d) => mousemove(event, d)) //event listener for mousemove
.on("mouseleave", mouseleave); //event listener for mouseleave
});

}






function createThirdChart() {

 /* CONSTANTS AND GLOBALS */
 const width = document.querySelector('.all-content-center').clientWidth * 0.8; // this will help ensure bar chart is centered
      height = window.innerHeight * 0.5, //reduced height since it looked too long after centering
      margin = { top: 50, bottom: 50, left: 70, right: 20 },
    

/* LOAD DATA */
d3.csv('incomebyPercentile.csv', d => {
  return {
    year: new Date(+d.Year, 0, 1),
    median: +d.Median,
    top10: +d["Top 10%"],
    top5: +d["Top 5%"],
    top1: +d["Top 1%"]
  };
}).then(data => {
  console.log('data :>> ', data);

  // SCALES Y as Linear Scale and X as Time Scale as year
  const yScale = d3.scaleLinear()
  .domain([22000, d3.max(data, d => Math.max(d.median, d.top10, d.top5, d.top1))])
  .range([height - margin.bottom, margin.top]);


  const xScale = d3.scaleTime()
  .domain(d3.extent(data, d => d.year))
  .range([margin.left, width - margin.right]);
  

  // CREATE SVG ELEMENT
  const svg = d3.select("#third-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)


  const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("position", "absolute")
  .style("padding", "10px")
  .style("background-color", "white")
  .style("border", "1px solid black")
  .style("border-radius", "5px")
  .style("pointer-events", "none")
  .style("font-size", "12px")
  .style("z-index", 999);

  //axis labels for X and Y
  
  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width - margin.right)
    .attr("y", height - margin.bottom/2 + 10)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Year");


  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", -height/2)
    .attr("y", margin.left/2 - 20)
    .attr("transform", "rotate(-90)")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Dollars ($)");

  // BUILD AND CALL AXES

  const xAxis = d3.axisBottom(xScale)
  svg.append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(xAxis);


  const yAxis = d3.axisLeft(yScale)
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

    //adding mouse interactions

    function mouseover(event, d) {
      tooltip
        .style("opacity", 1);
      tooltip
        .html("Year: " + d.year.getFullYear() + "<br/>" +
                    "Median: $" + d.median.toLocaleString() + "<br/>" +
                    "Top 10%: $" + d.top10.toLocaleString() + "<br/>" +
                    "Top 5%: $" + d.top5.toLocaleString() + "<br/>" +
                    "Top 1%: $" + d.top1.toLocaleString())
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    }
    
    function mousemove(event, d) {
      tooltip
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    }
    
    function mouseleave(d) {
      tooltip
        .style("opacity", 0);
    }

  // LINE GENERATOR FUNCTION

  const lineGenMedian = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.median));

  const lineGenTop10 = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.top10));

  const lineGenTop5 = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.top5));

  const lineGenTop1 = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.top1));


  // DRAW LINE
  svg.append("path")
  .datum(data)
  .attr("d", lineGenMedian)
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "black");

svg.append("path")
  .datum(data)
  .attr("d", lineGenTop10)
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "blue");

svg.append("path")
  .datum(data)
  .attr("d", lineGenTop5)
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "green");

svg.append("path")
  .datum(data)
  .attr("d", lineGenTop1)
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "red")
  

// Add small circles to every data point and add tooltip to circle using mouse function
// the circles make more sense to show the data for a particular year
// otherwise when direct added to line, shows same value between years on the line which is kinda weird and does not make sense as data is not continous but discrete for years and joined by a line

svg.selectAll(".dot")
  .data(data)
  .enter().append("circle")
  .attr("class", "dot")
  .attr("cx", d => xScale(d.year))
  .attr("cy", d => yScale(d.median))
  .attr("r", 4)
  .attr("stroke", "black")
  .attr("fill", "black")
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);

svg.selectAll(".circle-top10")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "circle-top10")
  .attr("cx", d => xScale(d.year))
  .attr("cy", d => yScale(d.top10))
  .attr("r", 4)
  .attr("stroke", "blue")
  .attr("fill", "blue")
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);

svg.selectAll(".circle-top5")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "circle-top5")
  .attr("cx", d => xScale(d.year))
  .attr("cy", d => yScale(d.top5))
  .attr("r", 4)
  .attr("stroke", "green")
  .attr("fill", "green")
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);

  svg.selectAll(".circle-top1")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "circle-top1")
  .attr("cx", d => xScale(d.year))
  .attr("cy", d => yScale(d.top1))
  .attr("r", 4)
  .attr("stroke", "red")
  .attr("fill", "red")
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);



});

}




createFirstChart();
createSecondChart();
createThirdChart();