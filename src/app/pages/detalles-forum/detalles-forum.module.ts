import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesForumPageRoutingModule } from './detalles-forum-routing.module';

import { DetallesForumPage } from './detalles-forum.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesForumPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DetallesForumPage]
})
export class DetallesForumPageModule {}
