import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearEvidencePage } from './crear-evidence.page';

/*const routes: Routes = [
  {
    path: '',
    component: CrearEvidencePage
  }
];*/

@NgModule({
//  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearEvidencePageRoutingModule {}
