import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { apiBase } from './apiBase';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService extends apiBase {

  constructor(public http: HttpClient) { 
    super();
    this.Ws = 'api/estadisticas';
  }

  get(): Observable<any[]> {
   return this.http.get<any[]>(`${this.url}/${this.Ws}/globales`);
  }


  getEstadisticasAlumno(mes): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/alumno/${mes}`);
   }


}
