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

  get(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}`);
  }

  getByMonth(mes: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/${mes}`);
  }
}
