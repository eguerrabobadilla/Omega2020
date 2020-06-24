import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleChatGroupPageRoutingModule } from './detalle-chat-group-routing.module';

import { DetalleChatGroupPage } from './detalle-chat-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleChatGroupPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DetalleChatGroupPage]
})
export class DetalleChatGroupPageModule {}
