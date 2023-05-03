//When the code works: ৻(  •̀ ᗜ •́  ৻)
//When the code doesn't work: (ಡ艸ಡ)

//I overall really like the site d3-graph-gallery.com.
//Simply easy to understand code that can be replicated and played with

function createFirstChart() {

/* CONSTANTS AND GLOBALS */
const width = document.querySelector('.all-content-center').clientWidth * 0.8; // this will help ensure bar chart is centered
      height = window.innerHeight * 0.5, //reduced height since it looked too long after centering
      margin = { top: 50, bottom: 50, left: 70, right: 70 },
      radius = 5;

// Tooltip being added
// I searched on Google and went through following tutorial sites (I went through some others but mainly these) to come to the code I used:
// https://d3-graph-gallery.com/graph/interactivity_tooltip.html (this is primarily where I learnt to use the tooltip)
// https://chartio.com/resources/tutorials/how-to-show-data-on-mouseover-in-d3js/
// https://gist.github.com/d3noob/a22c42db65eb00d4e369

      const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .style("position", "absolute") //tooltip would not show then I searched on Google for similar issues and got the idea here: https://stackoverflow.com/questions/67887686/tooltip-not-showing-only-on-hover
        .style("background-color", "white")
        .style("border", "solid 1px black")
        .style("border-radius", "5px") //border radius make it round which I like
        .style("padding", "5px") //padding added to make text more readable within tooltip
        .style("opacity", 0) //setting initial opacty to 0
        .style("transition", "opacity 0.2s ease-in-out"); //a little transition looks nice
      

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
    .domain([0, 80000])
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
    .style("opacity", 1); //calls in tooltip when mouseover is triggered
    d3.select(this) //this will make the bars change opacity and add a stroke
    .style("stroke", "black")// this helps create an animation type effect that helps see which bar you are viewing
    .style("opacity", 1);
  }
  
  function mousemove(event, d) { //mousemove does this cool thing where the tooltip follows you as you are moving the mouse on the bars
    tooltip
      .html(`Year: ${d.year}<br>Income: $${d.income}<br>Down Payment: $${d.downPayment}`) //information that will show when hovering over a bar
      .style("left", event.pageX + 15 + "px")
      .style("top", event.pageY - 28 + "px");
  }
  
  
  function mouseleave() {
    tooltip
    .style("opacity", 0)  //takes out tooltip when mouseleave is triggered
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.7)
  }

  //callout for 2007-2008 financial crisis
  //adding line for a callout I want to add
  svg.append("line")
  .attr("class", "callout-line")
  .attr("x1", xScale(2007))
  .attr("y1", yScale(50233))
  .attr("x2", xScale(2007))
  .attr("y2", yScale(60000))
  .attr("stroke", "black")
  .attr("stroke-width", 1);

  //adding the actual text for the callout
  svg.append("text")
  .attr("class", "callout-text")
  .attr("x", xScale(2007))
  .attr("y", yScale(60000) - 20)
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .text("The 2007-2008 Financial Crisis")
  .append("tspan") // source: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/tspan
  .attr("x", xScale(2007))
  .attr("dy", "1.2em")
  .text("momentarily made things better");

  //callout for 2005

  svg.append("line")
  .attr("class", "callout-line-2005")
  .attr("x1", xScale(2005))
  .attr("y1", yScale(48180))
  .attr("x2", xScale(1998))
  .attr("y2", yScale(50000))
  .attr("stroke", "black")
  .attr("stroke-width", 1);

  svg.append("text")
  .attr("class", "callout-text")
  .attr("x", xScale(1998))
  .attr("y", yScale(50000) - 35)
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .text("2005 marked the first year")
  .append("tspan")
  .attr("x", xScale(1998))
  .attr("dy", "1.2em")
  .text("that down payment overtook income")
  .append("tspan")
  .attr("x", xScale(1998))
  .attr("dy", "1.2em")
  .text("in US history");

    //callout for 2019

    svg.append("line")
    .attr("class", "callout-line-2005")
    .attr("x1", xScale(2019))
    .attr("y1", yScale(66000))
    .attr("x2", xScale(2016))
    .attr("y2", yScale(70000))
    .attr("stroke", "black")
    .attr("stroke-width", 1);
  
    svg.append("text")
    .attr("class", "callout-text")
    .attr("x", xScale(2015))
    .attr("y", yScale(70000) - 35)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .text("Things started improving again in 2019.")
    .append("tspan")
    .attr("x", xScale(2015))
    .attr("dy", "1.2em")
    .text("However, since the pandemic, home prices")
    .append("tspan")
    .attr("x", xScale(2015))
    .attr("dy", "1.2em")
    .text("had the highest jump in history");
  

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
         .attr("y", d => yScale(0))
         .attr("width", xScale.bandwidth())
         .attr("height", d => height - yScale(0))
         .attr("fill", "red")
         .style("opacity", 0.7)
         .transition() // transition effect
         .duration(800) // how long transition lasts for
         .attr("y", d => yScale(d.downPayment)) // previous set to 0 and now to actual data
         .attr("height", d => height - yScale(d.downPayment)) // previous set to 0 and now to actual data
         .delay((d, i) => i * 100); // adds a slight delay to transition. enables bars to come up one by one
         
         svg.selectAll(".downpayment-bar")
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
.style("position", "absolute") //tooltip would not show then I searched on Google for similar issues and got the idea here: https://stackoverflow.com/questions/67887686/tooltip-not-showing-only-on-hover
.style("background-color", "white")
.style("border", "solid 1px black")
.style("border-radius", "5px") //border radius make it round which I like
.style("padding", "5px") //padding added to make text more readable within tooltip
.style("opacity", 0) //setting initial opacty to 0
.style("transition", "opacity 0.2s ease-in-out"); //a little transition looks nice


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

    //callout for 1993

    svg.append("line")
    .attr("class", "callout-line-2005")
    .attr("x1", xScale(1993))
    .attr("y1", yScale(729))
    .attr("x2", xScale(1993))
    .attr("y2", yScale(1000))
    .attr("stroke", "black")
    .attr("stroke-width", 1);
  
    svg.append("text")
    .attr("class", "callout-text")
    .attr("x", xScale(1995))
    .attr("y", yScale(1000) - 35)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .text("1993 marked the first year in history")
    .append("tspan")
    .attr("x", xScale(1995))
    .attr("dy", "1.2em")
    .text("that the median income American")
    .append("tspan")
    .attr("x", xScale(1995))
    .attr("dy", "1.2em")
    .text("could qualify for a mortgage **");

        //callout for 2004

        svg.append("line")
        .attr("class", "callout-line-2005")
        .attr("x1", xScale(2004))
        .attr("y1", yScale(1042))
        .attr("x2", xScale(2004))
        .attr("y2", yScale(1300))
        .attr("stroke", "black")
        .attr("stroke-width", 1);
      
        svg.append("text")
        .attr("class", "callout-text")
        .attr("x", xScale(2004))
        .attr("y", yScale(1300) - 35)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Things worsened before the 2007-08 Financial Crisis")
        .append("tspan")
        .attr("x", xScale(2004))
        .attr("dy", "1.2em")
        .text("mainly as home prices soared (the housing bubble)")
        .append("tspan")
        .attr("x", xScale(2004))
        .attr("dy", "1.2em")
        .text("as subprime mortgages drove demand and spending. **");

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

