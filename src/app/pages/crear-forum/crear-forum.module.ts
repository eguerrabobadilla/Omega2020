import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearForumPageRoutingModule } from './crear-forum-routing.module';

import { CrearForumPage } from './crear-forum.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CrearForumPageRoutingModule
  ],
  declarations: [CrearForumPage]
})
export class CrearForumPageModule {}
