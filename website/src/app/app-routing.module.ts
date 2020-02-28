import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdentityComponent }                  from './identities/identity.component';
import { ApplicationsComponent }              from './applications/list/applications.component';
import { ApplicationComponent }               from './applications/edit/application.component';
import { PageNotFoundComponent }              from './page-not-found/page-not-found.component';

import { AuthGuard }                          from './auth/auth.guard';
import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';

const appRoutes: Routes = [
     { path: 'application/:id',    component: ApplicationComponent,   canActivate: [AuthGuard] },
     { path: 'applications',       component: ApplicationsComponent,  canActivate: [AuthGuard] },
     { path: 'identity',           component: IdentityComponent,      canActivate: [AuthGuard] },
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