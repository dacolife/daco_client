import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FaqComponent } from './faq.component';
import { WidgetModule } from '../layout/widget/widget.module';

import { UtilModule } from '../util/util.module';


//import { StatsComponent } from '../shared/components/stats/stats.component';
import { StatsModule } from '../shared/components/stats/stats.module';




export const routes = [
  {
    path: '', component: FaqComponent, pathMatch: 'full'
  }
];


@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), WidgetModule
    , UtilModule, StatsModule
  ],
  declarations: [FaqComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class FaqModule {
    static routes = routes;
}
