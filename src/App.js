import { 
  useState, useEffect,
} from 'react';

import Map from './components/Map';
import Sources from './components/Sources';
import Details from './components/Details';
import Census from './components/Census';
import Legend from './components/Legend';
import { mapColor } from './components/utils';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';

import axios from 'axios';
import { addData, processSheet, lookupRef } from './utils';

import { Typeahead } from 'react-bootstrap-typeahead'; 

import './App.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';

function App() {
  const [allData, setAllData] = useState(null);
  const [lookup, setLookup] = useState(null);
  const [shapeFile, setShapeFile] = useState(null);
  const [nonTrad, setNonTrad] = useState(null);
  const [ntLookup, setNtLookup] = useState(null);
  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState(null);

  const [langOptions, setLangOptions] = useState([]);
  const [selectLanguage, setSelectLanguage] = useState([]);

  useEffect(() => {
    function getData() {
      const mainSheet = axios.get('mainstream.json');
      const geoJson = axios.get('map.json');

      axios.all([mainSheet, geoJson])
        .then(axios.spread((...responses) => {
          const parsedMain = processSheet(responses[0].data.data);
          const shapeData = addData(responses[1].data, parsedMain);
          const initDetails = parsedMain.filter(d => d.STATEWIDE === 'x');
          
          setAllData(parsedMain);
          setLookup(lookupRef(parsedMain, 'COUNTY', 'SECTOR'));
          setShapeFile(shapeData);

          const langs = [...new Set(parsedMain.map(d => d['NON-ENGLISH/ BIPOC-SERVING']))];
          console.log(langs);
          setLangOptions(langs)
          
          setDetails({ 
            header: 'Statewide news outlets', 
            data: initDetails 
          });
        }))
        .catch(errors => {
          console.log(errors);
        });
    };
    getData();
  }, []);

  const mapFilter = (f) => {
    if(lookup.get(f.properties.NAME)) {
      const countySourceSummary = lookup.get(f.properties.NAME);
      f.properties.source_summary = [];      

      countySourceSummary.forEach((_v, key) => {
        f.properties.source_summary.push([key, _v.length]);
      });

      f.properties.source_summary = f.properties.source_summary.sort((a, b) => b[1] - a[1]);
    }
    setSummary(f);
      
    const sourceDetails = allData.filter(d => d.COUNTY === f.properties.NAME);
      
    if (sourceDetails.length) {
      setDetails({ 
        header: `News sources in ${f.properties.NAME} County`, 
        data: sourceDetails
      });
    } else {
      setDetails({ header: '', data: []});
    }
  };

  

  const buttonHandler = (e, key) => {
    const hedText = {
      'STATEWIDE': 'Statewide news outlets',
      'COLab': 'COLab news outlets',
      'CPA': 'CPA news outlets'
    };

    const btnData = allData.filter(d => d[key] === 'x');
    
    setDetails({ 
      header: hedText[key], 
      data: btnData
    });
  }

  const langChange = (selected) => {
    setSelectLanguage(selected);
    const refreshData = allData.filter(d => selected.indexOf(d['NON-ENGLISH/ BIPOC-SERVING']) > -1);
    setDetails({
      header: '',
      data: refreshData
    });
  }

  // console.log(...[].concat(...mapColor()));
  let colorArray = [
    'step', 
    ['number', ['get', 'total_sources']],
  ];

  mapColor().forEach(pair => {
    colorArray.push(pair[1]);
    colorArray.push(pair[0]);
  });

  colorArray.push('#001181');

  const fillColor = {
    id: 'colorado',
    type: 'fill',
    paint: {
      'fill-outline-color': '#d3d3d3',
      'fill-color': colorArray,
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
          {/*<h4 className='App__subhed'>Subhed and description come here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h4>*/}
          <div className='map__subhed'>Click or tap on a county to learn more about its news ecosystem.</div>
          <Legend />
        </Row>
        <Row>
          <Col xs={12} md={8} lg={7}>
            <Map 
              source={shapeFile} 
              fill={ fillColor }
              passData={ mapFilter }
              data-testid='map'
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
                    <h6>News sources</h6>
                    <Sources type='mainstream' county={summary.properties.NAME} sources={summary.properties.source_summary} />
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

        <div className="table-filters">
          <Row>
            <Col xs={4}>
              <Form.Group style={{ marginTop: '20px' }}>
                <Form.Label>Select a language</Form.Label>
                <Typeahead
                  id="table-language-filter"
                  labelKey="name"
                  multiple
                  onChange={langChange}
                  options={langOptions}
                  placeholder="Select a language"
                  selected={selectLanguage}
                />
              </Form.Group>
            </Col>

            <Col xs={4}>
              <Form.Group style={{ marginTop: '20px' }}>
                <Form.Label>Select a county</Form.Label>
                <Typeahead
                  id="table-language-filter"
                  labelKey="name"
                  multiple
                  onChange={langChange}
                  options={langOptions}
                  placeholder="Select a language"
                  selected={selectLanguage}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        <div className="spacer"></div>

        <Row>
          <Col xs={12} sm={8}>
            { details && 
              (<Details data-testid='statewide' mainstream={ details } />)
            }
          </Col>
        </Row>
      </Container>
    );
  } else {
    return (
      <div className="loading">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
}

export default App;
