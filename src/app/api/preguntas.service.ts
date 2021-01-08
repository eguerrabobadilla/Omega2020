import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBase } from './apiBase';


@Injectable({
  providedIn: 'root'
})
export class PreguntasService extends apiBase {

  constructor(public http: HttpClient) {
    super();
    this.Ws = 'api/preguntas';
  }

  save(item: any) {
    return this.http.post(`${this.url}/${this.Ws}`, item);
  }

  delete(ExamenId: any,Id: any) {
    return this.http.delete(`${this.url}/${this.Ws}/${ExamenId}/${Id}`);
  }

  update(id: string,item: any) {
    return this.http.put(`${this.url}/${this.Ws}/${id}`, item);
  }

  getExamen(examenId): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/getExamen/${examenId}`);
  }

  getInfinite(skip,take,examenId): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/infinite/${skip}/${take}/${examenId}`);
  }

  getTareasMateriasInfinite(id,skip,take): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${this.Ws}/materiaInfinite/${id}/${skip}/${take}`);
  }

  setBancosPreguntas(item: any) {
    return this.http.post(`${this.url}/${this.Ws}/upload`, item);
  }

  async getBancoPreguntas(examenId,filename: string = null) {

    const baseUrl = `${this.url}/${this.Ws}/dowload/${examenId}`;
    const token = localStorage.getItem('USER_INFO');
    const headers = new HttpHeaders().set('authorization','Bearer '+token);
    
    /*const response = await this.http.get("https://localhost:5001/api/preguntas/dowload/15",{headers, responseType: 'blob' as 'json'}).subscribe(
        (response: any) =>{
            //let dataType = response.type;
            let dataType = "application/zip";
            let binaryData = [];
            binaryData.push(response);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
            if (filename)
                downloadLink.setAttribute('download', filename);
            document.body.appendChild(downloadLink);
            downloadLink.click();
        }
    )*/

    const response = await this.http.get(baseUrl,{headers, responseType: 'blob' as 'json'}).toPromise();
    //let dataType = response.type;
    let dataType = "application/zip";
    let binaryData = [];
    binaryData.push(response);
    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
    if (filename)
        downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  } 
}
