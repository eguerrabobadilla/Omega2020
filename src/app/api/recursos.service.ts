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
    return this.http.get<any[]>(`${this.url}/${this.Ws}/filtros/?mes=${mes}&tipo=${tipo}`);
  }

  getByMonthTipoMateria(mes: string,tipo: string,id): Observable<any[]> {
    https://localhost:5001/api/recursos/filtros/?mes=Octubre&tipo=Zoom&tipo=Documento
    return this.http.get<any[]>(`${this.url}/${this.Ws}/filtros/materia/?mes=${mes}&tipo=${tipo}&id=${id}`);
  }



  getRecursosMaterias(id,mes): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/materia/${id}/${mes}`);
  }

  getByLink(mes): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/${mes}`);
  }

  getByMonthTipoInfinite(mes: string,tipo: string,skip,take): Observable<any[]> {
 //   return this.http.get<any[]>(`${this.url}/${this.Ws}/${mes}/materiaInfinite/${id}/${skip}/${take}`);
    return this.http.get<any[]>(`${this.url}/${this.Ws}/filtros/infinite/?mes=${mes}&tipo=${tipo}&skip=${skip}&take=${take}`);
  }
  getByMonthTipoInfiniteMateria(mes: string,tipo: string,skip,take,id): Observable<any[]> {
    //   return this.http.get<any[]>(`${this.url}/${this.Ws}/${mes}/materiaInfinite/${id}/${skip}/${take}`);
       return this.http.get<any[]>(`${this.url}/${this.Ws}/filtros/infinite/materia/?mes=${mes}&tipo=${tipo}&skip=${skip}&take=${take}&id=${id}`);
     }

  delete(Id: any) {
    return this.http.delete(`${this.url}/${this.Ws}/${Id}`);
  }

  asistenciaConferencia(RecursoId: any) {
    return this.http.post(`${this.url}/${this.Ws}/asistenciazoom/${RecursoId}`,null);
  }
  
}
