import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBase } from './apiBase';

@Injectable({
  providedIn: 'root'
})
export class ExamenesService extends apiBase {

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/examenes';
  }

  save(item: any) {
    return this.http.post(`${this.url}/${this.Ws}`, item);
  }

  update(item: any) {
    return this.http.put(`${this.url}/${this.Ws}/${item.Id}`, item);
  }

  examenTerminado(examenId,item){
    return this.http.put(`${this.url}/${this.Ws}/examenTerminado/${examenId}`,item);
  }

  delete(Id: any) {
    return this.http.delete(`${this.url}/${this.Ws}/${Id}`);
  }

  getInfinite(skip,take): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/infinite/${skip}/${take}`);
  }

  getTareasMateriasInfinite(id,skip,take): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/materiaInfinite/${id}/${skip}/${take}`);
  }

  getExamenesAlumnos(examenId): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/getExamenesAlumnos/${examenId}`);
  }
}
