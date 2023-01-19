import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {Map, Popup, Marker} from 'mapbox-gl';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit{

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef;

  constructor(private placesService: PlacesService,
              private mapService: MapService) {

    console.log('Localizacion del usuario: ', this.placesService.userLocation);

  }
  
  ngAfterViewInit(): void {

    if(!this.placesService.userLocation){
      throw Error('No hay placesService.userLocation')
    }

    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL Se puede CAMBIAR
      center: this.placesService.userLocation, //Localizacion que mostrara al inicio
      zoom: 14, // starting zoom
    });

    const popup = new Popup()
      .setHTML(`
        <h6>Aquí estoy</h6>
        <spam>Estoy en este lugar del mundo</spam>
      `);

    new Marker({color: 'red'})
      .setLngLat(this.placesService.userLocation) //Aqui aparesera el marcador
      .setPopup(popup)
      .addTo(map) //Aqui lo enlazamos con el mapa

    this.mapService.setMap(map); //Con esto inicializamos el mapa en el servicio y ya podriamos usar el servicio de manera global
  }

}
