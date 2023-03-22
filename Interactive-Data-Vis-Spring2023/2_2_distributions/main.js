/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = { top: 20, bottom: 50, left: 50, right: 20 },
  radius = 5;

/* LOAD DATA */
d3.json("environmentRatings.json", d3.autoType)
  .then(data => {
    console.log(data)

    /* SCALES */

    //envScore2020 on y, envScoreLifetime on x
  const yScale = d3.scaleLinear()
  .domain(d3.extent(data, d=>d.envScore2020))
  .range([height-margin.bottom,margin.top])

  const xScale = d3.scaleLinear()
  .domain(d3.extent(data, d => d.envScoreLifetime))
  .range([margin.left,width-margin.right])

  //Democrats as blue. Republicans as Red.
  const color= d3.scaleOrdinal()
  .domain(["D", "R"])
  .range(["Blue", "Red"])


  //using ideologyScore2020 to dictate size of the dots

  const ideologyScale = d3.scaleLinear()
  .domain([0,d3.max(data.map(d => d.ideologyScore2020))])
  .range([0,100])
  
    /* HTML ELEMENTS */

   //appending to container
    const svg = d3.select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  //x and y axes being apended (just like last tutorial)

  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  svg
    .append("g")
    .style("transform", `translate(0px, ${height - margin}px)`) 
    .call(xAxis)
  svg
    .append("g")
    .style("transform", `translate(${margin}px, 0px)`)
    .call(yAxis)


    //scatterplot dots, x corresponds to envScoreLifetime, y corresponds to envScore2020,
    //radius correspond to ideologyScore2020 & filled as Party (D or R)

  const dot = svg
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => xScale(d.envScoreLifetime))
    .attr("cy", d => yScale(d.envScore2020))
    .attr("r",  d=>ideologyScale(d.ideologyScore2020)/10)
    .attr("fill", d => colorScale(d.Party))
  });