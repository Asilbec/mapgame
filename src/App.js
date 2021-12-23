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

import ping from './pictures/pushpin-png-13.png'
import ping2 from './pictures/target.png'
import targetcursor from './pictures/cursortarget.png'
import gif from './pictures/tumblr_335c00f00577e421ec9216a31ce2bcde_d2833a17_1280.gif'





function Map(props) {
  const [marker, newMarker] = useState({ lat: 0, lng: 0 })
  const OPTIONS = {
    minZoom: 2,
    maxZoom: 18,
    streetViewControl: false,
    fullscreenControl: false,
    gestureHandling: 'greedy',
    draggableCursor: targetcursor,
    draggingCursor: targetcursor,
    defaultCursor: targetcursor,
    controlSize: 24,
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
    ping,
    null, /* size is determined at runtime */
    null, /* origin is 0,0 */
    null, /* anchor is bottom center of the scaled image */
    new window.google.maps.Size(32, 32)
  );
  let iconMarker2 = new window.google.maps.MarkerImage(
    ping2,
    null, /* size is determined at runtime */
    null, /* origin is 0,0 */
    new window.google.maps.Point(16, 16), /* anchor is bottom center of the scaled image */
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
  };

  return (
    <GoogleMap
      defaultCenter={{ lat: props.lat, lng: props.lng }}
    >
      <StreetViewPanorama
        position={{ lat: props.lat, lng: props.lng }}
        enableCloseButton={false}
        addressControl={true}
        visible={props.state}
        onLoad={(e) => { console.log('nice') }}
        options={mapOptions
        }
        linksControl={true}
      />
    </GoogleMap>
  )
}
const MapWrapped = withScriptjs(withGoogleMap(Map));
const StreetView = withScriptjs(withGoogleMap(streetview));






