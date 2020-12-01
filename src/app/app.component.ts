import { Component, ComponentFactoryResolver } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { WebsocketService } from './services/websocket.service';
import { PushService } from './services/push.service';

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
    public  webSocket: WebsocketService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.PushService.configuracionInicial();

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
        else
            this.router.navigate(['home']);
      } else {
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
}
