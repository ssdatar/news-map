import DataTable from 'react-data-table-component';

function Community(props) {
  if (props.community.data.length) {
    const { data, header } = props.community;
    console.log(data, header);
    
    const columns = [
      {
        name: 'Outlet',
        cell: row => (
            <a href={row['link']}>{ row['name'] }</a>
          )
      },
      {
        name: 'County',
        selector: row => row.county,
        sortable: true,
      },
      {
        name: 'Type',
        selector: row => row.type,
      },
      {
        name: 'Mission',
        selector: row => row.mission,
        wrap: true,
      }
    ];

    return (
      <div>
        <h4>{ header }</h4>
        <DataTable className='rdt_Table' columns={columns} data={data} pagination />
      </div>
    );
  } else {
    return <h4>This county has no community news sources.</h4>;
  }
}

export default Community;