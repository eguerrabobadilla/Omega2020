import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { apiBase } from '../api/apiBase';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  @Input() item;

  constructor(private modalCtrl: ModalController,private api: apiBase) { 
    
  }

  ngOnInit() {
    console.log(this.item);
    if(this.item.Image != undefined)
    {
      console.log(this.item.Image.includes('http://'));
      this.item.image = this.item.Image.includes('http://') == true ?  this.item.Image : `${this.api.url}/images/${this.item.Image}`;
    }
  }

  closeModal (){
      console.log("cerar");
      this.modalCtrl.dismiss();
  }
}

