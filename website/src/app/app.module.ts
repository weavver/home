import { NgModule }                     from '@angular/core';
import { CommonModule }                 from '@angular/common';  
import { HttpClientModule }             from '@angular/common/http'; 
import { BrowserModule }                from '@angular/platform-browser';
import { FormsModule,
     ReactiveFormsModule
}                                       from '@angular/forms';
import { BrowserAnimationsModule }      from '@angular/platform-browser/animations';
import { FlexLayoutModule }             from '@angular/flex-layout';

import { AppRoutingModule }             from './app-routing.module';

import { AuthModule }                   from './auth/auth.module';

import { AppComponent }                 from './app.component';

import { CenterComponent }              from './centers/editor/center.component';
import { CentersComponent }             from './centers/list/centers.component';
import { IdentityComponent }            from './identities/editor/identity.component';
import { IdentitiesComponent }          from './identities/list/identities.component';
import { ApplicationsComponent }        from './applications/list/applications.component';
import { ApplicationComponent }         from './applications/editor/application.component';
import { PageNotFoundComponent }        from './page-not-found/page-not-found.component';

import { WeavverFormModule }            from './shared/form/form.module';
import { WeavverCardModule }            from './shared/card/card.module';
import { WeavverTabsModule }            from './shared/tabs/tabs.module';

import { Apollo, ApolloModule, APOLLO_OPTIONS } from "apollo-angular";
import { InMemoryCache }                from "apollo-cache-inmemory";
import { HttpLink }                     from 'apollo-angular-link-http';
import { onError }                      from 'apollo-link-error'

import { AuthService }                  from './auth/auth.service';

import { AgGridModule } from 'ag-grid-angular';

// import "ag-grid/dist/styles/ag-grid.css";
// import "ag-grid/dist/styles/ag-theme-balham.css";

import {
     HttpBatchLinkModule,
     HttpBatchLink,
   } from 'apollo-angular-link-http-batch';
import { environment } from 'src/environments/environment';

declare var api_url:any;

@NgModule({
     imports: [
          CommonModule,
          HttpClientModule,
          AuthModule,
          BrowserModule,
          BrowserAnimationsModule,
          AppRoutingModule,
          FlexLayoutModule,
          FormsModule,
          ReactiveFormsModule,
          ApolloModule,
          // HttpLinkModule,
          WeavverCardModule,
          WeavverTabsModule,
          WeavverFormModule,
          HttpBatchLinkModule,
          AgGridModule
     ],
     declarations: [
          AppComponent,
          ApplicationsComponent,
          ApplicationComponent,
          IdentityComponent,
          IdentitiesComponent,
          CenterComponent,
          CentersComponent,
          PageNotFoundComponent
     ],
     providers: [
          AuthService,
          {
               provide: APOLLO_OPTIONS,
               useFactory: (httpLink: HttpBatchLink) => {
                    return {
                         cache: new InMemoryCache(),
                         link: httpLink.create({
                              uri: api_url + "/graphql",
                              withCredentials: true
                         })
                    }
               },
               deps: [HttpBatchLink]
          }],
     bootstrap: [AppComponent]
})
export class AppModule {
     constructor(
          apollo: Apollo,
          httpLink: HttpBatchLink,
          auth: AuthService
     )
     {
          // const http = HttpBatchLink.create({ uri: '/graphql' });
          
          const logoutLink = onError(({ networkError }) => {
               console.log("network error", networkError);
               // if (networkError === 401) auth.logOut();
          });

          // apollo.create({
          //           link: logoutLink.concat(http),
          //      });
     }
}