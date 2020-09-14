import { MbscModule } from '@mobiscroll/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallePageRoutingModule } from './detalle-routing.module';

import { DetallePage } from './detalle.page';
import { GlobalModule } from '../modules/GoblaModule';

@NgModule({
  imports: [ 
    MbscModule, 
    CommonModule,
    FormsModule,
    IonicModule,
    DetallePageRoutingModule,
    GlobalModule
  ],
  declarations: [DetallePage]
})
export class DetallePageModule {}
