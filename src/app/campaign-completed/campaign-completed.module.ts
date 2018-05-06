import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { CampaignCompletedComponent  } from './campaign-completed.component';
import { WidgetModule } from '../layout/widget/widget.module';

import { UtilModule } from '../util/util.module';






export const routes = [
  {
    path: '', component: CampaignCompletedComponent, pathMatch: 'full'
  }
];


@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), WidgetModule
    , UtilModule
  ],
  declarations: [CampaignCompletedComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class CampaignCompletedModule {
    static routes = routes;
}
