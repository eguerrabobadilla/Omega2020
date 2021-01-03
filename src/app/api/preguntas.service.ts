import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBase } from './apiBase';


@Injectable({
  providedIn: 'root'
})
export class PreguntasService extends apiBase {

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/preguntas';
  }

  save(item: any) {
    return this.http.post(`${this.url}/${this.Ws}`, item);
  }

  getInfinite(skip,take): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/infinite/${skip}/${take}`);
  }

  getTareasMateriasInfinite(id,skip,take): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/materiaInfinite/${id}/${skip}/${take}`);
  }
}
