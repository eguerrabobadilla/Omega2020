import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiBase } from './apiBase';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends apiBase {

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/login';
   }

   login(item) {
    return this.http.post(`${this.url}/${this.Ws}`,item);
  }
}
