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
import { ListPreguntasComponent } from 'src/app/components/examenes/list-preguntas/list-preguntas.component';
import  {QuillModule}  from 'ngx-quill';
import { RelacionarComponent } from 'src/app/components/examenes/relacionar/relacionar.component';




@NgModule({
  entryComponents : [
    CalendarComponent,
    SeleccionUnaRespuestaComponent,
    ListPreguntasComponent,
    RelacionarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearExamenPageRoutingModule,
    ReactiveFormsModule,
    CKEditorModule,
    MbscModule,
    QuillModule.forRoot()
  ],
  declarations: [CrearExamenPage,CalendarComponent,SeleccionUnaRespuestaComponent,ListPreguntasComponent,RelacionarComponent]
})
export class CrearExamenPageModule {}
