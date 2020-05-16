import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public Ws:string;
  public url: string ="http://35.193.103.213";
  //public url: string ="https://localhost:5001";

  constructor(public http: HttpClient) {
    this.Ws = 'api/login';
   }

   login(item) {
    //return this.http.get<any[]>(`${this.url}/${this.Ws}/test?finicio=${fechaInicial}&ffinal=${fechaFinal}`);
    
    return this.http.post(`${this.url}/${this.Ws}`,item);
  }
}
