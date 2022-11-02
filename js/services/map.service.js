import { locService } from "./loc.service.js";
import { controller } from "../app.controller.js"


const initLocation = {lat: 31.776738250628863, lng: 35.23448467254639}
const initTitle = 'Edit Text'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    setSearch,
    renderMarkers,
    closeInfoWindow,
    initLocation,
}


let map
let currInfoWindow
let markers = []



function initMap(lat = initLocation.lat, lng = initLocation.lng) {
    return _connectGoogleApi().then(() => {
        map = new google.maps.Map(
            document.querySelector('#map'), {
            center: { lat, lng },
            zoom: 15
        })
    })
        .then(_addListener)
}

function renderMarkers() {
    return locService.getLocs()
        .then(locations => {
            markers.forEach(marker => marker.setMap(null));
            markers = locations.map(({ id, name, lat, lng }) => {

                const marker = new google.maps.Marker({
                    position: { lat, lng },
                    map: map,
                    title: name,
                })

                const contentString =
                    `<article>
                    <h2>Change Location Title</h2>
                    <label>Location Name
                        <input class="title-text .${id}" type="text" value="${name}">
                    </label>
                    <div class="marker-modal-actions">
                        <button class="set-title-action" onclick="onSetTitle('${id}')">Save</button>
                        <button onclick="onCloseInfoWidow('${id}')">Cancel</button>
                    </div>
                    </article>`

                const infoWindow = new google.maps.InfoWindow({
                    content: contentString,
                });

                marker.addListener("click", () => {
                    if (currInfoWindow) currInfoWindow.close()
                    currInfoWindow = infoWindow

                    infoWindow.open({
                        anchor: marker,
                        gMap: map,
                    });

                })

                return marker
            })
            return Promise.resolve(locations)
        })
}


function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: map,
        title: initTitle,
    })

    markers.push(marker)
    locService.addLoc(initTitle, loc.lat(), loc.lng())
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    map.panTo(laLatLng)
}

function closeInfoWindow() {
    currInfoWindow.close()
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = `AIzaSyAxdXNT9j1GWz7kU5pwAK8bMSR2OJ0Bg6Q` //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function setSearch(val) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${val}&key=AIzaSyAxdXNT9j1GWz7kU5pwAK8bMSR2OJ0Bg6Q`)
        .then(res => {
            let data = res.data.results[0].geometry.location
            panTo(data.lat,data.lng)
<<<<<<< HEAD
            controller.getWeather(data.lat,data.lng)
                .then(controller.renderWeather)
=======
            getWeather(data.lat,data.lng)
            // var LatLng = new google.maps.LatLng(data.lat, data.lng)
            // map.panTo(LatLng)
>>>>>>> 1f06fda3a0ff15f8465a822ec83956a0bde3889d
        })
        .catch(console.log)
}


function _addListener() {
    map.addListener("click", (event) => {
        onAddMarker(event.latLng);
    });

    return Promise.resolve()
}