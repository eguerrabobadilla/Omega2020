import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallesCalendarPage } from './detalles-calendar.page';

/*const routes: Routes = [
  {
    path: '',
    component: DetallesCalendarPage
  }
];*/

@NgModule({
  //imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesCalendarPageRoutingModule {}
