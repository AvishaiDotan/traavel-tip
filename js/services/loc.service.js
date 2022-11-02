import { storageService } from "./storage.service.js"
import { utilService } from "./utils.service.js"

export const locService = {
    getLocs,
    addLoc,
    deleteLoc,
}

let locs
const LOCATIONS_KEY = 'locationsDB'

_createLocs()



function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

function addLoc(name, lat, lng) {
    locs.push({id: utilService.getId(), name, lat, lng, weather: 'cold', createdAt: Date.now(), updatedAt: ''})
    _saveToStorage()
}

function deleteLoc(locId) {
    const locIdx = _getLocIdxById(locId)
    locs.splice(locIdx, 1)
    _saveToStorage()
}

function _getLocIdxById(id) {
    return locs.findIndex(loc => loc.id === id)

}

function _saveToStorage() {
    storageService.save(LOCATIONS_KEY, locs)
}

function _createLocs() {
    locs = (storageService.load(LOCATIONS_KEY)) ? storageService.load(LOCATIONS_KEY) : 
    [
        {id: utilService.getId(), name: 'Greatplace', lat: 32.047104, lng: 34.832384, weather: 'sunny', createdAt: Date.now(), updatedAt: ''}, 
        {id: utilService.getId(), name: 'Neveragain', lat: 32.047201, lng: 34.832581, weather:'cold', createdAt: Date.now() + 500, updatedAt: ''}
    ]
}


