import { rollup } from 'd3-array';

export default function groupBy(data) {
    console.log(rollup(data, v => v.length, d => d.COUNTY));
    return rollup(data, v => v.length, d => d.COUNTY);
}