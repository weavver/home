import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent }           from './home/home.component';

import { PageNotFoundComponent }   from './page-not-found/page-not-found.component';

import { AuthModule }              from './auth/auth.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CardModule } from 'primeng/card';

@NgModule({
  imports: [
    AuthModule,
    CardModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
