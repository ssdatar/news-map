import { 
  useState, useEffect, useMemo, useCallback,
} from 'react';

import Map from 'react-map-gl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
import { csv } from 'd3-fetch';
import groupBy from './utils';

import './App.scss';

function App() {

  const [allData, setAllData] = useState(null);
  const [lookup, setLookup] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3OCcVgY7Sy8GBRUlrsLWJkfJnEtT5L7IqxNNRon1_Pw3keeVbNfs1h3QUFcFd9jz9cIfoIXg0MTn1/pub?gid=1853710081&single=true&output=csv')
    .then((res) => {
      setAllData(res);
      // console.log(groupBy(res));
      setLookup(groupBy(res));
    })
    .catch((err) => {
      console.log('Could not load data', err);
    });
  }, []);

  
  const onHover = useCallback(event => {
    const {
      features,
      point: {x, y}
    } = event;
    
    const hoveredFeature = features && features[0];
    const selectedFeature = allData.filter(d => d.COUNTY.toLowerCase() === hoveredFeature.properties.NAME.toLowerCase());
    console.log(selectedFeature);

    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
  }, []);

  const data = useMemo(() => {
    return allData;
  }, [ allData ]);

  // const fillColor = {
  //   id: 'colorado',
  //   type: 'fill',
  //   paint: '#e5e5e5',
  //   {
  //     'fill-color': {
  //       property: 'percentile',
  //       stops: [
  //         [0, '#3288bd'],
  //         [1, '#66c2a5'],
  //         [2, '#abdda4'],
  //         [3, '#e6f598'],
  //         [4, '#ffffbf'],
  //         [5, '#fee08b'],
  //         [6, '#fdae61'],
  //         [7, '#f46d43'],
  //         [8, '#d53e4f']
  //       ]
  //     },
  //     'fill-opacity': 0.8
  //   }
  // };


  return (
    <Container fluid>
      <Row>
        <Col xs={12} md={8} lg={9}>
          <Map
            initialViewState={{
              longitude: -105.358887,
              latitude: 39.113014,
              zoom: 6
            }}
            style={{width: '100%', height: 450}}
            mapStyle="mapbox://styles/datarkalloo/cl25brdxk001e14lpwvnxpjr7"
            mapboxAccessToken="pk.eyJ1IjoiZGF0YXJrYWxsb28iLCJhIjoiY2toOXI3aW5kMDRlZTJ4cWt0MW5kaHg4eCJ9.V4NfOecIoFaErvFv_lfKLg"
            interactiveLayerIds={['colorado']}
            onMouseMove={onHover}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
