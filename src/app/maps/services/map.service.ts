import { Injectable } from '@angular/core';
import { LngLatLike, Map } from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  ////////////////////
  //Primero debemos inicializar el mapa en algun lado para poder usarlo de manera global
  private map?: Map;

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
}
