import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoRecursoPageRoutingModule } from './nuevo-recurso-routing.module';

import { NuevoRecursoPage } from './nuevo-recurso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoRecursoPageRoutingModule
  ],
  declarations: [NuevoRecursoPage]
})
export class NuevoRecursoPageModule {}
