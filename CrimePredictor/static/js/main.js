var map = L.map('map').setView([41.85, -87.6298], 11);

var selectedCategory = "theft";
var info = L.control();
var legend = L.control({position: 'bottomright'});
var wardLayer;
var color_scale;

function selectChanged(){
  var element = document.getElementById("crimeSection");
  selectedCategory = element.options[element.selectedIndex].value;
  map.removeLayer(wardLayer);
  map.removeControl(info);
  map.removeControl(legend);
  updateMap();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

 $(function() {
    $("#datepicker").datepicker("setDate", new Date);
    $('#timepicker').timepicker('setTime', '12:45 AM');
    $("#timepicker").change(function(){
      console.log($(this).val());
    });
    $("#datepicker").change(function(){
      console.log($(this).val());
    });

  });

d3.select('#crimeSection').on("change", selectChanged );


function getColorScale(category, data){
  var category_extent = d3.extent(data,function(d){ return d[category];})

  //console.log(category_extent)
  var colors_chromatic;
  switch(category){
    case 'theft':
      colors_chromatic = d3.interpolateBlues;
      break;
    case 'other_offenses':
      colors_chromatic = d3.interpolateGreens;
      break;
    case 'child_offense':
      colors_chromatic = d3.interpolateGnBu;
      break;
    case 'sexual_crime':
      colors_chromatic = d3.interpolateReds;
      break;
    case 'vehicle_theft':
      colors_chromatic = d3.interpolateBuPu;
      break;
    case 'deceptive_practice':
      colors_chromatic = d3.interpolateOrRd;
      break;
    case 'assault':
      colors_chromatic = d3.interpolatePuRd;
      break;
    case 'narcotics':
      colors_chromatic = d3.interpolateYlGn;
      break;
    case 'criminal_damage':
      colors_chromatic = d3.interpolateRdPu;
      break;
  }
   color_scale = d3.scaleSequential(colors_chromatic)
                      .domain(category_extent)
   
    return color_scale;
}


function create_heatmap(data,ward_no){
  var requests = ['Abandoned Vehicle','Alley Light Out','Graffiti Removal','Vacant Buildings'];
  var crimeType = ['Theft','Others','Narcotics','Assault','Crim. Damage','Decep. Prac.','Sexual Crime','Child Offense','Vehicle Theft'];

  var margin = {
  top: 120,
  right: 10,
  bottom: 70,
  left: 70
};

var width = Math.max(Math.min(window.innerWidth, 1000), 500) - margin.left - margin.right - 20-550,
gridSize = Math.floor(width / crimeType.length),
height = gridSize * (requests.length+2) -100;


var svg = d3.select('.heatmap_box')
  .append("svg")
  .attr('class','heatMap')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var newFontSize = width * 62.5 / 900;
d3.select("html").style("font-size", newFontSize + "%");

var colorScale = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) {return d.Correlation; })/2, d3.max(data, function(d) {return d.Correlation; })])
  .range(["#FFFFDD", "#3E9583", "#1F2D86"])


var dayLabels = svg.selectAll(".dayLabel")
    .data(requests)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", 0)
    .attr("y", function (d, i) { return i * gridSize -50; })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
    .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

var timeLabels = svg.selectAll(".timeLabel")
    .data(crimeType)
    .enter().append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, i) { return i * gridSize; })
    .attr("y", -50)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class", function(d, i) { return ((i >= 8 && i <= 17) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

var heatMap = svg.selectAll(".hour")
    .data(data)
    .enter().append("rect")
    .attr("x", function(d) { return (d.CrimeType - 1) * gridSize; })
    .attr("y", function(d) { return (d.RequestType - 1) * gridSize - 50; })
    .attr("class", "hour bordered")
    .attr("width", gridSize)
    .attr("height", gridSize)
    .style("stroke", "white")
    .style("stroke-opacity", 0.6)
    .style("fill", function(d) { return colorScale(d.Correlation); });

svg.append("text")
  .attr("class", "title")
    .attr("x", width/2)
    .attr("y", -90)
    .style("text-anchor", "middle")
    .text("Correlation between Crime Type and 311 Requests");
svg.append("text")
  .attr("class", "subtitle")
    .attr("x", width/2)
    .attr("y", -80)
    .style("text-anchor", "middle")
    .text("City of Chicago | Ward: " + ward_no);

var countScale = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) {return d.Correlation; })])
  .range([0, width])

var numStops = 10;
countRange = countScale.domain();
countRange[2] = countRange[1] - countRange[0];
countPoint = [];
for(var i = 0; i < numStops; i++) {
  countPoint.push(i * countRange[2]/(numStops-1) + countRange[0]);
}

svg.append("defs")
  .append("linearGradient")
  .attr("id", "legend-traffic")
  .attr("x1", "0%").attr("y1", "0%")
  .attr("x2", "100%").attr("y2", "0%")
  .selectAll("stop") 
  .data(d3.range(numStops))                
  .enter().append("stop") 
  .attr("offset", function(d,i) { 
    return countScale( countPoint[i] )/width;
  })   
  .attr("stop-color", function(d,i) { 
    return colorScale( countPoint[i] ); 
  });

