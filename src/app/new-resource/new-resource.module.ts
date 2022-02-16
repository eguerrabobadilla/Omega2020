import { MbscModule } from '@mobiscroll/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewResourcePageRoutingModule } from './new-resource-routing.module';

import { BibliotecaPage } from '../pages/biblioteca/biblioteca.page';
import { BibliotecaPageModule } from '../pages/biblioteca/biblioteca.module';

import { NewResourcePage } from './new-resource.page';
import { MostrarArchivosComponent } from '../components/biblioteca/mostrar-archivos/mostrar-archivos.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';


@NgModule({
  entryComponents: [
    BibliotecaPage,
	MostrarArchivosComponent
  ],
  imports: [ 
    MbscModule, 
    CommonModule,
    FormsModule,
    IonicModule,
    NewResourcePageRoutingModule,
    BibliotecaPageModule,
    ReactiveFormsModule,
	VirtualScrollerModule
  ],
  declarations: [NewResourcePage, MostrarArchivosComponent]
})
export class NewResourcePageModule {}
