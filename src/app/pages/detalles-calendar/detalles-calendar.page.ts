import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalles-calendar',
  templateUrl: './detalles-calendar.page.html',
  styleUrls: ['./detalles-calendar.page.scss'],
})
export class DetallesCalendarPage implements OnInit {
  @Input() item;


  constructor(private modalCtrl: ModalController,) { }

  ngOnInit() {
   // console.log("input")
  //console.log(this.item);
    let escolaridad="";
    if(this.item.Escolaridad == 'Elementary School')
        escolaridad="Primaria"
    else if(this.item.Escolaridad == 'Junior High School')
        escolaridad="Secundaria"
    else if(this.item.Escolaridad == 'High School')
        escolaridad="Preparatoria"
    else if(this.item.Escolaridad == 'Kinder')
        escolaridad="Kinder"
    
    this.item.Escolaridad= escolaridad;
  }

  closeModal(){

    this.modalCtrl.dismiss();

  }

}
