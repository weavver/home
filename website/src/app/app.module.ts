import { NgModule }                from '@angular/core';
import { HttpClientModule }        from '@angular/common/http'; 
import { BrowserModule }           from '@angular/platform-browser';
import { FormsModule,
     ReactiveFormsModule
}                                  from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule }        from '@angular/flex-layout';

import { AppRoutingModule }        from './app-routing.module';

import { AuthModule }              from './auth/auth.module';

import { AppComponent }            from './app.component';
import { SettingsComponent }       from './settings/settings.component';
import { AppsComponent }           from './apps/apps.component';
import { PageNotFoundComponent }   from './page-not-found/page-not-found.component';

import { WeavverCardModule }       from './shared/card/card.module';

import { ApolloModule, APOLLO_OPTIONS } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

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
          HttpLinkModule,
          WeavverCardModule
     ],
     declarations: [
          AppComponent,
          AppsComponent,
          SettingsComponent,
          PageNotFoundComponent
     ],
     providers: [{
          provide: APOLLO_OPTIONS,
          useFactory: (httpLink: HttpLink) => {
            return {
              cache: new InMemoryCache(),
              link: httpLink.create({
                uri: "https://localhost:3000/graphql"
              })
            }
          },
          deps: [HttpLink]
        }],
     bootstrap: [AppComponent]
})
export class AppModule { }
