import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { WidgetModule } from '../layout/widget/widget.module';

import { UtilModule } from '../util/util.module';


import { StatsModule } from '../shared/components/stats/stats.module';




export const routes = [
  {
    path: '', component: HomeComponent, pathMatch: 'full'
  }
];


@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), WidgetModule
    , UtilModule, StatsModule
  ],
  declarations: [HomeComponent     ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class HomeModule {
    static routes = routes;
}
