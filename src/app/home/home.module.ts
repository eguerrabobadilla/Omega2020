import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PillMenuComponent } from '../components/pill-menu/pill-menu.component';

import { HomePage } from './home.page';
import { DetallePage } from '../detalle/detalle.page';
import { DetallePageModule } from '../detalle/detalle.module';
import { NuevoRecursoPage } from '../nuevo-recurso/nuevo-recurso.page';
import { NuevoRecursoPageModule } from '../nuevo-recurso/nuevo-recurso.module';
import { BooksComponent } from '../components/books/books.component';
import { CodesComponent } from '../components/codes/codes.component';
import { ListComponent } from '../components/list/list.component';
import { FilterPipe } from '../pipes/filter.pipe';

@NgModule({
  entryComponents : [
    DetallePage,
    NuevoRecursoPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    DetallePageModule,
    NuevoRecursoPageModule
  ],
  declarations: [HomePage, PillMenuComponent, BooksComponent, CodesComponent, ListComponent, FilterPipe]
})
export class HomePageModule {}
