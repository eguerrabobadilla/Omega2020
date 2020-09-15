import { Component, OnInit, ChangeDetectorRef, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ModalController, AlertController, PickerController, IonInput } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecursosService } from '../../api/recursos.service';
import { EvidenciasService } from '../../api/evidencias.service';
import { MateriasService } from 'src/app/api/materias.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File as FileAngular,FileEntry } from '@ionic-native/file/ngx';


@Component({
  selector: 'app-crear-evidence',
  templateUrl: './crear-evidence.page.html',
  styleUrls: ['./crear-evidence.page.scss'],
})
export class CrearEvidencePage implements OnInit {
  @ViewChild('txtFecha', {static: false}) txtFecha: IonInput;
  @ViewChild('txtFecha', {read: ElementRef, static: true}) txtFechaHTML: ElementRef;
  @ViewChild('txtMateria', {static: false}) txtMateria: IonInput;
  @ViewChild('txtMateria', {read: ElementRef, static: true}) txtMateriaHTML: ElementRef;
  public FrmItem: FormGroup;
  public  texto_adjuntar_portada: string = 'Adjuntar';
  public submitAttempt: boolean = false;
  private item: any;
  private files: any;
  private imgBlob: any;
  meses: string[];
  semanas: string[];
  materias: any[] = [];
  mesSeleccionado: any;
  semanaSeleccionada: any;
  MateriaSeleccionada: any;
  fotoActviva: boolean = false;

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder, private cd:ChangeDetectorRef,
              private alertCtrl: AlertController, private apiEvidencias: EvidenciasService, private pickerController: PickerController,
              private renderer: Renderer2,private apiMaterias: MateriasService,private camera: Camera,private file: FileAngular) { 
                this.FrmItem = formBuilder.group({
                  MateriaId:   ['', Validators.compose([Validators.required])],
                  Titulo: ['', Validators.compose([Validators.required])],
                  Descripcion: ['', Validators.compose([Validators.required])],
                  //Image: [null, Validators.compose([Validators.required])]
                  Image: [null, Validators.compose([])]
                });
              }

  ngOnInit() {
    
  }

  async openPicker() {
    const picker = await this.pickerController.create({
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (value: any) => {
            this.txtFecha.value = value.Meses.value + ' / ' + value.Semanas.value;
            this.mesSeleccionado = value.Meses.value;
          }
        }
      ],
      columns:[{
          name: 'Meses',
          options: this.getColumnOptionsMeses()
        },
      ],
      mode : 'ios',
    });

    picker.columns[0].selectedIndex = this.getRealMonth();
    picker.present();

  }

  getRealMonth() {
    /*
    Dado que el año escolar no inicia en Enero se tiene que ajustar para llenar el picker 
    ejemplo enero en lugar de ser index 1 es 6
    */
    const actualDate = new Date();
    let month = actualDate.getMonth() + 1;

    console.log(month);

    if(month >= 7 && month <12) {
      month+= 7
    }
    else {
      month+=4;
    }

    return month;
  }

  getColumnOptionsMeses() {
    let options = [];

    this.meses.forEach(x => {
      options.push({text: x , value: x});
    });

    return options;
  }

  async crearNoticia() {
    this.submitAttempt = true;

    if (!this.FrmItem.valid) {

      const alert = await  this.alertCtrl.create({
        header: 'No concluiste con el formulario',
        subHeader: 'El formulario se encuentra incompleto, favor de completar los datos faltantes.',
        mode: 'ios',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }

    console.log(this.FrmItem.value);
    this.item = this.FrmItem.value;


    const payload = new FormData();
    payload.append('Titulo', this.item.Titulo);
    payload.append('Descripcion', this.item.Descripcion);
    payload.append('MateriaId', this.MateriaSeleccionada);
    if(this.fotoActviva == false) {
      payload.append('ItemUpload', this.files, this.files.name);
    }
    else {
      payload.append('ItemUpload', this.imgBlob, "test.jpg");
      this.fotoActviva=false;
    }


    const tareaUpload = await this.apiEvidencias.save(payload).toPromise();

    this.texto_adjuntar_portada = 'Adjuntar';

    this.submitAttempt = false;

    const alertTerminado = await this.alertCtrl.create({
      header: 'Evidencia creada con éxito',
      backdropDismiss: false,
      message: 'Se creó la evidencia ' + this.FrmItem.get('Titulo').value + ', ¿desea crear otra evidencia?',
      buttons: [
        {
           text: 'No', handler: () =>  this.modalCtrl.dismiss()
        },
        {
          text: 'Crear otro', handler: () => this.FrmItem.reset()
        }
      ]
    });

    await alertTerminado.present();
  }

  onFileChange($event: any) {
    if( $event.target.files &&  $event.target.files.length) {
      this.texto_adjuntar_portada = 'Evidencia Seleccionada';
      
      this.FrmItem.patchValue({
        Image: $event.target.files[0]
      });

      this.files = $event.target.files[0];
      this.fotoActviva = false;
      // need to run CD since file load runs outside of zone
      this.cd.markForCheck();
    }
  }

  async openPickerMaterias() {
    const picker = await this.pickerController.create({
        mode : 'ios',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Aceptar',
            handler:  (value: any) => {
                this.txtMateria.value = value.Materias.text;
                this.MateriaSeleccionada = value.Materias.value;
            }
          }
        ],
        columns: [{
            name: 'Materias',
            options: await this.getColumnMaterias()
          }
        ]
    });
    
    picker.present();

  }

  async getColumnMaterias() {
    const options = [];

    this.materias = await this.apiMaterias.get().toPromise();

    this.materias.forEach(x => {
      options.push({text: x.Nombre , value: x.Id});
    });

    return options;
  }

  tomarFoto() {
    console.log("tomarFoto");
    
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      //let base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log(imageData);
      //this.readFile(imageData);
      this.startUpload(imageData);
     }, (err) => {
      // Handle error
     });

  }

  startUpload(imgEntry) {
    this.file.resolveLocalFilesystemUrl(imgEntry)
        .then(entry => {
          (<FileEntry>entry).file(file => this.readFile(file));
        })
        .catch(err => {
            alert('Error while reading file.');
        });
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
        this.imgBlob = new Blob([reader.result], {
            type: file.type
        });

        this.texto_adjuntar_portada = 'Evidencia Seleccionada';
        this.fotoActviva = true;
        const date = new Date();
        const timestamp = date.getTime();
        //let archivo = new File([imgBlob],timestamp.toString(),{ type: imgBlob.type });
        //this.files = archivo;

        console.log(this.files);
    };

    reader.readAsArrayBuffer(file);
   }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
