import { MbscModule } from '@mobiscroll/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoRecursoPageRoutingModule } from './nuevo-recurso-routing.module';

import { NuevoRecursoPage } from './nuevo-recurso.page';

@NgModule({
  imports: [ 
    MbscModule, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NuevoRecursoPageRoutingModule
  ],
  declarations: [NuevoRecursoPage]
})
export class NuevoRecursoPageModule {}
