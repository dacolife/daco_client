import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { ProposalComponent } from './proposal.component';
import { WidgetModule } from '../layout/widget/widget.module';

import { UtilModule } from '../util/util.module';






export const routes = [
  {
    path: '', component: ProposalComponent, pathMatch: 'full'
  }
];


@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), WidgetModule
    , UtilModule
  ],
  declarations: [ProposalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class ProposalModule {
    static routes = routes;
}
