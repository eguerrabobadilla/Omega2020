import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleResultadosExamenesPageRoutingModule } from './detalle-resultados-examenes-routing.module';

import { DetalleResultadosExamenesPage } from './detalle-resultados-examenes.page';
import { GlobalModule } from 'src/app/modules/GoblaModule';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GlobalModule,
    DetalleResultadosExamenesPageRoutingModule,

  ],
  declarations: [DetalleResultadosExamenesPage]
})
export class DetalleResultadosExamenesPageModule {}
