import { 
  useState, useEffect,
} from 'react';

import Map from './components/Map';
import Sources from './components/Sources';
import Details from './components/Details';
import Census from './components/Census';
import Race from './components/Race';
import Legend from './components/Legend';
import { mapColor } from './components/utils';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

import axios from 'axios';
import { addData, processSheet, lookupRef } from './utils';

import { Typeahead } from 'react-bootstrap-typeahead'; 

import './App.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';

function App() {
  const [allData, setAllData] = useState(null);
  const [lookup, setLookup] = useState(null);
  const [shapeFile, setShapeFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState(null);

  const [filterOptions, setFilterOptions] = useState({
    language: [],
    county: [],
    ownership: [],
    sector: [],
    search: [],
  });

  const [formOptions, setFormOptions] = useState({
    language: [],
    county: [],
    ownership: [],
    sector: [],
    search: []
  });

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

          setFormOptions({
            language: [...new Set(parsedMain.map(d => d['NON-ENGLISH/ BIPOC-SERVING']))],
            county: [...new Set(parsedMain.map(d => d.COUNTY))],
            ownership: [...new Set(parsedMain.map(d => d.OWTYPE))],
            sector: [...new Set(parsedMain.map(d => d.SECTOR))],
          });

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
      filterChange('county', [ f.properties.NAME ]);

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
      'CPA': 'CPA news outlets',
      'All': 'All news outlets',
    };

    const btnData = (key === 'All') ? allData : allData.filter(d => d[key] === 'x');
    
    setDetails({ 
      header: hedText[key], 
      data: btnData
    });
  }

  const searchHandler = (e) => {
    const searchData = allData.filter(d => d['OUTLET'].toLowerCase().indexOf(e.target.value) > -1);

    setDetails({ 
      header: '', 
      data: searchData
    });
  };

  const filterChange = (key, value) => {
    const updatedValues = {};
    updatedValues[key] = value;
  
    setFilterOptions((prevState) => {
      return {...prevState, ...updatedValues};
    });
  };

  const resetSummary = () => setSummary(null);

  useEffect(() => {
    if (allData) {
      // console.log(filterOptions);
      
      const filterKeys = {
        county: 'COUNTY',
        language: 'NON-ENGLISH/ BIPOC-SERVING',
        ownership: 'OWTYPE',
        sector: 'SECTOR',
        search: 'OUTLET'
      };

      let filterValues = {};

      Object.keys(filterKeys).forEach(fk => {
        if (filterOptions[fk].length) {
          filterValues[fk] = filterOptions[fk];
        } else {
          filterValues[fk] = [...new Set(allData.map(d => d[filterKeys[fk]]))];
        }
      });

      const refreshData = allData.filter(row => 
        filterValues.county.includes(row['COUNTY']) && 
        filterValues.language.includes(row['NON-ENGLISH/ BIPOC-SERVING']) && 
        filterValues.ownership.includes(row['OWTYPE']) &&
        filterValues.sector.includes(row['SECTOR']) && 
        row['OUTLET'].toLowerCase().indexOf(filterValues.search[0]) > -1
        // (filterValues.search[0].length > 0 ? 
        //     row['OUTLET'].toLowerCase().indexOf(filterValues.outlet) > -1 
        //     : true)
      );
      
      setDetails({
        header: '',
        data: refreshData
      });
    }

  }, [filterOptions]);

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

                  <Row>
                    <Col sm={6}>
                      <Sources 
                        type='mainstream' 
                        county={summary.properties.NAME} 
                        sources={summary.properties.source_summary}
                        refreshTable={ (obj) => filterChange('sector', obj.sector) } 
                      />
                    </Col>

                    <Col sm={6}>
                      <p className='summary__demographics'>Demographics</p>
                      <Race feature={summary} />
                    </Col>
                  </Row>                  
                </div>
              )}
          </Col>
        </Row>

        <div className="spacer"></div>

        <Row>
          <Col>
            <div className="button-filters">
              <Button onClick={e => buttonHandler(e, 'STATEWIDE') } variant="outline-dark" className='filter-table-btn'>Statewide publications</Button>
              <Button onClick= {e => buttonHandler(e, 'COLab') } variant="outline-dark" className='filter-table-btn'>COLab publications</Button>
              <Button onClick= {e => buttonHandler(e, 'CPA') } variant="outline-dark" className='filter-table-btn'>CPA publications</Button>
              <Button onClick= {e => buttonHandler(e, 'All') } variant="outline-dark" className='filter-table-btn'>Show all</Button>
            </div>
          </Col>
        </Row>

        <div className="table-filter">
          <Row>
            <Col xs={12} md={3}>
              <Form.Group style={{ marginTop: '20px' }}>
                <Form.Label>Language</Form.Label>
                <Typeahead
                  id="table-language-filter"
                  className='table-filter__form table-filter__language'
                  labelKey="name"
                  multiple
                  // onInputChange={(text, string) => {console.log(text,string)}}
                  onChange={ (sel) => filterChange('language', sel) }
                  options={formOptions.language}
                  placeholder="Select a language"
                  selected={filterOptions.language}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={3}>
              <Form.Group style={{ marginTop: '20px' }}>
                <Form.Label>County</Form.Label>
                <Typeahead
                  id="table-county-filter"
                  className='table-filter__form table-filter__county'
                  labelKey="county"
                  multiple
                  onChange={(selected) => {
                    if (!selected.length) {
                      resetSummary();
                    } 
                    filterChange('county', selected);
                  }}
                  options={formOptions.county}
                  placeholder="Select a county"
                  selected={filterOptions.county}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={3}>
              <Form.Group style={{ marginTop: '20px' }}>
                <Form.Label>Ownership</Form.Label>
                <Typeahead
                  id="table-ownership-filter"
                  labelKey="owner"
                  className='table-filter__form table-filter__owner'
                  multiple
                  onChange={(selected) => filterChange('ownership', selected)}
                  options={formOptions.ownership}
                  placeholder="Ownership type"
                  selected={filterOptions.ownership}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={3}>
              <Form.Group style={{ marginTop: '20px' }}>
                <Form.Label>Sector</Form.Label>
                <Typeahead
                  id="table-sector-filter"
                  labelKey="sector"
                  className='table-filter__form table-filter__sector'
                  multiple
                  onChange={(selected) => filterChange('sector', selected)}
                  options={formOptions.sector}
                  placeholder="Type of news organization"
                  selected={filterOptions.sector}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={4}>
              <Form.Group className='table-filter__outlet'>
                <Form.Label>Search for an news organization</Form.Label>
                <Form.Control type="text" placeholder="Search" 
                  onChange={ e => filterChange('search', [ e.target.value ]) }
                />
                {/*<Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>*/}
              </Form.Group>
            </Col>
          </Row>
        </div>

        <div className="spacer"></div>

        <Row>
          <Col xs={12}>
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
