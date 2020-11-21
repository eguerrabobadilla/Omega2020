import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiBase } from './apiBase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService extends apiBase {

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/noticias';
  }

  save(item: any) {
    console.log(item);
    return this.http.post(`${this.url}/${this.Ws}`,item);
  }

  update(item: any) {
    console.log(item);
    return this.http.put(`${this.url}/${this.Ws}/${item.Id}`, item);
  }
  
  get(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}`);
  }

  delete(Id: any) {
    return this.http.delete(`${this.url}/${this.Ws}/${Id}`);
  }

}
