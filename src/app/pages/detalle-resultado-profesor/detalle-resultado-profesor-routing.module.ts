import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleResultadoProfesorPage } from './detalle-resultado-profesor.page';

/*const routes: Routes = [
  {
    path: '',
    component: DetalleResultadoProfesorPage
  }
];*/

@NgModule({
//  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleResultadoProfesorPageRoutingModule {}
