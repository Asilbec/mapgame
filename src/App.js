import './App.css';
import randomStreetView from 'random-streetview';
import React, { useState } from 'react';
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  StreetViewPanorama,
  Polyline,
} from "react-google-maps";

function Map(props) {
  const [marker, newMarker] = useState({ lat: 0, lng: 0 })
  const OPTIONS = {
    minZoom: 2,
    maxZoom: 18,
    streetViewControl: false,
    fullscreenControl: false
  }
  const path = [
    { lat: props.lat, lng: props.lng },
    { lat: marker.lat, lng: marker.lng }
  ];

  const option = {
    geodesic: false,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  }
  let iconMarker = new window.google.maps.MarkerImage(
    "https://www.freeiconspng.com/uploads/pushpin-png-13.png",
    null, /* size is determined at runtime */
    null, /* origin is 0,0 */
    null, /* anchor is bottom center of the scaled image */
    new window.google.maps.Size(32, 32)
  );
  let iconMarker2 = new window.google.maps.MarkerImage(
    "https://www.freepnglogos.com/uploads/target-png/target-logo-png-transparent-svg-vector-bie-supply-35.png",
    null, /* size is determined at runtime */
    null, /* origin is 0,0 */
    null, /* anchor is bottom center of the scaled image */
    new window.google.maps.Size(32, 32)
  );
  return (
    <GoogleMap
      defaultZoom={4}
      options={OPTIONS}
      defaultCenter={{ lat: 45.4211, lng: -75.6903 }}
      onClick={(event) => {
        if (props.newMarkerStuff === true) {
          document.getElementById('lat').innerHTML = event.latLng.lat()
          document.getElementById('lng').innerHTML = event.latLng.lng()
          newMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() })
        }
      }}><Marker position={marker} icon={iconMarker}></Marker>
      <Marker icon={iconMarker2} visible={props.state}
        position={{ lat: props.lat, lng: props.lng }} />
      <Polyline options={option} visible={props.state} path={path}>
      </Polyline>
    </GoogleMap>);
}
function streetview(props) {
  const mapOptions = {
    enableCloseButton: false,
    showRoadLabels: false,
    motionTracking: false,
    panControl: true,
    linksControl: true
  };

  return (
    <GoogleMap
      defaultCenter={{ lat: -8.77790, lng: 5.94421 }}
    >
      <StreetViewPanorama
        position={{ lat: props.lat, lng: props.lng }}
        enableCloseButton={false}
        addressControl={true}
        visible={true}
        onLoad={(e) => { }}
        options={mapOptions
        }
      />
    </GoogleMap>
  )
}
const MapWrapped = withScriptjs(withGoogleMap(Map));
const StreetView = withScriptjs(withGoogleMap(streetview));






