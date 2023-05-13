/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = { top: 20, bottom: 50, left: 70, right: 20 },
  radius = 5;

  const tooltip = d3.select("body")
  .append("div")
  .attr("id", "tooltip")
  .attr("class", "tooltip")
  .style("position", "absolute") //tooltip would not show then I searched on Google for similar issues and got the idea here: https://stackoverflow.com/questions/67887686/tooltip-not-showing-only-on-hover
  .style("background-color", "white")
  .style("border", "solid 1px black")
  .style("border-radius", "5px") //border radius make it round which I like
  .style("padding", "5px") //padding added to make text more readable within tooltip
  .style("pointer-events", "none") //without this tooltip sometimes doesnt show. I asked a friend for suggestion and he suggested using this which worked
  .style("opacity", 0) //setting initial opacty to 0
  .style("transition", "opacity 0.2s ease-in-out"); //a little transition looks nice

/* LOAD DATA */
d3.csv("incomeData.csv", d3.autoType)
  .then(data => {
    console.log(data)

    /* SCALES */

    //income on y, Year on x
  const yScale = d3.scaleLinear()
  .domain([25000, 75000])
  .range([height-margin.bottom,margin.top])


  const xScale = d3.scaleLinear()
  .domain([1988, 2022]) 
  .range([margin.left,width-margin.right])

  //less than mean as red, greater than mean as blue
  const colorScale= d3.scaleOrdinal()
  .domain(["2", "1"])
  .range(["red", "blue"])

  // Tooltip mouse functions (mouseover, mouse move and mouseleave)
  function mouseover() {
    tooltip
    .style("opacity", 1); //calls in tooltip when mouseover is triggered
    d3.select(this) //this will make the bars change opacity and add a stroke
    .style("stroke", "white")// this helps create an animation type effect that helps see which bar you are viewing
    .style("opacity", 0.5);
  }
  
  function mousemove(event, d) { //mousemove does this cool thing where the tooltip follows you as you are moving the mouse on the bars
    tooltip
      .html(`Year: ${d.year}<br>Household Income: $${d.income}<br>Household Expenditure: $${d.expenditure}<br>Income-Expenditure Difference: $${d.actual_difference}`) //information that will show when hovering over a bar
      .style("left", event.pageX + 15 + "px")
      .style("top", event.pageY - 28 + "px");
  }
  
  function mouseleave() {
    tooltip
    .style("opacity", 0)  //takes out tooltip when mouseleave is triggered
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }


  //using difference (difference from mean of income - exp.) to dictate size of the dots

  const differenceScale = d3.scaleSqrt()
  .domain([0,d3.max(data.map(d => d.difference))])
  .range([0,100])
  
    /* HTML ELEMENTS */

   //appending to container
    const svg = d3.select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  //x and y axes being apended
  
  const xAxis = d3.axisBottom(xScale)
  svg.append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(xAxis);


  const yAxis = d3.axisLeft(yScale)
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

  //text being added as label of the axes

  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width - margin.right)
    .attr("y", height - margin.bottom/2)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Year");


  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", -height/2)
    .attr("y", margin.left/5)
    .attr("transform", "rotate(-90)")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Annual Household Income");


    //scatterplot dots, x corresponds to year, y corresponds to income,
    
  const dot = svg
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r",  0)
    .transition()
    .duration(800)
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.income))
    .attr("r",  d=>differenceScale(d.difference)/2.5)
    .attr("fill", d => colorScale(d.incomedifference))
    .style("stroke", "black")
    .delay((d, i) => i * 60);

    svg.selectAll("circle")
    .on("mouseover", mouseover) //event listener for mouseover
    .on("mousemove", (event, d) => mousemove(event, d)) //event listener for mousemove
    .on("mouseleave", mouseleave); //event listener for mouseleave
  });


         //.transition() // transition effect
         //.duration(800) // how long transition lasts for
         //.attr("y", d => yScale(d.downPayment)) // previous set to 0 and now to actual data
         //.attr("height", d => height - yScale(d.downPayment)) // previous set to 0 and now to actual data
         //.delay((d, i) => i * 100); // adds a slight delay to transition. enables bars to come up one by one


         //const dot = svg
    //.selectAll("circle")
    //.data(data)
    //.join("circle")
    //.attr("cx", d => xScale(d.year))
    //.attr("cy", d => yScale(d.income))
    //.attr("r",  d=>differenceScale(d.difference)/2.5)
    //.attr("fill", d => colorScale(d.difference_mean))



    //.on("mouseover", mouseover) //event listener for mouseover
    //.on("mousemove", (event, d) => mousemove(event, d)) //event listener for mousemove
    //.on("mouseleave", mouseleave); //event listener for mouseleave