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

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
  libros: any[] = [];
  @Input() librosIN: any[];

  constructor(public  webSocket: WebsocketService,private serviceDownload: DownloadFileService,private transfer: FileTransfer,
              private file: File,private platform: Platform,private booksService: BooksService,private zip: Zip) {

  }

  ngOnInit() {
    this.libros = this.librosIN;
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
    const directory = this.file.externalDataDirectory;

    this.file.checkDir(directory,'Libro'+ item.id).then(_ =>{
        console.log("Existe el directorio");
        //Verifica conexion con el servidor
        const status = this.webSocket.getStatusSocket() == 1 ? true : false;

        if(status==false)
           console.log(status);
        else 
          this.buscarActualizaciones();

    }).catch(err => {
        console.log("No exite el directorio");
        this.booksService.getBook(item.id).subscribe(data => {
          this.download(data["url"],item);
        });
    });
  }

  buscarActualizaciones() {
      
  }

  download(url,item) {
    const fileTransfer: FileTransferObject = this.transfer.create();

    const nameFile ='Libro'+ item.id + '.zip';
    const directory = this.file.externalDataDirectory;
    
    //this.file.dataDirectory

    //Descarga libro
    fileTransfer.download(url, directory + nameFile).then(entry => {
      //Descomprime libro
      return this.zip.unzip(entry.toURL(), directory + 'Libro'+ item.id,(progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%'));
    })
    .then(result =>{
      if(result === 0) console.log('SUCCESS');
      if(result === -1) console.log('FAILED');

      //Elimina zip para ahorra espacio
      return this.file.removeFile(directory,nameFile);
    })
    .then( data =>{
      console.log(data);
      alert("Terminado");
    })
    .catch(err => {
      console.error(err);
      alert(err);
    });

    fileTransfer.onProgress(progress => {
      //console.log(progress);
      let status = Math.round(100 * progress.loaded / progress.total);
      console.log(`Files are ${status}% downloaded`); 
    });
  }

}
