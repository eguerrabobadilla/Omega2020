import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

interface Theme {
  name: string;
  styles: ThemeStyle[];
}

interface ThemeStyle {
  themeVariable: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherService {

  private themes: Theme[] = [];
  private currentTheme: number = 0;
  public principalColor: string="";
  public escolaridad: string="";
  public tipoUsuario: string="";
  public cssStyle:string ="";

  constructor(private domCtrl: DomController, @Inject(DOCUMENT) private document,private http: HttpClient,private storage: Storage) {
    
    this.themes = [
      {
        name: 'default',
        styles: [

    
          { themeVariable: '--ion-color-principal', value: '#6228cf'},
          { themeVariable: '--ion-color-principal-rgb', value: '98, 40, 207'},
          { themeVariable: '--ion-color-principal-contrast', value: '#ffffff'},
          { themeVariable: '--ion-color-principal-contrast-rgb', value: '255,255,255'},
          { themeVariable: '--ion-color-principal-shade', value: '#5623b6'},
          { themeVariable: '--ion-color-principal-tint', value: '#723ed4'},
          { themeVariable: '--ion-color-principal-cerrarCesion-background', value: '#F4315D'},
          { themeVariable: '--ion-color-principal-cerrarCesion-activated', value: '#f76e8d'},
          { themeVariable: '--ion-color-principal-cerrarCesion-focused', value: '#f76e8d'},
          { themeVariable: ' --ion-color-principal-cerrarCesion-hover', value: '#f76e8d'},
          { themeVariable: '--ion-color-principal-titulosHeader', value: 'white'},

        ]
      }
    ]

   // this.storage.set("themesDefault",this.themes);

   

    
    
  
  }

  async themeSwitch(){
    await  this.loadDataLocal().then((data) => {
      this.cambioColorApp(data);
    }).catch((err) => {
      
    });

   await  this.loadData().subscribe(data =>{
      this.themes=data;
      this.storage.set("themes",this.themes);

    });

  }

  loadData(){
    
    return this.http.get<any[]>('https://www.alfalbs.app/ApiOmega/api/themes/')

  }

  cycleTheme(): void {
    this.loadData().subscribe(data =>{
      this.themes=data;
      if(this.themes.length > this.currentTheme + 1){
        this.currentTheme++;
      } else {
        this.currentTheme = 0;
      }
      this.setTheme(this.themes[this.currentTheme]["name"],"");
    });

 

  }
  async cambioColorApp(data){
     this.tipoUsuario= await this.getKeyToken("tipo");
     this.escolaridad = await this.getKeyToken("escolaridad");
     if(this.tipoUsuario !=="Alumno"){
      this.setTheme(this.tipoUsuario,data)
     }
        
     else{
      this.setTheme(this.escolaridad,data);
     }
      
 }
  setTheme(name,data): void {

    this.themes=data;
    let theme = this.themes.find(theme => theme.name === name);
     this.principalColor=theme.styles[0].value;
        this.domCtrl.write(() => {
    
          theme.styles.forEach(style => {

            document.documentElement.style.setProperty(style.themeVariable, style.value);
          });
  });

  /*  this.loadData().subscribe(data =>{



    });*/

  }



  loadDataLocal(){
    return  this.storage.get("themes");
  }

  getKeyToken(key: string): string {
    const jwt = localStorage.getItem('USER_INFO');

    const jwtData = jwt.split('.')[1];
    // let decodedJwtJsonData = window.atob(jwtData);
    const decodedJwtJsonData = decodeURIComponent(escape(window.atob(jwtData)));
    const decodedJwtData = JSON.parse(decodedJwtJsonData);

    const value = decodedJwtData[key];
      
    return value;

  }

}