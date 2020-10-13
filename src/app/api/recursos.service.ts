import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBase } from './apiBase';

@Injectable({
  providedIn: 'root'
})
export class RecursosService  extends apiBase {


  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/recursos';
   }

   save(item: any) {
    return this.http.post(`${this.url}/${this.Ws}`,item);
  }

  update(item: any) {
    return this.http.put(`${this.url}/${this.Ws}/${item.Id}`, item);
  }

  get(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}`);
  }

  getByMonth(mes: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/${mes}`);
  }
  getByMonthTipo(mes: string,tipo: string): Observable<any[]> {
    https://localhost:5001/api/recursos/filtros/?mes=Octubre&tipo=Zoom&tipo=Documento
    return this.http.get<any[]>(`${this.url}/${this.Ws}/filtros/?mes=${mes}&${tipo}`);
  }

  getRecursosMaterias(id,mes): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/materia/${id}/${mes}`);
  }

  getByLink(mes): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/${mes}`);
  }

  delete(Id: any) {
    return this.http.delete(`${this.url}/${this.Ws}/${Id}`);
  }
  
}
