
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// Global Parameters
var map;
var minValue;
document.addEventListener('DOMContentLoaded', createMap)


// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// createMap();

    function createMap(){
        // creates the editable map bits, sets a center and a zoom
        map = L.map('map', {
            center: [40, -95],
            zoom: 4});

        // adds the tiled basemap
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
            minZoom: 0,
            maxZoom: 20,
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'png'
        }).addTo(map);
        // runs the getData(); function
        getData();
    };

// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //


// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// createPropSymbols()

    function createPropSymbols(data){
        var attribute = "POPULATION";
        var geoJSONMarkerOptions =  {
            radius: 8,
            fillColor: "lightblue",
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                // var attValue = Number(feature.properties[attribute]);
                // geoJSONMarkerOptions.radius = calcPropRadius(attValue)
                return L.circleMarker(latlng, geoJSONMarkerOptions)
            }
        }).addTo(map)
    }
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //

// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// getData()

    function getData(){
        fetch("data/majorcities.geojson")
            .then(function(response){
                return  response.json();
            })
            .then(function(json){
                // minValue = calculateMinValue(json)
                createPropSymbols(json);
            })
    }
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //



// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// // calculateMinValue()

//     function calculateMinValue(data){
//         var allValues = [];
//         for (var NAME of data.features){
//             var value = NAME.properties["POPULATION" + String(NAME)];
//                 allValues.push(value)
//             }
//         var minValue = Math.min(...allValues)
//         return minValue;
//     }  
// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //

// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// // calcPropRadius()

//     function calcPropRadius(attValue) {
//         var minRadius = 6;
//         var radius = 1.0083 * Math.pow(attValue/minValue,0.5715)*minRadius

//         return radius;
//     };
// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
