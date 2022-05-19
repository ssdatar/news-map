import Table from 'react-bootstrap/Table';

function Sources(props) {
  // console.log(props);
  if (props.sources !== undefined && props.sources.length) {
    const { sources } = props;
    return (
      <div>
        {/*<h6>news sources</h6>*/}
        <Table hover responsive striped>
          {/*<thead>
            <tr>
              <th>Type of source</th>
              <th>Number of organizations</th>
            </tr>
          </thead>*/}
          
          <tbody>
          { sources.map((s, i) => (
            <tr key={i}>
              <td>{ s[0] }</td>
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
