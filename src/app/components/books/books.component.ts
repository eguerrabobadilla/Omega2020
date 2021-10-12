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
import { PortadasService } from 'src/app/api/portadas.service';
import { apiBase } from 'src/app/api/apiBase';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
  libros: any[] = [];
  spiner = true;
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
  @Output() buscarPortadas = new EventEmitter();
  pathStorage:any;
  tipoUsuario:any;
  token:any;

  constructor(public  webSocket: WebsocketService,private serviceDownload: DownloadFileService,private transfer: FileTransfer,
              private file: File,private platform: Platform,private booksService: BooksService,private zip: Zip,
              private webview: WebView,private storage: Storage,private applicationRef:ApplicationRef,private globalServicies: GlobalService,
              private renderer: Renderer2,private apiPortadas: PortadasService,private api: apiBase,public sanitizer: DomSanitizer,
              private elem: ElementRef) {
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
    console.log("inicia componente bookssssssssssssssssssssssssssssssssss");
    this.pathStorage = await this.globalServicies.getNameStorage();
    console.log("pathStorage");
    this.tipoUsuario = this.globalServicies.getKeyToken("tipo");

    setTimeout(() => {
      //this.iniciarValidacion();
      this.buscarPortadas.emit();
      //console.log(this.ArrayCircleProgress);
    }, 1000);
  }

  async ngAfterViewInit (){
    console.log("ngAfterViewInit");
    
    setTimeout(() => {
      //this.updateAutoHeightSlider.emit();
      this.spiner = false;
    }, 2500);
    /*this.ArrayCircleProgress.changes.subscribe((items: Array<CircleProgressComponent>) => {
      //messages.forEach((item: SystemMessageComponent) => console.log(item.message));
      console.log(items);
    });*/
  }

  waitForImages() {
    console.log("waitForImages");
    //var grid = document.getElementById("masonry");
    //let allItems = document.querySelectorAll('.masonry-item');
    let allItems = this.elem.nativeElement.querySelectorAll('.masonry-item');
    if( allItems ) {
      for(var i=0;i<allItems.length;i++){
        /*imagesLoaded( allItems[i], (instance) => {
          var item = instance.elements[0];
          this.resizeMasonryItem(item);
          console.log("Waiting for Images");
        } );*/
      }
    }
  }

  resizeMasonryItem(item){
    /* Get the grid object, its row-gap, and the size of its implicit rows */
    //let grid = document.getElementsByClassName('masonry')[0];
    let grid = this.elem.nativeElement.getElementsByClassName('masonry')[0];
    
    console.log(grid);
    if( grid ) {
      let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
          rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows')),
          gridImagesAsContent = item.querySelector('img.masonry-content');
 
      /*
       * Spanning for any brick = S
       * Grid's row-gap = G
       * Size of grid's implicitly create row-track = R
       * Height of item content = H
       * Net height of the item = H1 = H + G
       * Net height of the implicit row-track = T = G + R
       * S = H1 / T
       */
      let rowSpan = Math.ceil((item.querySelector('.masonry-content').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
      
      /* Set the spanning as calculated above (S) */
      item.style.gridRowEnd = 'span '+rowSpan;
      if(gridImagesAsContent) {
        //item.querySelector('img.masonry-content').style.height = item.getBoundingClientRect().height + "px";
      }
    }
  }
  
  reorder(arr, columns) {
    // READ HERE
    // this is the magic
    // re-order the array so the "cards" read left-right
    // cols === CSS column-count value
    
    const cols = columns;
    const out = [];
    let col = 0;
    while(col < cols) {
        for(let i = 0; i < arr.length; i += cols) {
            let _val = arr[i + col];
            if (_val !== undefined)
                out.push(_val);
        }
        if(col==0)
        {
          const fakeBook= {
            Escolaridad: "Kinder",
            Grados: "1",
            Id: 0,
            Idioma: "Espanol",
            Libroscodigos: [],
            Librospreparatoria: [],
            Materias: [],
            Nombre: "Lectoescritura",
            NombreArchivo: "KIN_01_lectoescritura",
            RutaThumbnails: "assets/img/temp.jpg",
            Suffix: "st",
            TipoLibro: "Real",
            Usuariolibros: [],
            Version: 1,
            Versiones: []
          }
          //Inserta libro falso
          out.push(fakeBook)
        }
        col++;
    }
    //this.setState({ cards: out, columns: columns });

    this.libros = out;
    // yes, I know Nick... you had another slicker ES6-y implementation
    // but this one I could understand :)
  }

  iniciarValidacion() {
    const directory = this.file.dataDirectory + "books2020/";
    
    //this.data = new BehaviorSubject(element);
    
    this.libros = this.librosIN;
    //console.log(JSON.stringify(this.librosIN));
    this.libros.forEach(item => {


      item.progreso=0;
      item.display="none";
      item.spinner="none";
      item.status="pendiente";
      if(this.platform.is('cordova')) {
        const date = new Date();
        const timestamp = date.getTime();

        //item.RutaThumbnails = item.RutaThumbnails.includes("?t=") ? item.RutaThumbnails : `${this.webview.convertFileSrc(urlCover)}?t=${timestamp}`;
      
        if(item.RutaThumbnails.includes("?t=")){ 
          let NombreCover=item.RutaThumbnails.split("/");

          const urlCover = `${this.file.dataDirectory}covers/${NombreCover[NombreCover.length-1].split("?")[0]}`;
          const pathIcono = `${this.file.dataDirectory}covers/iconos/${item.NombreArchivo}.svg`
          //console.log(item.RutaThumbnails);
          //console.log(urlCover);
          item.RutaThumbnails = `${this.webview.convertFileSrc(urlCover)}?t=${timestamp}`;
          item.Icono=`${this.webview.convertFileSrc(pathIcono)}?t=${timestamp}`;
        }
        else{
          const urlCover = `${this.file.dataDirectory}covers/${item.RutaThumbnails}`;
          const pathIcono = `${this.file.dataDirectory}covers/iconos/${item.NombreArchivo}.svg`

          item.RutaThumbnails=`${this.webview.convertFileSrc(urlCover)}?t=${timestamp}`;
          item.Icono=`${this.webview.convertFileSrc(pathIcono)}?t=${timestamp}`;
        }
      } else {
        const date = new Date();
        const timestamp = date.getTime();
        
        item.RutaThumbnails = item.RutaThumbnails.includes("?t=") ? item.RutaThumbnails : `${this.api.url}/covers/${item.RutaThumbnails}?t=${timestamp}`;
        item.Icono = `${this.api.url}/covers/iconos/${item.NombreArchivo}.svg?t=${timestamp}`;
        //console.log(item.Icono);
      }
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

  async eliminarLibro(item) {
    console.log(item);
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
    this.token=localStorage.getItem('USER_INFO');
    
    item.flecha="none";

    this.existeDirectorio(directory,'Libro'+ item.Id,item).then(_ =>{
        //Verifica conexion con el servidor
        const status = this.webSocket.getStatusSocket() == 1 ? true : false;
        console.log("pathLibro",directory + 'Libro'+ item.Id);
        item.status="terminado";

        if(status=== false) {
          (<any>window).modusecho.echo([directory + 'Libro'+ item.Id, item.Id ,"Lbs",this.token]);
        }
        else {
          this.buscarActualizaciones(item).then(data => {
            if(parseInt(data["version"]) > parseInt(item.Version))
            {
                item.spinner="block";
                item.descarga="block";
                item.progreso=0;
                this.download(data["url"] + "/" + item.Version,item,data["version"],"update");
            }
            else 
              (<any>window).modusecho.echo([directory + 'Libro'+ item.Id, item.Id ,"Lbs",this.token]);
          }).catch(() => {
              //En caso de error abre el libro;
              (<any>window).modusecho.echo([directory + 'Libro'+ item.Id, item.Id ,"Lbs",this.token]);
          });
        } 
        //console.log(this.webview.convertFileSrc(directory + 'Libro' + item.id + "/index.html"));
    }).catch(err => {
        console.log(err);
        //alert(err);
    });
  }

  existeLibro(directory,path){
    var promise = new Promise((resolve, reject) => {
      this.file.checkDir(directory,path).then(_ =>{
          console.log("Existe el directorio");
          resolve("ok");
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
          resolve("ok");
      }).catch(err => {
          console.log("No existe el directorio");
          console.log(err);
          item.spinner="block";

          //Solicita la url de descarga
          this.booksService.getBook(item.Id).subscribe(data => {
            this.download(data["url"],item,data["version"],"install");
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

  buscarActualizaciones(item) {
    const directory = this.file.dataDirectory + "books2020/";

    var promise = new Promise((resolve, reject) => { 
      this.booksService.getBook(item.Id).subscribe(data => {
          resolve(data);
      },err =>{
        reject();
        //reinicia el estado de la descarga
        /*item.spinner="none";
        item.descarga="block";
        item.status="terminado";
        item.flecha= "block";
        item.progreso=0;
        item.descargado="no";*/
      });
    });

    return promise;
  }

  download(url,item,version,tipo) {
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
      item.Version=version;

      this.storage.set(this.pathStorage,this.libros).then( () => {
        console.log("guardo libros");
      });
    })
    .catch(err => {
      /*console.error(err);
      alert(err);*/
      alert("Error con la conexión, por favor intente descargar de nuevo");
      
      if(tipo=="install")
      {
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
      }
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

  loadData(event){
    //console.log(event);
    this.updateAutoHeightSlider.emit();
    event.target.complete();
  }

}
