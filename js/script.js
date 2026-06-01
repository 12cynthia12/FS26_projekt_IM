console.log("blub");

// karte erstellen, keinen zoom erlauben, keine interaktionen erlauben
const map = L.map('map', {
    minZoom: 2, maxZoom: 2, zoomControl: false, 
    dragging: false, scrollWheelZoom: false, doubleClickZoom: false, 
}).setView([50, 0],2);
// karte laden, macht dass karte nicht unendlihc ist, sondern nur einmal gezeigt wird
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    noWrap: true,
    bounds: [[-90,-180], [90,180]]
}).addTo(map)