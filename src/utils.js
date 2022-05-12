import { rollup, group } from 'd3-array';

export function processSheet(sheet) {
  // console.log(sheet);
  sheet.forEach(s => {
    if (s.SECTOR.length < 2) {
      s.SECTOR = 'Other';
    }
  });
  return sheet;
}

export function addData(shape, data) {
  // Calculate number of news sources
  const lookup = rollup(data, v => v.length, d => d.COUNTY);
  const grouped = group(data, d => d.COUNTY, d => d.SECTOR);

  // Add to shapefile
  shape.features.forEach(county => {
    if (lookup.has(county.properties.NAME)) {
      county.properties.news_sources = lookup.get(county.properties.NAME);
      county.properties.news_sources_detail = grouped.get(county.properties.NAME);

      const arr = [];
      const countySourceSummary = grouped.get(county.properties.NAME);
      
      for (const key of countySourceSummary.keys()) {
        arr.push([key.trim(), countySourceSummary.get(key).length])
      }
      county.properties.news_sources_list = countySourceSummary;
    } else {
      county.properties.news_sources = 0;
      county.properties.news_sources_list = {};
    }
  });

  // console.log(grouped.get('Denver'));
  // grouped.get('Denver').forEach((_v, key) => {
  //     console.log(_v, key);
  // });
  return shape;
}

export function lookupRef(data) {
  return group(data, d => d.COUNTY, d => d.SECTOR);
}

export function otherSheet(insheet) {
  const answer = [];
  const keys = Object.keys(insheet[0]).slice(2);
  const outKeys = ['name', 'link', 'county', 'owner', 'mission', 'type', 'other_info'];

  insheet.forEach(row => {
    let dict = {};
    keys.forEach((k, i) => {
      dict[outKeys[i]] = row[k];
    })
    answer.push(dict);
  });
  return answer;
}