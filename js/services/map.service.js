export const mapService = {
    initMap,
    addMarker,
    panTo,
    sendLocation
}

var gMarkers = [];

// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('initMap')
    return _connectGoogleApi().then(() => {
        console.log('google available')
        gMap = new google.maps.Map(
            document.querySelector('#map'), {
            center: { lat, lng },
            zoom: 15
        })
        console.log('Map!', gMap)
    })
        .then(() => {
            gMap.addListener("click", (event) => {
                addMarker(event.latLng);
            });

        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    markers.push(marker);
    console.log(marker);
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    console.log('gg');
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
}