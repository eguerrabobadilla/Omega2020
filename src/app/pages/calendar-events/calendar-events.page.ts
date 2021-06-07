import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { mobiscroll, MbscCalendarOptions, MbscEventcalendarOptions,MbscCalendar,MbscEventcalendar } from '@mobiscroll/angular';
import { HttpClient } from '@angular/common/http';
import { DetallesCalendarPage } from '../detalles-calendar/detalles-calendar.page';
import { CalendarioService } from '../../api/calendario.service';
import { createVerify } from 'crypto';



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
  @Input() item;
  @ViewChild('mobi',{static: false}) mobi: MbscEventcalendar; 
  banderaEdito: boolean=false;

  constructor(private modalCtrl: ModalController, private http: HttpClient,private modalCrl: ModalController,
              private apiCalendario: CalendarioService,public loadingController: LoadingController) { }


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
     //  this.mobi.instance.navigate(new Date(2016, 1, 1),true);
    },
    onShow: (event, inst) => {
      setTimeout(() => {
       this.mobi.instance.navigate(new Date(this.item.date),true);
      }, 50);
    },
    onEventSelect: (event, inst) => {
      // tslint:disable-next-line: semicolon
     
      this.abrirDetalleCalendario(event.event);
   },
   onMarkupReady : (event, inst) => {
     
  },
   onDayChange : (event, inst) => {
   
    const strDate1 = `${event.date.getFullYear().toString().padStart(2, "0")}
    -${(event.date.getMonth()+1).toString().padStart(2, "0")}
    -${event.date.getDate().toString().padStart(2, "0")}`;
    this.apiCalendario.getCalendarioFecha(strDate1).subscribe(data => {
      this.events = data;
    });

   }



  
};

  ngOnInit() {
    this.cargar();
  }

  async cargar() {

    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });

    await loading.present();

    const strDate1 = `${this.item.date.getFullYear().toString().padStart(2, "0")}
                  -${(this.item.date.getMonth()+1).toString().padStart(2, "0")}
                  -${this.item.date.getDate().toString().padStart(2, "0")}`;

    this.apiCalendario.getCalendarioFecha(strDate1).subscribe(data => {
      //console.log(data);
      this.events = data;
      this.loadingController.dismiss();
    });
  }
  
  closeModal() {
    if(this.banderaEdito==true)
      this.modalCtrl.dismiss({
        banderaEdito : this.banderaEdito
      });
    else
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

    modal.onDidDismiss().then( async (data) => {
      if(data.data != undefined) {
        this.cargar();
        this.banderaEdito=true;
      }
    });

  }

}
