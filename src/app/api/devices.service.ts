import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiBase } from './apiBase';

@Injectable({
  providedIn: 'root'
})
export class DevicesService extends apiBase { 

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/devices';
  }

  update(id: any) {
    return this.http.put(`${this.url}/${this.Ws}/${id}`, undefined);
  }

}
