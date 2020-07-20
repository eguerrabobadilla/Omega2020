import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarEventsPageRoutingModule } from './calendar-events-routing.module';

import { CalendarEventsPage } from './calendar-events.page';
import { MbscModule } from '@mobiscroll/angular';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { DetallesCalendarPageModule } from '../detalles-calendar/detalles-calendar.module';
import { DetallesCalendarPage } from '../detalles-calendar/detalles-calendar.page';






@NgModule({
  entryComponents: [DetallesCalendarPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarEventsPageRoutingModule,
    MbscModule,
    HttpClientModule,
    HttpClientJsonpModule,
    DetallesCalendarPageModule
  ],
  declarations: [CalendarEventsPage]
})
export class CalendarEventsPageModule {}