var legendWidth = Math.min(width*0.8, 400);
//Color Legend container
var legendsvg = svg.append("g")
  .attr("class", "legendWrapper")
  .attr("transform", "translate(" + (width/2) + "," + (gridSize * requests.length + 40) + ")");

legendsvg.append("rect")
  .attr("class", "legendRect")
  .attr("x", -legendWidth/2)
  .attr("y", -60)
  //.attr("rx", hexRadius*1.25/2)
  .attr("width", legendWidth)
  .attr("height", 10)
  .style("fill", "url(#legend-traffic)");

legendsvg.append("text")
  .attr("class", "legendTitle")
  .attr("x", 0)
  .attr("y", -70)
  .style("text-anchor", "middle")
  .text("Correlation Value");

var xScale = d3.scaleLinear()
   .range([-legendWidth/2, legendWidth/2])
   .domain([ 0, d3.max(data, function(d) { return d.Correlation; })] );

var xAxis = d3.axisBottom(xScale)
    .ticks(5);
    //.tickFormat(formatPercent)

legendsvg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + (-55) + ")")
  .call(xAxis);

}



var init = function (){
    queue()
  .defer(d3.csv, "static/res/output.csv?_="+Math.random(), function(row) {
        return {ward: +row['ward'], theft: +row['theft'], other_offenses: +row['other_offenses'], child_offense: +row['child_offense'],
        sexual_crime: +row['sexual_crime'], vehicle_theft: +row['vehicle_theft'], deceptive_practice: +row['deceptive_practice'], assault: +row['assault'],
        narcotics: +row['narcotics'], criminal_damage: +row['criminal_damage']};
    })
  .defer(d3.json, "static/res/ward_boundaries.geojson")
  .defer(d3.csv,"static/res/corr.csv")
  .await(create_map);
};

init();

function create_map(error, data, wards,corr) {
  if(error) {
        console.error('Error while loading datasets.');
        console.error(error);
        return;
    }
//console.log(data)
  crime_data = data;
  wards_data = wards;
  corr_data = corr;

  // load a tile layer
  L.tileLayer('https://api.mapbox.com/styles/v1/kuhugupta/cjo4txr7o02i12rn8pr2x1cji/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3VodWd1cHRhIiwiYSI6ImNpcDgxYmg1YzAxN2hzem5yaXRtaDN6dWYifQ.hAIOSatYipnZ-NnqodCQFg',
    {
         attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        
        username: 'kuhugupta',
        id: 'cjo4txr7o02i12rn8pr2x1cji',
        tileSize: 512,
        zoomOffset: -1,
      accessToken: 'pk.eyJ1Ijoia3VodWd1cHRhIiwiYSI6ImNpcDgxYmg1YzAxN2hzem5yaXRtaDN6dWYifQ.hAIOSatYipnZ-NnqodCQFg'
      
  }).addTo(map);


   

  updateMap();
  

}

function updateMap(){
  var states_with_crime = {};
  

  for(var i = 0; i < crime_data.length; i++){
    states_with_crime[crime_data[i].ward] = crime_data[i][selectedCategory];
  }

  var getColor = getColorScale(selectedCategory,crime_data);

  //console.log(states_with_crime)

  

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };
  info.update = function (props_prob,props_ward,props_category) {
    this._div.innerHTML = (props_category ? '<h4>' + props_category + ' Probabability</h4>' : '<h4>Probabability</h4>' ) +  ( props_ward ?
      '<b>' +'Ward: '+ props_ward + '</b><br />' + props_prob.toFixed(4)  : 'Hover over a ward');
    var heatMapDiv = this._div.appendChild(document.createElement("div"));
    heatMapDiv.className="heatmap_box";
  };

  info.addTo(map);

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
    info.update(states_with_crime[layer.feature.properties.ward],layer.feature.properties.ward,selectedCategory);
  }

  function resetHighlight(e) {
    wardLayer.resetStyle(e.target);
    info.update();
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }


   wardLayer =  L.geoJson(wards_data, {
    style: function(feature) {
      return {
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7,
        fillColor: getColor(parseFloat(states_with_crime[feature.properties.ward]))
      };
    },
  onEachFeature: onEachFeature
  }).addTo(map);

   wardLayer.on('mouseover', function (e) {
      var ward_no = e.layer.feature.properties.ward;
      var filter_data = corr_data.filter( function(d){
        if(d['Ward'] == ward_no){ return d; }
      })
      
      create_heatmap(filter_data,ward_no);
    });
   wardLayer.on("mouseout",function(){
    d3.select(".heatMap").remove();
   });

   legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
      grades = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      labels = [],
      from, to;

    for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];
      labels.push(
        '<i style="background:' + color_scale(from) + '"></i> ' +
        from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
  };

  legend.addTo(map);


}