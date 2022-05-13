import Table from 'react-bootstrap/Table';
import DataTable from 'react-data-table-component';

function Details(props) {
  console.log(props);
  if (props.mainstream.data.length) {
    const { data, header } = props.mainstream;

    const columns = [
      {
        name: 'Outlet',
        cell: row => (
            <a href={row['WEB']}>{ row['OUTLET'] }</a>
          )
      },
      {
        name: 'County',
        selector: row => row.COUNTY,
        sortable: true,
      },
      {
        name: 'Sector',
        selector: row => row.SECTOR,
        sortable: true,
      }
    ];

    return (
      <div>
        <h4>{ header }</h4>
        <DataTable className='rdt_Table' columns={columns} data={data} pagination />
      </div>
    );
    
    // return (
    //   <div>
    //     <h4>{ header }</h4>
    //     <Table className="details" striped hover responsive>
    //       <thead>
    //         <tr>
    //           <th>Outlet</th>
    //           <th>County</th>
    //           <th>Sector</th>
    //         </tr>
    //       </thead>
          
    //       <tbody>
    //       { data.map((s, i) => (
    //         <tr key={i}>
    //           <td><a href={s['WEB']}>{ s['OUTLET'] }</a></td>
    //           <td>{ s['COUNTY'] }</td>
    //           <td>{ s['SECTOR'] }</td>
    //         </tr>
    //       ))}
    //       </tbody>
    //     </Table>
    //   </div>
    // )
  } else {
    return null;
  }
}

export default Details;