function App() {
  const [showStreet, newShown] = useState(true)
  const [maxPoints, newMax] = useState(5000)
  const [shown, notShown] = useState(false)
  const [round, newRound] = useState(0)
  const [roundpoints, addtopoints] = useState(0)
  const [markerState, newMarkerState] = useState(false)
  const [markerStatus, newmarkerStatus] = useState(true)
  const [points, newPoints] = useState({
    lat: -8.77790, lng: 5.94421
  })


  function enlarge() {
    if (shown === true) {
      document.getElementById('nice').style.width = '20px'
      document.getElementById('nice').style.height = '20px'
      notShown(false)

    }
    else {
      document.getElementById('nice').style.display = 'grid'
      document.getElementById('nice').style.width = '100vw'
      document.getElementById('nice').style.height = '70vh'
      notShown(true)

    }
  }


  function newArea() {
    var paraFar = 10
    document.getElementById('loading-break').style.display = 'none'
    if (document.getElementById('selectoptions').value === "1") {
      paraFar = 5000
    }
    else {
      paraFar = 10000
      newMax(10000)
    }

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
    document.getElementById('totalDifference').innerText = 'Total difference is ' + (calcCrow(lat1, lng1, lat2, lng2)).toFixed(3) + ' km'
    document.getElementById('currentRoundScore').innerText = (distancetoScore((calcCrow(lat1, lng1, lat2, lng2)).toFixed(2))).toFixed(1) + '/' + paraFar
    document.getElementById('realscorebar').style.width = (distancetoScore((calcCrow(lat1, lng1, lat2, lng2)).toFixed(2))).toFixed(1) / (paraFar / 100) + '%'
    addtopoints(roundpoints + distancetoScore((calcCrow(lat1, lng1, lat2, lng2)).toFixed(2)))
    newmarkerStatus(false)
  }
  function changeWidth() {
    if (markerState === false) {
      document.getElementById('nice').style.width = '40vw'
      document.getElementById('nice').style.height = '40vw'
    }
  }
  function changeBack() {
    if (markerState === false) {
      document.getElementById('nice').style.width = '20vw'
      document.getElementById('nice').style.height = '20vw'
    }
  }

  function distancetoScore(x) {

    if (document.getElementById('selectoptions').value === "1") {
      if (x > 5000) {
        return 0
      }
      else {
        if (x < 0.05) {
          return 5000
        }
        else {
          return (5000 - (70.710679774997 * Math.sqrt(x)))
        }
      }
    }
    else {
      if (x > 10000) {
        return 0
      }
      else {
        return (10000 - (100 * Math.sqrt(x)))
      }
    }



  }

  function updategame() {
    newRound(0)
    addtopoints(0)
  }


  function beginGame() {
    updategame()
    newview()
    document.getElementById('games').style.display = 'flex'
    document.getElementById('menu').style.display = 'none'
    document.getElementById('resultsPage').style.display = 'none'
    moveback()
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
    document.getElementById('loading-break').style.display = 'flex'
    setTimeout(() => {

      if (window.innerWidth < 600) {
        document.getElementById('nice').style.width = '0vw'
        document.getElementById('nice').style.height = '0vw'
      } else {
        document.getElementById('nice').style.width = '20vw'
        document.getElementById('nice').style.height = '20vw'
        console.log('nice')
      }
      document.getElementById('submitButton').style.display = 'inline'
      document.getElementById('infoshown').style.display = 'none'
      document.getElementById('nice').style.padding = '0px'
      newmarkerStatus(true)
      newMarkerState(false)

      if (round > 4) {
        finishgame()
        setTimeout(() => {
          document.getElementById('loading-break').style.display = 'none'

        }, 2700)
      }
      else {
        newview()
        setTimeout(() => {
          document.getElementById('loading-break').style.display = 'none'

        }, 2700)
      }
    }, 10);
  }

  function showDirections() {
    const state = document.getElementById('playintro').style.display

    if (state === 'block') {
      document.getElementById('playintro').style.display = 'none'
      document.getElementById('playintro').style.transition = '1s ease-in'

    }
    else {
      document.getElementById('playintro').style.display = 'block'
    }
  }

  function newview() {
    randomStreetView.setHighCpuUsage()

    if (document.getElementById('selectoptions').value === "1") {
      randomStreetView.setParameters({
        google: null,
        polygon: [[[55.775719492458784, 178.79332565783884], [47.74675218156385, -39.75047981907571], [13.47831833717081, -68.63839027176307], [24.036582764988257, -129.08819556550753]]]
      })
    }
    else {
      randomStreetView.setParameters({
        google: null
      })
    }


    randomStreetView.getRandomLocations(1).then(function (response) {
      newPoints({
        lat: response[0][0],
        lng: response[0][1]
      })
      newRound(round + 1)
    })
  }

  function finishgame() {
    document.getElementById("resultsPage").style.display = 'flex'
    document.getElementById("games").style.display = 'none'
  }

  function moveback() {
    newShown(false)
    setTimeout(() => { newShown(true) }, 300)
  }

  // Converts numeric degrees to radians
  function toRad(Value) {
    return Value * Math.PI / 180;
  }
  return (
    <div className='App'>
      <div className='game' id='games'>
        <div className='roundcounter'>
          <p>Round : {round}/5</p>
          <p>score : {roundpoints.toFixed(2)}</p>
        </div>
        <div className='mapFunction'>
          <div id='refresher' className="map">
            <StreetView
              id='flsajd'
              lat={points.lat}
              lng={points.lng}
              state={showStreet}
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
            <button onClick={() => enlarge()} id='largebutton'>Extend</button>
          </div>
          <div id='infoshown'>
            <h1 id='totalDifference'>Total difference : </h1>
            <div className='scorebar'>
              <div id='realscorebar'>
                <div id='loadingscorebar'>
                  <h1 id='currentRoundScore'>Points Given : </h1>
                </div>
              </div>
            </div>
            <button id='nextbutton' onClick={() => killtimer()}>Next</button>

          </div>
        </div>
      </div>
      <div id='menu'>
        <div className='menucontent'>
          <button id='begin' className='text-white' onClick={() => beginGame()}>Start</button>
          <div className='inputCountry'>
            <label id='useless'>Select:</label>
            <select id='selectoptions'>
              <option selected value="1">North America</option>
              <option value="2">The World</option>
            </select>
          </div>

          <div className='howtoplay'>
            <button id='howotoplay' onClick={() => showDirections()}>Directions</button>
            <p id='playintro'>
              <ul>
                <li>
                  Click Start
                </li>
                <li>
                  Get randomly placed anywhere in the world
                </li>
                <li>
                  Use the map in the corner to place a ping into where you think you are
                </li>
                <li>
                  Try to get close as possible
                </li>
                <li>
                  Points are rewarded based on a 10,000 km radius
                </li>
                <li>
                  <mark>Recent Changes: Fixed the map going back to small size - credit to Kaitlin Teyssier</mark>
                </li>
                <li>
                  <mark>Upcoming changes: (hint system) - credit to Ethan Snyder</mark>
                </li>
              </ul>
            </p>
          </div>
        </div>
      </div>
      <div id='resultsPage'>
        <div className='resultsPageCont'>
          <div className='resultsPageContOne'>
            <h1 id='total'>{roundpoints.toFixed(2)}/{round * maxPoints}</h1>

            <div className='bar'>
              <div className='outerline' style={{ width: (roundpoints / (round * maxPoints) * 100) + '%' }}>
                <div id='loadinggif'>
                  <h1 id='percentage'>{(roundpoints / (round * maxPoints) * 100).toFixed(1)}%</h1>

                </div>

              </div>

            </div>
            <button id='news' onClick={() => returntoScreen()}>Start over</button>
          </div>
        </div>


      </div>
      <div id='loading-break'>
        <img id='breakimagg' alt='none' src={gif}></img>
      </div>
    </div>
  );
}

export default App;
