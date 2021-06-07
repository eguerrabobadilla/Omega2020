import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MbscModule } from '@mobiscroll/angular';

import { CrearTopicPageRoutingModule } from './crear-topic-routing.module';

import { CrearTopicPage } from './crear-topic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearTopicPageRoutingModule,
    ReactiveFormsModule,
    MbscModule
  ],
  declarations: [CrearTopicPage]
})
export class CrearTopicPageModule {}
