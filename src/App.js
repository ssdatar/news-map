import { 
  useState, useEffect, useCallback,
} from 'react';

// import Map, { Source, Layer, Popup } from 'react-map-gl';
import Map from './components/Map';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sources from './components/Sources';
import Table from 'react-bootstrap/Table';
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
  const [details, setDetails] = useState(null);

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

  const updateTable = (f) => {
    // console.log(f);
    // console.log(allData);

    if(lookup.get(f.properties.NAME)) {
      const countySourceSummary = lookup.get(f.properties.NAME);
      f.properties.source_summary = [];      

      countySourceSummary.forEach((_v, key) => {
        f.properties.source_summary.push([key, _v.length]);
      });

      f.properties.source_summary = f.properties.source_summary.sort((a, b) => {
        return b[1] - a[1];
      });
    }
    setSummary(f);
    console.log(allData.filter(d => d.COUNTY === f.properties.NAME));
    setDetails(allData.filter(d => d.COUNTY === f.properties.NAME));
  };

  const onHover = useCallback(event => {
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
    console.log(hoveredFeature.source_summary);
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

  if (shapeFile) {
    return (
      <Container fluid>
        <Row>
          <Col xs={12} md={8} lg={8}>
            <Map 
              source={shapeFile} 
              fill={ fillColor }
              passData={updateTable}
            >
              
            </Map>
          </Col>

          <Col xs={12} md={4} lg={4}>
            {summary && (
              <div>
                <h5>{ summary.properties.NAME }</h5>
                <Sources county={summary.properties.NAME} sources={summary.properties.source_summary} />
              </div>
            )}
          </Col>
        </Row>

        <Row>
          <Col xs={12} sm={8}>
            {details && 
              (<Table className="details" striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Outlet</th>
                    <th>County</th>
                    <th>Sector</th>
                  </tr>
                </thead>
                
                <tbody>
                { details.map((s, i) => (
                  <tr key={i}>
                    <td><a href={s['WEB']}>{ s['OUTLET'] }</a></td>
                    <td>{ s['COUNTY'] }</td>
                    <td>{ s['SECTOR'] }</td>
                  </tr>
                ))}
                </tbody>
              </Table>)
            }
          </Col>
        </Row>
      </Container>
    );
  } else {
    return null;
  }
}

export default App;
