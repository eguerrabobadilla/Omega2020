import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  public Ws:string;
  public url: string ="http://35.193.103.213";
  //public url: string ="https://localhost:5001";

  constructor(public http: HttpClient) {
    this.Ws = 'api/tareas';
   }

   save(item: any) {

    return this.http.post(`${this.url}/${this.Ws}`,item);
  }

  get(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}`);
  }

}
