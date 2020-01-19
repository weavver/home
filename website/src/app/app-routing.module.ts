import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent }                      from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AuthGuard }                          from './auth/auth.guard';
import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';

const appRoutes: Routes = [
  {
       path: 'home', component: HomeComponent,
       canLoad: [AuthGuard]
  },
  {
       path: '',
       redirectTo: '/login',
       pathMatch: 'full'
  },
{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, // <-- debugging purposes only
        preloadingStrategy: SelectivePreloadingStrategyService,
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }