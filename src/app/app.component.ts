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
import { ThemeSwitcherService } from 'src/app/services/theme-switcher.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  mensajeEspacio = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private PushService : PushService,
    private router: Router,
    private authenticationService: AuthenticationService,
    public  webSocket: WebsocketService,
    private file: File,
    public alertController: AlertController,
    private themeSwitcher : ThemeSwitcherService
  ) {
    this.initializeApp();
  }

  async presentAlert() {
    if(this.mensajeEspacio==true) return;

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
    
    this.mensajeEspacio=true;
    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
    this.mensajeEspacio = false;
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.PushService.configuracionInicial();

    this.themeSwitcher.themeSwitch().then((data) => {
      this.statusBar.backgroundColorByHexString(this.themeSwitcher.principalColor);
    }).catch((err) => {
      
    });

      /**
       * Nota: En android el peso se mide en Kb y en IOS en Bytes
       * * */
      
      if(this.platform.is('cordova')) {
        this.file.getFreeDiskSpace().then(data => {
          console.log("Espacio:",data);
      
      
            if(this.platform.is('android'))
            {
              //1gb= 1048576 kb
              // 15gb = 15728640 kb
              // 3gb = 3145728 kb
              if(data < 3145728) 
                this.presentAlert();
            } else {
              //1gb= 1073741824 Bytes
              // 15gb = 16106127360 Bytes
              // 3gb = 3221225472 Bytes
              console.log("espacio libreeeeeeeeeee")
              console.log(data)
              if(data < 1610612736)
                this.presentAlert();
            }
          
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

        const home = this.getKeyToken("home");
        this.router.navigate([home]);

        /*if(this.getKeyToken("tipo")=="Director")
            this.router.navigate(['home-director']);
        else{
          if(this.getKeyToken("escolaridad")=="SAC" || this.getKeyToken("escolaridad")=="Universidad" || this.getKeyToken("escolaridad")=="Licenciatura Presencial" || this.getKeyToken("escolaridad")=="Licenciatura SAC")          
            this.router.navigate(['home-universidad']);
          else
          this.router.navigate(['home']);
        }*/
           
      } else {
        console.log("va al login");
        
        this.router.navigate(['login'],{ replaceUrl: true });
        //this.router.navigate(['login']);
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
