import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

const sourceClick = (e, props) => {
  // console.log(e.target.textContent, props);
  props.refreshTable({
    county: [props.county],
    sector: [e.target.textContent],
  });
};

function Sources(props) {
  // console.log(props);
  if (props.sources !== undefined && props.sources.length) {
    const { sources } = props;
    return (
      <div className='source'>
        {/*<h6>news sources</h6>*/}
        <Table  className='source__table' responsive>
          {/*<thead>
            <tr>
              <th>Type of source</th>
              <th>Number of organizations</th>
            </tr>
          </thead>*/}
          
          <tbody>
          { sources.map((s, i) => (
            <tr key={i}>
              <td>
                <Button 
                  onClick={e => sourceClick(e, props) } 
                  variant="outline-light" 
                  className='source__type--shortcut'>{ s[0] }</Button>
              </td>
              <td>{ s[1] }</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </div>
    );
  } else {
    return(
      <p>This county has no { props.type } news sources.</p>
    );
  }
}

export default Sources;
