import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleExamenAlumnoPageRoutingModule } from './detalle-examen-alumno-routing.module';

import { DetalleExamenAlumnoPage } from './detalle-examen-alumno.page';
import { CountdownGlobalConfig, CountdownModule } from 'ngx-countdown';

function countdownConfigFactory(): CountdownGlobalConfig {
  return null;
}




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleExamenAlumnoPageRoutingModule,
    CountdownModule
  
  ],
  declarations: [DetalleExamenAlumnoPage],
  providers: [
    { provide: CountdownGlobalConfig, useFactory: countdownConfigFactory }
  ]
})
export class DetalleExamenAlumnoPageModule {}
