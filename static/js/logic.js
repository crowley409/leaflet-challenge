// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add a tile layer (OpenStreetMap is commonly used)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load earthquake data from USGS GeoJSON Feed
$.getJSON('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson', function (data) {
    console.log(data); // Check the console for the loaded data
    processEarthquakeData(data.features);
});

// Function to process earthquake data and add markers
function processEarthquakeData(features) {
    // Loop through each earthquake feature and add a marker to the map
    features.forEach(function (feature) {
        var mag = feature.properties.mag;
        var depth = feature.geometry.coordinates[2];

        // Customize the marker size based on magnitude and color based on depth
        var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: mag * 2, // Adjust the factor for a better visual effect
            color: getColor(depth),
            fillOpacity: 0.7
        });

        // Create a popup with additional information
        var popupContent = `<b>${feature.properties.place}</b><br>Magnitude: ${mag}<br>Depth: ${depth}`;
        marker.bindPopup(popupContent);

        // Add the marker to the map
        marker.addTo(map);
    });

    // Create a legend and overlay on the map
    var legend = L.control({ position: 'topright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        // Customize your legend content here
        div.innerHTML = '<p><strong>Legend</strong></p>';
        div.innerHTML += '<i style="background: green"></i> Depth < 10<br>';
        div.innerHTML += '<i style="background: yellow"></i> 10 <= Depth < 30<br>';
        div.innerHTML += '<i style="background: red"></i> Depth >= 30<br>';
        return div;
    };

    legend.addTo(map);
    legend.getContainer().innerHTML = document.getElementById('map-legend').innerHTML;
}

// Define a function to get color based on depth
function getColor(depth) {
    // Customize this function based on your depth criteria
    if (depth < 10) {
        return 'green';
    } else if (depth < 30) {
        return 'yellow';
    } else {
        return 'red';
    }
}