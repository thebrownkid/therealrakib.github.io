/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = { top: 20, bottom: 50, left: 70, right: 20 },
  radius = 5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;
let colorScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedRace: "All" // + YOUR INITIAL FILTER SELECTION
};

/* LOAD DATA */
d3.csv("incomeByRacecopy.csv", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES
  xScale = d3.scaleLinear()
    .domain([d3.min(state.data, d => d.year), d3.max(state.data, d => d.year)])
    .range([margin.left, width - margin.right]);

  yScale = d3.scaleLinear()
    .domain([20000, d3.max(state.data, d => Math.max(d.annualMedianIncome, d.downPayment, d.white, d.black, d.hispanic, d.asian))])
    .range([height - margin.bottom, margin.top]);

  // + AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // + UI ELEMENT SETUP
  const selectElement = d3.select("#dropdown")
    .on('change', (event) => {
      console.log('selected', event.target.value);
      state.selectedRace = event.target.value;
      console.log('state', state);
      draw();
    });

  // + CREATE SVG ELEMENT
  svg = d3.select("#container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // + CALL AXES
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {
  // + FILTER DATA BASED ON STATE
  const filteredData = state.data
    .filter(d => state.selectedRace === "All" || state.selectedRace === d.race); 
    
  // + UPDATE LINE GENERATOR
  const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.annualMedianIncome))
    .curve(d3.curveMonotoneX);
    const path = svg
    .selectAll(".line")
    .data([filteredData]) // Wrap filteredData in an array since we're using a single path for the line
    .join("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator); // Use the lineGenerator to create the "d" attribute

  // + UPDATE DOTS
  const dots = svg
    .selectAll(".dot")
    .data(filteredData)
    .join(
      enter => enter
        .append("circle")
        .attr("class", "dot")
        .attr("r", radius)
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.annualMedianIncome))
        .attr("fill", "steelblue"),

      update => update
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.annualMedianIncome)),

      exit => exit.remove()
    );
}
