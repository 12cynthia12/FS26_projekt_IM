FS26_IM2_Semesterprojeket

CYNTHIA LÜTHI
ABGABE: 07.06.2026

PROJEKTTITEL:
sunneuf- und undergang / rund um d welt

PROJEKTBESCHREIBUNG:
Die Webseite zeigt eine interaktive Weltkarte, auf der man sich die Sonnenauf- und unterganszeiten von sieben Städten, verteilt auf der Welt, anzeigen lassen kann. Die Tag/Nacht-Grenze sowie die Golden-Hour werden live auf der Karte dargestellt.

FEATURES:

- interaktive Weltkarte mit live Tag/Nacht-Grenze
- golden Hour visualisierung auf der Karte
- bei Anklicken der Stadt-Marker öffnet sich Info-card zur jeweiligen Stadt
  - darauf zu sehen sind:
    - Stadtnamen
    - Lottie-Animation, welche den aktuellen Sonnenstand der Stadt anzeigt
    - lokale Sonnenauf- und Untergangszeit
- UTC-Uhr, welche bei Klick auf eine Stadt zur lokalen Zeit wechselt
- Info-Card und Time-Box wechselt Farbe je nach Tageszeit (Tag/Golden Hour/Nacht)

VERWENDETE TOOLS:

- html, css, javascrips, json
- Sonnenzeiten-API (https://sunrise-sunset.org/api)
- Leaflet (https://leafletjs.com/)
  - Karte
  - Terminator (Tag/Nacht-Grenze)
- Lottie-Files (https://lottiefiles.com/)

API:
https://api.sunrise-sunset.org/json?lat={lat}&lng={lng}&formatted=0&tzid={timezone}
