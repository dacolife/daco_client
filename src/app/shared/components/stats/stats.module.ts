import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatsComponent } from './stats.component';


@NgModule({
  imports: [CommonModule],
  declarations: [StatsComponent],
  exports: [StatsComponent, 
    CommonModule, FormsModule]
})
export class StatsModule { }
