import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import ReactDOM from 'react-dom';
import Tooltip from './Tooltip';
// import Legend from './Legend';

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGF0YXJrYWxsb28iLCJhIjoiY2toOXI3aW5kMDRlZTJ4cWt0MW5kaHg4eCJ9.V4NfOecIoFaErvFv_lfKLg';

const Map = (props) => {
  const mapContainerRef = useRef(null);
  const popupRef = useRef(new mapboxgl.Popup({ offset: 15 }));
  const { source, fill } = props;
  console.log(fill.paint);
  const isMobile = window.innerWidth < 600 ? true: false;
  const zoom = isMobile ? 5 : 6;
  const height = isMobile ? 300 : 450;
  const bounds = [
    [36.34551832917399, -109.85188785617123], // southwestern corner of the bounds
    [41.77721285520039, -100.80719442257701] // northeastern corner of the bounds
  ].map(d => d.reverse());

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-105.358887, 39.113014],
      zoom: zoom,
      minZoom: zoom,
      maxZoom: 6,
      maxBounds: bounds
    });

    map.fitBounds(bounds);

    // map.fitBounds([
    //   [-109.059196, 36.992751], // southwestern corner of the bounds
    //   [-102.042126,41.001982] // northeastern corner of the bounds
    // ]);

    let hoveredStateId = null;

    const resetFeature = (id) => {
      map.removeFeatureState({
        source: 'colorado',
        id: id
      });
    };

    map.on('load', () => {
      map.addSource('colorado', {
        type: 'geojson',
        data: source,
        promoteId: 'AFFGEOID',
        // generateId: true,
      });

      map.addLayer({
        id: 'colorado',
        type: 'fill',
        source: 'colorado',
        paint: fill.paint,
      });

      // // change cursor to pointer when user hovers over a clickable feature
      // map.on('mouseenter', e => {
      //   if (e.features.length) {
      //     map.getCanvas().style.cursor = 'pointer';
      //   }
      // });

      // reset cursor to default when user is no longer hovering over a clickable feature
      map.on('mouseout', 'colorado', () => {
        map.getCanvas().style.cursor = '';
        // resetFeature(hoveredStateId);
        
        if (hoveredStateId) {
          resetFeature(hoveredStateId);
          popupRef.current.remove();  
        }
      });

      // add tooltip when users mouse move over a point
      map.on('mousemove', 'colorado', e => {
        const features = map.queryRenderedFeatures(e.point);
        
        if (features.length > 0) {
          map.getCanvas().style.cursor = 'pointer';
          
          const feature = features[0];
          
          // create popup node
          const popupNode = document.createElement('div');
          ReactDOM.render(<Tooltip feature={feature} />, popupNode);
          
          popupRef.current
            .setLngLat(e.lngLat)
            .setDOMContent(popupNode)
            .addTo(map);

          // props.passData(feature);

          if (hoveredStateId && feature.properties.total_sources > 0) {
            resetFeature(hoveredStateId);
          }
          hoveredStateId = feature.id;

          map.setFeatureState({
            source: 'colorado',
            id: hoveredStateId,
          },
          {
            hover: true,
          });
        }
      });

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

          if (hoveredStateId && feature.properties.total_sources > 0) {
            resetFeature(hoveredStateId);
          }
          hoveredStateId = feature.id;

          map.setFeatureState({
            source: 'colorado',
            id: hoveredStateId,
          },
          {
            hover: true,
          });
        }
      });

      popupRef.current.on('close', () => {
        if (hoveredStateId) {
          resetFeature(hoveredStateId);
        }
      });
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='map'>
      <div className='map__container' ref={mapContainerRef} style={{width: '100%', height: height}} />
    </div>
  );
};

export default Map;