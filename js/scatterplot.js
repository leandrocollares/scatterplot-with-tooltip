var margin = {top: 60, right: 50, bottom: 75, left: 75},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom); 

var wrapper = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');     

var tooltip = d3.select('#chart').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

var colours = ["#d0112b","#1d4289"];

var xScale = d3.scaleLinear().range([0, width]),
    yScale = d3.scaleLinear().range([height, 0]),
    colourScale = d3.scaleOrdinal(colours);

d3.tsv('data/nbaStats.tsv', function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.allowedPoints = +d.allowedPoints;
    d.scoredPoints = +d.scoredPoints;
  });

  xScale.domain(d3.extent(data, function(d) { return d.allowedPoints; })).nice();
  yScale.domain(d3.extent(data, function(d) { return d.scoredPoints; })).nice();

  wrapper.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale))
    .append('text')
      .attr('x', width - 40)
      .attr('y', 40)
      .style('fill', '#333333')
      .style('text-anchor', 'middle')
      .text('allowed points');

  wrapper.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(yScale))
    .append('text')
      .attr('x', 0)
      .attr('y', -20)
      .style('fill', '#333333')
      .style('text-anchor', 'middle')
      .text('scored points');
   
  // Creates circles
  var circles = wrapper.selectAll('circle')
      .data(data)
    .enter().append('circle')
      .attr('class', 'circle')
      .attr('r', 5 )
      .style('fill', function(d) { return colourScale(d.conference); })
      .attr('cx', function(d) { return xScale(d.allowedPoints); })
      .attr('cy', function(d) { return yScale(d.scoredPoints); });
  
  // Displays tooltip with stats
  circles.on('mouseover', function(d) {
    d3.select(this).attr('r', 8);
    tooltip.transition()
        .duration(200)
        .style('opacity', 0.95);
    tooltip.html(
      '<p><strong>' + d.team + '</strong></p>' +
      '<p><strong>scored points: </strong>' + d.scoredPoints + '</p>' +
      '<p><strong>allowed points: </strong>' + d.allowedPoints + '</p>'
    )
        .style('left', (d3.event.pageX + 15) + 'px')
        .style('top', (d3.event.pageY - 30) + 'px');
    })

  // Hides tooltip
  circles.on('mouseout', function(d) {
    d3.select(this).attr('r', 5);
    tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    })

  // Creates legend
  var legend = wrapper.selectAll('.legend')
      .data(colourScale.domain())
    .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) { return 'translate(' + i * 50 + ', 0)'; })
      .on('mouseover', changeCircleOpacity(0.1))
      .on('mouseout', changeCircleOpacity(1));

  legend.append('rect')
      .attr('x', width / 2 - 48)
      .attr('y', height + 40)
      .attr('width', 47)
      .attr('height', 15)
      .style('fill', colourScale);

  legend.append('text')
      .attr('x', width / 2 - 25)
      .attr('y', height + 65)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text(function(d) { return d; });
});

// Changes the opacity of circles when hovering over a legend element 
// (mouseover event). Hovering over the East (West) rectangle causes 
// the opacity of Western (Eastern) Conference circles to be set to 0.1. 
// The opacity of all circles is set to 1 when there is a mouseout event.
function changeCircleOpacity(opacity) {
  return function(d) {
    var legendElement = d;
    wrapper.selectAll('.circle')
        .filter(function(e) { return e.conference != legendElement})
        .transition()
        .duration(200)
        .style('opacity', opacity);
  };
}