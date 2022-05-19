import DataTable from 'react-data-table-component';

function Details(props) {
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
      <div className='details'>
        <h4 className='details__hed'>{ header }</h4>
        <DataTable 
          className='rdt_Table' 
          columns={columns} 
          data={data} pagination 
          paginationPerPage={5}
          paginationRowsPerPageOptions = {[5, 10, 15, 20, 25, 30]}
        />
      </div>
    );
  } else {
    return <h4>This county has no mainstream news sources.</h4>;
  }
}

export default Details;