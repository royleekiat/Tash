//set state
let state = {"benchmark":"", "timeframe":"Max", "currency":"SGD","data":[]}
//Plot first graph with Stashaway portfolio
compare(state["benchmark"]);
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


//compare chosen benchmark against Stashaway portfolio. If benchmark is not provided, only Stashaway portfolio will be shown.
function compare(benchmark){
  state["benchmark"] = benchmark
  console.log("Plot graph: " + state["timeframe"] + " timeframe for " + state["benchmark"] + ", with currency" + state["currency"] )

  d3.select("svg").remove();
  var margin = {
    top: 20,
    right: 50,
    bottom: 30,
    left: 50
  },
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%Y-%m-%d").parse;

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
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.temperature);
    });

  var svg = d3.select("#graf").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-top",margin.top)
    .style("background-color","#001630")
    .style("border-radius", "20px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Call GraphQL API
  var settings = {
    "url": "/graphql",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({
    query: "query getOneDatapoint($dataid: String, $dataid2: String) {\r\n    datapoints(portfolio: $dataid, benchmark: $dataid2 ) {\r\n    \tvalue\r\n    \tportfolio\r\n    \tid\r\n    \tperiod\r\n    }\r\n}",
    variables: {"dataid":"Stashaway Risk Index 14%","dataid2":state["benchmark"]} // "Stashaway Risk Index 14%"
  })
  };

  //Plot after GraphQL response
  $.ajax(settings).done(function (response) {
    console.log(response);
  
    var datapointsList = response.data.datapoints

    var datamap = {}

    //sort by date
    datapointsList.forEach(function(d) {
      var rate = 1;
      if(state["currency"] === "USD"){
        rate = 0.74 //rate can be called via API
      }
      if (d.period in datamap){
        datamap[d.period][d.portfolio] = d.value*rate
      }
      else{ 
        datamap[d.period] = {"date":parseDate(d.period), [d.portfolio]: d.value*rate}
      }

      console.log (datamap)//[d.period])

    });

    switch(state["timeframe"]) {
      case "3 Month":
        var months = 3
        var tempDataMap = {}
        var key = ""
        for (i = months; i > 0; i--){
          key = Object.keys(datamap)[Object.keys(datamap).length - i]
          tempDataMap[key] = datamap[key]
        }
        datamap = tempDataMap;
        break;
      case "6 Month":
        var months = 6
        var tempDataMap = {}
        var key = ""
        for (i = months; i > 0; i--){
          key = Object.keys(datamap)[Object.keys(datamap).length - i]
          tempDataMap[key] = datamap[key]
        }
        datamap = tempDataMap;
        break;
      default:
        datamap = datamap;
    }



    //transform into data suitable for this d3 graph
    var data = Object.values(datamap)

    color.domain(d3.keys(data[0]).filter(function(key) {
      return key !== "date";
    }));



    var cities = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {
            date: d.date,
            name: name,
            temperature: +d[name]
          };
        })
      };
    });

    x.domain(d3.extent(data, function(d) {
      return d.date;
    }));

    y.domain([
      d3.min(cities, function(c) {
        return d3.min(c.values, function(v) {
          return v.temperature;
        });
      }),
      d3.max(cities, function(c) {
        return d3.max(c.values, function(v) {
          return v.temperature;
        });
      })
    ]);

    var legend = svg.selectAll('g')
      .data(cities)
      .enter()
      .append('g')
      .attr('class', 'legend');

    legend.append('rect')
      .attr('x', width - 215)
      .attr('y', function(d, i) {
        return i * 20;
      })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function(d) {
        return color(d.name);
      });

    legend.append('text')
      .attr('x', width -195)
      .attr('y', function(d, i) {
        return (i * 20) + 9;
      })
      .style("fill", "#eaeaea")
      .text(function(d) {
        return d.name;
      });

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .style("fill", "#eaeaea")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .style("fill", "#eaeaea")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("fill", "#eaeaea")
      .text("Value (" + state["currency"] + ")");

    var portfolio = svg.selectAll(".portfolio")
      .data(cities)
      .enter().append("g")
      .attr("class", "portfolio");

    portfolio.append("path")
      .attr("class", "line")
      .attr("d", function(d) {
        return line(d.values);
      })
      .style("stroke", function(d) {
        return color(d.name);
      });

    portfolio.append("text")
      .datum(function(d) {
        return {
          name: d.name,
          value: d.values[d.values.length - 1]
        };
      })
      .attr("transform", function(d) {
        return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")";
      })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) {
        return ""; //name at end of line 
      });

    var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "#D3D3D3")
      .style("stroke-width", "1px")
      .style("opacity", "0");
      
    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(cities)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", function(d) {
        return color(d.name);
      })
      .style("fill", function(d) {
        return color(d.name);
      })
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("rect")
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("width", 240)
      .attr("height", 100)
      .attr("transform", "translate(20,1)")
      .style("fill", "#D3D3D3")
      .style("stroke-width", "1px")
      .style("opacity", "0");


    mousePerLine.append("text")
      .attr("transform", "translate(25,25)")


    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line rect")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line rect")
          .style("opacity", "0.95");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
            console.log(width/mouse[0])
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);
            
            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            
            d3.select(this).select('text')
              .style("font-size","10px")
              .text(xDate.getDate() + "-" + (xDate.getMonth()+1) + "-" + xDate.getFullYear())
              .append('svg:tspan')
              .style("font-weight","bold")
              .attr('x', 0)
              .attr('dy', 30)
              .style("font-size","11.5px")
              .text(function(d) { return d.name; })
              .append('svg:tspan')
              .attr('x', 0)
              .attr('dy', 30)
              .style("fill", "#34A7C1")
              .style("font-size", "22px")
              .text("$" + numberWithCommas(y.invert(pos.y).toFixed(0)) + " " + state["currency"]);


              
            return "translate(" + mouse[0] + "," + pos.y +")";
          });
      });
    });
}

//function to handle change in timeframe
function openTime(evt, timeName) {
  console.log("Switch timeframe: " + state["timeframe"] + " for " + state["benchmark"] + ", with currency" + state["currency"] )
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  evt.currentTarget.className += " active";
  state["timeframe"] = timeName;
  compare(state["benchmark"])
}

//function to handle change in currency
function switchCurrency(){
  if(state["currency"] === "SGD"){
    state["currency"] = "USD"
  }else{
    state["currency"] = "SGD"
  }
  compare(state["benchmark"])
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}