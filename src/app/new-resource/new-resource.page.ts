import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ModalController, AlertController, PickerController, IonInput } from '@ionic/angular';
import { FormGroup, FormBuilder,Validators  } from '@angular/forms';
import { RecursosService } from '../api/recursos.service';

@Component({
  selector: 'app-new-resource',
  templateUrl: './new-resource.page.html',
  styleUrls: ['./new-resource.page.scss'],
})
export class NewResourcePage implements OnInit {
  @ViewChild('txtFecha', {static: false}) txtFecha: IonInput;
  @ViewChild('txtFecha', {read: ElementRef, static: true}) txtFechaHTML: ElementRef;
  public FrmItem: FormGroup;F
  public  texto_adjuntar_portada: string = 'Adjuntar Recurso';
  public submitAttempt: boolean = false;
  private item: any;
  private files: any;
  meses: string[];
  semanas: string[];
  mesSeleccionado: any;
  semanaSeleccionada: any;

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder, private cd:ChangeDetectorRef,
              private alertCtrl: AlertController, private apiRecursos: RecursosService, private pickerController: PickerController,
              private renderer: Renderer2) {
    this.FrmItem = formBuilder.group({
      Titulo: ['', Validators.compose([Validators.required])],
      Descripcion: ['', Validators.compose([Validators.required])],
      FechaPublicacion: ['', Validators.compose([Validators.required])],
      Image: [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.meses   = ['Agosto','Septiembre','Octubre', 'Noviembre', 'Diciembre', 'Enero', 'Febreo', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];
    this.semanas = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
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
            this.semanaSeleccionada = value.Semanas.value;
            this.mesSeleccionado = value.Meses.value;
          }
        }
      ],
      columns:[{
          name: 'Meses',
          options: this.getColumnOptionsMeses()
        },
        {
          name: 'Semanas',
          options: this.getColumnOptionsSemanas()
        }
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

  getColumnOptionsSemanas() {
    let options = [];

    this.semanas.forEach(x => {
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
    payload.append('Ano', '2020');
    payload.append('Mes', this.mesSeleccionado);
    payload.append('Semana', this.semanaSeleccionada);
    payload.append('ItemUpload', this.files, this.files.name);
  

    const tareaUpload = await this.apiRecursos.save(payload).toPromise();

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
