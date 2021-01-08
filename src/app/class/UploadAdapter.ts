import { HttpParams, HttpClient, HttpHeaders } from "@angular/common/http";
import { apiBase } from "../api/apiBase";

export class UploadAdapter {
    public url:string;

    constructor(private loader,private http:HttpClient,private api: apiBase) {
        console.log(this.http);
    }
//the uploadFile method use to upload image to your server
  uploadFile(file,url?:string,user?:string){
    let name = '';
    //url='https://localhost:5001/api/examenes/uploadImage';
    url=`${this.api.url}/api/examenes/uploadImage`;

    let formData:FormData = new FormData();
    let headerslocal = new Headers();
    name = file.name;
    formData.append('Attachment', file, name);

    const dotIndex = name.lastIndexOf('.');
    const fileName  = dotIndex>0?name.substring(0,dotIndex):name;

    formData.append('Name', fileName);
    formData.append('Source', user);

    const token: string = localStorage.getItem('USER_INFO');

    const headerDict = {
        'Authorization': `Bearer ${ token }`,
    }

    const requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict)
    };
      
    
    //http post return an observer
    //so I need to convert to Promise
    return this.http.post(url,formData,requestOptions);
  }
//implement the upload 
  upload() {
      let upload = new Promise((resolve, reject)=>{
        this.loader['file'].then(
            (data)=>{
                this.uploadFile(data,this.url,'test')
                .subscribe(
                    (result)=>{
                        //resolve data formate must like this
                        //if **default** is missing, you will get an error
                        //resolve({ default: `https://localhost:5001/editor/${result['Attachment']}` });
                        resolve({ default: `${this.api.url}/editor/${result['Attachment']}`});
                    },
                    (error)=>{
                        reject(data.msg);
                    }
                );
            }
        );
      });
      return upload;
  }
  abort() {
      console.log("abort")
  }
}