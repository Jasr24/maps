import { Injectable } from '@angular/core';
import { LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  ////////////////////
  //Primero debemos inicializar el mapa en algun lado para poder usarlo de manera global
  private map?: Map;

  private markers: Marker[] = [];

  setMap (map: Map) {
    this.map = map;
  }

  get isMapReady(){
    return !!this.map;
  }
  //////////////////


  //Este metodo es para moverse de un lugar a otro
  flyTo (coords: LngLatLike){
    if(!this.isMapReady) throw Error('El mapa no se encuentra inicializado')

    this.map?.flyTo({
      zoom: 14,
      center: coords
    });
  }

  //Creamos los marcadores de la busqueda
  createMarkersFromPlaces(places: Feature[], userLocation: [number,number]){

    if(!this.map) throw Error ('Mapa no inicializado');
   
    this.markers.forEach(marker => marker.remove());  //Los purgamos fisicamente en el mapa pero en este momento todavia existen dentro del arreglo

    const newMarkers = [];

    for (const place of places) {
      const [lng, lat] = place.center;
      const popup = new Popup()
        .setHTML(`
          <h6>${place.text}</h6>
          <span>${place.place_name}</span>
        `);

      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);
      
        newMarkers.push(newMarker);
    }   

    this.markers = newMarkers;

    if(places.length === 0){
      return;
    }

    //Limites del mapa, para que muestre todos los marcadores
    const bounce = new LngLatBounds();
    newMarkers.forEach(marker => bounce.extend(marker.getLngLat()));
    bounce.extend(userLocation);
    this.map.fitBounds(bounce, {
      padding: 200
    });
  }
}
