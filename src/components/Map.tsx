// import a bunch of leaflet stuff!

import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

import { createEffect, onMount } from 'solid-js';

// note the markerIcon lines: to address known issue (with webpack?) where Leaflet won't
// be able to find the marker icon in production
// https://stackoverflow.com/questions/60174040/marker-icon-isnt-showing-in-leaflet
import markerIcon from "../../node_modules/leaflet/dist/images/marker-icon.png";
import { coords, getCookie, score, setCookie, setDone, setScore, srcs } from '../App';
L.Marker.prototype.setIcon(L.icon({
  iconUrl:markerIcon,
  iconSize:     [30, 50], // size of the icon
  iconAnchor:   [15, 50], // point of the icon which will correspond to marker's location
}))

var options = {
  maxZoom: 18,
  minZoom: 15
};
export var nextScore = null;
// leaflet only works if you start doing stuff after the page properly exists (has rendered?)
// so we render the map and create our effects inside onMount() so they won't exist until the page does
export function MakeAMap(props?: any) {
  var map;
  let oldMarker: L.LayerGroup<any> | null = null;

  function submit(){
    if (nextScore != null){
      setScore(score() + nextScore);
      setCookie("level", (parseInt(getCookie("level")) + 1) + "");
      if (parseInt(getCookie("level")) >= 5){
        setDone(1);
      }
      else{
        document.getElementById("image").src=srcs[parseInt(getCookie("level"))];
      }
      nextScore = null;
      map.removeLayer(oldMarker)
      oldMarker = null;
    }
  }
  // Leaflet initialization has to happen inside onMount or it won't work
  onMount(() => {
    map = L.map('make-a-map', options).setView([44.9740, -93.2380], 15);
    map.on('click', function(ev) {
      if (oldMarker != null){
        map.removeLayer(oldMarker)
      }
      let markerLayer = L.layerGroup([
        L.marker([ev.latlng.lat, ev.latlng.lng])
      ]);
      console.log(ev.latlng);
      map.addLayer(markerLayer);
      oldMarker = markerLayer;
      if(map.distance(ev.latlng,coords[parseInt(getCookie("level"))]) != null){
        nextScore = Math.round(1000 * Math.pow(Math.E,(map.distance(ev.latlng,coords[parseInt(getCookie("level"))])/-50)))
      }
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    var southWest = L.latLng(44.9670, -93.2480),
    northEast = L.latLng(44.9800, -93.2200);
    var bounds = L.latLngBounds(southWest, northEast);
    
    map.setMaxBounds(bounds);
    map.on('drag', function() {
        map.panInsideBounds(bounds, { animate: false });
    });
});

return <><button class = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center" onclick={()=>submit()}>submit</button><div id="make-a-map" style="height:300px"/></>

}