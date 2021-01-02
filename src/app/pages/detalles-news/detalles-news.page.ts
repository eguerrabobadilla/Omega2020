import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { apiBase } from 'src/app/api/apiBase';
import { NewsService } from 'src/app/api/news.service';

@Component({
  selector: 'app-detalles-news',
  templateUrl: './detalles-news.page.html',
  styleUrls: ['./detalles-news.page.scss'],
})
export class DetallesNewsPage implements OnInit {
  @Input() item;

  constructor(private modalCtrl: ModalController,private api: apiBase,private apiNoticias: NewsService) { }

  ngOnInit() {
    console.log(this.item.Image.includes('http'));
    this.item.image = this.item.Image.includes('http') == true ?  this.item.Image : `${this.api.url}/images/${this.item.Image}`;
  }

  closeModal(){
    console.log("cerar");
    this.modalCtrl.dismiss();
  }

  async ionViewDidEnter() { 
    this.apiNoticias.updateAcceso(this.item.Id).toPromise();
    if(this.item.Noticiasusuarios.length > 0)
      this.item.Noticiasusuarios[0].Visto='SI';
  }

}
