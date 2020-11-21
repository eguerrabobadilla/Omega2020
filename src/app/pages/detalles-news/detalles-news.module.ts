import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesNewsPageRoutingModule } from './detalles-news-routing.module';

import { DetallesNewsPage } from './detalles-news.page';
import { GlobalModule } from 'src/app/modules/GoblaModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesNewsPageRoutingModule,
    GlobalModule
  ],
  declarations: [DetallesNewsPage]
})
export class DetallesNewsPageModule {}
