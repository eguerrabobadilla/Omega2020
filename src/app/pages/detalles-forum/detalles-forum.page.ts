import { Component, OnInit, Input, ChangeDetectorRef, ApplicationRef ,ViewChild, NgZone} from '@angular/core';
import { ModalController, IonVirtualScroll } from '@ionic/angular';
import { ForumService } from '../../api/forum.service';
import { FormGroup, FormBuilder,Validators  } from '@angular/forms';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-detalles-forum',
  templateUrl: './detalles-forum.page.html',
  styleUrls: ['./detalles-forum.page.scss'],
})
export class DetallesForumPage implements OnInit {
  @Input() item;
  lado:string;
  public FrmItem: FormGroup;
  LstForo: any[];
  detalleId: number;
  @ViewChild('virtualScroll', {static: true}) virtualScroll: IonVirtualScroll;

  constructor(private apiForum: ForumService, private modalCtrl: ModalController, private  formBuilder : FormBuilder,
              private applicationRef: ApplicationRef,private webSocket: WebsocketService, private _ngZone: NgZone) {
    this.FrmItem = formBuilder.group({
      mensaje: ['', Validators.compose([Validators.required])]
    });

    this.subscribeToEvents();
  }

  ngOnInit() {
    this.detalleId = this.item.foroId;
    console.log('foroId');
    console.log(this.item);
    console.log(this.item.Id);
    this.detalleId = this.item.Id;

    //Me uno al grupo
    this.webSocket.AddToGroup(`foro-${this.detalleId}`);

    this.apiForum.get(true,this.detalleId).subscribe(data => {
      this.LstForo = data;
    });
  }

  async votar(item) {
    console.log(item);
    const tipoVoto =await this.apiForum.addVoto(item.Id).toPromise();
    if(tipoVoto['tipoVoto'] == "positivo")
      item.Votos += 1;
    else
      item.Votos -= 1;
  }

  closeModal() {
      this.modalCtrl.dismiss();
  }

  async enviarMensaje() {

  //  console.log(this.FrmItem.value);
    this.item = this.FrmItem.value;
    if(this.item.mensaje==='') return;

    this.FrmItem.patchValue({
      mensaje: ""
    });
  //  console.log(this.detalleId);

    this.item.foroId = this.detalleId;
  //  console.log("this.item");
  //  console.log( this.item);

  /*  const payload = new FormData();
    payload.append('ForoId', this.detalleId.toString());
    payload.append('Mensaje', this.item.Comentario);*/


    const tareaUpload = await this.apiForum.save(this.item).toPromise();

    /*let item2 = {
      id: 60,
      usuarioId: 1,
      foroId: 2,
      mensaje: 'refrescar',
      fecha: '2020-06-05T00:00:00',
      foro: null,
      hora: '16:58:57'
    };*/

    //this.LstForo.unshift(this.item);
    //this.applicationRef.tick();

   // this.submitAttempt = false;
  }

  private subscribeToEvents(): void {

    this.webSocket.commentReceived.subscribe((comment: any) => {
        comment.Hora.Minutes = comment.Hora.Minutes.length == 1 ? `0${comment.Hora.Minutes}` : comment.Hora.Minutes;
        comment.Hora.Seconds = comment.Hora.Seconds.length == 1 ? `0${comment.Hora.Seconds}` : comment.Hora.Seconds;
        comment.Hora = `${comment.Hora.Hours}:${comment.Hora.Minutes}:${comment.Hora.Seconds}`
        this.LstForo.unshift(comment);
        this.applicationRef.tick();
        console.log(comment);
    });
  }
}
