import React from 'react';

const Tooltip = ({ feature }) => {
  const { id } = feature.properties;

  return (
    <div id={`tooltip-${id}`}>
      <p><strong>County:</strong> { feature.properties.NAME }</p>
      <p><strong>Total news sources:</strong> { feature.properties.total_sources }</p>
    </div>
  );
};

export default Tooltip;