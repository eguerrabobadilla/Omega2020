import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class apiBase  {
    //url  : string = "https://192.168.0.16:5001";
    url: string = "https://localhost:5001";
    //url: string = "https://192.168.0.15:5001";
    //url: string = "https://192.168.137.1:5001";
    //url: string = "http://35.193.103.213";
    //url: string = "https://192.168.137.1:5001";
  //  url: string = "http://35.193.103.213";
    //  url: string = 'https://192.168.0.4:5001';
    //url: string = 'https://www.alfalbs.app/ApiOmega'
    //url: string = 'https://www.alfalbs.app/WcfOmega'
    Ws: string;
}
