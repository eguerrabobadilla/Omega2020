import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar/ngx';

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


  constructor(private domCtrl: DomController, @Inject(DOCUMENT) private document,
              private http: HttpClient,private storage: Storage,private statusBar: StatusBar) {
    
    this.themes = [
      {
        name: 'homeThemeDefault',
        styles : [ 
          {
              themeVariable : "--ion-color-principal",
              value : "#6228cf"
          }, 
          {
              themeVariable : "--ion-color-principal-rgb",
              "value" : "98, 40, 207"
          }, 
          {
              themeVariable : "--ion-color-principal-contrast",
              value : "#ffffff"
          }, 
          {
              themeVariable : "--ion-color-principal-contrast-rgb",
              value : "255,255,255"
          }, 
          {
              themeVariable : "--ion-color-principal-shade",
              value : "#5623b6"
          }, 
          {
              themeVariable : "--ion-color-principal-tint",
              value : "#723ed4"
          }, 
          {
              themeVariable : "--ion-color-principal-cerrarCesion-background",
              value : "#F4315D"
          }, 
          {
              themeVariable : "--ion-color-principal-cerrarCesion-activated",
              value : "#f76e8d"
          }, 
          {
              themeVariable : "--ion-color-principal-cerrarCesion-focused",
              value : "#f76e8d"
          }, 
          {
              themeVariable : "--ion-color-principal-cerrarCesion-hover",
              value : "#f76e8d"
          }, 
          {
              themeVariable : "--ion-color-principal-tituloUsuario",
              value : "#ffffff"
          }, 
          {
              themeVariable : "--ion-color-principal-tituloVersion",
              value : "#ffffff"
          }, 
          {
              themeVariable : "--ion-color-principal-botonCerrarCesion",
              value : "#F4315D"
          }, 
          {
              themeVariable : "--ion-color-principal-iconoBotonCerrarCesion",
              value : "#ffffff"
          }, 
          {
              themeVariable : "--ion-color-principal-gradoUsuario",
              value : "#ffffff"
          }, 
          {
              themeVariable : "--ion-color-principal-iconoCategoria",
              value : "#ffffff"
          }, 
          {
              themeVariable : "--ion-color-principal-tituloCategoria",
              value : "#ffffff"
          }, 
          {
              themeVariable : "--ion-color-principal-iconoFlechaArriba",
              value : "#00000000"
          }, 
          {
              themeVariable : "--ion-color-principal-botonBajarContenedor",
              value : "#F4315D"
          }, 
          {
              themeVariable : "--ion-color-principal-sombra",
              value : "163 160 160 / 0%"
          }, 
          {
              "themeVariable" : "--ion-color-principal-titulosHeader",
              "value" : "#ffffff"
          }
      ]
      },
      {
        name: 'homeUniversidadThemeDefault',
        styles : [ 
          {
              themeVariable : "--ion-color-principal",
              value : "#ffffff"
          }, 
          {
              themeVariable : "--ion-color-principal-rgb",
              value : "68,68,68, 1"
          }, 
          {
              themeVariable : "--ion-color-principal-contrast",
              value : "#ffffff"
          }, 
          {
              themeVariable : "--ion-color-principal-contrast-rgb",
              value : "255,255,255"
          }, 
          {
              themeVariable : "--ion-color-principal-shade",
              value : "#5623b6"
          }, 
          {
              themeVariable : "--ion-color-principal-tint",
              value : "#723ed4"
          }, 
          {
              themeVariable : "--ion-color-principal-cerrarCesion-background",
              value : "#000000"
          }, 
          {
              themeVariable : "--ion-color-principal-cerrarCesion-activated",
              value : "#000000"
          }, 
          {
              themeVariable : "--ion-color-principal-cerrarCesion-focused",
              value : "#000000"
          }, 
          {
              themeVariable : "--ion-color-principal-cerrarCesion-hover",
              value : "#000000"
          }, 
          {
              themeVariable : "--ion-color-principal-tituloUsuario",
              value : "#000000"
          }, 
          {
              themeVariable : "--ion-color-principal-tituloVersion",
              value : "#000000"
          }, 
          {
              themeVariable : "--ion-color-principal-botonCerrarCesion",
              value : "#000000"
          }, 
          {
              themeVariable : "--ion-color-principal-iconoBotonCerrarCesion",
              value : "#ffffff"
          }, 
          {
              themeVariable : "--ion-color-principal-gradoUsuario",
              value : "#000000"
          }, 
          {
              themeVariable : "--ion-color-principal-iconoCategoria",
              value : "#000000"
          }, 
          {
              themeVariable : "--ion-color-principal-tituloCategoria",
              value : "#000000"
          }, 
          {
              themeVariable : "--ion-color-principal-iconoFlechaArriba",
              value : "#000000"
          }, 
          {
              themeVariable : "--ion-color-principal-botonBajarContenedor",
              value : "#000000"
          }, 
          {
              themeVariable : "--ion-color-principal-sombra",
              value : "163 160 160 / 50%"
          }, 
          {
              themeVariable : "--ion-color-principal-titulosHeader",
              value : "#0000"
          }
      ]
      },

    ]

    
    
    
  
  }

  async themeSwitch(){
    
    await  this.loadDataLocal().then((data) => {

      this.loadData().subscribe(data =>{
            this.themes=data;
            this.storage.set("themes",this.themes).then((data) => {
              this.cambioColorApp(data);
            })
      },
      error => {
            console.log("error")
            console.log(error)
            this.cambioColorApp(data);
      }
      );
    }).catch((err) => {
      
    });



  }

  loadData(){
    
    return  this.http.get<any[]>('https://www.alfalbs.app/ApiOmega/api/themes/')
    //return  this.http.get<any[]>('https://localhost:5001/api/themes/')

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
     console.log("data.length")
     console.log(data)
   
      
 }
 async setTheme(name,data): Promise<void> {

   
   
    console.log("themAtomar:------------")
    console.log(data)
    console.log(name)
    this.themes=data;
     let theme= data =! null ? this.themes.find(theme => theme.name === name) : null;
     


    if(theme ===undefined ){//si por alguna cuestion no se descargan los themas de la nube, entran lo default
        
                console.log("THEMES DESCARGAS ERROR, ENTRAN DEFAULT")
                console.log(theme=this.themes[1])
                if( this.escolaridad=="SAC" || this.escolaridad=="Universidad" || 
                    this.escolaridad=="Licenciatura Presencial" || this.escolaridad=="Licenciatura SAC") //si va al home universidad
                    //this.setTheme("homeUniversidadThemeDefault",this.themes)
                    theme=this.themes[1]
                    else // si va al home 
                    theme=this.themes[0]
          //          this.setTheme("homeThemeDefault",this.themes)

     }
     else{//continua logica normal, si hay themas descargados de la nube
              console.log("THEMES FROM NUBE")
              this.themes=data;
             
      }
      this.principalColor= await theme.styles[0].value;
      this.statusBar.backgroundColorByHexString(this.principalColor);
      console.log(this.principalColor)
         this.domCtrl.write(() => {
     
           theme.styles.forEach(style => {
 
             document.documentElement.style.setProperty(style.themeVariable, style.value);
           });
   });

   

  }



  async loadDataLocal(){
    

  //  await  this.storage.set("themesDefault",this.themes);
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