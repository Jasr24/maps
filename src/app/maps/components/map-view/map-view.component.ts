import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {Map} from 'mapbox-gl';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit{

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef;

  constructor(private placesService: PlacesService) {
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
  }

}
