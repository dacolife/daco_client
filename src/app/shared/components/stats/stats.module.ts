import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatsComponent } from './stats.component';
import {RouterModule} from '@angular/router';

export const routes = [];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [StatsComponent],
  exports: [StatsComponent, CommonModule, FormsModule]
})
export class StatsModule { }
