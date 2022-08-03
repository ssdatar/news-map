import Table from 'react-bootstrap/Table';

function Race(props) {
  const { feature } = props;
  const { properties } = feature;
  const raceLabels = ['White', 'Black', 'Hispanic', 'Asian', 'Native American', 'Other race', 'Multiracial']
  const raceKeys = ['white', 'black', 'hispanic', 'asianp', 'nat_am', 'other', 'multiracial'];

  const raceData = raceKeys.map((k, i) => ({
    race: raceLabels[i],
    num: Number.isNaN(+properties[raceKeys[i]]) ? 0 : +properties[raceKeys[i]],
    pct: parseFloat((100 * (properties[raceKeys[i]] / properties.total_pop)).toFixed(1))
  }))
  .sort((a, b) => b.pct - a.pct);

  // console.log(raceData);

  return (
    <Table  className='source__table' striped hover responsive>    
      <tbody>
      { raceData.map((r, i) => (
        <tr key={i}>
          <td>{ r.race }</td>
          <td>{ r.pct }%</td>
        </tr>
      ))}
      </tbody>
    </Table>
  );
}

export default Race;