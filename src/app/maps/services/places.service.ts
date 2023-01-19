import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number];

  //Determinar si el user location esta listo
  get isUserLocationReady(): boolean {
    return !!this.userLocation;   //Mira que pusimos la doble negacion, debido a que arriba no lo inicializamos, la primer negacion para saber si no tiene ningun valor y la segunda para negar el negado -> en otras palabras aqui obtendreos si tiene informacion(valor)
  }

  constructor() { 
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
}
