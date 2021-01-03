import { Component, OnInit,Input } from '@angular/core';
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
  @Input() examen;
  private item: any;

  constructor(private formBuilder: FormBuilder,public loadingController: LoadingController,private alertCtrl: AlertController,
              private apiPreguntas: PreguntasService) {
    this.FrmItem = formBuilder.group({
      Id:   [0, Validators.compose([Validators.required])],
      Pregunta:   ['', Validators.compose([Validators.required])],
      Puntos:   ['', Validators.compose([Validators.required])],
      TipoCarga:   ['azar', Validators.compose([Validators.required])],
      Respuestas: this.formBuilder.array([ this.createItem() ])
    });

   }

   ngAfterViewInit() {
  
  }

  ngOnInit() {
    for (let index = 1; index < this.numeroRespuestas; index++) {
      this.addItem();
    }
    console.log(this.examen);
  }

  counter(i: number) {
    return new Array(i);
  }

  async save(){
    console.log(this.FrmItem);

    this.submitAttempt = true;
    console.log(this.FrmItem.value);
    
    const loading = await this.loadingController.create({
      message: 'Guardando...'
    });

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

    await loading.present();

    this.item = this.FrmItem.value;
    console.log(this.item);

    const tareaUpload = await this.apiPreguntas.save(this.item).toPromise();

    this.submitAttempt = false;

    this.loadingController.dismiss();
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      Respuesta: ''
    });
  }

  addItem(): void {
    this.Respuestas = this.FrmItem.get('Respuestas') as FormArray;
    this.Respuestas.push(this.createItem());
  }

}
