import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
  preguntas: any[] = [];
  constructor() { }

  ngOnInit() {
    this.preguntas = [
      {pregunta: '¿Qué es la plataforma LBS+?',respuesta: 'Es un software de gestión educativa desarrollada para colegio inglés, que facilita la administración del aprendizaje presencial, semipresencial o virtua.'},
      {pregunta: '¿Qué características deben de tener los dispositivos?',respuesta: 'Las características compatibles son iPads o iPhone con iOS 11 o posterior y tabletas o celulares Android 7 o posterior. RAM de 3gb o superior, y almacenamiento de 32gb o superior.'},
      {pregunta: '¿Cuánto almacenamiento disponible necesito en mi dispositivo para que la aplicación funcione?',respuesta: 'Recomendamos que por lo menos se tenga 3GB disponibles.'},
      {pregunta: '¿Pueden las alumnas y alumnos comunicarse a través de plataforma?',respuesta: 'Si, por medio del módulo de mensajes, la comunicación es de alumno a profesor y viceversa.'},
      {pregunta: '¿Es necesario tener más de una dirección de correo electrónico para mi cuenta de plataforma si tengo varios hijos en el Colegio?',respuesta: 'Para ingresar a la app no se requiere un correo electrónico, sólo es necesario el usuario y contraseña, estos datos serán proporcionados por el Colegio.El correo electrónico se solicita una única vez a manera de registro de datos de contacto, a este correo electrónico llegarán las notificaciones de la actividad de la cuenta.Se podrá iniciar sesión con más de una cuenta en un mismo dispositivo, esto dará como beneficio poder moverse entre cuentas de una manera sencilla.'},
      {pregunta: '¿La plataforma funciona sin internet?',respuesta: 'Para un funcionamiento completo y la mejor experiencia de uso, se requiere de internet. Sin internet, la app funcionará con características limitadas de solo lectura para algunos apartados dependiendo de la última vez que el usuario se conectó a internet, no obstante, el apartado de libros tendrá la funcionalidad completa una vez que los libros han sido '}
    ]
  }

  

}
