import { Component, OnInit } from '@angular/core';
import { PickerController, Platform } from '@ionic/angular';
import { RecursosService } from '../../api/recursos.service';
import { Plugins } from '@capacitor/core';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
  selector: 'app-list-resource',
  templateUrl: './list-resource.component.html',
  styleUrls: ['./list-resource.component.scss'],
})
export class ListResourceComponent implements OnInit {

  images = [
    'bandit',
    'batmobile',
    'blues-brothers',
    'bueller',
    'delorean',
    'eleanor',
    'general-lee',
    'ghostbusters',
    'knight-rider',
    'mirth-mobile'
  ];
  rotateImg = 0;
  items: any[] = [];
  lorem = 'Lorem iuis aute irure dol cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  meses: string[];
  mesActual: string = 'Mayo';
  LstRecursos: any[] = [];

  constructor(private pickerController: PickerController, private apiRecursos: RecursosService, private transfer: FileTransfer,
              private file: File, private platform: Platform,private fileOpener: FileOpener) {
    for (let i = 0; i < 20  ; i++) {
      this.items.push({
        // tslint:disable-next-line: no-use-before-declare
        index: i,
        name: i + ' - ' + this.images[this.rotateImg],
    //    imgSrc: getImgSrc(),
    //    avatarSrc: getImgSrc(),
        imgHeight: Math.floor(Math.random() * 50 + 150),
        // tslint:disable-next-line: no-use-before-declare
        content: this.lorem.substring(0, Math.random() * (this.lorem.length - 100) + 100)
      });
     }
  }

ngOnInit() {
    //console.log("jose")
    this.meses = ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
                  'Enero', 'Febreo', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];

    this.apiRecursos.getByMonth('Mayo').subscribe(data => {
      //console.log(data);
      this.LstRecursos = data;
    });
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
    Datao que el año escolar no inicia en Enero se tiene que ajustar para llenar el picker 
    ejemplo enero en lugar de ser index 1 es 6
    */
    const actualDate = new Date();
    let month = actualDate.getMonth() + 1;

    console.log(month);

    if (month >= 7 && month < 12) {
      month += 7
    } else {
      month += 4;
    }

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
    console.log(item);
    const { Browser } = Plugins;
    if (this.platform.is('cordova')) {
      //this.download(`http://35.193.103.213/resources/${item.pathRecurso}`);
      this.download(`https://172.16.12.23.:5001/resources/${item.pathRecurso}`);
    } else {
      //await Browser.open({ url: `http://35.193.103.213/resources/${item.pathRecurso}` });
      await Browser.open({ url: `https://172.16.12.23:5001/resources/${item.pathRecurso}` });
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
