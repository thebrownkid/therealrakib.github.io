
//adapted from Fabio Mainardi's Github code: https://gist.github.com/fabiomainardi/cf1233873ea5e7bc899b
//which itself is adapted from an example by Bostock: http://bl.ocks.org/mbostock/3884955

var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
.x(function(d) { return x(d.date); })
.y(function(d) { return y(d.value); });

var svg = d3.select("#container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var filterData = {white: true, black: true, hispanic: true, asian: true}; //original code updated to reflect race

function drawChart(filterData){
  d3.csv("incomeByRacecopy.csv", function(error, data) {
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year" && key !== "down-payment" && key !== "BioID"; }));

    data.forEach(function(d) {
      d.date = parseDate(d.year);
    });

    var races = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {date: d.date, value: +d[name]};
        })
      };
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));

    y.domain([
      20000,
      d3.max(races, function(r) { return d3.max(r.values, function(v) { return v.value; }); })
    ]);

    svg.selectAll("*").remove();

    var race = svg.selectAll(".race")
        .data(races.filter(function(d) { return filterData[d.name] === true; }))
        .enter().append("g")
        .attr("class", "race");

    race.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });

    race.append("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.value) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Income");

        //adding an area chart for down payment to compare with line charts
        
        var area = d3.svg.area()
          .x(function(d) { return x(d.date); })
          .y0(height)
          .y1(function(d) { return y(d['down-payment']); });

        svg.append("path")
           .datum(data)
           .attr("class", "area")
           .attr("d", area)
           .style("fill", "steelblue")
           .style("opacity", 0.4);

           //tooltip

           const tooltip = d3.select("body")
              .append("div")
              .attr("id", "tooltip")
              .attr("class", "tooltip")
              .style("position", "absolute")
              .style("background-color", "white")
              .style("border", "solid 1px black")
              .style("border-radius", "5px")
              .style("padding", "5px")
              .style("opacity", 0)
              .style("transition", "opacity 0.2s ease-in-out");
              
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
    .html(`Year: ${d.date.getFullYear()}<br>Value: ${d.value}`)
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
              
           //adding dots on the data points over the line chart to add the tooltip onto it 
           race.selectAll(".dot")
           .data(function(d) { return d.values; })
           .enter().append("circle")
           .attr("class", "dot")
           .attr("cx", function(d) { return x(d.date); })
           .attr("cy", function(d) { return y(d.value); })
           .attr("r", 3.5)
           .style("fill", function(d) { return color(d.name); })
           .on("mouseover", mouseover) //event listener for mouseover
           .on("mousemove", (event, d) => mousemove(event, d)) //event listener for mousemove
           .on("mouseleave", mouseleave); //event listener for mouseleave;



    var legend = svg.selectAll('g.legend')
        .data(races)
        .enter()
      .append('g')
        .attr('class', 'legend');

    legend.append('rect')
        .attr('x', width - 800)
        .attr('y', function(d, i){ return i *  20;})
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function(d) { 
          return color(d.name);
        });

    legend.append('text')
        .attr('x', width - 788)
        .attr('y', function(d, i){ return (i *  20) + 9;})
        .text(function(d){ return d.name; });

    legend.on("click", function(d) {
      reDraw(d.name);
    });
  });
}

console.log(filterData);
drawChart(filterData);

function reDraw(name) {
  filterData[name] = !filterData[name];
  console.log("redraw :");
  console.log(filterData);
  drawChart(filterData);
}
