import Table from 'react-bootstrap/Table';

function Sources(props) {
  if (props.sources !== undefined) {
    const { sources } = props;
    return (
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Type of source</th>
            <th>Number of organizations</th>
          </tr>
        </thead>
        
        <tbody>
        { sources.map((s, i) => (
          <tr key={i}>
            <td>{ s[0] }</td>
            <td>{ s[1] }</td>
          </tr>
        ))}
        </tbody>
      </Table>
    );
  } else {
    return(
      <p>This county has no news sources</p>
    );
  }
}

export default Sources;
