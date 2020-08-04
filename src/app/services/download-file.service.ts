import { Injectable } from '@angular/core';
import { HttpRequest, HttpEventType, HttpClient } from '@angular/common/http';
import { BehaviorSubject} from 'rxjs';
import { map, tap, last } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {
  public uploadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public downloadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(public http: HttpClient) { }

  download() {
    let req = new HttpRequest('GET', "http://s3.us-east-2.amazonaws.com/lbs.libros/1ES_Lengua_Materna_Espanol.zip?X-Amz-Expires=3600&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA47RBVNHKJXUEXGXD/20200803/us-east-2/s3/aws4_request&X-Amz-Date=20200803T014829Z&X-Amz-SignedHeaders=host&X-Amz-Signature=2c6ccae43e5a92cc0b691a691a8575b5e83624a138c29cf98c19c6568dc13844", { 
      responseType: 'arraybuffer',
      reportProgress: true
    });

    return this.http.request(req).pipe(
      map(event => this.getStatusMessage(event)),
      tap(message => console.log(message)),
      last()
    );
  }

  getStatusMessage(event){

    let status;

    switch(event.type){
      case HttpEventType.Sent:
        return `Uploading Files`;
      
      case HttpEventType.UploadProgress:
        status = Math.round(100 * event.loaded / event.total);
        this.uploadProgress.next(status);
        return `Files are ${status}% uploaded`;

      case HttpEventType.DownloadProgress:
        status = Math.round(100 * event.loaded / event.total);
        this.downloadProgress.next(status); // NOTE: The Content-Length header must be set on the server to calculate this
        return `Files are ${status}% downloaded`; 

      case HttpEventType.Response:
        return `Done`;

      default:
        return `Something went wrong`
    }
  }
}
