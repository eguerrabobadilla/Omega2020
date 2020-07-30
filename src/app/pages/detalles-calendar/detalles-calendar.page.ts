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
  //  console.log(this.item);

  }

  closeModal(){

    this.modalCtrl.dismiss();

  }

}
