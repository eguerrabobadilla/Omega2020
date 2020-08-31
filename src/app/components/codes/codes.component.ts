import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { BooksService } from '../../services/books.service';
import { Storage } from '@ionic/storage';
import { WebsocketService } from 'src/app/services/websocket.service';
import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';
import { Libroscodigos } from 'src/app/models/Libroscodigos';

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
              private alertController: AlertController,private storage: Storage,public  webSocket: WebsocketService) {    
  }

  ngOnInit() {
    this.storage.get('books').then((librosLocales) => {
      const status = this.webSocket.getStatusSocket() == 1 ? true : false;
      //console.log(librosLocales);

      if(status === true)
      {
        console.log("Con conexion a internet");
        const tipo  = this.getKeyToken('tipo');
        
        //Si el tipo es alumno y no hay libros guardados de manera local en la bd
        //if(tipo==="Alumno" && librosLocales==null) {
        if(librosLocales==null) {
          this.booksService.getBooksGrado().subscribe(data => {
            this.libros = data;
            this.librosDescargados.emit(this.libros);
            this.storage.set('books',this.libros);
          });
        }
        //else if(tipo==="Alumno") {
        else {
          this.booksService.getBooksGrado().subscribe(data => {
            //Busca si viene algun nuevo libro del servidor
            data.forEach(element => {
               const libroD = librosLocales.filter(l => l.Id == element.Id);
               if(libroD.length == 0)
                  librosLocales.push(element);
            });

            //Busco si algun libro ya no debe estar en el dispostivo
            let index=0;
            librosLocales.forEach(element => {
              const libroD = data.filter(l => l.Id == element.Id);
              if(libroD.length == 0)
                 librosLocales.splice(index,1);
                 //console.log(element);
              index++;
           });

            this.libros = librosLocales;
            this.librosDescargados.emit(this.libros);
            this.storage.set('books',this.libros);
          });
        }
      }
      else {
        this.libros = librosLocales;
        this.librosDescargados.emit(this.libros);
      }
    });
  }

  getKeyToken(key: string): string {

    const jwt = localStorage.getItem('USER_INFO');

    const jwtData = jwt.split('.')[1];
    // let decodedJwtJsonData = window.atob(jwtData);
    const decodedJwtJsonData = decodeURIComponent(escape(window.atob(jwtData)));
    const decodedJwtData = JSON.parse(decodedJwtJsonData);

    const value = decodedJwtData[key];

    return value;
  }


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

      await this.storage.set('books',this.libros);

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
