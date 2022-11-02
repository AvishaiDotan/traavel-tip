// import { storageService } from "./storage.service";
import { locService } from "./loc.service.js";

export const mapService = {
    initMap,
    addMarker,
    panTo,
    sendLocation,
    renderMarkers,
}


// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi().then(() => {
        gMap = new google.maps.Map(
            document.querySelector('#map'), {
            center: { lat, lng },
            zoom: 15
        })
    })
        .then(_addListener)
        .then(renderMarkers)
}

function renderMarkers() {
    return locService.getLocs()
        .then(markers =>
            {
                markers.forEach(({ title, lat, lng }) => {
                    new google.maps.Marker({
                        position: { lat, lng },
                        map: gMap,
                        title: title,
                    })
                })

                return Promise.resolve(markers)
            })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!',
    })

    locService.addLoc('hello world', loc.lat(), loc.lng())
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
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

function sendLocation(val) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${val}&key=AIzaSyAUa9etRbJHXatY5NPGcT4Qej9HqCsTqTg`)
        .then(res => {
            console.log(res)
            let data = res.data.results[0].geometry.location
            var laLatLng = new google.maps.LatLng(data.lat, data.lng)
            gMap.panTo(laLatLng)
        })
        .catch(console.log)
}


function _addListener() {
    gMap.addListener("click", (event) => {
        onAddMarker(event.latLng);
    });

    return Promise.resolve()
}