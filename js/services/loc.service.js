import { storageService } from "./storage.service.js"
import { controller } from "../app.controller.js"
import { utilService} from "../services/utils.service.js"
import { mapService } from "./map.service.js"

export const locService = {
    getLocs,
    addLoc,
    deleteLoc,
    getLocById,
    setTitle,
}

let locs
const LOCATIONS_KEY = 'locationsDB'

_createLocs()




function addLoc(name, lat, lng) {

    locs.push({id: utilService.getId(), name, address:'', lat, lng, weather: 'cold', createdAt: new Date().toLocaleString(), updatedAt: ''})
    
    const lastLoc = locs[locs.length - 1]

    controller.getWeather(lastLoc.lat, lastLoc.lng)
        .then((weather) => {setWeather(weather, lastLoc)})
        .then(() => {return mapService.getAddress(lastLoc.lat, lastLoc.lng)})
        .then((addressStr) => {setAddress(addressStr, lastLoc)})
        .then(_saveToStorage)
        
}

function deleteLoc(locId) {
    const locIdx = _getLocIdxById(locId)
    locs.splice(locIdx, 1)
    _saveToStorage()
}




// Getters
function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 500)
    })
}

function getLocById(id) {
    return locs.find(loc => loc.id === id)
}

// SETTERS
function setTitle(locId, title) {
    const loc = getLocById(locId)
    loc.name = title
    _saveToStorage()
}

function setWeather(weather, loc) {
    const {description} = weather.weather[0]
    loc.weather = description
    return Promise.resolve()
}

function setAddress(addressStr, loc) {
    console.log('addressStr', addressStr);
    loc.address = addressStr
    return Promise.resolve()
}






function _getLocIdxById(id) {
    return locs.findIndex(loc => loc.id === id)
}

function _saveToStorage() {
    storageService.save(LOCATIONS_KEY, locs)
}

function _createLocs() {
    const loadedLocs = storageService.load(LOCATIONS_KEY)
    
    if (!loadedLocs || !loadedLocs.length) {
        locs = [
            {id: utilService.getId(), name: 'Greatplace', lat: 32.047104, lng: 34.832384, weather: 'sunny', createdAt: new Date().toLocaleString(), updatedAt: ''}, 
            {id: utilService.getId(), name: 'Neveragain', lat: 32.047201, lng: 34.832581, weather:'cold', createdAt: new Date().toLocaleString(), updatedAt: ''}
        ]
        _saveToStorage()
    }

    locs = loadedLocs
}


