import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBase } from './apiBase';


@Injectable({
  providedIn: 'root'
})
export class TemasService extends apiBase {

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/temas';
   }

  save(item: any) {
    return this.http.post(`${this.url}/${this.Ws}`, item);
  }

  get(id:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/${id}`);
  }

  update(item: any) {
    console.log(item);
    return this.http.put(`${this.url}/${this.Ws}/${item.Id}`, item);
  }
  
}
