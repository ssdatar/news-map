import React from 'react';

const Tooltip = ({ feature }) => {
  const { id } = feature.properties;

  return (
    <div id={`tooltip-${id}`}>
      <h4 className='tooltip__hed'><strong>{ feature.properties.NAME } County</strong></h4>
      <p><strong>Total news sources:</strong> { feature.properties.total_sources }</p>
    </div>
  );
};

export default Tooltip;