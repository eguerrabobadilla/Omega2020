import { EventEmitter, Injectable } from '@angular/core';  
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Message } from '../models/Message';
import { apiBase } from '../api/apiBase';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  messageReceived = new EventEmitter<Message>();
  positionReceived = new EventEmitter<Message>();
  commentReceived = new EventEmitter<Message>();
  connectionEstablished = new EventEmitter<Boolean>();

  private connectionIsEstablished = false;
  private _hubConnection: HubConnection;

  constructor(private api: apiBase) {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }

  sendMessage(message: Message) {
    this._hubConnection.invoke('NewMessage', message);
  }

  AddToGroup(grupo: string) {
   this._hubConnection.invoke('AddToGroup', grupo);
  }

  private createConnection() {
    this._hubConnection = new HubConnectionBuilder()
      //.withUrl('https://172.16.12.21:5001/' + 'MessageHub')
      .withUrl(`${this.api.url}/MessageHub`)
      .build();
  }

  private startConnection(): void {
    this._hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        console.log('Hub connection started');
        this.connectionEstablished.emit(true);
      })
      .catch(err => {
        console.log('Error while establishing connection, retrying...');
        setTimeout(function() { this.startConnection(); }, 5000);
      });
  }

  private registerOnServerEvents(): void {

    this._hubConnection.on('MessageReceived', (data: any) => {
      console.log(data);
      this.messageReceived.emit(data);
    });

    this._hubConnection.on('CommentReceived', (data: any) => {
      this.commentReceived.emit(data);
    });

  }
}
