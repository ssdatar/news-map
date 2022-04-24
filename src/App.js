import { 
  useState, useEffect, useCallback, useRef
} from 'react';

import Map, { Source, Layer, Popup } from 'react-map-gl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sources from './components/Sources';
// import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { csvParse } from 'd3-dsv';
import { addData, processSheet, lookupRef } from './utils';

import './App.scss';


function App() {
  const [allData, setAllData] = useState(null);
  const [lookup, setLookup] = useState(null);
  const [shapeFile, setShapeFile] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [summary, setSummary] = useState(null);

  const mapRef = useRef();

  const onMapLoad = useCallback(() => {
    mapRef.current.on('click', () => {
      console.log(mapRef.current);
    });
  }, []);

  useEffect(() => {
    function getData() {
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
          const parsedMain = processSheet(csvParse(responses[0].data));
          const shapeData = addData(responses[2].data, parsedMain);
          
          setAllData(parsedMain);
          setLookup(lookupRef(parsedMain));
          setShapeFile(shapeData);
        }))
        .catch(errors => {
          console.log(errors);
        });
    };

    getData();
  }, []);
  
  const onHover = useCallback(event => {
    console.log(event);
    event.originalEvent.stopPropagation();
    // event.originalEvent.preventDefault();
    
    const {
      features,
      point: {x, y},
    } = event;
    
    const hoveredFeature = features && features[0];
    
    hoveredFeature.longitude = event.lngLat.lng;
    hoveredFeature.latitude = event.lngLat.lat;
    hoveredFeature.source_summary = [];

    if(lookup.get(hoveredFeature.properties.NAME)) {
      const countySourceSummary = lookup.get(hoveredFeature.properties.NAME);
      
      countySourceSummary.forEach((_v, key) => {
        hoveredFeature.source_summary.push([key, _v.length]);
      });

      hoveredFeature.source_summary = hoveredFeature.source_summary.sort((a, b) => {
        return b[1] - a[1];
      });
    }
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
    // console.log(hoveredFeature.source_summary);
    setSummary(hoveredFeature);
  }, [ lookup ]);

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
            onLoad={ onMapLoad }
            // onMouseMove={ onHover }
            // onMouseLeave={ onLeave }
            // onClick={ onHover }
            >

            <Source type="geojson" data={shapeFile}>
              <Layer {...fillColor} />
            </Source>

            {hoverInfo && (
              <Popup
                longitude={hoverInfo.feature.longitude}
                latitude={hoverInfo.feature.latitude}
                offset={[0, -10]}
                closeButton={ true }
                closeOnClick={ false }
                className="county-info"
                onClose={ onLeave }>
                <h5>{ hoverInfo.feature.properties.NAME }</h5>
                <p>News sources: { hoverInfo.feature.properties.news_sources }</p>
              </Popup>
            )}
          </Map>
        </Col>

        <Col xs={12} md={4} lg={4}>
          {summary && (
            <div>
              <h5>{ summary.properties.NAME }</h5>

              <Sources county={summary.properties.NAME} sources={summary.source_summary} />
            </div>
          )}
        </Col>

      </Row>
    </Container>
  );
}

export default App;
