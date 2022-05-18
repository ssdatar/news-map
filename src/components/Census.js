import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { intcomma } from 'journalize';

import './Census.scss';

function Census(props) {
  const { feature } = props;
  console.log(feature)

  return(
    <div className='census__data'>
      <Row>
        <Col sm='4'>
          <div className="census__number">
            <p className='census__number--num'>{ intcomma(feature.properties.total_pop) }</p>
            <div>people</div>
          </div> 
        </Col>
        <Col sm='4'>
          <div className="census__number">
            <p className='census__number--num'>{ Math.round(feature.properties.pop_density) }</p>
            <p>people per sq. mile</p>
          </div>
        </Col>
        <Col sm='4'>
          <div className="census__number">
            <p className='census__number--num'>${ intcomma(feature.properties.median_income) }</p>
            <p>median income</p>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Census;