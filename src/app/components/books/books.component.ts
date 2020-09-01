import { Component, OnInit, Input } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { BooksService } from 'src/app/services/books.service';
import { Zip } from '@ionic-native/zip/ngx';
import { stat } from 'fs';
import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {


  libros: any[] = [];
  //private  BackgroundGeolocation: modusecho;
  @Input() librosIN: any[];

  constructor(public  webSocket: WebsocketService,private serviceDownload: DownloadFileService,private transfer: FileTransfer,
              private file: File,private platform: Platform,private booksService: BooksService,private zip: Zip,
              private webview: WebView) {

  }

  ngOnInit() {
    setTimeout(() => {
      this.iniciarValidacion();
    }, 1000);
  }

  iniciarValidacion() {
    const directory = this.file.dataDirectory + "books2020/";

    this.libros = this.librosIN;
    this.libros.forEach(item => {
      item.progreso=0;
      item.display="none";
      if (this.platform.is('cordova')) {
        this.existeLibro(directory,'Libro'+ item.Id).then(() =>{
          item.opacity= 1;
        }).catch(() =>{
          item.opacity= 0.2;
        });
      }
    });
  }

  visualizarLibro() {
    //modusecho.echo(['dsfadsf','1',"Lbs"]);
  }
    //Funcion para desplegar la respuesta cuando es satisfactorio
  successCallback(message){
      alert(message);
  }

  async openBook(item){
    console.log(item);
    const { Browser } = Plugins;

    if (this.platform.is('cordova')) {
        this.verificarLibro(item);
    } else {
      console.log("Opcion solo en celular")
    }
  }

  //Verifica si el existen el libro en el alamacenamiento
  verificarLibro(item){
    const directory = this.file.dataDirectory + "books2020/";
    console.log(directory);
    console.log('Libro'+ item.Id);

    this.existeDirectorio(directory,'Libro'+ item.Id,item).then(_ =>{
        //Verifica conexion con el servidor
        const status = this.webSocket.getStatusSocket() == 1 ? true : false;
        console.log("pathLibro",directory + 'Libro'+ item.Id);

        if(status=== false) {
          (<any>window).modusecho.echo([directory + 'Libro'+ item.Id, item.Id ,"Lbs"]);
        }
        else {
          (<any>window).modusecho.echo([directory + 'Libro'+ item.Id, item.Id ,"Lbs"]);
        } 
          //this.buscarActualizaciones();

        //console.log(this.webview.convertFileSrc(directory + 'Libro' + item.id + "/index.html"));
    }).catch(err => {
        console.log(err);
    });
  }

  existeLibro(directory,path){
    var promise = new Promise((resolve, reject) => {
      this.file.checkDir(directory,path).then(_ =>{
          console.log("Existe el directorio");
          resolve();
      }).catch(err => {
          reject();
      });
    });

    return promise;
  }

  existeDirectorio(directory,path,item){
    var promise = new Promise((resolve, reject) => {
      this.file.checkDir(directory,path).then(_ =>{
          console.log("Existe el directorio");
          resolve();
      }).catch(err => {
          console.log("No existe el directorio");
          console.log(err);
          this.booksService.getBook(item.Id).subscribe(data => {
            this.download(data["url"],item);
            reject();
          });
      });
    });

    return promise;
  }

  buscarActualizaciones() {
      
  }

  download(url,item) {
    const fileTransfer: FileTransferObject = this.transfer.create();

    const nameFile ='Libro'+ item.Id + '.zip';
    const directory = this.file.dataDirectory + "books2020/";
    
    //this.file.dataDirectory
    item.display="block";
    //this.file.externalDataDirectory

    //Descarga libro
    fileTransfer.download(url, directory + nameFile).then(entry => {
      //Descomprime libro
      console.log(entry.toURL());
      console.log(directory + 'Libro'+ item.Id);
      return this.zip.unzip(entry.toURL(), directory + 'Libro'+ item.Id,(progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%'));
    })
    .then(result =>{
      if(result === 0) { console.log('SUCCESS'); }
      if(result === -1) { console.log('FAILED'); }

      //Elimina zip para ahorrae espacio
      return this.file.removeFile(directory,nameFile);
    })
    .then( data =>{
      console.log(data);
      console.log("Terminado");
      item.display="none";
      item.opacity=1;
    })
    .catch(err => {
      console.error(err);
      alert(err);
    });

    fileTransfer.onProgress(progress => {
      //console.log(progress);
      //let status = Math.round(100 * progress.loaded / progress.total);
      item.progreso += progress.loaded / progress.total;
      console.log(item.progreso);
      //console.log(`Files are ${status}% downloaded`); 
    });
  }

}
