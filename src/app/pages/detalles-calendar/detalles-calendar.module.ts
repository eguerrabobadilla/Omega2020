import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesCalendarPageRoutingModule } from './detalles-calendar-routing.module';

import { DetallesCalendarPage } from './detalles-calendar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesCalendarPageRoutingModule
  ],
  declarations: [DetallesCalendarPage]
})
export class DetallesCalendarPageModule {}
