import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {tap} from 'rxjs/operators';
import { apiBase } from '../api/apiBase';

@Injectable({
  providedIn: 'root'
})
export class BooksService extends apiBase {
  WsLibros: string;

  constructor(public http: HttpClient) { 
    super();
    this.Ws = 'api/codigos';
    this.WsLibros = 'api/libros';
  }


  getPost() {
    return this.http.get('http://35.193.103.213/api/codigos/123456').pipe(tap(console.log));
    //return this.http.get<any[]>(`${this.url}/${this.Ws}`);
    
  }

  getBooks(value: string) {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/${value}`);
  }

  getBooksGrado() {
    //return this.http.get('http://35.193.103.213/api/codigos/'+value).pipe(tap(console.log));
    return this.http.get<any[]>(`${this.url}/${this.Ws}/grados`);
  }

  getBook(libroId) {
    return this.http.get(`${this.url}/${this.WsLibros}/${libroId}`);
  }

}