// Add bars for downpayment

// Add bars for income
svg.selectAll(".mortgage-bar")
.data(data)
.join("rect")
.attr("class", "mortgage-bar") 
.attr("x", d => xScale(d.year))
.attr("y", d => yScale(d.monthlyMortgage)) 
.attr("width", xScale.bandwidth())
.attr("height", d => height - yScale(d.monthlyMortgage))
.attr("fill", "red")
.style("opacity", 0.7) // opacity for income
.on("mouseover", mouseover) //event listener for mouseover
.on("mousemove", (event, d) => mousemove(event, d)) //event listener for mousemove
.on("mouseleave", mouseleave); //event listener for mouseleave

svg.selectAll(".income28-bar")
.data(data)
.join("rect")
.attr("class", "income28-bar")
.attr("x", d => xScale(d.year))
.attr("y", d => yScale(d.monthlyIncome28)) 
.attr("width", xScale.bandwidth())
.attr("height", d => height - yScale(d.monthlyIncome28)) 
.attr("fill", "blue")
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
.style("position", "absolute") //tooltip would not show then I searched on Google for similar issues and got the idea here: https://stackoverflow.com/questions/67887686/tooltip-not-showing-only-on-hover
.style("background-color", "white")
.style("border", "solid 1px black")
.style("border-radius", "5px") //border radius make it round which I like
.style("padding", "5px") //padding added to make text more readable within tooltip
.style("opacity", 0) //setting initial opacty to 0
.style("pointer-events", "none") //without this tooltip sometimes doesnt show. I asked a friend for suggestion and he suggested using this which worked
.style("transition", "opacity 0.2s ease-in-out"); //a little transition looks nice


