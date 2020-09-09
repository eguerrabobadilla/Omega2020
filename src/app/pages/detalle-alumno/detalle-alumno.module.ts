import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleAlumnoPageRoutingModule } from './detalle-alumno-routing.module';

import { DetalleAlumnoPage } from './detalle-alumno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    DetalleAlumnoPageRoutingModule
  ],
  declarations: [DetalleAlumnoPage]
})
export class DetalleAlumnoPageModule {}
