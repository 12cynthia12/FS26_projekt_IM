console.log("willkommen bei 'sunneuf- und untergang / rund um d welt' und viel spass!");

// mobile: horizontales scrollen
const isMobile = window.innerWidth < 768;
const center = isMobile ? [30, 0] : [53, 0];

// karte erstellen, desktop: keinen zoom/scroll erlauben, 
const map = L.map('map', { // L. ruft leaflet auf
    minZoom: 2, maxZoom: 2, zoomControl: false, 
    dragging: isMobile, touchZoom: false,
    scrollWheelZoom: false, doubleClickZoom: false, 
    maxBounds: [[-90, -180], [90, 180]], // karte endet an grenze
    maxBoundsViscosity: 1.0 // harte grenze, kein scrollen über rand
}).setView(center, 2);

if (isMobile) {
    map.on('drag', function() {
        const center = map.getCenter();
        // nur horizontales scrollen erlauben
        map.setView([30, center.lng], map.getZoom(), {animate: false});
        // info card beim scrollen schliessen
        document.getElementById('info-card').classList.add('hidden-card');
        activeCity = null; // setzt aktuelle stadt zurück
    });
};

// karte unsichtbar laden, macht dass karte nicht unendlihc ist, sondern nur einmal gezeigt wird
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    noWrap: true,
    bounds: [[-90,-180], [90,180]],
    opacity: 100,
}).addTo(map);

// golden hour (ca 1h um terminator)
const goldenHourMorning = L.terminator({
    fillColor: '#F08A12',
    fillOpacity: 0.2,
    color: 'transparent',
    interactive: false,
    time: new Date(Date.now() - 80 * 60 * 1000)
}).addTo(map);

// golden hour (ca 1h um terminator)
const goldenHourEvening = L.terminator({
    fillColor: '#F08A12',
    fillOpacity: 0.2,
    color: 'transparent',
    interactive: false,
    time: new Date(Date.now() + 80 * 60 * 1000)
}).addTo(map);

// tag/nacht-grenze hinzufügen
L.terminator({
    fillColor: '#2E3F57',
    fillOpacity: 0.8,
    interactive: false,
}).addTo(map);

// städte mit koordinaten
// lat = latitude = breitengrad / lng = longitude = längengrad
// cardX oder Y für anzeige der card an einem bestimmten punkt
const cities = [
    {name: "züri", lat: 47.37, timezone:"Europe/Zurich", lng:  8.54, cardX: '65%', cardY: '50%'},
    {name: "reykjavík", lat: 64.13, timezone:"Atlantic/Reykjavik", lng: -21.89, cardX: '32%', cardY: '42%'},
    { name: "vancouver", lat: 49.28, timezone:"America/Vancouver", lng: -123.12, cardX: '15%', cardY: '50%'},
    { name: "nairobi", lat: -1.29, timezone:"Africa/Nairobi", lng:  36.82, cardX: '70%', cardY: '70%'},
    { name: "brasília", lat: -15.78, timezone:"America/Sao_Paulo", lng: -47.93, cardX: '30%', cardY: '75%'},
    { name: "kalkutta", lat: 22.57, timezone:"Asia/Kolkata", lng:  88.36, cardX: '78%', cardY: '50%'},
    { name: "auckland", lat: -36.86, timezone:"Pacific/Auckland", lng: 174.76, cardX: '83%', cardY: '55%'},
];

// punkt für jede stadt setzen
cities.forEach(city => {
    // eigenes icon, statt von leaflet standart-icon, mit hover effekt
    const icon = L.divIcon({
        className: 'marker-hover',
        html: '<div class="marker"></div>',
        iconSize: [14,14], // grösse des klickbereichs
        iconAnchor: [7,7], // mitte des icons sitzt auf koordinaten
    });
    const marker = L.marker([city.lat, city.lng], {icon}).addTo(map);

    // bei klick
    marker.on('click', function(){
        const card = document.getElementById('info-card');
        if (!isMobile) {
            card.style.left = city.cardX;
            card.style.top = city.cardY;
        }
        fetchSunData(city);
        document.getElementById('city-name').textContent = city.name;
        document.getElementById('info-card').classList.remove('hidden-card');
        showCityTime(city); // stadtzeit aktivieren
    });
});

