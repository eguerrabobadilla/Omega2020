import { Component, OnInit, Input } from '@angular/core';
//import {modusecho} from 'modusecho/www/modusecho'



@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {


  libros: any[] = [];
  //private  BackgroundGeolocation: modusecho;
  @Input() librosIN: any[];

  constructor() {
    
  }

  ngOnInit() {
    this.libros = this.librosIN;
  //Realiza el llamado al plugin e invoca segun el resultado la funcion correspondiente
   
    
  }
 visualizarLibro() {
  //modusecho.echo(['dsfadsf','1',"Lbs"]);
  (<any>window).modusecho.echo(['dsfadsf','1',"Lbs"]);
}
  //Funcion para desplegar la respuesta cuando es satisfactorio
  successCallback(message){
    alert(message);
}

//Funcion si hubo un error
errorCallback(){
    alert("Hubo un error");
} 
}
