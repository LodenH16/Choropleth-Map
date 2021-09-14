const COUNTIES = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

const EDUCATION = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

const margin = 50;
const path = d3.geoPath();

const svg = d3.select('#svg');

Promise.all([d3.json(COUNTIES), d3.json(EDUCATION)]).then(data => {
  const colorDomain = [d3.min(data[1].map(d => d.bachelorsOrHigher)), d3.max(data[1].map(d => d.bachelorsOrHigher))];

  const linearColor = d3.scaleLinear().domain(colorDomain);
  const legendScale = d3.scaleLinear().domain(colorDomain).range([0, 390]);
  const legendAxis = d3.axisTop(legendScale).tickFormat(d => d + '%');

  const tooltip = d3.select('#wrapper').
  append('div').
  attr('id', 'tooltip').
  style('position', 'absolute').
  style('visibility', 'hidden').
  style("background-color", "white").
  style("border", "solid").
  style("border-width", "2px").
  style("border-radius", "5px").
  style("padding", "5px");

  d3.select('#legend').
  append('g').
  call(legendAxis).
  attr('transform', 'translate(0,80)');

  d3.select('#legend').
  selectAll('rect').
  data([3, 12, 21, 30, 39, 48, 57, 66]).
  enter().
  append('rect').
  attr('x', d => legendScale(d)).
  attr('y', 81).
  attr('height', 12).
  attr('width', 43).
  attr('fill', d => d3.interpolateBlues(linearColor(d)));

  svg.selectAll('path').
  data(topojson.feature(data[0], data[0].objects.counties).features).
  enter().
  append('path').
  attr('d', path).
  attr('data-fips', d => d.id).
  attr('data-education', (d, i) => data[1].find(f => f.fips === d.id).bachelorsOrHigher).
  attr('class', 'county').
  style('fill', d => d3.interpolateBlues(linearColor(data[1].find(f => f.fips === d.id).bachelorsOrHigher))).
  on('mouseover', () => tooltip.style('visibility', 'visible')).
  on('mousemove', (e, d, i) => {
    {tooltip.style('top', event.pageY + 'px').
      style('left', event.pageX + 8 + 'px').
      attr('data-education', data[1].find(f => f.fips === d.id).bachelorsOrHigher).
      html(data[1].find(f => f.fips === d.id).area_name + `
                      <br>
                      ` + data[1].find(f => f.fips === d.id).bachelorsOrHigher + `%
                      <br> 
                    `);}
  });

  svg.on('mouseout', () => tooltip.style('visibility', 'hidden'));
});