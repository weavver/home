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
          // console.log("auth guard");
     }

     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> {
          let url: string = state.url;
          return this.checkUri(url);
     }

     canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> {
          // console.log("child check");
          return this.canActivate(route, state);
     }

     canLoad(route: Route) : Observable<boolean> {
          let url = `/${route.path}`;
          return this.checkUri(url);
     }

     checkUri(uri : string) : Observable<boolean> {
          console.log("checkUri", uri);
          if (this.authService.isLoggedIn) {
               return of(true);
          }
          else {
               console.log('redirecting...');
               var params : NavigationExtras = {
                    queryParams: { "redirect_uri": uri },
                    queryParamsHandling: "merge"
               };
               this.router.navigate(['/login'], params);
               return of(false);
          }
     }
}
