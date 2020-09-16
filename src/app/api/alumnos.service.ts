import { Injectable } from '@angular/core';
import { apiBase } from './apiBase';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService extends apiBase {

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/usuarios';
  }

  getAlumnosEscolaridad(index,grado,grupo): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/${index}/${grado}/${grupo}`);
  }

  getTotales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/api/grupos/totales/alumnos`);
  }

}
