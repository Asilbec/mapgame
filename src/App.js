import './App.css';
import randomStreetView from 'random-streetview';
import React, { useState, useEffect } from 'react';
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  StreetViewPanorama
} from "react-google-maps";

function Map() {
  const [marker, newMarker] = useState()
  const OPTIONS = {
    minZoom: 4,
    maxZoom: 18,
  }
  return (
    <GoogleMap
      defaultZoom={4}
      options={OPTIONS}
      defaultCenter={{ lat: 45.4211, lng: -75.6903 }}
      onClick={(event) => {
        document.getElementById('lat').innerHTML = event.latLng.lat()
        document.getElementById('lng').innerHTML = event.latLng.lng()
        newMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() })
      }}><Marker position={marker} />
    </GoogleMap>);
}
function streetview(props) {
  const mapOptions = {
    disableDefaultUI: true,
    enableCloseButton: false,
    showRoadLabels: false
  };
  return (
    <GoogleMap
      defaultCenter={{ lat: 40.403154441461346, lng: -80.06076967448335 }}
    >
      <StreetViewPanorama
        position={{ lat: props.lat, lng: props.lng }}
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
const StreetView = withScriptjs(withGoogleMap(streetview));
function App() {

  function newArea() {
    const lat1 = document.getElementById('lat').innerHTML
    const lng1 = document.getElementById('lng').innerHTML
    const lat2 = points.lat
    const lng2 = points.lng

    console.log("difference is " + calcCrow(lat1, lng1, lat2, lng2))
    document.getElementById('differnce').innerHTML = calcCrow(lat1, lng1, lat2, lng2)
    newview()
  }



  const [points, newPoints] = useState({
    lat: 40.403154441461346, lng: -80.06076967448335
  })

  function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var latOne = toRad(lat1);
    var latTwo = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(latOne) * Math.cos(latTwo);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  function newview() {
    randomStreetView.getRandomLocations(1).then(function (response) {
      console.log("lat: " + response[0][0] + " lng : " + response[0][1])
      newPoints({
        lat: response[0][0],
        lng: response[0][1]
      })
    })
  }
  // Converts numeric degrees to radians
  function toRad(Value) {
    return Value * Math.PI / 180;
  }
  useEffect(() => {
    newview()

  }, []);
  return (
    <div className='App'>
      <div className='game'>
        <div className="map" >
          <MapWrapped
            googleMapURL={"https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCea_aNWrtFKwa63zn0e3xpkpBTe2QYAFU"}
            loadingElement={<div className='loadingStuff' />}
            containerElement={<div className='loadingStuff' />}
            mapElement={<div className='loadingStuff' />}
          />
        </div>
        <div className='section'>
          <div className="map">
            <StreetView
              lat={points.lat}
              lng={points.lng}
              googleMapURL={"https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCea_aNWrtFKwa63zn0e3xpkpBTe2QYAFU"}
              loadingElement={<div className='loadingStuff' />}
              containerElement={<div className='loadingStuff' />}
              mapElement={<div className='loadingStuff' />}
            />
          </div>
          <div className='infoContainer'>
            <button onClick={() => newArea()} id='submit'></button>
            <div className='textinfo'>

              <p id='differnce'>the difference is : </p>
            </div>
            <div className='hidden'>
              <h1 id='lat'>?</h1>
              <h1 id='lng'>?</h1>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default App;
