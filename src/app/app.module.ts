import { MbscModule } from '@mobiscroll/angular';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AnimateItemsDirective } from './directives/animate-items.directive';
import { from } from 'rxjs';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { DetallesForumPageModule } from './pages/detalles-forum/detalles-forum.module';
import { DetallesChatPage } from './pages/detalles-chat/detalles-chat.page';
import { DetallesChatPageModule } from './pages/detalles-chat/detalles-chat.module';
import { DetallesNewsPageModule } from './pages/detalles-news/detalles-news.module';
import { DetallesNewsPage } from './pages/detalles-news/detalles-news.page';

import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DetalleChatGroupPageModule } from './pages/detalle-chat-group/detalle-chat-group.module';

//import {ModusEcho} from 'modusecho/www/ModusEcho';

import { FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { Zip } from '@ionic-native/zip/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@NgModule({
  declarations: [AppComponent, AnimateItemsDirective],
  entryComponents: [DetallesNewsPage],
  imports: [ 
    MbscModule,  
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot({mode:'ios', scrollPadding:false,scrollAssist:true}),
    IonicStorageModule.forRoot({
      name: '__books',
      driverOrder: ['sqlite','indexeddb', 'websql']
    }), 
    HttpClientModule,
    ReactiveFormsModule,
    DetallesForumPageModule,
    DetallesChatPageModule,
    DetalleChatGroupPageModule,
    DetallesNewsPageModule,
    FormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileTransfer,
    FileOpener,
    File,
    Zip,
    WebView,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS,useClass: AuthInterceptorService,multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
