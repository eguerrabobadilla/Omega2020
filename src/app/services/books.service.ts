import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) { }

  getPost() {
    return this.http.get('https://my-json-server.typicode.com/eguerrabobadilla/Omega2020/libros').pipe(tap(console.log));
  }
}
