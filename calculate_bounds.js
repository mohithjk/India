const fs = require('fs');
const d3 = require('d3-geo');

const data = JSON.parse(fs.readFileSync('./public/india_state.geojson', 'utf8'));

// The base projection used in IndiaMap.jsx
// Note: We don't have the exact width/height in px, but we can assume an aspect ratio
// React-simple-maps default width=800, height=600
const width = 800;
const height = 600;
const projection = d3.geoMercator().scale(980).center([80, 22]).translate([width / 2, height / 2]);
const path = d3.geoPath().projection(projection);

const states = {};

data.features.forEach(feature => {
  const name = feature.properties.NAME_1 || feature.properties.name;
  
  // Calculate bounding box in pixels
  const bounds = path.bounds(feature);
  const dx = bounds[1][0] - bounds[0][0];
  const dy = bounds[1][1] - bounds[0][1];
  const x = (bounds[0][0] + bounds[1][0]) / 2;
  const y = (bounds[0][1] + bounds[1][1]) / 2;
  
  // Calculate optimal zoom to fit within 80% of the SVG
  // Math.min fits it in the container exactly.
  // We want the state to take up maybe 75% of the SVG.
  const scale = 0.75 / Math.max(dx / width, dy / height);
  
  // Find the coordinate center by inverting the center pixel
  const centerCoord = projection.invert([x, y]);
  
  states[name] = {
    center: [parseFloat(centerCoord[0].toFixed(2)), parseFloat(centerCoord[1].toFixed(2))],
    zoom: parseFloat(scale.toFixed(1))
  };
});

console.log(JSON.stringify(states, null, 2));
