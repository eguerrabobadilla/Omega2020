import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBase } from './apiBase';

@Injectable({
  providedIn: 'root'
})
export class EvidenciasService  extends apiBase  {

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/evidencias';
  }

  get(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}`);
  }

  getEvidenciasTarea(TareaId): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/evidenciasTarea/${TareaId}`);
  }

  getEvidenciasAlumnos(TareaId,MateriaId): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/evidenciasAlumnos/${TareaId}/${MateriaId}`);
  }

  getEvidenciasAlumnoProfesor(UsuarioId,TareaId): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/profesor/${UsuarioId}/${TareaId}`);
  }

  save(TareaId,item: any) {
    return this.http.post(`${this.url}/${this.Ws}/${TareaId}`, item);
  }

  getInfinite(skip,take): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/infinite/${skip}/${take}`);
  }
}
