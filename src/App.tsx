import { createSignal, Match, onMount, Switch, type Component } from 'solid-js';
import { MakeAMap, nextScore} from './components/Map';
import * as L from 'leaflet';

export const [score, setScore] = createSignal(0);

export let srcs = ["https://i.imgur.com/90knAWv.jpeg","https://i.imgur.com/C87vMI3.jpeg","https://i.imgur.com/OyGpPd5.jpeg"];
export let coords = [
  L.latLng([44.979952303164154, -93.22008526338324]),
  L.latLng([44.979952303164154, -93.22008526338324]),
  L.latLng([44.979952303164154, -93.22008526338324]),
  L.latLng([44.979952303164154, -93.22008526338324]),
  L.latLng([44.979952303164154, -93.22008526338324])];

export const [done, setDone] = createSignal(0);
export function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
export function setCookie(cname, cvalue) {
  const d = new Date();
  d.setHours(23,59,59,0);
  d.setTime(d.getTime());
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const App: Component = () => {
  const dayOfYear = Date();
  onMount(async () => {
    if(Number.isNaN(parseInt(getCookie("level")))){
      setCookie("level", 0 + "");
      document.getElementById("image").src=srcs[parseInt(getCookie("level"))];
    }
    if (parseInt(getCookie("level")) >= 5){
      setDone(1);
    }
  });
  function zoomin(){
    var myImg = document.getElementById("map");
    var currWidth = myImg.clientWidth;
    var currHeight = myImg.clientHeight;
    if(currWidth >= 500) return false;
     else{
        myImg.style.width = (currWidth + 200) + "px";
        myImg.style.height = (currHeight + 100) + "px";
    } 
  }
  function zoomout(){
    var myImg = document.getElementById("map");
    var currWidth = myImg.clientWidth;
    var currHeight = myImg.clientHeight;
    if(currWidth <= 400) return false;
     else{
        myImg.style.width = (currWidth - 200) + "px";
        myImg.style.height = (currHeight - 100) + "px";
    } 
  }
  function reset(){
    setDone(0);
    setCookie("level", 0 + "");
    document.getElementById("image").src=srcs[parseInt(getCookie("level"))];
  }
  return (
    <div class ="w-full h-screen bg-gray-200 flex justify-end items-end">
      <div class = "w-full h-screen absolute justify-start items-start ">
        <button class = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center p-2" onclick={()=>reset()}>Restart</button>
        <Switch fallback={<h1 class="font-bold text-center items-center">Score: {score()}/5000</h1>}>
          <Match when={done() == 0}>
            <img id="image" class = "w-full h-[90%] object-contain object-left p-1" src={srcs[parseInt(getCookie("level"))]} />
          </Match>
        </Switch>
      </div>
      <div id="map" class="bg-gray-400 w-96 h-96 absolute z-0">
        <div class = "absolute inset-0 flex-col justify-end items-center z-10 columns-1">
          <button class = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center" onclick={()=>zoomin()}>↖</button>
          <button class = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center" onclick={()=>zoomout()}>↘</button>
          <MakeAMap/>
        </div>
      </div>
    </div>
  );
};

export default App;
