import { Injectable } from '@angular/core';
import { apiBase } from './apiBase';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GruposService  extends apiBase {

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/grupos';
  }

  getGruposEscolaridad(index): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/${index}`);
  }
}
