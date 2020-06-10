import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesChatPageRoutingModule } from './detalles-chat-routing.module';

import { DetallesChatPage } from './detalles-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesChatPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DetallesChatPage]
})
export class DetallesChatPageModule {}
