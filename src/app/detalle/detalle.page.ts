import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  @Input() item;

  constructor(private modalCtrl: ModalController) { 
    
  }

  ngOnInit() {
    console.log(this.item);
    console.log(this.item.image.includes('http://'));
    this.item.image = this.item.image.includes('http://') == true ?  this.item.image : 'http://35.193.103.213/images/' + this.item.image;
  }

  closeModal (){
      console.log("cerar");
      this.modalCtrl.dismiss();
  }

}

