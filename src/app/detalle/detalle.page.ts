import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  @Input() item;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  closeModal (){
      console.log("cerar");
      this.modalCtrl.dismiss();
  }

}

