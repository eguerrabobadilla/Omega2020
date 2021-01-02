import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearExamenPageRoutingModule } from './crear-examen-routing.module';

import { CrearExamenPage } from './crear-examen.page';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MbscModule } from '@mobiscroll/angular';
import { CalendarComponent } from 'src/app/components/calendar/calendar.component';
import { SeleccionUnaRespuestaComponent } from 'src/app/components/examenes/seleccion-una-respuesta/seleccion-una-respuesta.component';


@NgModule({
  entryComponents : [
    CalendarComponent,
    SeleccionUnaRespuestaComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearExamenPageRoutingModule,
    ReactiveFormsModule,
    CKEditorModule,
    MbscModule
  ],
  declarations: [CrearExamenPage,CalendarComponent,SeleccionUnaRespuestaComponent]
})
export class CrearExamenPageModule {}
