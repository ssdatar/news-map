import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import Tooltip from './Tooltip';
import ReactDOM from 'react-dom';

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGF0YXJrYWxsb28iLCJhIjoiY2toOXI3aW5kMDRlZTJ4cWt0MW5kaHg4eCJ9.V4NfOecIoFaErvFv_lfKLg';

const Map = (props) => {
  const mapContainerRef = useRef(null);
  const popupRef = useRef(new mapboxgl.Popup({ offset: 15 }));
  const { source, fill } = props;

  // console.log(props);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-105.358887, 39.113014],
      zoom: 6
    });

    map.on('load', () => {
      console.log(source);
      map.addSource('colorado', {
        type: 'geojson',
        data: source,
      });

      map.addLayer({
        id: 'colorado',
        type: 'fill',
        source: 'colorado',
        paint: fill.paint,
      });

      // change cursor to pointer when user hovers over a clickable feature
      map.on('mouseenter', e => {
        if (e.features.length) {
          map.getCanvas().style.cursor = 'pointer';
        }
      });

      // reset cursor to default when user is no longer hovering over a clickable feature
      map.on('mouseleave', () => {
        map.getCanvas().style.cursor = '';
      });

      // // add tooltip when users mouse move over a point
      // map.on('mousemove', e => {
      //   const features = map.queryRenderedFeatures(e.point);
      //   if (features.length) {
      //     const feature = features[0];

      //     // Create tooltip node
      //     const tooltipNode = document.createElement('div');
      //     ReactDOM.createRoot(<Tooltip feature={feature} />, tooltipNode);

      //     // Set tooltip on map
      //     tooltipRef.current
      //       .setLngLat(e.lngLat)
      //       .setDOMContent(tooltipNode)
      //       .addTo(map);
      //   }
      // });

      map.on('click', 'colorado', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['colorado'],
        });
        
        if (features.length > 0) {
          const feature = features[0];
          
          // create popup node
          const popupNode = document.createElement('div');
          ReactDOM.render(<Tooltip feature={feature} />, popupNode);
          
          popupRef.current
            .setLngLat(e.lngLat)
            .setDOMContent(popupNode)
            .addTo(map);

          props.passData(feature);
        }
      });
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className='map-container' ref={mapContainerRef} style={{width: '100%', height: 450}} />
    </div>
  );
};

export default Map;