import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard }            from './auth.guard';
import { AuthService }          from './auth.service';
import { LoginComponent }       from './login/login.component';
import { LogInResetPasswordComponent }       from './login-resetpassword/login-resetpassword.component';
import { LogInResetPasswordConfirmComponent }       from './login-resetpassword-confirm/login-resetpassword-confirm.component';
import { SignUpComponent }       from './signup/signup.component';
import { SignUpConfirmComponent }       from './signup-confirm/signup-confirm.component';

const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'login/resetpassword', component: LogInResetPasswordComponent },
  { path: 'login/resetpassword/confirm', component: LogInResetPasswordConfirmComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'signup/confirm', component: SignUpConfirmComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule {}