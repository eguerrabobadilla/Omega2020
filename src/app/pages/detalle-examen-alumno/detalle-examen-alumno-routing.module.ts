import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleExamenAlumnoPage } from './detalle-examen-alumno.page';

/*const routes: Routes = [
  {
    path: '',
    component: DetalleExamenAlumnoPage
  }
];*/

@NgModule({
//  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleExamenAlumnoPageRoutingModule {}
