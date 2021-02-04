import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleResultadoProfesorPageRoutingModule } from './detalle-resultado-profesor-routing.module';

import { DetalleResultadoProfesorPage } from './detalle-resultado-profesor.page';
import { GlobalModule } from '../../modules/GoblaModule';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleResultadoProfesorPageRoutingModule,
    GlobalModule
  ],
  declarations: [DetalleResultadoProfesorPage]
})
export class DetalleResultadoProfesorPageModule {}
