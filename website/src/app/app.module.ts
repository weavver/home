import { NgModule }                     from '@angular/core';
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
import { IdentityComponent }            from './identities/identity.component';
import { AppsComponent }                from './apps/apps.component';
import { PageNotFoundComponent }        from './page-not-found/page-not-found.component';

import { WeavverCardModule }            from './shared/card/card.module';

import { ApolloModule, APOLLO_OPTIONS } from "apollo-angular";
import { InMemoryCache }                from "apollo-cache-inmemory";

import {
     HttpBatchLinkModule,
     HttpBatchLink,
   } from 'apollo-angular-link-http-batch';
import { environment } from 'src/environments/environment';

@NgModule({
     imports: [
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
          HttpBatchLinkModule
     ],
     declarations: [
          AppComponent,
          AppsComponent,
          IdentityComponent,
          PageNotFoundComponent
     ],
     providers: [{
          provide: APOLLO_OPTIONS,
          useFactory: (httpLink: HttpBatchLink) => {
                    return {
                         cache: new InMemoryCache(),
                         link: httpLink.create({
                         uri: environment.graphql_url
                    })
                    }
               },
          deps: [HttpBatchLink]
        }],
     bootstrap: [AppComponent]
})
export class AppModule { }
