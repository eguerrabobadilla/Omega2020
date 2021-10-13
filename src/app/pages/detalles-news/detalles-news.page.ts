import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { apiBase } from 'src/app/api/apiBase';
import { NewsService } from 'src/app/api/news.service';
import { Plugins } from '@capacitor/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File,FileEntry } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-detalles-news',
  templateUrl: './detalles-news.page.html',
  styleUrls: ['./detalles-news.page.scss'],
})
export class DetallesNewsPage implements OnInit {
  @Input() item;
  loading: any;

  constructor(private modalCtrl: ModalController,private api: apiBase,private apiNoticias: NewsService,private loadingController: LoadingController,
              private platform: Platform,private transfer: FileTransfer,private file: File,private fileOpener: FileOpener) { }

  ngOnInit() {
    console.log(this.item.Image.includes('http'));
    this.item.image = this.item.Image.includes('http') == true ?  this.item.Image : `${this.api.url}/images/${this.item.Image}`;
  }

  closeModal(){
    console.log("cerar");
    this.modalCtrl.dismiss();
  }

  async ionViewDidEnter() { 
    this.apiNoticias.updateAcceso(this.item.Id).toPromise();
    if(this.item.Noticiasusuarios.length > 0)
      this.item.Noticiasusuarios[0].Visto='SI';
  }

  onErrorImage(item) {
    console.log(item);
    this.openFile(item);
  }

  async openFile(item) {
    setTimeout(async () => {
        this.loading =await this.loadingController.create({
          //cssClass: 'my-custom-class',
          message: 'Cargando...',
          duration: 120000
        });
    
        this.loading.present();
        
        console.log(item);
        const { Browser } = Plugins;
        if (this.platform.is('cordova')) {
          console.log(this.item.ImageUser);
          this.download(`${this.api.url}/images/${item.Image}`,this.item.Image);
        } else {
          await Browser.open({ url: `${this.api.url}/images/${item.Image}` });
          this.loadingController.dismiss();
        }
    }, 300);
  }

  download(url,NameFile) {
    console.log(url);
    console.log(NameFile);
    const fileTransfer: FileTransferObject = this.transfer.create();
    const extension = url.split('/').pop(); 
    const pathDownload = this.platform.is("android") ? this.file.dataDirectory  :  this.file.dataDirectory;
    //const pathDownload = this.platform.is("android") ? this.file.externalDataDirectory :  this.file.documentsDirectory;
    //const pathDownload = this.platform.is("android") ? this.file.externalRootDirectory + "download/" :  this.file.documentsDirectory;

    fileTransfer.download(url, pathDownload + NameFile).then((entry) => {
        console.log('download complete: ' + entry.toURL());

        let files = entry as FileEntry;
        files.file(success =>{
            //success.name;

            this.fileOpener.open(pathDownload + NameFile, success.type)
            .then(() => { console.log('File is opened'); this.loading.dismiss(); })
            .catch(e => console.log('Error opening file', e));

        });
    }, (error) => {
      // handle error
      console.log(error);
      alert(error.exception);
      this.loadingController.dismiss();
    });

  }

}
