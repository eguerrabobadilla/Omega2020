import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

//components
//import { MostrarArchivosComponent } from 'src/app/components/biblioteca/mostrar-archivos/mostrar-archivos.component'; 

import { BibliotecaPageRoutingModule } from './biblioteca-routing.module';

import { BibliotecaPage } from './biblioteca.page';
import { ModalImageComponent } from 'src/app/components/biblioteca/modal-image/modal-image.component';
import { ModalVideoComponent } from 'src/app/components/biblioteca/modal-video/modal-video.component';
import { ModalAudioComponent } from 'src/app/components/biblioteca/modal-audio/modal-audio.component';

//VideoPlayer ngx-videogular
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

//Media player plugin
import { Media } from '@ionic-native/media/ngx';

 
@NgModule({
  entryComponents: [	
	ModalImageComponent,
	ModalVideoComponent,
	ModalAudioComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BibliotecaPageRoutingModule,
	VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
	VgBufferingModule
  ],
  providers: [
	  Media
  ],
  declarations: [BibliotecaPage, ModalImageComponent, ModalVideoComponent, ModalAudioComponent]
})
export class BibliotecaPageModule {}
