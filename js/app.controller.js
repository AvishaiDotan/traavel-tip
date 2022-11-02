import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

export const controller = {
    getWeather,
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSendSearch = onSendSearch;
window.onCopyAddress = onCopyAddress
window.onPanTo = onPanTo
window.onDeleteLoc = onDeleteLoc
window.onCloseInfoWidow = onCloseInfoWidow
window.onSetTitle = onSetTitle



function onInit() {
    setCurrentLocationByQueryParams()

    mapService.initMap()
        .then(renderSavedLocations)
        .catch((err) => console.log('Error: cannot init map', err)) 
}


function renderApp() {
    mapService.renderMarkers()
        .then(renderSavedLocations)
}

function renderSavedLocations(locations) {
    let strHTMLs = locations.map(({id ,name, createdAt, lat, lng}) => `
                <article>
                    <h2>${name}</h2>
                    <p>${createdAt}</p>
                    <p>${lat}, ${lng}</p>
                    <div class="location-actions">
                        <button onclick="onPanTo(${lat}, ${lng})" class="goto-action" >Go</button>
                        <button onclick="onDeleteLoc('${id}')" class="delete-action">Delete</button>
                    </div>
                </article>
    `)


    document.querySelector('.saved-loc-container').innerHTML = strHTMLs.join('')
}

function onPanTo(lat, lng) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng)
    getWeather(lat, lng)
}

function onDeleteLoc(locId) {
    locService.deleteLoc(locId)
    renderApp()
}

function onCopyAddress() {

    getPosition()
        .then((pos) => {
            const address = `https://avishaidotan.github.io/travel-tip/index.html?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}` 
            navigator.clipboard.writeText(address);
        }) 
}

function onCloseInfoWidow(locId) {
    mapService.closeInfoWindow(locId) 
}

function onAddMarker(position) {
    mapService.addMarker(position)
    renderApp()
}

// Getters
function onGetLocs(ev) {
    locService.getLocs()
        .then(locs => {
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            document.querySelector('.user-pos').innerText = 
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

// SETTERS
function setCurrentLocationByQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);

    const lat = urlParams.get('lat');
    const lng = urlParams.get('lng');

    if (!lat || !lng) return

    onPanTo(lat, lng)
}

function onSendSearch(val) {
    console.log(val);
    mapService.sendLocation(val)
    document.querySelector('.user-pos').innerText = val.toUpperCase()
}

function onSetTitle(locId) {
    const title = document.querySelector(`.title-text`).value
    locService.setTitle(locId, title)
    mapService.closeInfoWindow()
    renderApp()

}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function getWeather(lat, lng){
    const WETH_API = 'a6250b674e919a78ea206f38e4dab46d'
console.log(lat, lng);
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${WETH_API}`)
    .then(res => {
        console.log(res.data);
        renderWeather(res.data.main.temp)
    })
}

function renderWeather(weather){
    document.querySelector('.weather-container .heading').innerText = ' '+ weather + ' Celsius' 
}