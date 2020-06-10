import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  public Ws: string;
  public WsForo: string;
  //public url = 'http://35.193.103.213';
  public url = 'https://172.16.12.23:5001';
  //public LstForos: any = [];
  // public url: string ="https://localhost:5001";

  constructor(public http: HttpClient) {
    this.Ws = 'api/comentarios';
    this.WsForo = 'api/foro';
   }

   save(item: any) {
    return this.http.post(`${this.url}/${this.Ws}`, item);
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
}
