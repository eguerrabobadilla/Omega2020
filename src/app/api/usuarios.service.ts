import { Injectable } from '@angular/core';
import { apiBase } from './apiBase';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends apiBase {

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/usuarios';
  }

  getUsuarios(text,skip,take): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/filter/${text}/${skip}/${take}`);
  }

  getUsuario(Id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/${Id}`);
  }
}
