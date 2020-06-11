import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBase } from './apiBase';

@Injectable({
  providedIn: 'root'
})
export class TareasService  extends apiBase {

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/tareas';
   }

   save(item: any) {

    return this.http.post(`${this.url}/${this.Ws}`,item);
  }

  get(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}`);
  }

}
