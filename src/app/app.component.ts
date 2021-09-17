import { Component, ComponentFactoryResolver } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { WebsocketService } from './services/websocket.service';
import { PushService } from './services/push.service';
import { File } from '@ionic-native/file/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private PushService : PushService,
    private router: Router,
    private authenticationService: AuthenticationService,
    public  webSocket: WebsocketService,
    private file: File,
    public alertController: AlertController
  ) {
    this.initializeApp();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      header: 'Falta espacio',
      //subHeader: 'Error:',
      message: 'No cuentas con espacio suficiente en tu dispositivo, libera espacio de almacenamiento, debes tener 3GB libres o más.',
      buttons: [
        {
          text: 'Entendido',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.PushService.configuracionInicial();
      
      if(this.platform.is('cordova')) {
        this.file.getFreeDiskSpace().then(data => {
          console.log("Espacio:",data);
          //1gb= 1048576 kb
          // 15gb = 15728640 kb
          setInterval(() => { 
            if(data < 15728640) 
            this.presentAlert();
          }, 10000);
          
        });
      }

    });
    
    

    //Login
    this.authenticationService.authState.subscribe(state => {
      if (state) {
        console.log("primer socket");
        this.webSocket.initSocket();

        //Busca si se quedo un sesion del director iniciada
        const jwt_temp = localStorage.getItem('USER_INFO_TEMP');
        
        if(jwt_temp != null)
        {
            localStorage.clear();
            localStorage.setItem('USER_INFO',jwt_temp);
        }

        if(this.getKeyToken("tipo")=="Director")
            this.router.navigate(['home-director']);
        else{
          if(this.getKeyToken("escolaridad")=="SAC" || this.getKeyToken("escolaridad")=="Universidad" )
          this.router.navigate(['home-universidad']);
          else
          this.router.navigate(['home']);
        }
           
      } else {
        console.log("va al login");
        this.router.navigate(['login']);
      }
    });
  
  }

  
  getKeyToken(key: string): string {

    const jwt = localStorage.getItem('USER_INFO');

    const jwtData = jwt.split('.')[1];
    // let decodedJwtJsonData = window.atob(jwtData);
    const decodedJwtJsonData = decodeURIComponent(escape(window.atob(jwtData)));
    const decodedJwtData = JSON.parse(decodedJwtJsonData);

    const value = decodedJwtData[key];

    return value;
  }

  interfaceApp(){
   const colores ={
     backgoundPincipal : 'blue'

    }
  }
}
