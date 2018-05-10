import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { MemberComponent } from './member.component';
import { WidgetModule } from '../layout/widget/widget.module';

import { UtilModule } from '../util/util.module';


import { StatsModule } from '../shared/components/stats/stats.module';

import { PaginationModule } from 'ngx-bootstrap';
import { Ng2TableModule } from 'ng2-table';

import { Web3Service } from '../util/web3.service';
import { DacoService } from '../util/daco.sevice';




export const routes = [
  {
    path: '',
    component: MemberComponent,
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), WidgetModule
    , UtilModule, StatsModule,
    PaginationModule.forRoot(),
    WidgetModule,
    Ng2TableModule

  ],
  declarations: [
    MemberComponent
  ],
  providers: [
    Web3Service,
    DacoService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class MemberModule {
    static routes = routes;
}
