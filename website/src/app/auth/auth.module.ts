import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule,
     ReactiveFormsModule }                        from '@angular/forms';

import { WeavverCardComponent }                   from '../shared/card/card.component';

import { ConsentComponent }                       from './consent/consent.component';

import { SignUpComponent }                        from './signup/signup.component';
import { SignUpConfirmComponent }                 from './signup-confirm/signup-confirm.component';

import { LoginComponent }                         from './login/login.component';
import { LogInResetPasswordComponent }            from './login-resetpassword/login-resetpassword.component';
import { LogInResetPasswordConfirmComponent }     from './login-resetpassword-confirm/login-resetpassword-confirm.component';

import { PasswordComponent }                      from './password/password.component';

import { AuthRoutingModule }                      from './auth-routing.module';

@NgModule({
     imports: [
          CommonModule,
          FormsModule,
          ReactiveFormsModule,
          AuthRoutingModule
     ],
     declarations: [
          WeavverCardComponent,
          ConsentComponent,
          SignUpComponent,
          SignUpConfirmComponent,
          LoginComponent,
          LogInResetPasswordComponent,
          LogInResetPasswordConfirmComponent,
          PasswordComponent
     ]
})
export class AuthModule {

}