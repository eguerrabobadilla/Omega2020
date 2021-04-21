import { HttpClient } from '@angular/common/http';
import { Component, OnInit,Input,Output,EventEmitter,ViewChild,ElementRef  } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormGroup, FormBuilder, Validators,FormArray  } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { apiBase } from 'src/app/api/apiBase';
import { PreguntasService } from 'src/app/api/preguntas.service';
import Quill from 'quill';
import  ImageResize  from 'src/assets/quill-image-resize-module-fix-for-mobile';
Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'app-relacionar',
  templateUrl: './relacionar.component.html',
  styleUrls: ['./relacionar.component.scss'],
})
export class RelacionarComponent implements OnInit {
  public Editor = ClassicEditor;
  public numeroRespuestas: number = 8;
  public FrmItem: FormGroup;
  public submitAttempt: boolean = false;
  Preguntas: FormArray;
  Respuestas: FormArray;
  @Output() backPage = new EventEmitter();
  @Input() examen;
  @Input() itemPreguntaSeleccionada;
  @ViewChild('header', {read: ElementRef, static: true}) headerHtml: ElementRef;
  private item: any;
  quillConfiguration = {
    'toolbar': [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['code-block'],

      [{ 'size': ['small', false, 'large', 'huge'] }],// custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                     // text direction

        // custom dropdown

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'align': [] }],
                              // remove formatting button

      ['link', 'image', 'video'],                         // link and image, video


    ],
    imageResize: true
  };
  quillConfigurationRespuestas = {
    'toolbar': [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      ['image'],                         // link and image, video
    ],
    imageResize: true
  };

  constructor(private formBuilder: FormBuilder,public loadingController: LoadingController,private alertCtrl: AlertController,
    private apiPreguntas: PreguntasService, public http: HttpClient,private api: apiBase) {
      this.FrmItem = formBuilder.group({
        //_id:   [''],
        ExamenId:   [0, Validators.compose([Validators.required])],
        Pregunta:   ['', Validators.compose([Validators.required])],
        Puntos:   ['', Validators.compose([Validators.required])],
        Preguntas: this.formBuilder.array([ /*this.createItem()*/ ]),
        Respuestas: this.formBuilder.array([ /*this.createItem()*/ ])
      });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadRespuestas();
      //console.log(this.examen);
  
      this.FrmItem.controls["ExamenId"].setValue(this.examen.Id);
  
      //Modo edicion de pregunta
      if(this.itemPreguntaSeleccionada != undefined) { 
        console.log(this.itemPreguntaSeleccionada);
        this.FrmItem.patchValue(this.itemPreguntaSeleccionada);
      }
    });
  }

  loadRespuestas() {
    for (let index = 1; index <= this.numeroRespuestas; index++) {
      this.addItem(index);
    }
  }

  createItem(index): FormGroup {
    return this.formBuilder.group({
      Id: index + 'p',
      Respuesta : '',
      Correcta: index + 'r',
      Relacionado : "NO",
      Background : "",
    });
  }

  createItemRespuesta(index): FormGroup {
    return this.formBuilder.group({
      Id: index + 'r', 
      Respuesta : '',
      Correcta: index + 'p',
      Relacionado : "NO",
      Background : "",
    });
  }

  addItem(index): void {
    this.Preguntas = this.FrmItem.get('Preguntas') as FormArray;
    this.Preguntas.push(this.createItem(index));

    this.Respuestas = this.FrmItem.get('Respuestas') as FormArray;
    this.Respuestas.push(this.createItemRespuesta(index));
  }

  async save(){ 
    console.log("save");
    console.log(this.FrmItem.value);
    try  {
        this.submitAttempt = true;
        
        
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
        this.item.TipoPregunta="relacionarPreguntas";

        //Elimina las preguntas vacias
        for( var i = 0; i < this.item.Preguntas.length; i++){ 
          if ( this.item.Preguntas[i].Respuesta === "") { 
             this.item.Preguntas.splice(i, 1); 
             this.item.Respuestas.splice(i, 1);
              i--; 
          } else {
            console.log(i);
            this.item.Preguntas[i].Id = (i+1) + 'p';
            this.item.Preguntas[i].Correcta = (i+1) + 'r';
            this.item.Respuestas[i].Id = (i+1) + 'r';
            this.item.Respuestas[i].Correcta = (i+1) +'p';
          }
        }

        
        
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
                  //this.FrmItem.controls['TipoCarga'].setValue("azar");
                  //this.FrmItem.controls['Correcta'].setValue("rp1");
                  this.FrmItem.controls['ExamenId'].setValue(this.examen.Id);
                  let frmArray = this.FrmItem.get('Preguntas') as FormArray;
                  frmArray.clear();
                  let frmArray2 = this.FrmItem.get('Respuestas') as FormArray;
                  frmArray2.clear();

                  this.loadRespuestas();

                  setTimeout(() => {
                    this.headerHtml.nativeElement.scrollIntoView();
                  }, 200);
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
    catch(err) {
      console.log(err);
      await this.loadingController.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'LBS Plus',
        //subHeader: 'Subtitle',
        message: err.error,
        buttons: ['Aceptar']
      });
  
      await alert.present();
    }
  }

}
