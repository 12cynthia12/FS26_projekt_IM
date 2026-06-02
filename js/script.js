console.log("blub");

// karte erstellen, keinen zoom erlauben, keine interaktionen erlauben
// L. ruft leaflet auf
const map = L.map('map', {
    minZoom: 2, maxZoom: 2, zoomControl: false, 
    dragging: false, scrollWheelZoom: false, doubleClickZoom: false, 
}).setView([50, 0],2);


// karte unsichtbar laden, macht dass karte nicht unendlihc ist, sondern nur einmal gezeigt wird
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    noWrap: true,
    bounds: [[-90,-180], [90,180]],
    opacity: 100,
}).addTo(map);


// tag/nacht-grenze hinzufügen
L.terminator({
    fillColor: '#2E3F57',
    fillOpacity: 0.77,
    interactive: false,
}).addTo(map);

// städte mit koordinaten
// lat = latitude = breitengrad / lng = longitude = längengrad
const cities = [
    {name: "züri", lat: 47.37,  lng:  8.54},
    {name: "reykjavík", lat: 64.13,  lng: -21.89 },
    { name: "toronto",   lat: 43.70,  lng: -79.42 },
    { name: "nairobi",   lat: -1.29,  lng:  36.82 },
    { name: "são paulo", lat: -23.55, lng: -46.63 },
    { name: "mumbai",    lat: 19.07,  lng:  72.87 },
    { name: "sydney",    lat: -33.86, lng: 151.20 },
];

// punkt für jede stadt setzen
cities.forEach(city => {
    // eigenes icon, statt von leaflet standart-icon, mit hover effekt
    const icon = L.divIcon({
        className: 'marker-hover',
        html: '<div class="marker"></div>',
        iconSize: [14,14], // grösse des klickbereichs
        iconAnchor: [7,7], // mitte des icons sitzt auf koordinaten
    })
    const marker = L.marker([city.lat, city.lng], {icon}).addTo(map);
});
