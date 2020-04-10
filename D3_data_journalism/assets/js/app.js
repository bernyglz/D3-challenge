// @TODO: YOUR CODE HERE!
let width = parseInt(d3.select("#scatter").style("width"));

let height = width - width / 3.9;

let margin = 20;

let labelArea = 110;

let tPadBot = 40;
let tPadLeft = 40;

let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

let circRadius;
function cirRad() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
cirRad();

svg.append("g").attr("class", "xText");

let xText = d3.select(".xText");

function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}
xTextRefresh();

xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");

let leftTextX = margin + tPadLeft;
let leftTextY = (height + labelArea) / 2 - labelArea;

svg.append("g").attr("class", "yText");

let yText = d3.select(".yText");

function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "active")

  .text("Lacks Healthcare (%)");

d3.csv("assets/data/data.csv").then(function(data) {

  visualize(data);
});

function visualize(theData) {

  let curX = "poverty";
  let curY = "healthcare";

  let xMin;
  let xMax;
  let yMin;
  let yMax;

  function xMinMax() {

    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });

  
    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }

  function yMinMax() {

    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });

    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }

  xMinMax();
  yMinMax();

  let xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  let yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);

  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);

  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  let theCircles = svg.selectAll("g theCircles").data(theData).enter();

  theCircles
    .append("circle")
 
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
   
  theCircles
    .append("text")

    .text(function(d) {
      return d.abbr;
    })
  
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {

      return yScale(d[curY]) + circRadius / 4;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")

  d3.selectAll(".aText").on("click", function() {

    let self = d3.select(this);

    if (self.classed("inactive")) {
    
      let axis = self.attr("data-axis");
      let name = self.attr("data-name");

      if (axis === "x") {
    
        curX = name;

        xMinMax();

        xScale.domain([xMin, xMax]);

        svg.select(".xAxis").transition().duration(300).call(xAxis);

        d3.selectAll("circle").each(function() {
      
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        d3.selectAll(".stateText").each(function() {
  
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        labelChange(axis, self);
      }
      else {
 
        curY = name;

        yMinMax();

        yScale.domain([yMin, yMax]);

        svg.select(".yAxis").transition().duration(300).call(yAxis);

        d3.selectAll("circle").each(function() {
       
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });

        d3.selectAll(".stateText").each(function() {
  
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + circRadius / 4;
            })
            .duration(300);
        });

        labelChange(axis, self);
      }
    }
  });

  d3.select(window).on("resize", resize);

  function resize() {

    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;

    svg.attr("width", width).attr("height", height);

    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);

    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

    svg.select(".yAxis").call(yAxis);

    tickCount();

    xTextRefresh();
    yTextRefresh();

    cirRad();

    d3
      .selectAll("circle")
      .attr("cy", function(d) {
        return yScale(d[curY]);
      })
      .attr("cx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", function() {
        return circRadius;
      });

    d3
      .selectAll(".stateText")
      .attr("dy", function(d) {
        return yScale(d[curY]) + circRadius / 4;
      })
      .attr("dx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", circRadius / 4);
  }
}