import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearEvidencePageRoutingModule } from './crear-evidence-routing.module';

import { CrearEvidencePage } from './crear-evidence.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearEvidencePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CrearEvidencePage]
})
export class CrearEvidencePageModule {}
