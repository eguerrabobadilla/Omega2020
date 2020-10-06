import { Component, OnInit } from '@angular/core';
import { PickerController, Platform, LoadingController } from '@ionic/angular';
import { RecursosService } from '../../api/recursos.service';
import { File,FileEntry } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { apiBase } from '../../api/apiBase';
import { Plugins } from '@capacitor/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { EvidenciasService } from '../../api/evidencias.service';

@Component({
  selector: 'app-evidences',
  templateUrl: './evidences.component.html',
  styleUrls: ['./evidences.component.scss'],
})

export class EvidencesComponent implements OnInit {
  LstEvidencias: any[] = [];
  meses: string[];
  loading: any;

  constructor(private pickerController: PickerController, private apiEvidencias: EvidenciasService, private transfer: FileTransfer,
    private file: File, private platform: Platform, private fileOpener: FileOpener, private api: apiBase,public loadingController: LoadingController) { }

  ngOnInit() {
    this.meses = ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    'Enero', 'Febreo', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];
    this.cargar();
  }

  openDetail(){


  }

  public cargar() {
    this.apiEvidencias.get().subscribe(data => {
      this.LstEvidencias = data;
    });
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

  download(url) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const extension = url.split('.').pop(); 

    fileTransfer.download(url, this.file.dataDirectory + 'file.'+ extension).then((entry) => {
        console.log('download complete: ' + entry.toURL());

        let files = entry as FileEntry;
        files.file(success =>{
            //success.name;

            this.fileOpener.open(this.file.dataDirectory + 'file.' + extension , success.type)
            .then(() => { console.log('File is opened');  this.loadingController.dismiss();})
            .catch(e => { console.log('Error opening file', e);  this.loadingController.dismiss(); });
        });
    }, (error) => {
      // handle error
      console.log(error);
      alert(error.exception);
      this.loadingController.dismiss();
    });
  }


}
