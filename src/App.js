import Map from 'react-map-gl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';

import './App.scss';

function App() {
  return (
    <Container fluid>
      <Row>
        <Col xs={12} md={8} lg={9}>
          <Map
            initialViewState={{
              longitude: -105.358887,
              latitude: 39.113014,
              zoom: 6.5
            }}
            style={{width: '100%', height: 450}}
            mapStyle="mapbox://styles/mapbox/light-v9"
            mapboxAccessToken="pk.eyJ1IjoiZGF0YXJrYWxsb28iLCJhIjoiY2toOXI3aW5kMDRlZTJ4cWt0MW5kaHg4eCJ9.V4NfOecIoFaErvFv_lfKLg"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
