import { Component, OnInit, ViewChild } from '@angular/core';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController, IonList, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { timeStamp } from 'console';

declare var window;

@Component({
  selector: 'app-explorer-file',
  templateUrl: './explorer-file.page.html',
  styleUrls: ['./explorer-file.page.scss'],
})
export class ExplorerFilePage implements OnInit {
  LstFiles: any[] = [];
  @ViewChild(IonList, {static: false}) ionList: IonList;

  constructor(private modalCtrl:ModalController,private transfer: FileTransfer,private file: File,private platform: Platform,
              private loadingController:LoadingController,private alertController:AlertController,private toastController: ToastController) { }

  ngOnInit() {
    this.cargar();
  }

  cerrar(){
    this.modalCtrl.dismiss();
  }

  async cargar() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });

    await loading.present();

    this.LstFiles = [];

    const pathDownload = this.platform.is("android") ? this.file.dataDirectory  :  this.file.dataDirectory;

    this.file.listDir(pathDownload,'exportPreguntas/').then(async files => {

      await Promise.all(files.map(async (file) => { 
        let fileEntry = await this.resolveLocalFileSystem(file);
        let metadata  = await this.getMetadataFile(fileEntry);
        file["modificationTime"] = metadata["modificationTime"];
        file["dateTimeStamp"] = Date.parse(file["modificationTime"]);
        this.LstFiles.push(file);
      }));
      
      this.LstFiles.sort((a, b) => (a.dateTimeStamp > b.dateTimeStamp) ? 1 : -1);
      this.LstFiles.reverse();
      this.loadingController.dismiss();
      
    }).catch(error =>{
      this.loadingController.dismiss();
    });

  }
  
  resolveLocalFileSystem(file) {
    let promise = new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(file.nativeURL, (fileEntry) => {
        resolve(fileEntry);
      });
    });
    return promise;
  }

  getMetadataFile(fileEntry){
    let promise = new Promise((resolve, reject) => {
      fileEntry.getMetadata((metadata) => {
        //console.log("file date : " + metadata.modificationTime);
        resolve(metadata);
      });
    });

    return promise;
  }

  async importar(file) {
    const alertTerminado = await this.alertController.create({
      header: 'Importar',
      message: '¿Está seguro de importar el banco de preguntas ' + file.name +'?',
      buttons: [
        {
          text: 'No', handler: () =>  {
            return;
          }
        },
        {
          text: 'Si', handler: async () => {
            this.modalCtrl.dismiss({
              file :file
            });
          }
        }
      ]
    });

    alertTerminado.present();
  }

  async eliminar(file) {
    const alertTerminado = await this.alertController.create({
      header: 'Importar',
      message: '¿Está seguro de eliminar  el banco de preguntas ' + file.name +'?',
      buttons: [
        {
          text: 'No', handler: () =>  {
            return;
          }
        },
        {
          text: 'Si', handler: async () => {
            const pathDownload = this.platform.is("android") ? this.file.dataDirectory  :  this.file.dataDirectory;

            this.file.removeFile(pathDownload + "exportPreguntas/" ,file.name).then(data =>{
              this.ionList.closeSlidingItems();
              this.presentToast("Banco Eliminado");
              this.cargar();
            });
          }
        }
      ]
    });

    alertTerminado.present();
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      color: "dark",
      mode: "ios",
      cssClass : "toastCenter",
      duration: 3000
    });

    toast.present();
  }

}
