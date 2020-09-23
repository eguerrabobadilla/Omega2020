import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ignoreElements } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private platform:Platform,private storage: Storage) { }

  async getNameStorage(){
    //return "books2020"
    if(this.getKeyToken("tipo")=="Director")
      return "books" + this.getKeyToken("id");
    else {

      let storageOld = await this.storage.get("books2020");
      console.log(storageOld);
      if(storageOld == null) {
          return "books" + this.getKeyToken("id");
      }
      else {

          const storagePath="books" + this.getKeyToken("id");
          await this.storage.set(storagePath,storageOld);
          
          await this.storage.remove("books2020");

          return storagePath;
          //return "books2020";
      }
    }
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
