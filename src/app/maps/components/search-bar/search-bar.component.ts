import { Component } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  private debounceTimer? : NodeJS.Timeout; //Para que esta linea funcione correctamente ahy que modificar el tsconfig.app.json y en el tsconfig.json en el arreglo de los types

  constructor (private placesService: PlacesService) {}

  //debounce manual, cuando hay un evento de toque de tecla debido al (keyup) del html oviamente
  onQueryChanged(query: string = ''){ //Se dispara cada vez que el query cambie, cuando se presiona una tecla
    
    ////////////////////
    //Si queremos podriamos verificar que tipo de letra ingresa, ignorar ciertas teclas, o que se dispare solo cuando demos enter.....
    ////////////////////

    if(this.debounceTimer) { //si tiene un valor
      clearTimeout (this.debounceTimer) //lo limpia
    }

    this.debounceTimer = setTimeout( () => {
      console.log('Mandar este query cada ??? mlisegundos: ', query);
      this.placesService.getPlacesByQuery(query);
    }, 350) //Esperamos estos milisegundos. cadavez que pasa este tiempo lo del cuerpo inmediatamente arriba se dispara


  }
}
