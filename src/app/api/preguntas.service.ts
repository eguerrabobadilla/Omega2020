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

  update(id: string,item: any) {
    return this.http.put(`${this.url}/${this.Ws}/${id}`, item);
  }

  getExamen(examenId): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/getExamen/${examenId}`);
  }

  getInfinite(skip,take,examenId): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/infinite/${skip}/${take}/${examenId}`);
  }

  getTareasMateriasInfinite(id,skip,take): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/materiaInfinite/${id}/${skip}/${take}`);
  }

  getPreguntaExamen(examenId,indexPregunta,indexPreguntaAnterior,respuestaAlumno): Observable<any[]>{

    return this.http.get<any[]>(`${this.url}/${this.Ws}/getPregunta/${examenId}/${indexPregunta}/${indexPreguntaAnterior}/${respuestaAlumno}`);
   // return this.http.get<any[]>(`https://my-json-server.typicode.com/eguerrabobadilla/Omega2020/preguntas/${indexPregunta}`);
  }
}
