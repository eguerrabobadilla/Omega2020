import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  userId: string;

  constructor(private oneSignal: OneSignal,
              private storage: Storage) { }

  async configuracionInicial(){

    this.oneSignal.startInit('8d1eda81-162e-4a4b-9f20-421712cf9780','739804224507');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    
    this.oneSignal.handleNotificationReceived().subscribe(( noti ) => {
     // do something when notification is received
     console.log('notificacion recibida', noti);
    });
    
    this.oneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
    });

    // Obtener ID del suscriptor
    this.oneSignal.getIds().then( info => {
      //this.userId = info.userId || 'bb4c4088-3427-44ff-8380-570aa6c1ce1a';
      this.userId = info.userId;
      console.log(this.userId);
    });

    this.oneSignal.endInit();

  }

  async getUserIdOneSignal() {
    console.log('Cargando userId');
    // Obtener ID del suscriptor
    const info = await this.oneSignal.getIds();
    this.userId = info.userId;
    return info.userId;
  }


}
