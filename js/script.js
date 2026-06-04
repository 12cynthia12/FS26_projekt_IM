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
// cardX oder Y für anzeige der card an einem bestimmten punkt
const cities = [
    {name: "züri", lat: 47.37, timezone:"Europe/Zurich", lng:  8.54, cardX: '25%', cardY: '45%'},
    {name: "reykjavík", lat: 64.13, timezone:"Atlantic/Reykjavik", lng: -21.89, cardX: '24%', cardY: '40%'},
    { name: "vancouver", lat: 49.28, timezone:"America/Vancouver", lng: -123.12, cardX: '17%', cardY: '50%'},
    { name: "nairobi", lat: -1.29, timezone:"Africa/Nairobi", lng:  36.82, cardX: '58%', cardY: '83%'},
    { name: "brasília", lat: -15.78, timezone:"America/Sao_Paulo", lng: -47.93, cardX: '20%', cardY: '70%'},
    { name: "kalkutta", lat: 22.57, timezone:"Asia/Kolkata", lng:  88.36, cardX: '80%', cardY: '60%'},
    { name: "auckland", lat: -36.86, timezone:"Pacific/Auckland", lng: 174.76, cardX: '83%', cardY: '60%'},
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

    // bei klick
    marker.on('click', function(){
        const card = document.getElementById('info-card');
        card.style.left = city.cardX;
        card.style.top = city.cardY;
        fetchSunData(city);
        document.getElementById('city-name').textContent = city.name;
        document.getElementById('info-card').classList.remove('hidden-card');
    })
});

// sonnenzeiten von api für stadt abrufen
async function fetchSunData(city) {
    // fügt api ein, in der api werden automatisch längen- und breitengrade der stadt eingegeben
    // &formatted=0&tzid=${city.timezone} zeigt die zeiten als in richtiger zeitzone der stadt 
    const url = `https://api.sunrise-sunset.org/json?lat=${city.lat}&lng=${city.lng}&formatted=0&tzid=${city.timezone}`;
    const response = await fetch(url);
    const data = await response.json();
    // zeit in daten suchen
    const sunrise = formatTime(data.results.sunrise);
    const sunset = formatTime(data.results.sunset);
    // zeiten in card anzeigen
    document.getElementById('sunrise').textContent = sunrise;
    document.getElementById('sunset').textContent = sunset;
}

// UTC in einfache uhrzeit umwandeln ('2026-06-02T03:13:58+00:00' → '03:13')
function formatTime(isoString) {
    // lokale zeit aus string lesen
    // split('T')[1] teilt string in zwei teile:
    // [0] = '2026-06-04' (datum) und [1] = '05:29:00+02:00' (zeit) 
    const timePart = isoString.split('T')[1];
    // teilen bei doppelpunkt in stunden, minuten (und sekunden/zeitzone)
    const h = timePart.split(':')[0];
    const m = timePart.split(':')[1];
    // stunden und minuten mit doppelpunkt zusammensetzen
    return `${h}:${m}`;
}
