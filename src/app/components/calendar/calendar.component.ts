import { Component, OnInit } from '@angular/core';
import { mobiscroll, MbscCalendarOptions } from '@mobiscroll/angular';

mobiscroll.settings = {
  theme: 'ios',
  themeVariant: 'ligth'
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  
  settings: MbscCalendarOptions = {
    display: 'inline'
};
  constructor() { }

  ngOnInit() {}

}
