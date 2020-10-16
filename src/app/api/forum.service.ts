import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { apiBase } from './apiBase';

@Injectable({
  providedIn: 'root'
})
export class ForumService  extends apiBase {
  public WsForo: string;

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/comentarios';
    this.WsForo = 'api/foro';
   }

   save(item: any) {
    return this.http.post(`${this.url}/${this.Ws}`, item);
   }

   updateForo(item: any) {
    return this.http.put(`${this.url}/${this.WsForo}/${item.Id}`, item);
  }

  setEstadoForo(item: any) {
    return this.http.put(`${this.url}/${this.WsForo}/estadoforo/${item.Id}`, item);
  }

   saveForo(item: any) {
    return this.http.post(`${this.url}/${this.WsForo}`, item);
   }

   addVoto(comentarioId: any) {
    return this.http.put(`${this.url}/${this.Ws}/${comentarioId}`, {});
   }

  get(esDetalle,foroId): Observable<any[]> {
    //return this.http.get<any[]>(https://my-json-server.typicode.com/eguerrabobadilla/Omega2020/libros`);


   if (esDetalle) {return this.http.get<any[]>(`${this.url}/${this.Ws}?ForoId=${foroId}`); }
   // tslint:disable-next-line: one-line
   else { return this.http.get<any[]>(`${this.url}/api/foro`);   }

  }

  getForosMaterias(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.WsForo}/materia/${id}`);
  }
}
