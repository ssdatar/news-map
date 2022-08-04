const os = require('os');
const fs = require('fs');
const path = require('path');

const map = require('./public/map.json');
const { features } = map;
const ratings = require('./public/ratings.json').data
  .filter(d => d.County.length > 0);

// console.log(ratings[0])

map.features.forEach((feat, i) => {
  const r = ratings.filter(d => d.County.toLowerCase() === feat.properties.NAME.toLowerCase())[0];
  // console.log('index', i, r);
  
  if (r !== undefined) {
    Object.keys(r).forEach(k => {
      if (k !== 'County') {
        feat.properties[k] = parseInt(r[k]);
      }
    })
  }
});

fs.writeFileSync('public/map.json', JSON.stringify(map));