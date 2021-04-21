import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExplorerFilePageRoutingModule } from './explorer-file-routing.module';

import { ExplorerFilePage } from './explorer-file.page';
import { GlobalModule } from 'src/app/modules/GoblaModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExplorerFilePageRoutingModule,
    GlobalModule
  ],
  declarations: [ExplorerFilePage]
})
export class ExplorerFilePageModule {}
