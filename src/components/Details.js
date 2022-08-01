import DataTable from 'react-data-table-component';
import { formatNumber } from './utils';

const sortReach = (rowA, rowB) => {
  const a = rowA['REACH (if available)'];
  const b = rowB['REACH (if available)'];

  // https://stackoverflow.com/questions/30528541/javascript-sort-array-of-mixed-data-type
  if (isNaN(a)) {
    if (isNaN(b)) {  // a and b are strings
      return a.localeCompare(b);
    } else {         // a string and b number
        return 1;  // a > b
      }
  } else {
      if (isNaN(b)) {  // a number and b string
        return -1;  // a < b
      } else {         // a and b are numbers
        return parseInt(a) - parseInt(b);
      }
  }
};

const MissionComponent = ({ data }) => {
   return(
      <div className='expanded'>
        <p className='expanded__mission'>{ data.MISSION }</p>
      </div>
    )
};

function Details(props) {
  if (props.mainstream.data.length) {
    const { data, header } = props.mainstream;

    const tableDataItems = data.map(item => {
      let disabled = item.MISSION.length > 0 ? false : true;
      return { ...item, disabled };
    })

    const columns = [
      {
        name: 'Outlet',
        selector: row => row.OUTLET,
        // cell: row => (
        //     <a href={row['WEB']}>{ row['OUTLET'] }</a>
        //   )
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
      },
      {
        name: 'Language',
        selector: row => row['NON-ENGLISH/ BIPOC-SERVING'],
        // sortable: true,
        // sortFunction: sortReach
      },
      {
        name: 'Owner',
        selector: row => row.OWNER,
        sortable: true,
      },
      {
        name: 'Ownership',
        selector: row => row.OWTYPE,
        sortable: false,
      },
      {
        name: 'Reach',
        selector: row => formatNumber(row['REACH (if available)']),
        sortable: true,
        sortFunction: sortReach
      },
      // {
      //   name: 'Mission',
      //   selector: row => row.MISSION
      //   // sortable: true,
      //   // sortFunction: sortReach
      // }
    ];

    return (
      <div className='details'>
        <h4 className='details__hed'>{ header }</h4>
        <DataTable 
          className='rdt_Table' 
          columns={ columns } 
          data={ tableDataItems } 
          pagination
          paginationPerPage={25}
          paginationRowsPerPageOptions = {[5, 10, 15, 20, 25, 30]}
          expandableRows 
          expandableRowsComponent={ MissionComponent }
          expandableRowDisabled={ row => row.disabled }
        />
      </div>
    );
  } else {
    return <h4>This county has no news sources.</h4>;
  }
}

export default Details;