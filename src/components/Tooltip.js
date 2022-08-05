import React from 'react';

const Tooltip = ({ feature }) => {
  const { id } = feature.properties;
  const { properties } = feature;

  if (properties.hasOwnProperty('Original') && properties.hasOwnProperty('Local')) {
    const totalOriginal = properties['Original'] + properties['Not Original'];

    return (
      <div id={`tooltip-${id}`}>
        <h4 className='tooltip__hed'><strong>{ properties.NAME } County</strong></h4>
        <p className='tooltip__text'><strong>Total news sources:</strong> { properties.total_sources }</p>      

        <p className='tooltip__text'><strong>Originality of news sources:</strong></p> 
        <p className='tooltip__text'>{ properties['Original'] } original and { properties['Not Original'] } non-original stories.</p>
        <p className='tooltip__text'><strong>Locality of news sources:</strong></p>
        <p className='tooltip__text'>{ properties['Local'] } local and { properties['Not Local'] } non-local stories.</p>
      </div>
    );
  }

  return (
    <div id={`tooltip-${id}`}>
      <h4 className='tooltip__hed'><strong>{ properties.NAME } County</strong></h4>
      <p><strong>Total news sources:</strong> { properties.total_sources }</p>
    </div>
  );
};

export default Tooltip;