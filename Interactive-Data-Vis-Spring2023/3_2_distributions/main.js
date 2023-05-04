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
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

var svg = d3.select("#container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var filterData = {white: true, black: true, hispanic: true, asian: true};

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

        //adding a bar chart

        
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



    var legend = svg.selectAll('g.legend')
        .data(races)
        .enter()
      .append('g')
        .attr('class', 'legend');

    legend.append('rect')
        .attr('x', width - 20)
        .attr('y', function(d, i){ return i *  20;})
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function(d) { 
          return color(d.name);
        });

    legend.append('text')
        .attr('x', width - 8)
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
