import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-nuevo-recurso',
  templateUrl: './nuevo-recurso.page.html',
  styleUrls: ['./nuevo-recurso.page.scss'],
})
export class NuevoRecursoPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
