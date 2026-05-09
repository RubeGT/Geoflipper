let panorama, guessMap, targetLatLng, userGuessMarker;
let score = 0;

const locations = [
    { lat: 48.8584, lng: 2.2945 }, // Paris
    { lat: 40.7128, lng: -74.0060 }, // NYC
    { lat: 35.6895, lng: 139.6917 }, // Tokyo
    { lat: -22.9519, lng: -43.2105 }  // Rio
];

function initGame() {
    const randomLoc = locations[Math.floor(Math.random() * locations.length)];
    targetLatLng = randomLoc;

    // Initialize Street View
    panorama = new google.maps.StreetViewPanorama(
        document.getElementById("street-view"),
        {
            position: targetLatLng,
            addressControl: false, // Disables standard address overlay
            showRoadLabels: false,
            zoomControl: true
        }
    );

    // Initialize Mini-map for guessing
    guessMap = new google.maps.Map(document.getElementById("guess-map"), {
        center: { lat: 0, lng: 0 },
        zoom: 1,
        streetViewControl: false,
        mapTypeControl: false
    });

    // Place marker on click
    guessMap.addListener("click", (e) => {
        if (userGuessMarker) userGuessMarker.setMap(null);
        userGuessMarker = new google.maps.Marker({
            position: e.latLng,
            map: guessMap
        });
    });

    document.getElementById("guess-btn").addEventListener("click", calculateScore);
}

function calculateScore() {
    if (!userGuessMarker) return alert("Place a marker first!");

    const guessPos = userGuessMarker.getPosition();
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(targetLatLng.lat, targetLatLng.lng),
        guessPos
    );

    // Simple scoring: 5000 max, decreases with distance
    const roundScore = Math.max(0, Math.floor(5000 - (distance / 2000)));
    score += roundScore;
    
    alert(`Distance: ${(distance / 1000).toFixed(2)} km\nScore: ${roundScore}`);
    document.getElementById("score-display").innerText = `Score: ${score}`;
    
    // Reset for next round
    initGame();
}