/* LOAD DATA */
d3.csv("mortgageVSincome-controlled-copy.csv").then(data => {
data.forEach(d => {
d.yearstring = +d.Year;
d.year = new Date(+d.Year, 0, 1);
d.monthlyMortgage = +d['Monthly Mortgage Payment']; 
d.monthlyIncome28median = +d['28% of Monthly Income - Median'];
d.monthlyIncome28minimum = +d['28% of Monthly Income - Minimum Wage'];
d.monthlyIncome28top1 = +d['28% of Monthly Income - Top 10%'];


});

const svg = d3.select("#third-container")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create scales
const xScale = d3.scaleTime()
  .domain(d3.extent(data, d => d.year))
  .range([0, width]);


const yScale = d3.scaleLinear()
.domain([0, d3.max(data, d => Math.max(d.monthlyMortgage, d.monthlyIncome28median, d.monthlyIncome28minimum, d.monthlyIncome28top1 ))])
.range([height, 0]);

//a separate scale for ease of annotating
const xEZScale = d3.scaleLinear()
  .domain(d3.extent(data, d => d.yearstring))
  .range([0, width]);

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


function mouseover(event, d) {
  tooltip
    .style("opacity", 1)
  
  d3.select(this)
    .style("stroke", "black")
    .style("opacity", 0.2);
}

function mousemove(event, d) {
tooltip
.html(`Year: ${d.yearstring}<br><u>Mortgage Qualification Index:</u> <br>Top 10%: ${d.monthlyIncome28top1} <br> Median Income: ${d.monthlyIncome28median}<br>Minimum Wage: ${d.monthlyIncome28minimum}`)
.style("left", event.pageX + 15 + "px")
.style("top", event.pageY - 28 + "px");
}

function mouseleave(d) {
  tooltip
      .style("opacity", 0);
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 1)
}



// LINE GENERATOR FUNCTION

const lineGenMedian = d3.line()
.x(d => xScale(d.year))
.y(d => yScale(d.monthlyIncome28median));

const lineGenTopMinimum = d3.line()
.x(d => xScale(d.year))
.y(d => yScale(d.monthlyIncome28minimum));

const lineGenTop1 = d3.line()
.x(d => xScale(d.year))
.y(d => yScale(d.monthlyIncome28top1));


  // DRAW LINE
  svg.append("path")
  .datum(data)
  .attr("d", lineGenMedian)
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "black");

svg.append("path")
  .datum(data)
  .attr("d", lineGenTopMinimum)
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "blue");

svg.append("path")
  .datum(data)
  .attr("d", lineGenTop1)
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "green");

  svg.append("line")
   .attr("x1", 0)
   .attr("y1", yScale(100))
   .attr("x2", width)
   .attr("y2", yScale(100))
   .style("stroke", "red")
   .style("stroke-dasharray", "4")
   .style("stroke-width", 2);
    
  //create circles

  svg.selectAll(".dot")
  .data(data)
  .enter().append("circle")
  .attr("class", "dot")
  .attr("cx", d => xScale(d.year))
  .attr("cy", d => yScale(d.monthlyIncome28median))
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
  .attr("cy", d => yScale(d.monthlyIncome28minimum))
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
  .attr("cy", d => yScale(d.monthlyIncome28top1))
  .attr("r", 4)
  .attr("stroke", "green")
  .attr("fill", "green")
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);

    //callout for median income
  
    svg.append("line")
    .attr("class", "callout-line")
    .attr("x1", xEZScale(2008))
    .attr("y1", yScale(105))
    .attr("x2", xEZScale(2008))
    .attr("y2", yScale(150))
    .attr("stroke", "black")
    .attr("stroke-width", 1);
  
    svg.append("text")
    .attr("class", "callout-text")
    .attr("x", xEZScale(2008))
    .attr("y", yScale(150) - 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .text("Since 2008, median income earners")
    .append("tspan")
    .attr("x", xEZScale(2008))
    .attr("dy", "1.2em")
    .text("consistently qualify for mortgage **");


        //callout for top 10% earners
  
        svg.append("line")
        .attr("class", "callout-line")
        .attr("x1", xEZScale(2003))
        .attr("y1", yScale(291))
        .attr("x2", xEZScale(2003))
        .attr("y2", yScale(325))
        .attr("stroke", "green")
        .attr("stroke-width", 1);
      
        svg.append("text")
        .attr("class", "callout-text")
        .attr("x", xEZScale(2003))
        .attr("y", yScale(325) - 35)
        .attr("text-anchor", "middle")
        .attr("fill", "green")
        .attr("font-size", "12px")
        .text("Top 10% earners have always qualified for mortgage.")
        .append("tspan")
        .attr("x", xEZScale(2003))
        .attr("dy", "1.2em")
        .text("Also the chances of them qualifying continues")
        .append("tspan")
        .attr("x", xEZScale(2003))
        .attr("dy", "1.2em")
        .text("improving faster than median income earners. **");

                //callout for minimum wage earners
  
                svg.append("line")
                .attr("class", "callout-line")
                .attr("x1", xEZScale(2014))
                .attr("y1", yScale(31))
                .attr("x2", xEZScale(2014))
                .attr("y2", yScale(50))
                .attr("stroke", "blue")
                .attr("stroke-width", 1);
              
                svg.append("text")
                .attr("class", "callout-text")
                .attr("x", xEZScale(2014))
                .attr("y", yScale(50) - 20)
                .attr("text-anchor", "middle")
                .attr("fill", "blue")
                .attr("font-size", "12px")
                .text("Mortgage qualification chances for minimum wage earners")
                .append("tspan")
                .attr("x", xEZScale(2014))
                .attr("dy", "1.2em")
                .text("have remained pretty much the same in 25 years **");

});

}














createFirstChart();
createSecondChart();
createThirdChart();