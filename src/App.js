import { 
  useState, useEffect,
} from 'react';

import Map from './components/Map';
import Sources from './components/Sources';
import Details from './components/Details';
import Community from './components/Community';
import Census from './components/Census';
import Legend from './components/Legend';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import axios from 'axios';
import { csvParse } from 'd3-dsv';
import { addData, processSheet, lookupRef, otherSheet } from './utils';

import './App.scss';

function App() {
  const [allData, setAllData] = useState(null);
  const [lookup, setLookup] = useState(null);
  const [shapeFile, setShapeFile] = useState(null);
  const [nonTrad, setNonTrad] = useState(null);
  const [ntLookup, setNtLookup] = useState(null);
  const [summary, setSummary] = useState(null);
  const [communitySummary, setCommunitySummary] = useState(null);
  const [details, setDetails] = useState(null);
  const [community, setCommunity] = useState(null);

  useEffect(() => {
    function getData() {
      const mainSheet = axios({
          url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3OCcVgY7Sy8GBRUlrsLWJkfJnEtT5L7IqxNNRon1_Pw3keeVbNfs1h3QUFcFd9jz9cIfoIXg0MTn1/pub?gid=1853710081&single=true&output=csv', 
          method: 'GET',
          responseType: 'text',
        });

      const nonTraditional = axios({
          url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGQJ9V4Tz9pw4AY32VzE-PpMz7zTfnAUkXD6OQM5koNnMU835n1gJOdNeLD8TPgtJtP8KE5Q7nlvgx/pub?output=csv', 
          method: 'GET',
          responseType: 'text',
        });

      const geoJson = axios.get('map.json');

      axios.all([mainSheet, nonTraditional, geoJson])
        .then(axios.spread((...responses) => {
          const parsedMain = processSheet(csvParse(responses[0].data));
          const processedNonTrad = otherSheet(csvParse(responses[1].data));
          const shapeData = addData(responses[2].data, parsedMain, processedNonTrad);
          const initDetails = parsedMain.filter(d => d.STATEWIDE === 'x');
          
          setAllData(parsedMain);
          setLookup(lookupRef(parsedMain, 'COUNTY', 'SECTOR'));
          setShapeFile(shapeData);
          setNonTrad(processedNonTrad);
          setNtLookup(lookupRef(processedNonTrad, 'county', 'type'));
          setDetails({ header: 'Statewide news outlets', data: initDetails});
        }))
        .catch(errors => {
          console.log(errors);
        });
    };
    getData();
  }, []);

  const updateTable = (f) => {
    if(lookup.get(f.properties.NAME)) {
      const countySourceSummary = lookup.get(f.properties.NAME);
      f.properties.source_summary = [];      

      countySourceSummary.forEach((_v, key) => {
        f.properties.source_summary.push([key, _v.length]);
      });

      f.properties.source_summary = f.properties.source_summary.sort((a, b) => b[1] - a[1]);
    }
    setSummary(f);
    
    if (ntLookup.get(f.properties.NAME)) {
      f.properties.community_source_summary = [];
      
      ntLookup.get(f.properties.NAME).forEach((v, k) => {
        f.properties.community_source_summary.push([k, v.length]);
      });
      f.properties.community_source_summary = f.properties.community_source_summary.sort(((a, b) => b[1] - a[1]));
    }
    setCommunitySummary(f);
    
    const sourceDetails = allData.filter(d => d.COUNTY === f.properties.NAME);
    const communityDetails = nonTrad.filter(d => d.county === f.properties.NAME);
    
    if (sourceDetails.length) {
      setDetails({ header: `Mainstream news sources in ${f.properties.NAME} County`, data: sourceDetails});
    } else {
      setDetails({ header: '', data: []});
    }

    if (communityDetails.length) {
      setCommunity({header: 'Community news sources', data: communityDetails });
    } else {
      setCommunity({ header: '', data: []});
    }
  };

  const buttonHandler = (e, key) => {
    const hedText = {
      'STATEWIDE': 'Statewide mainstream outlets',
      'COLab': 'COLab news outlets',
      'CPA': 'CPA news outlets'
    };

    const btnData = allData.filter(d => d[key] === 'x');
    setDetails({ header: hedText[key], data: btnData});
  }

  const fillColor = {
    id: 'colorado',
    type: 'fill',
    paint: {
      'fill-outline-color': '#787878',
      'fill-color': {
        property: 'total_sources',
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
          <h1 className='App__hed bold'>Colorado News Map</h1>
          <h4 className='App__subhed'>Subhed and description come here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h4>
          <div className='map__subhed'>Click or tap on a county to learn more about its news ecosystem.</div>
          <Legend />
        </Row>
        <Row>
          <Col xs={12} md={8} lg={7}>
            <Map 
              source={shapeFile} 
              fill={ fillColor }
              passData={updateTable}
            >
            </Map>
          </Col>

          <Col xs={12} md={4} lg={5}>
            {summary &&
              (
                <div>
                  <h4 className='summary__hed'>{ summary.properties.NAME } County</h4>
                  <Census feature={ summary }/>
                  <p className='summary__intro'>This county has { summary.properties.total_sources } news sources.</p>
                </div>
              )}
            <Row>
              <Col xs={6}>
                {summary && (
                  <div>
                    <h6>Mainstream news sources</h6>
                    <Sources type='mainstream' county={summary.properties.NAME} sources={summary.properties.source_summary} />
                  </div>
                )}
              </Col>
              
              <Col xs={6}>
                {communitySummary && (
                  <div>
                    <h6>Community news sources</h6>
                    <Sources type='community' county={summary.properties.NAME} sources={summary.properties.community_source_summary} />
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="spacer"></div>

        <Row>
          <Col>
            <div className="button-filters">
              <Button onClick={e => buttonHandler(e, 'STATEWIDE') } variant="outline-dark" className='filter-table-btn'>Statewide publications</Button>
              <Button onClick= {e => buttonHandler(e, 'COLab') } variant="outline-dark" className='filter-table-btn'>COLab publications</Button>
              <Button onClick= {e => buttonHandler(e, 'CPA') } variant="outline-dark" className='filter-table-btn'>CPA publications</Button>
            </div>  
          </Col>
        </Row>

        <div className="spacer"></div>

        <Row>
          <Col xs={12} sm={6}>
            { details && 
              (<Details mainstream={ details } />)
            }
          </Col>

          <Col xs={12} sm={6}>
            { community && 
              (<Community community={ community } />)
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
