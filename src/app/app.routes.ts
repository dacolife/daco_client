import { Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';

export const ROUTES: Routes = [{
   path: '', redirectTo: 'app', pathMatch: 'full'
  },
  {
    path: 'app',   loadChildren: './layout/layout.module#LayoutModule'
  },
  {
    path: 'login', loadChildren: './login/login.module#LoginModule'
  }
  ,
  {
    path: 'application', loadChildren: './application/application.module#ApplicationModule'
  },
  {
    path: 'faq', loadChildren: './faq/faq.module#FaqModule'
  },
  {
    path: 'error', component: ErrorComponent
  },
  {
    path: '**',    component: ErrorComponent
  }

];
