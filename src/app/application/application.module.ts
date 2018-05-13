import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { ApplicationComponent } from './application.component';
import { WidgetModule } from '../layout/widget/widget.module';

import { UtilModule } from '../util/util.module';

import { PaginationModule } from 'ngx-bootstrap';
import { Ng2TableModule } from 'ng2-table';

import { TableModule } from '../shared/components/table/table.module';





export const routes = [
  {
    path: '', component: ApplicationComponent, pathMatch: 'full'
  }
];


@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), WidgetModule
    , UtilModule,
    PaginationModule.forRoot(),
    WidgetModule,
    Ng2TableModule,
    TableModule
  ],
  declarations: [ApplicationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class ApplicationModule {
    static routes = routes;
}
