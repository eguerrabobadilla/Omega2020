import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiBase } from './apiBase';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService extends apiBase {
  public WsCalendario: string;
  constructor(public http: HttpClient) { 
    super();
    this.Ws = 'api/calendario';
  }

  getCalendario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/api/calendario`);
 }
}
