
document.addEventListener("DOMContentLoaded", () => {
const socket = io()

if(navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords
        console.log('Sending location:', { latitude, longitude });
        socket.emit("send-location", { latitude, longitude })
    },
    (error) => {
        console.log(error.message)
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
 )
}

var map = L.map('map').setView([0, 0], 16)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const marker = {}
socket.on("received-location", (data) => {
    const { id, latitude, longitude } = data
    console.log('Received location:', data);
    map.setView([latitude, longitude])
    if(marker[id]) {
        marker[id].setLatLng([latitude, longitude])
    }
    else {
        marker[id] = L.marker([latitude, longitude]).addTo(map)
    }
})

socket.on("user-disconnected", (id) => {
    if(marker[id]) {
        map.removeLayer(marker[id])
        delete marker[id]
    }
})

})