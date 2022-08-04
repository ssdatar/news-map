import Table from 'react-bootstrap/Table';
import { useState, useEffect, useRef } from 'react';
// import { PieChart, PieArcSeries } from 'reaviz';
import { PieChart, Pie, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  console.log(payload[0]);
  if (active && payload.length) {
    return (
      <div className="chart__tooltip">
        <p>{ payload[0].name }: { payload[0].value }%</p>
      </div>
    );
  }
  return null;
}

function Race(props) {
  const { feature } = props;
  const { properties } = feature;
  const raceLabels = ['White', 'Black', 'Hispanic', 'Asian', 'Native American', 'Other race', 'Multiracial']
  const raceKeys = ['white_pct', 'black_pct', 'hispanic_pct', 'asian_pi_pct', 'nat_am_pct', 'other_pct', 'multiracial_pct'];

  const chartContainerRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 300,
  });

  const raceData = raceKeys.map((k, i) => ({
    race: raceLabels[i],
    pct: Number.isNaN(+properties[raceKeys[i]]) ? 0 : parseFloat((100 * properties[raceKeys[i]]).toFixed(1)),
  }))
  .sort((a, b) => b.pct - a.pct);

  console.log(raceData);

  // return (
  //   <div ref={ chartContainerRef } className="chart__container race__chart">
  //     {/*<Table  className='source__table' striped hover responsive>    
  //       <tbody>
  //       { raceData.map((r, i) => (
  //         <tr key={i}>
  //           <td>{ r.race }</td>
  //           <td>{ r.pct }%</td>
  //         </tr>
  //       ))}
  //       </tbody>
  //     </Table>*/}
  //     <PieChart
  //       width={dimensions.width}
  //       height={dimensions.height}
  //       data={ data }
  //       series={ <PieArcSeries doughnut={true} /> }
  //     />
  //   </div>  
  // );
  return (
    <div className="chart__container race__chart">
      <ResponsiveContainer>
        <PieChart>
          <Pie 
            data={ raceData } 
            nameKey='race' 
            dataKey="pct" 
            cx="50%" 
            cy="50%" 
            innerRadius={45} 
            outerRadius={90} 
            fill="#4085FF" label> 
            {/*<LabelList dataKey="name" position="top" />*/}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Race;