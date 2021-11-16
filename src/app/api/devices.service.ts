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
    console.log(id);
    return this.http.put(`${this.url}/${this.Ws}/${id}`, undefined);
  }

  delete(id: any) {
    console.log(id);
    return this.http.delete(`${this.url}/${this.Ws}/${id}`);
  }

}
