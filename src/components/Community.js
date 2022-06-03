import DataTable from 'react-data-table-component';

function Community(props) {
  if (props.community.data.length) {
    const { data, header } = props.community;
    const customStyles = {
      rows: {
          style: {
              minHeight: '50px', // override the row height
          },
      }
    };

    const ExpandedComponent = ({ data }) => {
      return(
        <div>
          <p className='community-mission'>{ data.other_info }</p>
          <p className='community-mission'>{ data.mission }</p>
        </div>
      )
    };
    
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
      // {
      //   name: 'Mission',
      //   selector: row => row.mission,
      //   wrap: true,
      //   height: '50px',
      // }
    ];

    return (
      <div className='details community'>
        <h4 className='details__hed'>{ header }</h4>
        <DataTable 
          className='rdt_Table' 
          columns={columns} 
          data={data} 
          customStyles={customStyles} 
          pagination paginationPerPage={5}
          paginationRowsPerPageOptions = {[5, 10, 15, 20, 25, 30]}
          highlightOnHover 
          expandableRows 
          expandableRowsComponent={ ExpandedComponent }
        />
      </div>
    );
  } else {
    return <h4>This county has no community news sources.</h4>;
  }
}

export default Community;