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

  getCalendarioFecha(fecha): Observable<any[]> {
    //2020-07-01
    return this.http.get<any[]>(`${this.url}/api/calendario/fecha/${fecha}`);
  }

  deleteEvento(Tipo:any,Id: any) {
    return this.http.delete(`${this.url}/${this.Ws}/${Tipo}/${Id}`);
  }

}
