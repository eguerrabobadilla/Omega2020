import { Component, OnInit } from '@angular/core';
import { mobiscroll, MbscCalendarOptions } from '@mobiscroll/angular';

mobiscroll.settings = {
  theme: 'mobiscroll',
  themeVariant: 'light',
  layout: 'liquid'
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  
  settings: MbscCalendarOptions = {
    theme: 'mobiscroll',
    display: 'inline',
    themeVariant: 'light',
    calendarScroll: 'vertical',
    controls: ['calendar','time'],
    months: 1
  };

  
  constructor() { }

  ngOnInit() {}

}
