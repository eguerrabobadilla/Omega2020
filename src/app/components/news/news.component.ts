import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../api/news.service';
import { DetallesNewsPage } from 'src/app/pages/detalles-news/detalles-news.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  LstNoticias: any[] = [];

  constructor(private apiNoticias: NewsService, private modalCrl: ModalController) { }

  ngOnInit() {
    this.cargar();
  }


  
  public cargar() {

    this.apiNoticias.get().subscribe(data =>{
      this.LstNoticias = data;
      console.log('this.LstNoticias yeah');
      console.log(this.LstNoticias);
    });
  }
  async openDetail(event: Event, item) {

    const modal = await this.modalCrl.create({
        component: DetallesNewsPage,
        cssClass: 'my-custom-modal-css',
        mode: 'ios',
        backdropDismiss: true,
        showBackdrop: false,
        componentProps: {item}
      });
      
      return await modal.present();
    }


}
