import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlacesResponse, Feature } from '../interfaces/places';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  //Determinar si el user location esta listo
  get isUserLocationReady(): boolean {
    return !!this.userLocation;   //Mira que pusimos la doble negacion, debido a que arriba no lo inicializamos, la primer negacion para saber si no tiene ningun valor y la segunda para negar el negado -> en otras palabras aqui obtendreos si tiene informacion(valor)
  }

  constructor(private http: HttpClient) { 
    this.getUserLocation(); //Tan pronto alguien use este servicio se llama este metodo.
  }

  /*Con este metodo de esta forma es para para poder convertir en una promesa la parte 
   de navigator.location que trabaja en base a callbacks, esto para tener mejor control al respecto*/
  public async getUserLocation(): Promise<[number,number]> {
    return new Promise((resolve, reject) => {
      //navigator.geolocation.watchPosition()// esto emitira valores conforme se va moviendo.
      navigator.geolocation.getCurrentPosition(
        ({coords}) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },
        (err) => {
          alert(`Ocurrio un error al obtener la localizacion del usuario: ${err}`);
          console.log('Ocurrio un error al obtener la localizacion del usuario', err);
          reject(); //Con este reject mandamos el error de esta promesa.
        }
      );
    })
  }

  getPlacesByQuery (query: string = "") {

    //Primero evaluamos si el string es vacio

    this.isLoadingPlaces = true;

    this.http.get<PlacesResponse>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=6&proximity=-75.48931895257327%2C3.7290962971833466&language=es&access_token=pk.eyJ1IjoiamFzcjI0IiwiYSI6ImNsY3MxbWJ4dzBsMHYzb3BoM3VxbDZuM2oifQ.xfBoK-Och1U9M7rWkw_bSg`)
        .subscribe(res => {
          console.log(res.features)
          this.isLoadingPlaces = false;
          this.places = res.features;
        });

  }
}
