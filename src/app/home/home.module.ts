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
import { ForumComponent } from '../components/forum/forum.component';
import { CrearForumPageModule } from '../pages/crear-forum/crear-forum.module';
import { CrearForumPage } from '../pages/crear-forum/crear-forum.page';
import { ChatsComponent } from '../components/chats/chats.component';
import { DetallesChatPage } from '../pages/detalles-chat/detalles-chat.page';
import { DetallesChatPageModule } from '../pages/detalles-chat/detalles-chat.module';



@NgModule({
  entryComponents : [
    DetallePage,
    CrearForumPage,
    NuevoRecursoPage,
    DetallesChatPage
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
    NuevoRecursoPageModule,
    CrearForumPageModule,
    DetallesChatPageModule
  ],
  declarations: [HomePage, PillMenuComponent, BooksComponent, CodesComponent, ListComponent, FilterPipe, ForumComponent, ChatsComponent]
})
export class HomePageModule {}
