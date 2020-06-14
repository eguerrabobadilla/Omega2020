import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class apiBase  {
   // url  : string = "https://172.16.12.15:5001";
    url: string = "https://localhost:5001";
   //url: string = "http://35.193.103.213";
    //url: string = 'https://172.16.12.23:5001';
    Ws: string;
}
