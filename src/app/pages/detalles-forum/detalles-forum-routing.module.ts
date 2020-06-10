import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallesForumPage } from './detalles-forum.page';

const routes: Routes = [
  {
    path: '',
    component: DetallesForumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesForumPageRoutingModule {}
