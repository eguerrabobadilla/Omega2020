import { MbscModule } from '@mobiscroll/angular';
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
import { ForumComponent } from '../components/forum/forum.component';
import { CrearForumPageModule } from '../pages/crear-forum/crear-forum.module';
import { CrearForumPage } from '../pages/crear-forum/crear-forum.page';
import { ChatsComponent } from '../components/chats/chats.component';
import { DetallesChatPage } from '../pages/detalles-chat/detalles-chat.page';
import { DetallesChatPageModule } from '../pages/detalles-chat/detalles-chat.module';
import { CrearChatPageModule } from '../pages/crear-chat/crear-chat.module';
import { CrearChatPage } from '../pages/crear-chat/crear-chat.page';
import { FilterPipe } from '../pipes/filter.pipe';
import { NewResourcePage } from '../new-resource/new-resource.page';
import { NewResourcePageModule } from '../new-resource/new-resource.module';
import { ListResourceComponent } from '../components/list-resource/list-resource.component';
import { NewsComponent } from '../components/news/news.component';
import { CrearNewsPageModule } from '../pages/crear-news/crear-news.module';
import { CrearNewsPage } from '../pages/crear-news/crear-news.page';
import { DetalleChatGroupPage } from '../pages/detalle-chat-group/detalle-chat-group.page';
import { DetalleChatGroupPageModule } from '../pages/detalle-chat-group/detalle-chat-group.module';
import { GraphicsComponent } from '../components/graphics/graphics.component';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { CalendarEventsPage } from '../pages/calendar-events/calendar-events.page';
import { CalendarEventsPageModule } from '../pages/calendar-events/calendar-events.module';
import { EvidencesComponent } from '../components/evidences/evidences.component';
import { CrearEvidencePage } from '../pages/crear-evidence/crear-evidence.page';
import { CrearEvidencePageModule } from '../pages/crear-evidence/crear-evidence.module';
import { CrearTopicPage } from '../pages/crear-topic/crear-topic.page';
import { CrearTopicPageModule } from '../pages/crear-topic/crear-topic.module';
import { SubjectsComponent } from '../components/subjects/subjects.component';
import { QuestionsComponent } from '../components/questions/questions.component';
import { ContactComponent } from '../components/contact/contact.component';
import { PerfilComponent } from '../components/perfil/perfil.component';
import { LinkifyPipe } from '../pipes/linkifypipe ';
import { CircleProgressComponent } from '../components/circle-progress/circle-progress.component';
import { GlobalModule } from '../modules/GoblaModule';


@NgModule({
  entryComponents : [
    DetallePage,
    CrearForumPage,
    CrearChatPage,
    CrearNewsPage,
    NuevoRecursoPage,
    DetallesChatPage,
    DetalleChatGroupPage,
    NewResourcePage,
    CalendarEventsPage,
    CrearEvidencePage,
    CrearTopicPage
  ],
  imports: [ 
    MbscModule,  
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
    CrearChatPageModule,
    DetallesChatPageModule,
    DetalleChatGroupPageModule,
    NewResourcePageModule,
    CrearNewsPageModule,
    CalendarEventsPageModule,
    CrearEvidencePageModule,
    CrearTopicPageModule,
    GlobalModule
  ],
  declarations: [ HomePage, BooksComponent, CodesComponent, ListComponent, 
    ChatsComponent, FilterPipe, ListResourceComponent, NewsComponent, ForumComponent,GraphicsComponent,CalendarComponent
    , EvidencesComponent,SubjectsComponent, QuestionsComponent, ContactComponent, PerfilComponent,LinkifyPipe]
})
export class HomePageModule {}
