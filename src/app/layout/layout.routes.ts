import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
const routes: Routes = [
  { path: '', component: LayoutComponent, children: [
    //{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadChildren: '../home/home.module#HomeModule' },
    { path: 'member', loadChildren: '../member/member.module#MemberModule' },
    { path: 'proposal', loadChildren: '../proposal/proposal.module#ProposalModule' },
    { path: 'campaignKnown', loadChildren: '../campaign-known/campaign-known.module#CampaignKnownModule' },
    { path: 'campaignCompleted', loadChildren: '../campaign-completed/campaign-completed.module#CampaignCompletedModule' },
    { path: 'application', loadChildren: '../application/application.module#ApplicationModule' },
    { path: 'faq', loadChildren: '../faq/faq.module#FaqModule' },

    //{ path: 'another-page', loadChildren: '../another/another.module#AnotherModule' },
  ]}
];

export const ROUTES = RouterModule.forChild(routes);
