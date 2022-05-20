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

export function addData(shape, data, nt) {
  // Calculate number of news sources
  const lookup = rollup(data, v => v.length, d => d.COUNTY);
  const grouped = group(data, d => d.COUNTY, d => d.SECTOR);
  const nonTrad = rollup(nt, v => v.length, d => d.county);
  // const ntGrp = group(nt, d => d.county, d => d.type);
  // console.log(ntGrp);

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

    if (nonTrad.has(county.properties.NAME)) {
      county.properties.community_sources = nonTrad.get(county.properties.NAME);
    } else {
      county.properties.community_sources = 0;
      // county.properties.community_source_summary = [];
    }

    county.properties.total_sources = county.properties.news_sources + county.properties.community_sources;
  });

  // console.log(ntGrp.get('Teller'));

  // let s = shape.features.map(d => d.properties.total_sources);
  // console.log(Math.max(...s), Math.min(...s), s.reduce((a, b) => a + b) / s.length)
  // console.log(s.sort())

  // console.log(grouped.get('Denver'));
  // grouped.get('Denver').forEach((_v, key) => {
  //     console.log(_v, key);
  // });
  return shape;
}

export function lookupRef(data, k1, k2) {
  return group(data, d => d[k1], d => d[k2]);
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