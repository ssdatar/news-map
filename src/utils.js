import { rollup, group } from 'd3-array';

export default function addData(shape, data) {
    // Calculate number of news sources
    const lookup = rollup(data, v => v.length, d => d.COUNTY);
    const grouped = group(data, d => d.COUNTY, d => d.SECTOR);

    // Add to shapefile
    shape.features.forEach(county => {
        if (lookup.has(county.properties.NAME)) {
            county.properties.news_sources = lookup.get(county.properties.NAME);
        } else {
            county.properties.news_sources = 0;
        }

    });

    console.log(Array.from(grouped.get('Denver')));
    return shape;
}