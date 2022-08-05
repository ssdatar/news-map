import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { intcomma } from 'journalize';
import { PieChart, Pie, ResponsiveContainer, LabelList } from 'recharts';

import './Census.scss';

function Census(props) {
  const { feature } = props;
  const { properties } = feature;
  const raceLabels = ['White', 'Black', 'Hispanic', 'Asian', 'Native American', 'Other race', 'Multiracial']
  const raceKeys = ['white', 'black', 'hispanic', 'asian', 'nat_am', 'other', 'multiracial'];

  const raceData = raceKeys.map((k, i) => ({
    race: raceLabels[i],
    num: properties[raceKeys[i]],
    pct: parseFloat((100 * (properties[raceKeys[i]] / properties.total_pop)).toFixed(1))
  }));

  // console.log(props);
  // console.log(properties.total_pop, raceKeys.map(d => properties[d]).reduce((a, b) => a + b));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, race, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
      return (
        <text x={x} y={y} fill='#1B1725' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          { race }
        </text>
      );
  };

  const showScores = (properties.hasOwnProperty('Original') && properties.hasOwnProperty('Local'));

  const scores = showScores && (
    <div>
      <p className='summary__intro'><strong>Originality of news sources:</strong> { properties['Original'] } original and { properties['Not Original'] } non-original stories.</p> 
      <p className='summary__intro'><strong>Locality of news sources:</strong> { properties['Local'] } local and { properties['Not Local'] } non-local stories.</p>
    </div>
  );

  return(
    <div className='census__data'>
      <Row>
        <Col sm='3' md='4' lg='3'>
          <div className="census__number">
            <p className='census__number--num'>{ properties.total_sources }</p>
            <p className='census__number--description'>news sources</p>
          </div>
        </Col>
        <Col sm='3' md='4' lg='3'>
          <div className="census__number">
            <p className='census__number--num'>{ intcomma(feature.properties.total_pop) }</p>
            <p className='census__number--description'>people</p>
          </div> 
        </Col>
        <Col sm='3' md='4' lg='3'>
          <div className="census__number">
            <p className='census__number--num'>{ Math.round(feature.properties.pop_density) } people</p>
            <p className='census__number--description'>per sq. mile</p>
          </div>
        </Col>
        <Col sm='3' md='4' lg='3'>
          <div className="census__number">
            <p className='census__number--num'>${ intcomma(feature.properties.median_income) }</p>
            <p className='census__number--description'>median income</p>
          </div>
        </Col>
        
      </Row>
      { scores }
    </div>
  );
}

export default Census;