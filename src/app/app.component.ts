import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AuthenticationService } from './services/Authentication.service';
import { Router } from '@angular/router';
import { WebsocketService } from './services/websocket.service';

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
    private router: Router,
    private authenticationService: AuthenticationService,
    public  webSocket: WebsocketService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.log("initializeApp");
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    //Login
    this.authenticationService.authState.subscribe(state => {
      if (state) {
        this.webSocket.initSocket();
        this.router.navigate(['home']);
      } else {
        this.router.navigate(['login']);
      }
    });
  }
}
