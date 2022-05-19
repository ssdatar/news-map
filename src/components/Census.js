import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { intcomma } from 'journalize';
// import { PieChart, Pie, ResponsiveContainer } from 'recharts';

import './Census.scss';

function Census(props) {
  const { feature } = props;
  const { properties } = feature;
  const raceLabels = ['White', 'Black', 'Hispanic', 'Asian', 'Native American', 'Other race', 'Multiracial']
  const raceKeys = ['white', 'black', 'hispanic', 'asian', 'nat_am', 'other', 'multiracial'];

  const raceData = raceKeys.map((k, i) => ({
    name: raceLabels[i],
    num: parseFloat((100 * (properties[raceKeys[i]] / properties.total_pop)).toFixed(1))
  }));

  return(
    <div className='census__data'>
      <Row>
        <Col sm='4'>
          <div className="census__number">
            <p className='census__number--num'>{ intcomma(feature.properties.total_pop) }</p>
            <p className='census__number--description'>people</p>
          </div> 
        </Col>
        <Col sm='4'>
          <div className="census__number">
            <p className='census__number--num'>{ Math.round(feature.properties.pop_density) }</p>
            <p className='census__number--description'>people per sq. mile</p>
          </div>
        </Col>
        <Col sm='4'>
          <div className="census__number">
            <p className='census__number--num'>${ intcomma(feature.properties.median_income) }</p>
            <p className='census__number--description'>median income</p>
          </div>
        </Col>
      </Row>

      {/*<Row>
        <Col className="sm-6">
          <ResponsiveContainer width='100%' height={250}>
            <PieChart width={ 250 } height={ 250 }>
              <Pie data={ raceData } dataKey='name' outerRadius={250} innerRadius={150} fill="#d0bcd5" />
            </PieChart>
          </ResponsiveContainer>
        </Col>
        <Col className="sm-6">
          
        </Col>
      </Row>*/}
    </div>
  );
}

export default Census;