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
      {pregunta: '¿Qué significa LBS?',respuesta: 'Learning Bicultural System (Sistema de Aprendizaje Bicultural).'},
      {pregunta: '¿Qué es la app LBS+?',respuesta: 'LBS+ (LBS Plus) Es una app de gestión educativa desarrollada para Colegio Inglés de Durango y Colegio Irlandés Americano, que facilita la administración del aprendizaje presencial, semipre-sencial o virtual mediante funciones y herramientas interactivas. '},
      {pregunta: '¿La app LBS+ funciona sin internet?',respuesta: 'Para un funcionamiento completo y la mejor experiencia de uso, se requiere de internet. Sin internet, la app funcionará únicamente con la categoría de Books (libros).'},
      {pregunta: '¿Puedo personalizar mi cuenta de plataforma con una fotografía de perfil?',respuesta: 'De momento no es posible. En las próximas semanas se activará esta opción.'},
      {pregunta: '¿Con qué dispositivos es compatible la app LBS+?',respuesta: 'Con dispositivos móviles (iOS y Android). A partir de septiembre 2020 también será compatible en computadoras.'},
      {pregunta: '¿Porqué aún no es compatible con computadoras?',respuesta: 'Debido a la situación actual, se dio prioridad al funcionamiento en dispositivos móviles ya que en su totalidad, docentes, directivos, padres de familia y alumnos, cuentan con un dispositivo móvil, sin embargo, no todos los integrantes de nuestra comunidad cuentan con una computadora en casa o trabajo. '},
      {pregunta: '¿Qué características deben de tener los dispositivos?',respuesta: 'Las características compatibles son iPad o iPhone con iOS 11 o posterior y tabletas o celulares Android 7 o posterior. RAM de 3gb o superior, y almacenamiento de 32gb o superior.'},
      {pregunta: '¿Es muy importante la versión de sistema operativo?',respuesta: 'Si, en caso de no contar con los requisitos anteriormente especificados se puede tener un mal rendimiento de la aplicación, o bien podría no funcionar en absoluto.'},
      {pregunta: '¿Cuál es la mejor marca de dispositivo?',respuesta: 'Es difícil afirmar cuál es la mejor marca, algunas recomendaciones son Apple y Samsung. Aunque esto también depende de la gama y año de creación del dispositivo.'},
      {pregunta: '¿Por qué se recomienda el uso de dispositivos Apple?',respuesta: 'Recomendamos el uso de dispositivos Apple ya que cuentan con un sistema operativo propio de la marca, esto hace que el funcionamiento de las apps en general sea más efectivo en su sistema operativo iOS.'},
      {pregunta: '¿En qué afecta el año de creación de un dispositivo?',respuesta: 'Si un dispositivo es mayor a 4 años, probablemente empezará a ser lento en su rendimiento. Esto no tiene nada que ver con la app LBS+, esto se debe a que la tecnología avanza año con año, mientras más años tenga de uso el dispositivo puede volverse lento debido a que va quedando fuera de los lineamientos de compatibilidad con las nuevas tecnologías.'},
      {pregunta: '¿Puedo usar la aplicación LBS+ en una computadora de escritorio?',respuesta: 'De momento no. A partir de septiembre 2020, LBS+ podrá ser usada desde cualquier compu-tadora de escritorio que cuente con un navegador web. En la versión web y/o de escritorio, los libros serán únicamente de consulta (modo lectura), es decir, no serán interactivos en los ejerci-cios. Las cuestiones interactivas funcionan perfectamente en cualquier dispositivo móvil.'},
      {pregunta: '¿Es tardado descargar los libros interactivos LBS+?',respuesta: 'No. El proceso de descarga puede demorar de 1 a 3 minutos, esto depende de factores como la velocidad de internet y características del dispositivo.'},
      {pregunta: '¿Cuánto almacenamiento disponible necesito en mi dispositivo para que la aplicación funcione?',respuesta: 'Recomendamos que por lo menos se tenga 3GB disponibles.'},
      {pregunta: '¿Es necesario tener más de una dirección de correo electrónico para mi cuenta de LBS+ si tengo varios hijos o hijas en el Colegio?',respuesta: 'Para ingresar a la app no se requiere un correo electrónico, sólo es necesario el usuario y contra-seña, estos datos serán proporcionados por el Colegio.'},
      {pregunta: 'Si cambio de dispositivo, ¿qué pasa con mi información?',respuesta: 'Toda la información generada en la aplicación se respalda en la nube de LBS+ por tal motivo los datos siempre estarán seguros y sin riesgos de pérdida. Es importante tener claro que los datos guardados dependerán de qué datos existían a la última vez que el usuario utilizó la app con co-nexión a internet.'},
      {pregunta: '¿Puedo abrir una misma cuenta en más de un dispositivo?',respuesta: 'Si, siempre y cuando se ingresen los datos de usuario y contraseña.'},
      {pregunta: '¿Se pueden imprimir los ejercicios realizados?',respuesta: 'No. La app LBS+ es completamente digital, virtual e interactiva. No existe opción de impresión.'},
      {pregunta: '¿Pueden las alumnas y alumnos comunicarse a través de la app LBS+?',respuesta: 'Si, por medio del módulo de Mensajes, la comunicación es únicamente de estudiante a docente y viceversa.'},
      {pregunta: '¿Se pueden enviar tareas desde la aplicación?',respuesta: 'Si. En el apartado de Evidencias, alumnos y alumnas pueden compartir fotografías de sus trabajos realizados.'},
      {pregunta: '¿Funciona la app LBS+ en modo horizontal?',respuesta: 'No. LBS+ únicamente funciona en modo vertical.'},
      {pregunta: '¿Qué debo hacer si los datos y contenido dentro de la app LBS+ no corresponden a mi usuario?',respuesta: 'Favor de comunicarse vía WhatsApp al número: 669 162 5682. Una persona a cargo de Ayuda y Soporte Técnico podrá dar seguimiento a cualquier duda o comentario que se presente.'},
      {pregunta: '¿Debo actualizar la app LBS+?',respuesta: 'Si. Cuando existan actualizaciones disponibles se compartirá la información.'},
      {pregunta: '¿Por qué debo actualizar la app LBS+?',respuesta: 'Todas las apps se actualizan cada cierto tiempo, esto ayuda a mejorar el rendimiento de la app, ofrecer un mejor desempeño, o bien, poder acceder a nuevas funciones.'},
      {pregunta: 'Si tengo dudas sobre la app LBS+, ¿con quién puedo acudir?',respuesta: 'Favor de comunicarse vía WhatsApp al número: 669 162 5682. Una persona a cargo de Ayuda y Soporte Técnico podrá dar seguimiento a cualquier duda o comentario que se presente.'}
    ]
  }

  

}
