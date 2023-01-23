import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { DirectionsApiClient } from '../api';
import { Feature } from '../interfaces/places';
import { DirectionResponse, Route } from '../interfaces/direction';

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

  constructor (private directionsApi: DirectionsApiClient) {}

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

  getRouteBetweenPoints(start: [number,number], end: [number,number]) {
    this.directionsApi.get<DirectionResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe(resp => this.draPolyLine(resp.routes[0]));
  }

  private draPolyLine(route: Route){
    console.log({kms: route.distance/1000, duration: route.duration/60});

    if(!this.map) throw Error ('Mapa no inicializado');

    const coords = route.geometry.coordinates;

    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => {
      bounds.extend([lng,lat]);
    });

    this.map?.fitBounds(bounds, {
      padding: 200
    });


    //Linea el PolyLine, trazar la linea de los dos puntos
    const sourceDate: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }

    //Todo: Limpirar ruta previa
    if (this.map.getLayer('RouteString')){
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }



    this.map.addSource('RouteString', sourceDate);
    this.map.addLayer({
      id:'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'black', //El color de la linea
        'line-width': 3
      }
    });
  }
}
