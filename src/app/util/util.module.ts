import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { Web3Service } from './web3.service';
import { DacoService } from './daco.sevice';
import { StatsComponent } from '../shared/components/stats/stats.component';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    Web3Service,
    DacoService,
    StatsComponent
  ],
  declarations: []
})
export class UtilModule {
}
