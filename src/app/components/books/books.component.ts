import { Component, OnInit, Input, ViewChildren, QueryList,ApplicationRef,Output,EventEmitter,ViewChild,ElementRef,Renderer2 } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Plugins } from '@capacitor/core';
import { Platform, AlertController } from '@ionic/angular';
import { BooksService } from 'src/app/services/books.service';
import { Zip } from '@ionic-native/zip/ngx';
import { stat } from 'fs';
import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { BehaviorSubject} from 'rxjs';
import { CircleProgressComponent } from '../circle-progress/circle-progress.component';
import { Storage } from '@ionic/storage';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
  libros: any[] = [];
  //private  BackgroundGeolocation: modusecho;
  @ViewChildren(CircleProgressComponent) ArrayCircleProgress: QueryList<CircleProgressComponent>;
  @ViewChild('panelKinder', {read: ElementRef, static: false}) panelKinder: ElementRef;
  @ViewChild('botonKinder', {read: ElementRef, static: false}) botonKinder: ElementRef;

  @ViewChild('panelPrimaria', {read: ElementRef, static: false}) panelPrimaria: ElementRef;
  @ViewChild('botonPrimaria', {read: ElementRef, static: false}) botonPrimaria: ElementRef;

  @ViewChild('panelSecundaria', {read: ElementRef, static: false}) panelSecundaria: ElementRef;
  @ViewChild('botonSecundaira', {read: ElementRef, static: false}) botonSecundaira: ElementRef;

  @ViewChild('panelPreparatoria', {read: ElementRef, static: false}) panelPreparatoria: ElementRef;
  @ViewChild('botonPreparatoria', {read: ElementRef, static: false}) botonPreparatoria: ElementRef;


  @Input() librosIN: any[];
  @Output() updateAutoHeightSlider = new EventEmitter();
  pathStorage:any;
  tipoUsuario:any;

  constructor(public  webSocket: WebsocketService,private serviceDownload: DownloadFileService,private transfer: FileTransfer,
              private file: File,private platform: Platform,private booksService: BooksService,private zip: Zip,
              private webview: WebView,private storage: Storage,private applicationRef:ApplicationRef,private globalServicies: GlobalService,
              private renderer: Renderer2) {
  }

  abrirKinder(){
    console.log("abrirKinder");
    
    const statusPanel = this.panelKinder.nativeElement.getAttribute("status");
    if(statusPanel=="close") {
      this.renderer.removeStyle(this.panelKinder.nativeElement, 'max-height');
      this.renderer.addClass(this.botonKinder.nativeElement, 'active');
      this.panelKinder.nativeElement.setAttribute('status','open');
      this.renderer.removeStyle(this.panelKinder.nativeElement, 'display');
    }
    else {
      this.renderer.setStyle(this.panelKinder.nativeElement, 'max-height','0');
      this.renderer.removeClass(this.botonKinder.nativeElement, 'active');
      this.panelKinder.nativeElement.setAttribute('status','close');
      this.renderer.setStyle(this.panelKinder.nativeElement, 'display','none');
    }

    this.updateAutoHeightSlider.emit();
  }

  abrirPrimaria(){
    console.log("abrirPrimaria");
    
    const statusPanel = this.panelPrimaria.nativeElement.getAttribute("status");
    if(statusPanel=="close") {
      this.renderer.removeStyle(this.panelPrimaria.nativeElement, 'max-height');
      this.renderer.addClass(this.botonPrimaria.nativeElement, 'active');
      this.panelPrimaria.nativeElement.setAttribute('status','open');
      this.renderer.removeStyle(this.panelPrimaria.nativeElement, 'display');
    }
    else {
      this.renderer.setStyle(this.panelPrimaria.nativeElement, 'max-height','0');
      this.renderer.removeClass(this.botonPrimaria.nativeElement, 'active');
      this.panelPrimaria.nativeElement.setAttribute('status','close');
      this.renderer.setStyle(this.panelPrimaria.nativeElement, 'display','none');
    }

    this.updateAutoHeightSlider.emit();
  }

  abrirSecundaria() {
    console.log("abrirSecundaria");
    
    const statusPanel = this.panelSecundaria.nativeElement.getAttribute("status");
    if(statusPanel=="close") {
      this.renderer.removeStyle(this.panelSecundaria.nativeElement, 'max-height');
      this.renderer.addClass(this.botonSecundaira.nativeElement, 'active');
      this.panelSecundaria.nativeElement.setAttribute('status','open');
      this.renderer.removeStyle(this.panelSecundaria.nativeElement, 'display');
    }
    else {
      this.renderer.setStyle(this.panelSecundaria.nativeElement, 'max-height','0');
      this.renderer.removeClass(this.botonSecundaira.nativeElement, 'active');
      this.panelSecundaria.nativeElement.setAttribute('status','close');
      this.renderer.setStyle(this.panelSecundaria.nativeElement, 'display','none');
    }

    this.updateAutoHeightSlider.emit();
  }

  abrirPreparatoria(){
    
    
    const statusPanel = this.panelPreparatoria.nativeElement.getAttribute("status");

    if(statusPanel=="close") {
      this.renderer.removeStyle(this.panelPreparatoria.nativeElement, 'max-height');
      this.renderer.addClass(this.botonPreparatoria.nativeElement, 'active');
      this.panelPreparatoria.nativeElement.setAttribute('status','open');
      this.renderer.removeStyle(this.panelPreparatoria.nativeElement, 'display');
    }
    else {
      this.renderer.setStyle(this.panelPreparatoria.nativeElement, 'max-height','0');
      this.renderer.removeClass(this.botonPreparatoria.nativeElement, 'active');
      this.panelPreparatoria.nativeElement.setAttribute('status','close');
      this.renderer.setStyle(this.panelPreparatoria.nativeElement, 'display','none');
    }

    console.log("abrirPreparatoria");
    this.updateAutoHeightSlider.emit();
  }

  async ngOnInit() {
    
    this.pathStorage = await this.globalServicies.getNameStorage();
    console.log("pathStorage");
    this.tipoUsuario = this.globalServicies.getKeyToken("tipo");

    setTimeout(() => {
      this.iniciarValidacion();
      //console.log(this.ArrayCircleProgress);
    }, 1000);
  }

  async ngAfterViewInit (){
    console.log("ngAfterViewInit");

    setTimeout(() => {
      this.updateAutoHeightSlider.emit();
    }, 2500);
    /*this.ArrayCircleProgress.changes.subscribe((items: Array<CircleProgressComponent>) => {
      //messages.forEach((item: SystemMessageComponent) => console.log(item.message));
      console.log(items);
    });*/
  }

  iniciarValidacion() {
    const directory = this.file.dataDirectory + "books2020/";

    //this.data = new BehaviorSubject(element);
    
    this.libros = this.librosIN;
    this.libros.forEach(item => {
      item.progreso=0;
      item.display="none";
      item.spinner="none";
      item.status="pendiente";
      if (this.platform.is('cordova')) {
        this.existeLibro(directory,'Libro'+ item.Id).then(() =>{
          //item.opacity= 1;
          if(item.descargado=="no")
              throw new Error("El libro no esta descargado");

          item.descarga = "none";
          item.flecha= "none";
        }).catch(() =>{
          //item.opacity= 0.2;
          item.descargado="no";
          item.descarga = "block";
          item.flecha= "block";
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

  getTipoUsuario() {
    const tipo=this.globalServicies.getKeyToken("tipo");
    
    return tipo;
  }

  async openBook(item){
    console.log(item);
    
    const { Browser } = Plugins;

    if(item.status=="descargando")
      return;

    console.log("openBook");
    item.status="descargando";

    if (this.platform.is('cordova')) {
        this.verificarLibro(item);
    } else {
      console.log("Opcion solo en celular");
      console.log(item.NombreArchivo);
      item.status="terminado";
      window.open('https://desktop.alfalbs.app/books/' + item.NombreArchivo + '/index.html');
      //window.open('../books/' + item.NombreArchivo + '/index.html');
    }
  }

  //Verifica si el existen el libro en el alamacenamiento
  verificarLibro(item){
    const directory = this.file.dataDirectory + "books2020/";
    console.log(directory);
    console.log('Libro'+ item.Id);
    
    item.flecha="none";

    this.existeDirectorio(directory,'Libro'+ item.Id,item).then(_ =>{
        //Verifica conexion con el servidor
        const status = this.webSocket.getStatusSocket() == 1 ? true : false;
        console.log("pathLibro",directory + 'Libro'+ item.Id);
        item.status="terminado";

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
          if(item.descargado=="no")
              throw new Error("El libro no esta descargado");
              
          console.log("Existe el directorio");
          resolve();
      }).catch(err => {
          console.log("No existe el directorio");
          console.log(err);
          item.spinner="block";

          //Solicita la url de descarga
          this.booksService.getBook(item.Id).subscribe(data => {
            this.download(data["url"],item);
            reject();
          },err =>{
            //reinicia el estado de la descarga
            item.spinner="none";
            item.descarga="block";
            item.status="terminado";
            item.flecha= "block";
            item.progreso=0;
            item.descargado="no";
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
    //item.display="block";
    //this.file.externalDataDirectory
    item.spinner="none";

    //Descarga libro
    fileTransfer.download(url, directory + nameFile).then(entry => {
      item.spinner="block";

      //Descomprime libro
      console.log(entry.toURL());
      console.log(directory + 'Libro'+ item.Id);
      //,(progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%')
      return this.zip.unzip(entry.toURL(), directory + 'Libro'+ item.Id);
    })
    .then(result =>{
      if(result === 0) { console.log('SUCCESS'); }
      if(result === -1) { console.log('FAILED'); }

      //Elimina zip para ahorrar espacio
      return this.file.removeFile(directory,nameFile);
    })
    .then( data =>{
      console.log(data);
      console.log("Terminado");
      //item.display="none";
      //item.opacity=1;
      item.spinner="none";
      item.descarga="none";
      item.status="terminado";
      item.descargado="si";
      item.progreso=0;

      this.storage.set(this.pathStorage,this.libros).then( () => {
        console.log("guardo libros");
      });
    })
    .catch(err => {
      /*console.error(err);
      alert(err);*/
      alert("Error con la conexión, por favor intente descargar de nuevo");

      //reinicia el estado de la descarga
      item.spinner="none";
      item.descarga="block";
      item.status="pendiente";
      item.flecha= "block";
      item.progreso=0;
      item.descargado="no";

      const circleP=this.ArrayCircleProgress.toArray().find(x => x.item.Id===item.Id);
      circleP.restartProgress();

      this.storage.set(this.pathStorage,this.libros).then( () => {
        console.log("guardo libros");
      });
    });

    fileTransfer.onProgress(progress => {
      //console.log(progress);
      //let status = Math.round(100 * progress.loaded / progress.total);
      //item.progreso += progress.loaded / progress.total;
      item.progreso = Math.round(100 *progress.loaded / progress.total);
      const circleP=this.ArrayCircleProgress.toArray().find(x => x.item.Id===item.Id);
      circleP.progress(item.progreso);
      //console.log(item.progreso);
      
      //console.log(`Files are ${status}% downloaded`); 
    });
  }

}
