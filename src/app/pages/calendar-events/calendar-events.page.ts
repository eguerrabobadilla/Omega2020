import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { mobiscroll, MbscCalendarOptions, MbscEventcalendarOptions } from '@mobiscroll/angular';
import { HttpClient } from '@angular/common/http';
import { DetallesCalendarPage } from '../detalles-calendar/detalles-calendar.page';
import { CalendarioService } from '../../api/calendario.service';


mobiscroll.settings = {
  theme: 'mobiscroll',
  themeVariant: 'light',

};

@Component({
  selector: 'app-calendar-events',
  templateUrl: './calendar-events.page.html',
  styleUrls: ['./calendar-events.page.scss'],
})
export class CalendarEventsPage implements OnInit {

  constructor(private modalCtrl: ModalController, private http: HttpClient,private modalCrl: ModalController,
              private apiCalendario: CalendarioService ) { }


  events: Array < any > ;
  view = 'month';
  viewOptions: any = {
      calendar: { type: 'week' },
      eventList: { type: 'week', scrollable: true },

  };

  eventSettings: MbscEventcalendarOptions = {
    theme: 'mobiscroll',
    themeVariant: 'light',
    display: 'inline',
    onInit: (event, inst) => {
       console.log("asdfasdf")
    },
    onEventSelect: (event, inst) => {
      // tslint:disable-next-line: semicolon
      console.log(event.event)
      this.abrirDetalleCalendario(event.event);
   },



  
};

  ngOnInit() {
  /*  this.http.jsonp('https://trial.mobiscroll.com/events/', 'callback').subscribe((resp: any) => {
      this.events = resp;
  });*/

  this.apiCalendario.getCalendario().subscribe(data => {
    this.events = data;
  });

  }
  
  closeModal() {
    this.modalCtrl.dismiss();
  }

  async abrirDetalleCalendario(item) {

    const modal = await this.modalCrl.create({
      component: DetallesCalendarPage,
      // cssClass: 'my-custom-modal-css',
      cssClass: 'my-custom-modal-css-capturas',
      showBackdrop: false,
      mode: 'ios',
      backdropDismiss: true,
      componentProps: {item}
    });

    await modal.present();

  }

}
