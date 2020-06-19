import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearNewsPageRoutingModule } from './crear-news-routing.module';

import { CrearNewsPage } from './crear-news.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CrearNewsPageRoutingModule
  ],
  declarations: [CrearNewsPage]
})
export class CrearNewsPageModule {}
