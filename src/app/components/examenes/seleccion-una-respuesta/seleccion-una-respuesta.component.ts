import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormGroup, FormBuilder, Validators,FormArray } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { PreguntasService } from 'src/app/api/preguntas.service';

@Component({
  selector: 'app-seleccion-una-respuesta',
  templateUrl: './seleccion-una-respuesta.component.html',
  styleUrls: ['./seleccion-una-respuesta.component.scss'],
})
export class SeleccionUnaRespuestaComponent implements OnInit {
  public Editor = ClassicEditor;
  public numeroRespuestas: number = 5;
  public FrmItem: FormGroup;
  public submitAttempt: boolean = false;
  Respuestas: FormArray;
  @Output() backPage = new EventEmitter();
  @Input() examen;
  @Input() itemPreguntaSeleccionada;
  private item: any;

  constructor(private formBuilder: FormBuilder,public loadingController: LoadingController,private alertCtrl: AlertController,
              private apiPreguntas: PreguntasService) {
    this.FrmItem = formBuilder.group({
      //_id:   [''],
      ExamenId:   [0, Validators.compose([Validators.required])],
      Pregunta:   ['', Validators.compose([Validators.required])],
      Puntos:   ['', Validators.compose([Validators.required])],
      TipoCarga:   ['azar', Validators.compose([Validators.required])],
      Correcta:   ['rp1', Validators.compose([Validators.required])],
      Respuestas: this.formBuilder.array([ /*this.createItem()*/ ])
    });

   }

  ngAfterViewInit() {
    setTimeout(() => {
      for (let index = 1; index <= this.numeroRespuestas; index++) {
        this.addItem(index);
      }
      //console.log(this.examen);
  
      this.FrmItem.controls["ExamenId"].setValue(this.examen.Id);
  
      //Modo edicion de pregunta
      if(this.itemPreguntaSeleccionada != undefined) { 
        console.log(this.itemPreguntaSeleccionada);
        this.FrmItem.patchValue(this.itemPreguntaSeleccionada);
      }
    });
  }

  ngOnInit() {

  }

  counter(i: number) {
    return new Array(i);
  }

  async save(){
    //console.log(this.FrmItem);

    this.submitAttempt = true;
    //console.log(this.FrmItem.value);
    
    const loading = await this.loadingController.create({
      message: 'Guardando...'
    });

    if (!this.FrmItem.valid) {
      console.log(this.FrmItem);
      const alert = await  this.alertCtrl.create({
        header: 'No concluiste con el formulario',
        subHeader: 'El formulario se encuentra incompleto, favor de completar los datos faltantes.',
        mode: 'ios',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }

    await loading.present();

    this.item = this.FrmItem.value;
    console.log(this.item);
    this.item.TipoPregunta="multipleUnaRespuesta";

    
    if(this.itemPreguntaSeleccionada === undefined) {
      const tareaUpload = await this.apiPreguntas.save(this.item).toPromise();
    }
    else {
      const tareaUpload = await this.apiPreguntas.update(this.itemPreguntaSeleccionada._id,this.item).toPromise();
    } 

    this.submitAttempt = false;

    this.loadingController.dismiss();

    if(this.itemPreguntaSeleccionada === undefined)  {
      const alertTerminado = await this.alertCtrl.create({
        header: 'Pregunta creada con éxito',
        backdropDismiss: false,
        message: '¿Dese crear otra pregunta del mismo tipo?',
        buttons: [
          {
            text: 'No', handler: () =>  this.backPage.emit()
          },
          {
            text: 'Crear otra', handler: () =>{ 
              this.FrmItem.reset(); 
              //this.FrmItem.controls['Id'].setValue(0);
              this.FrmItem.controls['TipoCarga'].setValue("azar");
              this.FrmItem.controls['Correcta'].setValue("rp1");
              this.FrmItem.controls['ExamenId'].setValue(this.examen.Id);
            }
          }
        ]
      });

      await alertTerminado.present();
    } else {
      const alertTerminado = await this.alertCtrl.create({
        header: 'Pregunta modificada con éxito',
        backdropDismiss: false,
        message: 'Se modificó la pregunta',
        buttons: [
          {
            text: 'Continuar', handler: () =>  this.backPage.emit()
          }
        ]
      });
      await alertTerminado.present();
    }
  }

  createItem(index): FormGroup {
    return this.formBuilder.group({
      Id:'rp' + index,
      Respuesta: ''
    });
  }

  addItem(index): void {
    this.Respuestas = this.FrmItem.get('Respuestas') as FormArray;
    this.Respuestas.push(this.createItem(index));
  }

}
