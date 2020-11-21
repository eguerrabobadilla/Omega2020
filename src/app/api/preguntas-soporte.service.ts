import { Injectable } from '@angular/core';
import { apiBase } from './apiBase';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreguntasSoporteService extends apiBase {

   constructor(public http: HttpClient) {
      super();
      this.Ws = 'api/preguntassoporte';
     }
     get(): Observable<any[]> {
      return this.http.get<any[]>(`${this.url}/${this.Ws}`);
    }
}
