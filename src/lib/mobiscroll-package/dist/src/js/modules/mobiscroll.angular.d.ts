import { mobiscroll } from '../frameworks/angular';
import { MbscInput, MbscInputModule } from '../input.angular';
import { MbscCalendarModule, MbscCalendar, MbscCalendarOptions, MbscCalendarComponent } from '../calendar.angular';
import { MbscDatetimeModule, MbscDate, MbscTime, MbscDatetime, MbscDateComponent, MbscTimeComponent, MbscDatetimeComponent, MbscDatetimeOptions } from '../datetime.angular';
import { MbscEventcalendarModule, MbscEventcalendar, MbscEventcalendarOptions, MbscEventcalendarComponent } from '../eventcalendar.angular';
import { MbscListviewModule, MbscListview, MbscListviewSublist, MbscListviewItem, MbscListviewHeader, MbscListviewOptions } from '../listview.angular';
import { MbscPopupModule, MbscPopup, MbscPopupOptions, MbscWidget, MbscWidgetOptions } from '../popup.angular';
import { MbscRangeModule, MbscRange, MbscRangeOptions, MbscRangeComponent, MbscRangeStartComponent, MbscRangeEndComponent } from '../range.angular';
declare class MbscModule {
    static forRoot(config: {
        angularRouter: any;
    }): any;
}
export { mobiscroll, MbscCalendar, MbscCalendarComponent, MbscDate, MbscTime, MbscDatetime, MbscDateComponent, MbscTimeComponent, MbscDatetimeComponent, MbscEventcalendar, MbscEventcalendarComponent, MbscListview, MbscListviewSublist, MbscListviewItem, MbscListviewHeader, MbscPopup, MbscWidget, MbscRange, MbscRangeComponent, MbscRangeStartComponent, MbscRangeEndComponent, MbscInput, MbscCalendarOptions, MbscDatetimeOptions, MbscEventcalendarOptions, MbscListviewOptions, MbscRangeOptions, MbscPopupOptions, MbscWidgetOptions, MbscModule, MbscInputModule, MbscCalendarModule, MbscDatetimeModule, MbscEventcalendarModule, MbscListviewModule, MbscPopupModule, MbscRangeModule, };
