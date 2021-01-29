import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleExamenAlumnoPageRoutingModule } from './detalle-examen-alumno-routing.module';

import { DetalleExamenAlumnoPage } from './detalle-examen-alumno.page';
import { CountdownGlobalConfig, CountdownModule } from 'ngx-countdown';





//import { SwiperModule } from 'swiper/angular';
import { SanitizePipe } from '../../pipes/sanitize.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleExamenAlumnoPageRoutingModule,
    //SwiperModule
    CountdownModule
  
  ],
  declarations: [DetalleExamenAlumnoPage,SanitizePipe],
  providers: [
    { provide: CountdownGlobalConfig}
  ]
})
export class DetalleExamenAlumnoPageModule {}
