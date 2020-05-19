import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) { }

  getPost() {
    return this.http.get('http://35.193.103.213/api/codigos/123456').pipe(tap(console.log));
  }

  getBooks(value: string) {
    console.log(value);
    return this.http.get('http://35.193.103.213/api/codigos/'+value).pipe(tap(console.log));
  }

}
