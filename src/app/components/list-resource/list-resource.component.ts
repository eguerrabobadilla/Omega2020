import { Component, OnInit } from '@angular/core';
import { PickerController, Platform, ModalController,LoadingController } from '@ionic/angular';
import { RecursosService } from '../../api/recursos.service';
import { Plugins } from '@capacitor/core';
import { File,FileEntry } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { apiBase } from 'src/app/api/apiBase';
import { NewResourcePage } from 'src/app/new-resource/new-resource.page';
import { CommentStmt } from '@angular/compiler';

@Component({
  selector: 'app-list-resource',
  templateUrl: './list-resource.component.html',
  styleUrls: ['./list-resource.component.scss'],
})
export class ListResourceComponent implements OnInit {

  rotateImg = 0;
  items: any[] = [];
  meses: string[];
  mesActual: string = 'Mayo';
  LstRecursos: any[] = [];
  materiaId =0;
  loading: any;

  constructor(private pickerController: PickerController, private apiRecursos: RecursosService, private transfer: FileTransfer,
              private file: File, private platform: Platform,private fileOpener: FileOpener,private api: apiBase,private modalCrl: ModalController,public loadingController: LoadingController) {
  }

ngOnInit() {
    //console.log("jose")
    this.meses = ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
                  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];

    const mesesReal = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
                  'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const d = new Date();
    this.mesActual= mesesReal[d.getMonth()];

    this.apiRecursos.getByMonth(this.mesActual).subscribe(data => {
      //console.log(data);
      this.LstRecursos = data;
    });
  }

  public cargar(materiaId) {
    this.materiaId = materiaId;
    console.log(this.materiaId);
    //0=todas 1=Filtrado por materia
    if(materiaId==0){
      this.apiRecursos.getByMonth(this.mesActual).subscribe(data => {
        //console.log(data);
        this.LstRecursos = data;
      });
    }
    else{
      this.apiRecursos.getRecursosMaterias(materiaId,this.mesActual).subscribe(data => {
        //console.log(data);
        this.LstRecursos = data;
      });
    }
  }

  async openPicker() {
    const picker = await this.pickerController.create({
        mode : 'ios',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Aceptar',
            handler: (value: any) => {
              this.mesActual = value.Meses.value;
              this.apiRecursos.getByMonth(this.mesActual).subscribe(data => {
                  this.LstRecursos = data;
              });
            }
          }
        ],
        columns: [{
            name: 'Meses',
            options: this.getColumnOptionsMeses()
          }
        ]
    });
    picker.columns[0].selectedIndex = this.getRealMonth();
    picker.present();

  }

  getRealMonth() {
    /*
    Dado que el año escolar no inicia en Enero se tiene que ajustar para llenar el picker 
    ejemplo enero en lugar de ser index 1 es 6
    */
   console.log("getRealMonth");
    const actualDate = new Date();
    let month = actualDate.getMonth() + 1;

    console.log(month);

    if(month==1) month= 5;
    else if(month==2) month= 6;
    else if(month==3) month= 7;
    else if(month==4) month= 8;
    else if(month==5) month= 9;
    else if(month==6) month= 10;
    else if(month==7) month= 11;
    else if(month==8) month= 0;
    else if(month==9) month= 1;
    else if(month==10) month= 2;
    else if(month==11) month= 3;


    console.log(month);
    return month;
  }

  getColumnOptionsMeses() {
    const options = [];

    this.meses.forEach(x => {
      options.push({text: x , value: x});
    });

    return options;
  }

  async openFile(item) {
    this.loading =await this.loadingController.create({
      //cssClass: 'my-custom-class',
      message: 'Cargando...',
      duration: 120000
    });

    this.loading.present();
    
    console.log(item);
    const { Browser } = Plugins;
    if (this.platform.is('cordova')) {
      this.download(`${this.api.url}/resources/${item.PathRecurso}`);
      //this.download(`http://192.168.0.16:5000/resources/${item.PathRecurso}`);
    } else {
      await Browser.open({ url: `${this.api.url}/resources/${item.PathRecurso}` });
      this.loadingController.dismiss();
    }
  }

  urlify(text) {
     console.log(text);
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return '<a href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
  }

  download(url) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const extension = url.split('.').pop(); 

    fileTransfer.download(url, this.file.dataDirectory + 'file.'+ extension).then((entry) => {
        console.log('download complete: ' + entry.toURL());

        let files = entry as FileEntry;
        files.file(success =>{
            //success.name;

            this.fileOpener.open(this.file.dataDirectory + 'file.' + extension , success.type)
            .then(() => { console.log('File is opened'); this.loading.dismiss(); })
            .catch(e => console.log('Error opening file', e));
        });
    }, (error) => {
      // handle error
      console.log(error);
      alert(error.exception);
    });

  }

  public async edit(event,item){
    event.stopPropagation();
    
    const modal = await this.modalCrl.create({
      component: NewResourcePage,
      // cssClass: 'my-custom-modal-css',
      cssClass: 'my-custom-modal-css-capturas',
      showBackdrop: false,
      componentProps: {item},
      mode: 'ios',
      backdropDismiss: true
    });

    await modal.present();

    modal.onDidDismiss().then( async (data) => {
        console.log(this.materiaId);
        this.cargar(this.materiaId);
    });
  }

  public permisoEditar() {
    if(this.getKeyToken('tipo')=='Profesor')
      return true;
    else
      return false;
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
}
