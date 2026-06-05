FS26_IM2_Semesterprojeket

CYNTHIA LÜTHI
ABGABE: 07.06.2026

SUNNEUF- UND UNTERGANG / RUND UM D WELT

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

HERAUSFORDERUNGEN UND LEARNINGS:

- die eigene Figma-SVG-WEltkarte konnte nicht exakt über Leaflet-Karte gelegt werden
- der Terminator von Leaflet lässt sich nicht auf die Kartengrenze beschränken und wiederholt sich quasi unendlich bis an den Viewport-Rand
- die zwei Golden-Hour-Flächen überlappen sich (was man durch den blur fast nicht mehr sehen kann) und sie können auch nicht ganz genau berechnet werden. Aber da die Tag/Nacht-Grenze genau berechnet ist, ergänzt die golden Hour das Bild visuell extrem gut und ist fast exakt.
- auf der Karte wird rechts ein Teil von Russland abgeschnitten und wird links auf der Karte an Amerika angefügt. Die Geografie stimmt so natürlich, rein visuell wäre es aber schöner gewesen, hätte ich den Ausschnitt verschieben können, damit Russland an einem Stück rechts in der Karte zu sehen ist.
- das horizontale Scrollen in der MobileVersion verschiebt die Karte manchmal leicht in der Y Achse, obwohl ich diese so gut wie möglich fixiert hatte

FAZIT
Trotz der technischen Einschränkung von Leaflet bin ich sehr zufrieden mit meinem Resultat. Die Kernfunktion (das Abrufen der Sonnenzeiten der API) konnte ich darstellen und mit der Lottie-Animation (Sonnenstand) visuell unterstützen. Die Tag/Nacht-Visualisierung (vor welcher ich ziemlich respekt hatte) funktioniert auch, auch wenn man diese vielleicht noch perfekter programmieren könnte.
