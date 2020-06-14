import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewResourcePageRoutingModule } from './new-resource-routing.module';

import { NewResourcePage } from './new-resource.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewResourcePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewResourcePage]
})
export class NewResourcePageModule {}