function App() {
  const [round, newRound] = useState(0)
  const [roundpoints, addtopoints] = useState(0)
  const [markerState, newMarkerState] = useState(false)
  const [markerStatus, newmarkerStatus] = useState(true)
  const [points, newPoints] = useState({
    lat: -8.77790, lng: 5.94421
  })

  function newArea() {
    const lat1 = document.getElementById('lat').innerHTML
    const lng1 = document.getElementById('lng').innerHTML
    const lat2 = points.lat
    const lng2 = points.lng
    document.getElementById('nice').style.width = '100vw'
    document.getElementById('nice').style.height = '100vh'
    document.getElementById('nice').style.padding = '0px'
    document.getElementById('submitButton').style.display = 'none'
    document.getElementById('infoshown').style.display = 'grid'
    newMarkerState(true)
    document.getElementById('totalDifference').innerText = 'Total difference is ' + (calcCrow(lat1, lng1, lat2, lng2)).toFixed(2) + ' km'
    document.getElementById('currentRoundScore').innerText = 'Total points ' + (distancetoScore((calcCrow(lat1, lng1, lat2, lng2)).toFixed(2))).toFixed(2) + '/10,000'
    addtopoints(roundpoints + distancetoScore((calcCrow(lat1, lng1, lat2, lng2)).toFixed(2)))

    newmarkerStatus(false)
  }


  function changeWidth() {
    if (markerState === false) {
      document.getElementById('nice').style.width = '30vw'
      document.getElementById('nice').style.height = '30vw'
    }
  }

  function changeBack() {
    if (markerState === false) {
      document.getElementById('nice').style.width = '20vw'
      document.getElementById('nice').style.height = '20vw'
    }
  }

  function distancetoScore(distance) {
    if (distance > 10000) {
      return 0
    }
    else {
      return 10000 - distance
    }
  }


  function beginGame() {
    newRound(0)
    addtopoints(0)
    newview()
    setTimeout(() => {
      document.getElementById('games').style.display = 'flex'
      document.getElementById('menu').style.display = 'none'
      document.getElementById('resultsPage').style.display = 'none'

    }, 1000);
  }

  function returntoScreen() {
    document.getElementById('games').style.display = 'none'
    document.getElementById('menu').style.display = 'flex'
    document.getElementById('resultsPage').style.display = 'none'
    newRound(0)
    addtopoints(0)
  }


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

  function killtimer() {
    document.getElementById('nice').style.width = '20vw'
    document.getElementById('nice').style.height = '20vw'
    document.getElementById('submitButton').style.display = 'inline'
    document.getElementById('infoshown').style.display = 'none'
    document.getElementById('nice').style.padding = '2px'
    newmarkerStatus(true)
    newMarkerState(false)
    if (round > 4) {
      finishgame()
    }
    else {
      newview()

    }
  }


  function newview() {
    randomStreetView.getRandomLocations(1).then(function (response) {
      newPoints({
        lat: response[0][0],
        lng: response[0][1]
      })
      newRound(round + 1)
    })
  }

  function finishgame() {
    document.getElementById("games").style.display = 'none'
    document.getElementById("resultsPage").style.display = 'grid'
  }


  // Converts numeric degrees to radians
  function toRad(Value) {
    return Value * Math.PI / 180;
  }
  return (
    <div className='App'>
      <div className='game' id='games'>
        <div className='roundcounter'>
          <p>Round : {round}</p>
          <p>score : {roundpoints.toFixed(2)}</p>
        </div>
        <div className='mapFunction'>
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
        </div>
        <div className="map" onMouseLeave={() => changeBack()} onMouseEnter={() => changeWidth()} id='nice' >
          <MapWrapped
            id='streetviewmap'
            newMarkerStuff={markerStatus}
            googleMapURL={"https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCea_aNWrtFKwa63zn0e3xpkpBTe2QYAFU"}
            loadingElement={<div className='loadingStuff' />}
            containerElement={<div className='loadingStuff' />}
            mapElement={<div className='loadingStuff' />}
            lat={points.lat}
            lng={points.lng}
            state={markerState}
          />
          <div id='info'>
            <h1 id='lat'>?</h1>
            <h1 id='lng'>?</h1>
            <button onClick={() => newArea()} id='submitButton'>Submit</button>
          </div>
          <div id='infoshown'>
            <h1 id='totalDifference'>Total difference : </h1>
            <h1 id='currentRoundScore'>Points Given : </h1>
            <button id='nextbutton' onClick={() => killtimer()}>Next</button>

          </div>
        </div>
      </div>
      <div id='menu'>
        <button id='begin' onClick={() => beginGame()}>Start</button>
      </div>
      <div id='resultsPage'>
        <div className='totalScore'>
          <h1 id='total'>{roundpoints.toFixed(2)}/{round * 10000}</h1>
        </div>
        <h1 id='percentage'>{(roundpoints / (round * 10000) * 100).toFixed(1)}%</h1>
        <div className='bar'>
          <div className='outerline' style={{ width: (roundpoints / (round * 10000) * 100) + '%' }}>
            <div id='loadinggif'></div>
          </div>
        </div>
        <button id='news' onClick={() => returntoScreen()}>Start over</button>

      </div>
    </div>
  );
}

export default App;
