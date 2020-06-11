import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearChatPageRoutingModule } from './crear-chat-routing.module';

import { CrearChatPage } from './crear-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearChatPageRoutingModule
  ],
  declarations: [CrearChatPage]
})
export class CrearChatPageModule {}
