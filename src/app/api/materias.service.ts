import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBase } from './apiBase';

@Injectable({
  providedIn: 'root'
})
export class MateriasService  extends apiBase {

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/materias';
  }

  get(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/grado/6`);
  }

  getMateriasProfesor(grado): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/profesor/${grado}`);
  }

}
