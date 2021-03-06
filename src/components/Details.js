import DataTable from 'react-data-table-component';
import { formatNumber } from './utils';

const sortReach = (rowA, rowB) => {
  const a = rowA['REACH (if available)'];
  const b = rowB['REACH (if available)'];

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

function Details(props) {
  if (props.mainstream.data.length) {
    const { data, header } = props.mainstream;

    // const [filterText, setFilterText] = React.useState('');
    // const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    // const filteredItems = fakeUsers.filter(
    //   item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
    // );

    // const subHeaderComponentMemo = React.useMemo(() => {
    //   const handleClear = () => {
    //     if (filterText) {
    //       setResetPaginationToggle(!resetPaginationToggle);
    //       setFilterText('');
    //     }
    //   };

    //   return (
    //     <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
    //   );
    // }, [filterText, resetPaginationToggle]);

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
        name: 'Ownership',
        selector: row => row.OWTYPE,
        sortable: false,
      },
      {
        name: 'Reach',
        selector: row => formatNumber(row['REACH (if available)']),
        sortable: true,
        sortFunction: sortReach
      }
    ];

    return (
      <div className='details'>
        <h4 className='details__hed'>{ header }</h4>
        <DataTable 
          className='rdt_Table' 
          columns={columns} 
          data={data} pagination
          paginationPerPage={25}
          paginationRowsPerPageOptions = {[5, 10, 15, 20, 25, 30]}
        />
      </div>
    );
  } else {
    return <h4>This county has no news sources.</h4>;
  }
}

export default Details;