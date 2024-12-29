const socket = io();
// to check it the browser has navigator feature
if (navigator.geolocation) {
  // fnc to find out the position
  navigator.geolocation.watchPosition(
    (position) => {
      // from position find out latitude and longitude from coords keys
      const { latitude, longitude } = position.coords;
      // send these lat & long to backend
      socket.emit('send-location', { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    // some additional properties like highly accurate tracking, no caching and refresh in 5s
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
}
// to integrate map layout on your index with default lat/long and zoom point
const map = L.map('map').setView([0, 0], 16);

// adding openstreet map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

// to set the pointer on map
const markers = {};

// receives the location from backend
socket.on('receive-location', (data) => {
  // extract id,lat/long
  const { id, latitude, longitude } = data;
  // center the map on new coordinates
  map.setView([latitude, longitude]);
  // if marker exist then update its position
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  }
  // otherwise create new marker with new coords
  else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id])
        delete markers[id]
    }
})

