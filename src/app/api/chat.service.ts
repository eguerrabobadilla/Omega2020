import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public Ws: string;
  public WsConversaciones: string;
  public url = 'https://172.16.12.23:5001';

  constructor(public http: HttpClient) {
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
