import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './table.component';


import { UtilModule } from '../../../util/util.module';

import { PaginationModule } from 'ngx-bootstrap';
import { Ng2TableModule } from 'ng2-table';
import { WidgetModule } from '../../../layout/widget/widget.module';



@NgModule({
  imports: [CommonModule,
    PaginationModule.forRoot(),
    WidgetModule,
    Ng2TableModule
  ],
  declarations: [TableComponent],
  exports: [TableComponent, 
    CommonModule, FormsModule]
})
export class TableModule { }
