import './App.css';
import { useState } from 'react';
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  StreetViewPanorama,
} from "react-google-maps";
function Map() {
  const center = { lat: 40.403154441461346, lng: -80.06076967448335 };
  const mapOptions = {
    disableDefaultUI: true,
    enableCloseButton: false
  };

  return (
    <GoogleMap
      defaultCenter={{ lat: 40.403154441461346, lng: -80.06076967448335 }}
    >
      <StreetViewPanorama
        position={center}
        enableCloseButton={false}
        linksControl={false}
        addressControl={true}
        visible={true}
        onLoad={(e) => { }}
        motionTracking={true}
        motionTrackingControl={true}
        options={mapOptions
        }

      />
    </GoogleMap>
  )
}



const MapWrapped = withScriptjs(withGoogleMap(Map));

function App() {

  function Trap(props) {
    const [marker, newMarker] = useState({ lat: 0, lng: 0 })

    function updateEverything(Event) {
      console.log(Event.latLng.lng())
      newMarker(
        { lat: Event.latLng.lat(), lng: Event.latLng.lng() })
    }
    return (
      <GoogleMap
        defaultZoom={0}
        defaultCenter={{ lat: 40.403154441461346, lng: -80.06076967448335 }}
        options={{
          streetViewControl: false,
        }}
        onClick={(Event) => {
          updateEverything(Event)
          console.log('nice')
          document.getElementById('lat').innerHTML = (Event.latLng.lat()).toFixed(2)
          document.getElementById('lng').innerHTML = (Event.latLng.lng()).toFixed(2)

        }
        }

      >
        {props.isMarkerShown && <Marker position={marker} />}

      </GoogleMap>
    )
  }
  const UserMapWrapped = withScriptjs(withGoogleMap(Trap));

  return (
    <div className="App">
      <div className='container'>
        <MapWrapped
          googleMapURL={'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCea_aNWrtFKwa63zn0e3xpkpBTe2QYAFU'}
          loadingElement={<div className='nice' />}
          containerElement={<div className='nice' />}
          mapElement={<div className='nice' />}
        />
      </div>
      <div id='button' className='container'>
        <UserMapWrapped
          isMarkerShown={true}
          googleMapURL={'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCea_aNWrtFKwa63zn0e3xpkpBTe2QYAFU'}
          loadingElement={<div className='nice' />}
          containerElement={<div className='nice' />}
          mapElement={<div className='nice' />}
        />
        <div className='submit'>
          <h1 id='lat'>lat</h1>
          <h1 id='lng'>lat</h1>
          <button></button>
        </div>
      </div>

    </div>
  );
}

export default App;
