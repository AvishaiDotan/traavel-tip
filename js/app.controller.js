import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

export const controller = {
    getWeather,
    renderWeather,
}


window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSendSearch = onSetSearch;
window.onCopyAddress = onCopyAddress
window.onPanTo = onPanTo
window.onDeleteLoc = onDeleteLoc
window.onCloseInfoWidow = onCloseInfoWidow
window.onSetTitle = onSetTitle



function onInit() {
    setCurrentLocationByQueryParams()
    getWeather(mapService.initLocation.lat, mapService.initLocation.lng)
        .then(renderWeather)

    mapService.initMap()
        .then(mapService.renderMarkers)
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

function renderWeather(weather){
    const {temp} = weather.main
    const {description} = weather.weather[0]

    document.querySelector('.weather-container .heading').innerText = `${description}, ${temp} celsius` 
}




// on Functions
function onPanTo(lat, lng) {
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

function onSetSearch(val) {
    mapService.setSearch(val)
    // document.querySelector('.user-pos').innerText = val.toUpperCase()
}



// Getters
function getWeather(lat, lng){
    const WETH_API = 'a6250b674e919a78ea206f38e4dab46d'
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${WETH_API}`)
    .then(({data}) => {return data})
}

function onGetLocs() {
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

function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
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


function onSetTitle(locId) {
    const title = document.querySelector(`.title-text`).value
    locService.setTitle(locId, title)
    mapService.closeInfoWindow()
    renderApp()

}


