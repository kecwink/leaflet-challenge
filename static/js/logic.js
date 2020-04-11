// Creating our initial map object
var myMap = L.map("map", {
  center: [39.7392, -104.9903],
  zoom: 5
});

// Adding a tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);

// Store API url
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-04-09&endtime=" +
  "2020-04-10&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
//console.log(url)


function quakeMagnitude(magnitude) {
  return magnitude * 10000
}

// Grab the data with d3
d3.json(queryUrl, function (data) {
  //console.log(data.features)

  for (var i = 0; i < data.features.length; i++) {

    // get the latitude and longitude for each earthquake
    var long = data.features[i].geometry.coordinates[0]
    var lat = data.features[i].geometry.coordinates[1]
    
    
  //create different colored circles based on the magnitude of the earthquake
  var color = "";
  if (data.features[i].properties.mag >6.1) {
    color = "brown";
  }
  else if (data.features[i].properties.mag > 5.5) {
    color = "red";
  }
  else if (data.features[i].properties.mag > 2.5) {
    color = "orange";
  }
  else {
    color = "yellow";
  }


//create circle markers for each earthquake
//the radius of each circle is proportional to the magnitude of the earthquake
    var circle = L.circle([lat ,long], {
      fillOpacity: 0.75,
      color: color,
      fillColor: color,
      radius: quakeMagnitude(data.features[i].properties.mag)
    }).bindPopup("<h3>" + data.features[i].properties.place + "</h3><hr><p>" + new Date(data.features[i].properties.time) + "</p>" + "</h3><hr><p> Magnitude:" +(data.features[i].properties.mag)+ "</p>").addTo(myMap);
    // 
  };
});


var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Earthquake Magnitude</strong>'],
    colors =["brown", 'red', 'orange', 'yellow']
    categories = [' 6.0 or Greater', '5.5 - 5.9', '5.4 - 2.5', 'Less Than 2.5'];

    for (var i = 0; i < categories.length; i++) {

            div.innerHTML += 
            labels.push(
                '<i class="square" style="background:' + colors[i] + '"></i> ' +
            (categories[i] ? categories[i] : '+'));

        }
        div.innerHTML = labels.join('<br>');
    return div;
    };
    legend.addTo(myMap);