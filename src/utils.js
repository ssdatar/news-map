import { rollup, extent, mean, median } from 'd3-array';

export default function addData(shape, data) {
    // Calculate number of news sources
    const lookup = rollup(data, v => v.length, d => d.COUNTY);

    // Add to shapefile
    shape.features.forEach(county => {
        if (lookup.has(county.properties.NAME)) {
            county.properties.news_sources = lookup.get(county.properties.NAME);
        } else {
            county.properties.news_sources = 0;
        }

    });

    const values = shape.features.map(d => d.properties.news_sources);
    console.log(extent(values), mean(values), median(values));

    console.log(shape.features.filter(d => d.properties.news_sources === 81))

    return shape;
}