import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearExamenPage } from './crear-examen.page';

/*const routes: Routes = [
  {
    path: '',
    component: CrearExamenPage
  }
];*/

@NgModule({
  //imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearExamenPageRoutingModule {}
