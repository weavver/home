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
import { PageNotFoundComponent }   from './page-not-found/page-not-found.component';

import { WeavverCardComponent }    from './shared/card/card.component';

@NgModule({
     imports: [
          HttpClientModule,
          AuthModule,
          BrowserModule,
          BrowserAnimationsModule,
          AppRoutingModule,
          FlexLayoutModule,
          FormsModule,
          ReactiveFormsModule
     ],
     declarations: [
          AppComponent,
          SettingsComponent,
          PageNotFoundComponent,
          // WeavverCardComponent
     ],
     providers: [],
     bootstrap: [AppComponent]
})
export class AppModule { }
