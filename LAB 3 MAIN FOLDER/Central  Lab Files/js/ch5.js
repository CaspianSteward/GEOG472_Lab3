
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// Global Parameters
var map;
var map2;
var minValue;
var dataStats = {};
document.addEventListener('DOMContentLoaded', createMap1)
document.addEventListener('DOMContentLoaded', createMap2)


// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// createMap();

    function createMap1(){
        // creates the editable map bits, sets a center and a zoom
        map = L.map('map', {
            center: [40, -95],
            zoom: 4,    
            maxZoom: 5,
            minZoom: 0
        }); 

        // adds the tiled basemap
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
            minZoom: 0,
            maxZoom: 5,
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
        var attribute = "POPULATION"
        var geoJSONMarkerOptions =  {
            radius: 8,
            fillColor: "lightblue",
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        L.geoJSON(data, {
            pointToLayer: pointToLayer
        }).addTo(map);
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
                minValue = calculateMinValue(json)
                createPropSymbols(json);
                calcStats(json);
                createLegend(json);
            })
    }
// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //



// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// calculateMinValue()

    function calculateMinValue(data){
        var allValues = [];
        for (var NAME of data.features){
            var value = NAME.properties["POPULATION"]
            allValues.push(value)
         }  
        var minValue = Math.min(...allValues)
        return minValue;
    }
    
// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //

// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// calcPropRadius()

    function calcPropRadius(attValue) {
        var minRadius = 1.5;
        var radius = 1.008 * Math.pow(attValue/minValue,0.5)*minRadius

        return radius;
    };

// calcStats()

    function calcStats(data){
        var allValues = [];
        for (var NAME of data.features){
            var value = NAME.properties["POPULATION"]
            allValues.push(value)
         }  
        dataStats.min = Math.min(...allValues)
        dataStats.max = Math.max(...allValues)
        var sum = allValues.reduce(function(a,b){return a+b});
        dataStats.mean = sum / allValues.length;
    }
    
// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //

// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// pointToLayer()

    function pointToLayer(feature, latlng){
        var attribute = "POPULATION";
        var options = {
            fillColor: "lightblue",
            color: "lightblue",
            weight: 2,
            opacity: 0.5,
            fillOpacity: 0.075
        };

        var attValue = Number(feature.properties[attribute]);
        options.radius = calcPropRadius(attValue);
        var layer = L.circleMarker(latlng, options);    
        var formatted = new Intl.NumberFormat('en-US').format(feature.properties.POPULATION)

        var popupContent = "<p><h3>" + feature.properties.NAME + "</h3></p>" + "<p><b> Population : </b> " + formatted + "</p>"
        layer.bindPopup(popupContent);
        return layer;
    };


// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //


// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// createLegend()

    function createLegend(attributes){
        var LegendControl = L.Control.extend({
            options: {
                position: 'bottomright' 
            },
            onAdd: function(map) {
                var container = L.DomUtil.create('div', 'legend-control-container');
                container.innerHTML = '<p> Population </p>'

                var maxRadius = calcPropRadius(dataStats.max); 

                var svg = '<svg id ="attribute-legend" width="130px" height="180px">';
                var circles = ["max", "mean", "min"]    

                for (var i=0; i<circles.length; i++){
                    var radius = calcPropRadius(dataStats[circles[i]]);
                    var cy = 105 - radius
    
                    svg+= '<circle class = "legend-circle" id="' + circles[i] +
                        '" r="' + radius + 
                        '" cy="' + cy + '"' +
                        ' fill="lightblue" fill-opacity="0.5" stroke="#000" cx = "60"/>';
                };
                svg += "</svg>";
                container.innerHTML += svg;       

                return container;
            }

        });
        map.addControl(new LegendControl());
    };  
// // ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //

// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
// createMap2();

    function createMap2(){
        // creates the editable map bits, sets a center and a zoom
        map2 = L.map('map2', {
            center: [45, -106],
            zoom: 2,    
        }); 

        // adds the tiled basemap
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
            minZoom: 0,
            maxZoom: 5,
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'png'
        }).addTo(map2);
        statesData()
    };

    function statesData(){
        fetch("data/statesinfo.geojson")
            .then(function(response){
                return  response.json();
            })
            .then(function(json){
                createStatesBorders(json)
                separateStates(json)
            })
    }
    function createStatesBorders(data){
        L.geoJSON(data, {
            // run the pointToLayer Function //
        }).addTo(map2);
    }

var stateCoords = [];

    function separateStates(data) {
        for (var NAME of data.features) {
            stateCoords.push({
                name: NAME.properties.NAME,
                coords: NAME.geometry.coordinates
                pops: NAME.properties.POPULATION
            });
        }
        console.log(stateCoords)
        pullCities();
    }

var cityCoords = [];

    function pullCities () {
        fetch("data/majorcities.geojson")
            .then(function(response){
                return response.json();
            })
            .then(function(json){
                separateCities(json)
            })
    }

    function separateCities(data) {
        for (var NAME of data.features) {
            cityCoords.push({
            population: NAME.properties.POPULATION,
            coords: NAME.geometry.coordinates })
        }
        console.log(cityCoords)
    }

    // function assignStates(data){
    //     for (var NAME of data.features) {
    //         for (var name of stateCoords) {
    //             var coords = name.coords
    //             if (coords.contains(NAME.geometry.coordinates)){console.log(name)}
    //         }
    //     }
    // }


// ><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>< //
