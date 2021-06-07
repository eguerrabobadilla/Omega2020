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
import { CrearForumPageModule } from '../pages/crear-forum/crear-forum.module';
import { CrearForumPage } from '../pages/crear-forum/crear-forum.page';
import { DetallesChatPage } from '../pages/detalles-chat/detalles-chat.page';
import { DetallesChatPageModule } from '../pages/detalles-chat/detalles-chat.module';
import { CrearChatPageModule } from '../pages/crear-chat/crear-chat.module';
import { CrearChatPage } from '../pages/crear-chat/crear-chat.page';
import { FilterPipe } from '../pipes/filter.pipe';
import { NewResourcePage } from '../new-resource/new-resource.page';
import { NewResourcePageModule } from '../new-resource/new-resource.module';
import { CrearNewsPageModule } from '../pages/crear-news/crear-news.module';
import { CrearNewsPage } from '../pages/crear-news/crear-news.page';
import { DetalleChatGroupPage } from '../pages/detalle-chat-group/detalle-chat-group.page';
import { DetalleChatGroupPageModule } from '../pages/detalle-chat-group/detalle-chat-group.module';
import { CalendarEventsPage } from '../pages/calendar-events/calendar-events.page';
import { CalendarEventsPageModule } from '../pages/calendar-events/calendar-events.module';
import { CrearEvidencePage } from '../pages/crear-evidence/crear-evidence.page';
import { CrearEvidencePageModule } from '../pages/crear-evidence/crear-evidence.module';
import { CrearTopicPage } from '../pages/crear-topic/crear-topic.page';
import { CrearTopicPageModule } from '../pages/crear-topic/crear-topic.module';
import { CircleProgressComponent } from '../components/circle-progress/circle-progress.component';
import { CircleProgressReportComponent } from '../components/circle-progress-report/circle-progress-report.component';
import { GlobalModule } from '../modules/GoblaModule';
import { ListTareasComponent } from '../components/list-tareas/list-tareas.component';
import { CrearExamenPage } from '../pages/crear-examen/crear-examen.page';
import { CrearExamenPageModule } from '../pages/crear-examen/crear-examen.module';
import { DetalleExamenAlumnoPage } from '../pages/detalle-examen-alumno/detalle-examen-alumno.page';
import { DetalleExamenAlumnoPageModule } from '../pages/detalle-examen-alumno/detalle-examen-alumno.module';
import { DetalleResultadosExamenesPage } from '../pages/detalle-resultados-examenes/detalle-resultados-examenes.page';
import { from } from 'rxjs';
import { DetalleResultadosExamenesPageModule } from '../pages/detalle-resultados-examenes/detalle-resultados-examenes.module';
import { SortByPipe } from '../pipes/sort-by.pipe';
import { DetalleResultadoProfesorPage } from '../pages/detalle-resultado-profesor/detalle-resultado-profesor.page';
import { DetalleResultadoProfesorPageModule } from '../pages/detalle-resultado-profesor/detalle-resultado-profesor.module';
import { ExplorerFilePage } from '../pages/explorer-file/explorer-file.page';
import { ExplorerFilePageModule } from '../pages/explorer-file/explorer-file.module';


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
    CrearTopicPage,
    CrearExamenPage,
    DetalleExamenAlumnoPage,
    ListComponent,
    DetalleResultadosExamenesPage,
    DetalleResultadoProfesorPage,
    ExplorerFilePage
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
    CrearExamenPageModule,
    GlobalModule,
    DetalleExamenAlumnoPageModule,
    DetalleResultadosExamenesPageModule,
    DetalleResultadoProfesorPageModule,
    ExplorerFilePageModule
  ],
  declarations: [ HomePage, ListComponent,ListTareasComponent]
})
export class HomePageModule {}
