import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { Web3Service } from './web3.service';
import { DacoService } from './daco.sevice';
import { StatsComponent } from '../shared/components/stats/stats.component';
import { WindowRefService } from './window-ref.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DacoService,
    StatsComponent,
    Web3Service,
    WindowRefService
  ],
  declarations: []
})
export class UtilModule {
}
