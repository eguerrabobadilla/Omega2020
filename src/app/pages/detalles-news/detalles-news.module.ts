import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesNewsPageRoutingModule } from './detalles-news-routing.module';

import { DetallesNewsPage } from './detalles-news.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesNewsPageRoutingModule
  ],
  declarations: [DetallesNewsPage]
})
export class DetallesNewsPageModule {}
