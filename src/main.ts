import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


 //Verificamos la geolocalizacion
 if (!navigator.geolocation){
    alert ('Debe tener la geolocalizacion(GPS) activada!! || El navegador no soporta la geolocalización');
    throw new Error('Debe tener la geolocalizacion(GPS) activada!! || El navegador no soporta la geolocalización');
 }


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
