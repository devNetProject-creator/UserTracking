let map;
let userMarkers = {};
let userColors = {};

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: { lat: 37.7749, lng: -122.4194 } // Default center (San Francisco)
    });

    navigator.geolocation.watchPosition(function (position) {
        let userLocation = {
            userId: userId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        if (!userMarkers[userId]) {
            userColors[userId] = getRandomColor();
            userMarkers[userId] = new google.maps.Marker({
                map: map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 7,
                    fillColor: userColors[userId],
                    fillOpacity: 1,
                    strokeWeight: 1
                },
                title: userId
            });
        }

        let latlng = new google.maps.LatLng(userLocation.latitude, userLocation.longitude);
        userMarkers[userId].setPosition(latlng);
        map.setCenter(latlng);

        connection.invoke("UpdateLocation", userLocation);
    });
}

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/locationHub")
    .build();

connection.on("ReceiveLocation", function (location) {
    if (!userMarkers[location.userId]) {
        userColors[location.userId] = getRandomColor();
        userMarkers[location.userId] = new google.maps.Marker({
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: userColors[location.userId],
                fillOpacity: 1,
                strokeWeight: 1
            },
            title: location.userId
        });
    }

    let latlng = new google.maps.LatLng(location.latitude, location.longitude);
    userMarkers[location.userId].setPosition(latlng);
});

connection.start().then(function () {
    initMap();
});
