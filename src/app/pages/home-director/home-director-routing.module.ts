import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeDirectorPage } from './home-director.page';

const routes: Routes = [
  {
    path: '',
    component: HomeDirectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeDirectorPageRoutingModule {}
