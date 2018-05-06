import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { MemberComponent } from './member.component';
import { WidgetModule } from '../layout/widget/widget.module';

import { UtilModule } from '../util/util.module';


//import { StatsComponent } from '../layout/stats/stats.component';
import { StatsModule } from '../shared/components/stats/stats.module';




export const routes = [
  {
    path: '', component: MemberComponent, pathMatch: 'full'
  }
];


@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), WidgetModule
    , UtilModule, StatsModule
  ],
  declarations: [MemberComponent   ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class MemberModule {
    static routes = routes;
}
