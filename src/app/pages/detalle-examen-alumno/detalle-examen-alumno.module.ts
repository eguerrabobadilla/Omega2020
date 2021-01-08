import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleExamenAlumnoPageRoutingModule } from './detalle-examen-alumno-routing.module';

import { DetalleExamenAlumnoPage } from './detalle-examen-alumno.page';

//import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleExamenAlumnoPageRoutingModule,
    //SwiperModule
  ],
  declarations: [DetalleExamenAlumnoPage]
})
export class DetalleExamenAlumnoPageModule {}
