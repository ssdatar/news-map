function Legend() {
  const legendColor = [
    [5, '#feebe2'],
    [10, '#fbb4b9'],
    [15, '#f768a1'],
    [20, '#c51b8a'],
    [25, '#7a0177']];

  const legend = legendColor.map((num, i) => (
    <div className="legend__categ">
      <div key={ num[1] } className={`legend__categ--box legend__categ--box-${i}`} style={{ background: num[1] }}></div>
      <div key={ num[0] } className={`legend__categ--text`}>{ num[0] }
        {
          (i === 4) ? ' or more news sources': ''
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