import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';

import { LoginComponent }    from './login/login.component';
import { SignUpComponent }    from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing.module';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SignUpConfirmComponent } from './signup-confirm/signup-confirm.component';
import { LogInResetPasswordComponent } from './login-resetpassword/login-resetpassword.component';
import { LogInResetPasswordConfirmComponent } from './login-resetpassword-confirm/login-resetpassword-confirm.component';
import { PasswordComponent } from './password/password.component';

@NgModule({
     imports: [
          CommonModule,
          FormsModule,
          ReactiveFormsModule,
          AuthRoutingModule,
          ButtonModule,
          CardModule
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