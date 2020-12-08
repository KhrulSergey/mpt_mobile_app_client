(function() {
    document.addEventListener('message', function(e) {
        var jsonData = JSON.parse(e.data);
        if (jsonData) {
            if (jsonData.regions) {
                regionSelect(jsonData.regions);
            } else if (jsonData.remove) {
                map.removeLayer(tiles);
                map.remove();
            }
        }
    });
})();

var map = L.map('map', {
    center: [66, 94],
    zoom: 3,
    maxBounds: [[-60, -180], [85, 180]], // [[40.45, 18.11], [82.05, 179.65]]
    maxBoundsViscosity: 1,
    doubleClickZoom: false,
    zoomControl: false,
    attributionControl: false
});

var zoomControl = L.control.zoom({ position: 'bottomright' });
map.addControl(zoomControl);

// https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw
var tiles = L.tileLayer('tiles/{z}/{x}/{y}.png', {
    minZoom: 3,
    maxZoom: 8
    /*,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'*/
    // id: 'mapbox.light'
});
tiles.addTo(map);

function style(feature) {
    return {
        weight: 0,
        opacity: 1,
        // color: '#596B7F',
        dashArray: '3',
        fillOpacity: 0
        // fillColor: '#76D7EA'
    };
}

var geojson;

var prevTargets = null;
var prevRegion = null;

function onClick(e) {
    var dataToSend = JSON.stringify({
        region: e.target.feature.properties,
        coords: { x: e.originalEvent.x, y: e.originalEvent.y }
    });
    window.postMessage(dataToSend);
    if (prevRegion !== e.target.feature.properties.ref) {
        zoomToFeature(e.target);
    }
}

function resetStyle(targets) {
    var len = targets.length;
    var i = 0;
    for (i = 0; i < len; i++) {
        geojson.resetStyle(targets[i]);
    }
}

function zoomToFeature(targets) {
    if (targets.length === 1) {
        prevRegion = targets[0].feature.properties.ref;
    }
    if (prevTargets) {
        resetStyle(prevTargets);
    }
    var len = targets.length;
    var i = 0;
    var regionBounds = [];
    for (i = 0; i < len; i++) {
        regionBounds.push(targets[i].getBounds());
        targets[i].setStyle({
            weight: 2,
            color: '#4BD0AA',
            dashArray: '',
            fillOpacity: 0.5
        });
        targets[i].bringToFront();
    }
    map.fitBounds(regionBounds, {
        maxZoom: 8,
        animate: false,
        duration: 0,
        easeLinearity: 1,
        noMoveStart: true
    });
    prevTargets = targets;
}

function onEachFeature(feature, layer) {
    layer.on({
        click: onClick
    });
}

geojson = L.geoJson(regionsData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

function regionSelect(regions) {
    var len = regions.length;
    var i = 0;
    var regionsToSelect = [];
    for (i = 0; i < len; i++) {
        for (var prop in geojson._layers) {
            if (geojson._layers.hasOwnProperty(prop)) {
                if (geojson._layers[prop].feature.properties && geojson._layers[prop].feature.properties.ref === regions[i].ref) {
                    // zoomToFeature(geojson._layers[prop]);
                    regionsToSelect.push(geojson._layers[prop]);
                    break;
                }
            }
        }
    }
    zoomToFeature(regionsToSelect);
}
