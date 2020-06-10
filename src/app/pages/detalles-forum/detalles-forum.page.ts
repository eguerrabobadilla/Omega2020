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
    console.log(this.item.id);
    this.detalleId = this.item.id;

    //Me uno al grupo
    this.webSocket.AddToGroup(`foro-${this.detalleId}`);

    this.apiForum.get(true,this.detalleId).subscribe(data => {
      this.LstForo = data;
    });

   // console.log(this.item.image.includes('http://'));
  //  this.item.image = this.item.image.includes('http://') === true ?  this.item.image : 'http://35.193.103.213/images/' + this.item.image;
  }

  async votar(item) {
    console.log(item);
    await this.apiForum.addVoto(item.id).toPromise();
    item.votos += 1;
  }

  closeModal() {
      this.modalCtrl.dismiss();
  }

  async crearNoticia() {

  //  console.log(this.FrmItem.value);
    this.item = this.FrmItem.value;
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
        this.LstForo.unshift(comment);
        this.applicationRef.tick();
        console.log(comment);
    });
  }
}
