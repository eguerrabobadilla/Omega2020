import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
  libros: any[] = [];
  @Input() librosIN: any[];

  constructor() {

  }

  ngOnInit() {
    this.libros = this.librosIN;
  }

}
