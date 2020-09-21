import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ignoreElements } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private platform:Platform) { }

  public getNameStorage(){
    if(this.getKeyToken("tipo")=="Director")
      return "books" + this.getKeyToken("id");
    else
      return "books2020";
  }

  isMobileDevice(){
    let isMobile:boolean;

    if(this.platform.is("desktop")) {
      console.log("not mobile device");
      isMobile = false;
    } else {
      console.log("mobile device");
      isMobile=true;
    }

    return isMobile;
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
