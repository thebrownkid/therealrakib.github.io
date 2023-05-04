var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse; // Updated date format

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
    .y(function(d) { return y(d.value); }); // Updated y value function

var svg = d3.select("#container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var filterData = {white: true, black: true, hispanic: true, asian: true}; // Updated filter data

function drawChart(filterData){
d3.csv("incomeByRacecopy.csv", function(error, data) { // Updated to read CSV
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year" && key !== "down-payment" && key !== "BioID"; })); // Updated data keys

  data.forEach(function(d) {
    d.date = parseDate(d.year);
  });

  var races = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, value: +d[name]}; // Updated data key
      })
    };
  });

  // Rest of the code remains the same, just replace every instance of 'cities' with 'races' and 'city' with 'race'

});
}
console.log(filterData);
drawChart(filterData);
function reDraw(name){
	
	filterData[name]=!filterData[name];
	console.log("redraw :");
	console.log(filterData);
	drawChart(filterData);
}
