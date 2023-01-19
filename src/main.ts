import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

///////
//Esta configuracion se hace al nivel global de paquete  de mapbox y cada vez que haga cualquier cosa con  mapbox, este sabe cual token es el que hace referencia
import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
Mapboxgl.accessToken = 'pk.eyJ1IjoiamFzcjI0IiwiYSI6ImNsY3MyY2oyazBsc3ozbms2dmg4dXduaXIifQ.cSA32wrf0jfl6sK3iZeAzQ';
//////

 //Verificamos la geolocalizacion
 if (!navigator.geolocation){
    alert ('Debe tener la geolocalizacion(GPS) activada!! || El navegador no soporta la geolocalización');
    throw new Error('Debe tener la geolocalizacion(GPS) activada!! || El navegador no soporta la geolocalización');
 }


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
