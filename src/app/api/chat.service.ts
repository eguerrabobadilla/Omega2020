import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiBase } from './apiBase';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends apiBase {
  public WsConversaciones: string;

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/mensajes';
    this.WsConversaciones = 'api/conversaciones';
   }


   getConversaciones(): Observable<any[]> {
      return this.http.get<any[]>(`${this.url}/api/conversaciones`);
  }

  getChatByIdUsuario(id){
    return this.http.get<any[]>(`${this.url}/api/mensajes/usuario/${id}`);

  }
}
