import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { PreguntasService } from 'src/app/api/preguntas.service';
// import Swiper core and required components
import SwiperCore , { Virtual } from "swiper/core";

// install Swiper components
SwiperCore.use([Virtual]);


@Component({
  selector: 'app-detalle-examen-alumno',
  templateUrl: './detalle-examen-alumno.page.html',
  styleUrls: ['./detalle-examen-alumno.page.scss'],
})
export class DetalleExamenAlumnoPage implements OnInit {


  innerHtml1= '<img src="https://d500.epimg.net/cincodias/imagenes/2018/11/13/lifestyle/1542113135_776401_1542116070_noticia_normal.jpg" alt="Smiley face" width="42" height="42" style="vertical-align:bottom">';
  slideOpts:any;

 
  constructor(private apiPreguntas: PreguntasService) { }

  ngOnInit() {

    this.apiPreguntas.getExamen(2).subscribe(data =>{
      
    });

    let mySwiper = new SwiperCore('.ion-slides', {
      initialSlide: 1,
      direction: "vertical",
      speed: 150,
      preloadImages: false,
      lazy: true,
  
      virtual: {
        slides: ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5'],
      }

      
  });
    
    
  }

}
