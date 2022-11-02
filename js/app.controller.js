import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'



window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSendSearch = onSendSearch;
window.onCopyAddress = onCopyAddress

let markers = [];


function onInit() {
    const Location = { lat: 29.5577, lng: 34.9519 };
    mapService.initMap()
        .then(renderSavedLocations)
        .catch(() => console.log('Error: cannot init map'))
        
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

    window.onPanTo = onPanTo
    window.onDeleteLoc = onDeleteLoc

    document.querySelector('.saved-loc-container').innerHTML = strHTMLs.join('')
}


function onAddMarker(position) {
    mapService.addMarker(position)
    renderApp()
}

function onGetLocs(ev) {
    console.log();
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
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

function onPanTo(lat, lng) {
    mapService.panTo(lat, lng)
}

function onSendSearch(val) {
    console.log('Search val', val)
    mapService.sendLocation(val)
<<<<<<< HEAD
    // document.querySelector('.user-pos').innerText = val.toUpperCase()
    

=======
    document.querySelector('.user-pos').innerText = val.toUpperCase()
>>>>>>> e1fd4b55442fd6261a9f1b14b24d71b51055fe05
}

function onDeleteLoc(locId) {
    locService.deleteLoc(locId)
    renderApp()
}

function onCopyAddress() {
    getPosition()
        .then((pos) => {
            const address = `https://github.io/me/travelTip/index.html?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}` 
            navigator.clipboard.writeText(address);
        })
    
}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}