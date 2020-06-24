import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-codes',
  templateUrl: './codes.component.html',
  styleUrls: ['./codes.component.scss'],
})
export class CodesComponent implements OnInit {
  libros: any[];
  @Output() librosDescargados = new EventEmitter();

  FrmCodigo = {
    codigo : ''
  };

  constructor(private loadingController: LoadingController, private booksService: BooksService,
              private alertController: AlertController) {    
  }

  ngOnInit() {}

  async IngresarCodigo() {
    let loading;

    try {

      if (this.FrmCodigo.codigo === '') { return; }

      loading = await this.loadingController.create({
        mode: 'ios',
        message: 'Validando...'
      });


      const code = this.FrmCodigo.codigo;
      this.libros =  await this.booksService.getBooks(code).toPromise();



      await this.loadingController.dismiss();

      const alert = await this.alertController.create({
        header: 'LBS Plus Demo',
        // subHeader: 'Subtitle',
        message: `Has adquirido ${ this.libros.length} libros`,
        mode: 'ios',
        buttons: ['Aceptar']
      });

      await alert.present();

      this.FrmCodigo.codigo = '';
      
      this.librosDescargados.emit(this.libros);

    } catch (err) {
      console.log(err);
      await this.loadingController.dismiss();

      const alert = await this.alertController.create({
        header: 'LBS Plus Demo',
        // subHeader: 'Subtitle',
        message: err.error,
        mode: 'ios',
        buttons: ['Aceptar']
      });

      await alert.present();
    }
  }

}
