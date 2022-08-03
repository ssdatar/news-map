import Table from 'react-bootstrap/Table';

function Race(props) {
  const { feature } = props;
  const { properties } = feature;
  const raceLabels = ['White', 'Black', 'Hispanic', 'Asian', 'Native American', 'Other race', 'Multiracial']
  const raceKeys = ['white_pct', 'black_pct', 'hispanic_pct', 'asian_pi_pct', 'nat_am_pct', 'other_pct', 'multiracial_pct'];

  const raceData = raceKeys.map((k, i) => ({
    race: raceLabels[i],
    pct: Number.isNaN(+properties[raceKeys[i]]) ? 0 : (100 * properties[raceKeys[i]]).toFixed(1),
    // pct: parseFloat((100 * (properties[raceKeys[i]] / properties.total_pop)).toFixed(1))
  }))
  .sort((a, b) => b.pct - a.pct);

  console.log(properties);
  console.log(raceData);

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