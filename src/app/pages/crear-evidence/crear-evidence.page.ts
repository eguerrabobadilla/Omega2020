import { Component, OnInit, ChangeDetectorRef, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ModalController, AlertController, PickerController, IonInput } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecursosService } from '../../api/recursos.service';
import { EvidenciasService } from '../../api/evidencias.service';

@Component({
  selector: 'app-crear-evidence',
  templateUrl: './crear-evidence.page.html',
  styleUrls: ['./crear-evidence.page.scss'],
})
export class CrearEvidencePage implements OnInit {
  @ViewChild('txtFecha', {static: false}) txtFecha: IonInput;
  @ViewChild('txtFecha', {read: ElementRef, static: true}) txtFechaHTML: ElementRef;
  public FrmItem: FormGroup;
  public  texto_adjuntar_portada: string = 'Adjuntar Recurso';
  public submitAttempt: boolean = false;
  private item: any;
  private files: any;
  meses: string[];
  semanas: string[];
  mesSeleccionado: any;
  semanaSeleccionada: any;

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder, private cd:ChangeDetectorRef,
              private alertCtrl: AlertController, private apiEvidencias: EvidenciasService, private pickerController: PickerController,
              private renderer: Renderer2) { 
                this.FrmItem = formBuilder.group({
                  Titulo: ['', Validators.compose([Validators.required])],
                  Descripcion: ['', Validators.compose([Validators.required])],
                  Image: [null, Validators.compose([Validators.required])]
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
    Datao que el año escolar no inicia en Enero se tiene que ajustar para llenar el picker 
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
    payload.append('ItemUpload', this.files, this.files.name);


    const tareaUpload = await this.apiEvidencias.save(payload).toPromise();

    this.submitAttempt = false;

    const alertTerminado = await this.alertCtrl.create({
      header: 'Recurso creada con éxito',
      message: 'Se creó el recurso ' + this.FrmItem.get('Titulo').value + ', ¿desea crear otra tarea?',
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
      this.texto_adjuntar_portada = 'Recurso Seleccionada';

      this.FrmItem.patchValue({
        Image: $event.target.files[0]
      });

      this.files = $event.target.files[0];
      // need to run CD since file load runs outside of zone
      this.cd.markForCheck();
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
