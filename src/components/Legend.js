import { mapColor } from './utils';

function Legend() {
  let legendColor = mapColor().concat([[18, '#001181']]);
  console.log(legendColor)

  const legend = legendColor.map((num, i) => (
    <div className="legend__categ">
      <div key={ num[1] } className={`legend__categ--box legend__categ--box-${i}`} style={{ background: num[1] }}></div>
      <div key={ num[0] } className={`legend__categ--text`}>{ num[0] }
        {
          (i === 5) ? ' or more news sources': ''
        }
      </div>
    </div>
  ));

  return (
    <div key='legend' className="legend">
      { legend }
    </div>
  )
}

export default Legend;