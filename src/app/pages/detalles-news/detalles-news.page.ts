import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalles-news',
  templateUrl: './detalles-news.page.html',
  styleUrls: ['./detalles-news.page.scss'],
})
export class DetallesNewsPage implements OnInit {
  @Input() item;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.item);
    console.log(this.item.image.includes('https://'));
    this.item.image = this.item.image.includes('https://') == true ?  this.item.image : 'https://172.16.12.29:5001/images/' + this.item.image;
  }

  closeModal(){

    console.log("cerar");
    this.modalCtrl.dismiss();

  }

}
