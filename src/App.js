import { 
  useState, useEffect, useMemo, useCallback,
} from 'react';

import Map, { Source, Layer, Popup } from 'react-map-gl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { csvParse } from 'd3-dsv';
import groupBy from './utils';

import './App.scss';


function App() {
  const [allData, setAllData] = useState(null);
  const [lookup, setLookup] = useState(null);
  const [shapeFile, setShapeFile] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  const getData = () => {
    const mainSheet = axios({
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3OCcVgY7Sy8GBRUlrsLWJkfJnEtT5L7IqxNNRon1_Pw3keeVbNfs1h3QUFcFd9jz9cIfoIXg0MTn1/pub?gid=1853710081&single=true&output=csv', 
        method: 'GET',
        responseType: 'text',
      });

    const nonTraditional = axios({
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3OCcVgY7Sy8GBRUlrsLWJkfJnEtT5L7IqxNNRon1_Pw3keeVbNfs1h3QUFcFd9jz9cIfoIXg0MTn1/pub?gid=1853710081&single=true&output=csv', 
        method: 'GET',
        responseType: 'text',
      });

    const geoJson = axios.get('colorado.json');

    axios.all([mainSheet, nonTraditional, geoJson])
    .then(axios.spread((...responses) => {
      setAllData(csvParse(responses[0].data));
      setLookup(groupBy(responses[0].data));
      setShapeFile(responses[2].data);
    }))
    .catch(errors => {
      console.log(errors);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  
  const onHover = useCallback(event => {
    const {
      features,
      point: {x, y},
      // longitude: event.lngLat.lng,
      // latitude: event.lngLat.lat,
    } = event;
    
    const hoveredFeature = features && features[0];
    hoveredFeature.longitude = event.lngLat.lng;
    hoveredFeature.latitude = event.lngLat.lat;
    // const selectedFeature = allData.filter(d => d.COUNTY.toLowerCase() === hoveredFeature.properties.NAME.toLowerCase());
    console.log(hoveredFeature && {feature: hoveredFeature, x, y});

    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
  }, []);

  // const data = useMemo(() => {
  //   return allData;
  // }, [ allData ]);

  const fillColor = {
    id: 'colorado',
    type: 'fill',
    paint: {
      'fill-color': '#545454',
      'fill-outline-color': '#e5e5e5',
      // {
      //   property: 'percentile',
      //   stops: [
      //     [0, '#3288bd'],
      //     [1, '#66c2a5'],
      //     [2, '#abdda4'],
      //     [3, '#e6f598'],
      //     [4, '#ffffbf'],
      //     [5, '#fee08b'],
      //     [6, '#fdae61'],
      //     [7, '#f46d43'],
      //     [8, '#d53e4f']
      //   ]
      // },
      'fill-opacity': 0.8
    }
  };


  return (
    <Container fluid>
      <Row>
        <Col xs={12} md={8} lg={8}>
          <Map
            initialViewState={{
              longitude: -105.358887,
              latitude: 39.113014,
              zoom: 6
            }}
            style={{width: '100%', height: 450}}
            mapStyle="mapbox://styles/mapbox/light-v10"
            // mapStyle="mapbox://styles/datarkalloo/cl25brdxk001e14lpwvnxpjr7"
            mapboxAccessToken="pk.eyJ1IjoiZGF0YXJrYWxsb28iLCJhIjoiY2toOXI3aW5kMDRlZTJ4cWt0MW5kaHg4eCJ9.V4NfOecIoFaErvFv_lfKLg"
            interactiveLayerIds={['colorado']}
            onMouseMove={onHover}
            onMouseLeave={() => { setHoverInfo(null) }}>

            <Source type="geojson" data={shapeFile}>
              <Layer {...fillColor} />
            </Source>

            {hoverInfo && (
              <Popup
                longitude={hoverInfo.feature.longitude}
                latitude={hoverInfo.feature.latitude}
                offset={[0, -10]}
                closeButton={ false }
                className="county-info"
              >
                { hoverInfo.feature.properties.NAME }
              </Popup>
            )}

            {/*{hoverInfo && (
              <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
                <div>County: {hoverInfo.feature.properties.NAME}</div>               
              </div>
            )}*/}
          </Map>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
