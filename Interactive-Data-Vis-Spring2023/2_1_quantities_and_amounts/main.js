/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = { top: 20, bottom: 50, left: 70, right: 20 };

/* LOAD DATA */
d3.csv('squirrelActivities.csv', d3.autoType)
  .then(data => {
console.log("data", data)

    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    const xScale = d3.scaleLinear()
    .domain([0, Math.max(...data.map(d => d.count))]) 
    .range([margin.left, width - margin.right])
    
    const activity = ['running', 'chasing', 'climbing', 'eating', 'foraging'];

    const yScale = d3.scaleBand()
    .domain(activity)
    .range([height-margin, margin])
    .paddingInner(0.2)
    .paddingOuter(0.2);


    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */

    const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

    svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("height", yScale.bandwidth())
    .attr("width", d=> xScale(d.count)) 
    .attr("x", margin)
    .attr("y", d=> yScale(d.activity))

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

  })

