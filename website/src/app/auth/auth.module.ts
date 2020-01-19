import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';

import { LoginComponent }    from './login/login.component';
import { SignUpComponent }    from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing.module';

import { SignUpConfirmComponent } from './signup-confirm/signup-confirm.component';
import { LogInResetPasswordComponent } from './login-resetpassword/login-resetpassword.component';
import { LogInResetPasswordConfirmComponent } from './login-resetpassword-confirm/login-resetpassword-confirm.component';
import { PasswordComponent } from './password/password.component';

@NgModule({
     imports: [
          CommonModule,
          FormsModule,
          ReactiveFormsModule,
          AuthRoutingModule
     ],
     declarations: [
          LoginComponent,
          LogInResetPasswordComponent,
          LogInResetPasswordConfirmComponent,
          SignUpComponent,
          SignUpConfirmComponent,
          PasswordComponent
     ]
})
export class AuthModule {

}