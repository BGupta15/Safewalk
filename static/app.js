let positions = [];
let stopTimer = null;

function startTrip() {
  document.getElementById("status").innerText = "Trip started... tracking you.";
  
  navigator.geolocation.watchPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      const location = { lat: latitude, lng: longitude, timestamp: Date.now() };
      positions.push(location);

      document.getElementById("status").innerText = `Location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

      checkStop();
    },
    err => console.error(err),
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  );
}

function checkStop() {
  if (positions.length < 2) return;

  const last = positions[positions.length - 1];
  const prev = positions[positions.length - 2];

  const dist = getDistance(last, prev);
  if (dist < 10) { // not moved more than 10m
    if (!stopTimer) {
      stopTimer = setTimeout(triggerSOS, 60000); // 60 seconds
      document.getElementById("status").innerText = "No movement... checking in soon!";
    }
  } else {
    clearTimeout(stopTimer);
    stopTimer = null;
  }
}

function getDistance(p1, p2) {
  const R = 6371e3;
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(p2.lat - p1.lat);
  const dLon = toRad(p2.lng - p1.lng);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) *
            Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function triggerSOS() {
  const latest = positions[positions.length - 1];
  fetch('/sos', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ user: "Brinda", location: latest })
  }).then(res => res.json())
    .then(data => {
      document.getElementById("status").innerText = "🚨 SOS sent to contacts!";
    });
}