// klick auf karte schliesst infocard
map.on('click', function() {
    activeCity = null;
    document.getElementById('info-card').classList.add('hidden-card');
})

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

    const phase = getDayPhase(data.results.sunrise, data.results.sunset);
    applyPhaseStyle(phase); // ändert farbe der info-card
    // zeiten in card anzeigen
    document.getElementById('sunrise').textContent = sunrise;
    document.getElementById('sunset').textContent = sunset;

    // sonnenstand bei animation korrekt darstellen
    const sunPosition = calcSunPosition(data.results.sunrise);
    const lottie = document.getElementById('lottie'); 
    // animation auf richtigen frame setzen (192 ist letzter)
    // sunPosition (0-1) * 192 frames = genauer frame (mittag ist frame 0)
    const adjustedProcess = (sunPosition - 0.5 + 1) % 1;
    // frame ausrechnen und auf ganze zahl runden 
    const frame = Math.round(adjustedProcess * 192);
    lottie.load('animation/animation_sun.json');
    lottie.addEventListener('ready', () => {
        lottie.seek(frame); // zum berechneten frame springen
        lottie.pause(); // animation soll da stehen
    }, {once: true}); // eventlistener wird nach ausführung entfernt
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

// berechnung des sonnenstands (0 mitternacht / 0.5 mittag / 1 wieder mitternacht)
function calcSunPosition(sunriseISO) { // ISO = standard format für daten
    // mithilfe der zeitzone
    const offsetString = sunriseISO.slice(-6); //letzte sechs zeichen (also z.B: +12:00)
    const sign = offsetString[0] == '+' ? 1 : -1; // vorzeichen für ost / west
    // stunden und minuten
    const offsetHours = parseInt(offsetString.slice(1, 3));
    const offsetMinutes = parseInt(offsetString.slice(4, 6));
    const totalOffsetMinutes = sign * (offsetHours * 60 + offsetMinutes);
    const nowUTC = new Date(); // aktuelle UTC holen
    // UTC-minuten + offset = lokale zeit 
    const localMinutes = (nowUTC.getUTCHours() * 60 + nowUTC.getUTCMinutes() + totalOffsetMinutes + 1440) % 1440;
    return localMinutes / 1440;
}

let activeCity = null;

startUTCClock();
function startUTCClock() {
    function update() {
        // aktuelle zeit in stunden, minuten und sekonden holen
        const now = new Date();
        if (activeCity) { // lokale zeit anzeigen (von der aktiven stadt)
            const localTime = now.toLocaleTimeString('de-CH', { // in schweizer format ausgeben
                timeZone: activeCity.timezone,
                hour: '2-digit', minute: '2-digit', second: '2-digit',
            });
            document.getElementById('city-time-name').textContent = activeCity.name; // stadtname als label schreiben
            document.getElementById('city-time-time').textContent = localTime;
        } else { // uct zeigen
            const h = String(now.getUTCHours()).padStart(2, '0');
            const m = String(now.getUTCMinutes()).padStart(2, '0');
            const s = String(now.getUTCSeconds()).padStart(2, '0');
            document.getElementById('city-time-name').textContent = 'UTC'; // UCT als label schreiben
            document.getElementById('city-time-time').textContent = `${h}:${m}:${s}`;
        }
    }
    update(); // ausführen
    setInterval(update, 1000); // jede sekunde wiederholen
}

function showCityTime(city) {
    activeCity = city; // speichert aktive stadt
}

// tageszeiten für card-farben berechnen
function getDayPhase(sunriseISO, sunsetISO) {
    const now = Date.now();
    const sunrise = new Date(sunriseISO).getTime();
    const sunset = new Date(sunsetISO).getTime();
    const oneHour = 60 * 60 * 1000; // eine stunde in millisekunden

    if (now < sunrise || now > sunset) {
        return 'night';
    } else if (now < sunrise + oneHour || now > sunset - oneHour) {
        return 'golden';
    } else {
        return 'day';
    }
}

function applyPhaseStyle(phase) {
    const card = document.getElementById('info-card');
    const timeBox = document.getElementById('city-time');

    if (phase == 'night') {
        card.style.background = 'rgba(84, 102, 127, 0.3)';
        card.style.border = '1px solid rgba(84, 102, 127, 0.5)';
        timeBox.style.background = 'rgba(84, 102, 127, 0.3)';
        timeBox.style.border = '1px solid rgba(84, 102, 127, 0.5)';
    } else if (phase == 'golden') {
        card.style.background = 'rgba(245, 208, 149, 0.4)';
        card.style.border = '1px solid rgba(245, 208, 149, 0.7)';
        timeBox.style.background = 'rgba(245, 208, 149, 0.4)';
        timeBox.style.border = '1px solid rgba(245, 208, 149, 0.7)';
    } else {
        card.style.background = 'rgba(255, 255, 255, 0.2)';
        card.style.border = '1px solid rgba(255, 255, 255, 0.5)';
        timeBox.style.background = 'rgba(255, 255, 255, 0.2)';
        timeBox.style.border ='1px solid rgba(255, 255, 255, 0.5)';
    }
}