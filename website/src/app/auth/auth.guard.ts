import { Injectable }       from '@angular/core';
import {
     CanActivate, Router,
     ActivatedRouteSnapshot,
     RouterStateSnapshot,
     CanActivateChild,
     NavigationExtras,
     CanLoad, Route
}                           from '@angular/router';
import { AuthService }      from './auth.service';
import { take, map, delay,catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
     constructor(private authService: AuthService, private router: Router) {
          console.log("auth guard");
     }

     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
          let url: string = state.url;
          console.log("canActivate: ", url);
          return this.checkLogin(url);
     }

     canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
          console.log("child check");
          return this.canActivate(route, state);
     }

     canLoad(route: Route): Observable<boolean> {
          let url = `/${route.path}`;
          console.log(url);
          
          return this.checkLogin(url);
     }

     checkLogin(url: string): Observable<boolean> {
          this.authService.redirectUrl = url;


          // // // Create a dummy session id
          // // let sessionId = 123456789;
          
          // // Set our navigation extras object that contains our global query params and fragment
          let navigationExtras: NavigationExtras = {
               // queryParams: { 'session_id': sessionId },
               // fragment: 'anchor'
          };
          
          // speed up using cache if available...
          if (localStorage.getItem("logged_in") != "true") {
               console.log("not logged_in so skipping check");
               this.router.navigate(['/login'], navigationExtras);
               return of(false);
          }

          // logged in locally? let's check in with server to confirm...
          return this.authService.I_get().pipe(
               map(data => {
                    console.log("received data", data);
                    return true;
               }),
               catchError(error => {
                    console.log("not logged in..");

                    // Navigate to the login page with extras
                    this.router.navigate(['/login'], navigationExtras);
                    return of(false);
               }),
               take(1)
          );

     }
}
