import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleResultadosExamenesPage } from './detalle-resultados-examenes.page';

/*const routes: Routes = [
  {
    path: '',
    component: DetalleResultadosExamenesPage
  }
];*/

@NgModule({
  //imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleResultadosExamenesPageRoutingModule {}
