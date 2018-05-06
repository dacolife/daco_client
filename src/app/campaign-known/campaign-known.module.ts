import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { CampaignKnownComponent } from './campaign-known.component';
import { WidgetModule } from '../layout/widget/widget.module';

import { UtilModule } from '../util/util.module';






export const routes = [
  {
    path: '', component: CampaignKnownComponent, pathMatch: 'full'
  }
];


@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), WidgetModule
    , UtilModule
  ],
  declarations: [CampaignKnownComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class CampaignKnownModule {
    static routes = routes;
}
