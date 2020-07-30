import { Component, OnInit } from '@angular/core';
import { PickerController, Platform } from '@ionic/angular';
import { RecursosService } from '../../api/recursos.service';
import { File } from '@ionic-native/file/ngx';
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

  constructor(private pickerController: PickerController, private apiEvidencias: EvidenciasService, private transfer: FileTransfer,
    private file: File, private platform: Platform, private fileOpener: FileOpener, private api: apiBase) { }

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
    console.log(item);
    const { Browser } = Plugins;
    if (this.platform.is('cordova')) {
      this.download(`${this.api.url}/resources/${item.pathRecurso}`);
    } else {
      await Browser.open({ url: `${this.api.url}/resources/${item.pathRecurso}` });
    }
  }

  download(url) {
    const fileTransfer: FileTransferObject = this.transfer.create();


    fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
        console.log('download complete: ' + entry.toURL());
        this.fileOpener.open(this.file.dataDirectory + 'file.pdf', 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));
    }, (error) => {
      // handle error
    });

  }

}
