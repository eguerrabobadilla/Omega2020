import {NgModule} from '@angular/core';
import { PillMenuComponent } from '../components/pill-menu/pill-menu.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CircleProgressComponent } from '../components/circle-progress/circle-progress.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule
    ],
    declarations:[PillMenuComponent,CircleProgressComponent],
    exports:[PillMenuComponent,CircleProgressComponent]
})
export class GlobalModule
{

}