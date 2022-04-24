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
import addData from './utils';

import './App.scss';


function App() {
  const [allData, setAllData] = useState(null);
  const [lookup, setLookup] = useState(null);
  const [shapeFile, setShapeFile] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [summary, setSummary] = useState(null);

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
        const parsedMain = csvParse(responses[0].data);
        
        setAllData(parsedMain);
        setLookup(parsedMain);
        setShapeFile(addData(responses[2].data, parsedMain));
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
    } = event;
    
    const hoveredFeature = features && features[0];
    
    hoveredFeature.longitude = event.lngLat.lng;
    hoveredFeature.latitude = event.lngLat.lat;
    
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
    console.log(hoveredFeature)
    setSummary(hoveredFeature);
  }, []);

  const onLeave = () => { 
    setHoverInfo(null);
    setSummary(null);
  };

  // const data = useMemo(() => {
  //   return allData;
  // }, [ allData ]);

  const fillColor = {
    id: 'colorado',
    type: 'fill',
    paint: {
      'fill-outline-color': '#787878',
      'fill-color': {
        property: 'news_sources',
        stops: [
          [0, 'transparent'],
          [1, '#feebe2'],
          [5, '#feebe2'],
          [10, '#fbb4b9'],
          [15, '#f768a1'],
          [20, '#c51b8a'],
          [25, '#7a0177'],
        ]
      },
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.3,
        0.85,
      ],
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
            mapStyle="mapbox://styles/mapbox/dark-v10"
            mapboxAccessToken="pk.eyJ1IjoiZGF0YXJrYWxsb28iLCJhIjoiY2toOXI3aW5kMDRlZTJ4cWt0MW5kaHg4eCJ9.V4NfOecIoFaErvFv_lfKLg"
            interactiveLayerIds={['colorado']}
            onMouseMove={ onHover }
            onMouseLeave={ onLeave }>

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
                dynamicPosition={ false }
              >
                <h5>{ hoverInfo.feature.properties.NAME }</h5>
                <p>News sources: { hoverInfo.feature.properties.news_sources }</p>
              </Popup>
            )}

            {/*{hoverInfo && (
              <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
                <div>County: {hoverInfo.feature.properties.NAME}</div>               
              </div>
            )}*/}
          </Map>
        </Col>

        <Col xs={12} md={4} lg={4}>
          {summary && (
            <div>
              <h5>{ summary.properties.NAME }</h5>
            </div>
          )}
        </Col>

      </Row>
    </Container>
  );
}

export default App;
