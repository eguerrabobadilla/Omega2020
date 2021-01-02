import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBase } from './apiBase';

@Injectable({
  providedIn: 'root'
})
export class ExamenesService extends apiBase {

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/examenes';
  }

  save(item: any) {
    return this.http.post(`${this.url}/${this.Ws}`, item);
  }
}
