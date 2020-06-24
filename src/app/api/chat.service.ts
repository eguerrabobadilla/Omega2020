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

   getAlumnos(): Observable<any[]> {
     return this.http.get<any[]>(`${this.url}/api/conversaciones/alumnos`);
   }

   getChatByIdUsuario(id) {
     return this.http.get<any[]>(`${this.url}/api/mensajes/usuario/${id}`);
   }

   getChatGrupo(id) {
    return this.http.get<any[]>(`${this.url}/api/mensajes/grupos/${id}`);
  }

   getGruposMaestros(){
    return this.http.get<any[]>(`${this.url}/api/conversaciones/grupos`);
  }

  addMensajes(item) {
    return this.http.post(`${this.url}/${this.Ws}`, item);
  }

  crearGrupo(item) {
    return this.http.post(`${this.url}/${this.Ws}/grupos/crear`, item);
  }

  addMensajeGrupo(item) {
    return this.http.post(`${this.url}/${this.Ws}/grupos`, item);
  }
}
