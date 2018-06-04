import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { ErrorComponent } from './error/error.component';
//import { StatsComponent } from './layout/stats/stats.component';

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
//import { MemberComponent } from './member/member.component';
//import { ProposalComponent } from './proposal/proposal.component';
//import { CampaignKnownComponent } from './campaign-known/campaign-known.component';
//import { CampaignCompletedComponent } from './campaign-completed/campaign-completed.component';
//import { FaqComponent } from './faq/faq.component';
import * as $ from 'jquery'





const APP_PROVIDERS = [
  AppConfig
];

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    ErrorComponent,
    //MemberComponent,
    //ProposalComponent,
    //CampaignKnownComponent,
    //CampaignCompletedComponent,
    //FaqComponent
 //   StatsComponent
  
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, {
      useHash: true,
      preloadingStrategy: PreloadAllModules
    })

  ],
  providers: [
    APP_PROVIDERS
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule {}
