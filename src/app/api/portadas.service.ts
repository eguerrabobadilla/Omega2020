import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiBase } from './apiBase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortadasService  extends apiBase {

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/portadas';
  }

  getPortadasVersion() {
    return this.http.get<any[]>(`${this.url}/${this.Ws}`);
  }
}
