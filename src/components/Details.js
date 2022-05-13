import Table from 'react-bootstrap/Table';

function Details(props) {
  console.log(props);
  if (props.mainstream.data.length) {
    const { data, header } = props.mainstream;
    console.log(data, header);
    
    return (
      <div>
        <h4>{ header }</h4>
        <Table className="details" striped hover responsive>
          <thead>
            <tr>
              <th>Outlet</th>
              <th>County</th>
              <th>Sector</th>
            </tr>
          </thead>
          
          <tbody>
          { data.map((s, i) => (
            <tr key={i}>
              <td><a href={s['WEB']}>{ s['OUTLET'] }</a></td>
              <td>{ s['COUNTY'] }</td>
              <td>{ s['SECTOR'] }</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </div>
    )
  } else {
    return null;
  }
}

export default Details;