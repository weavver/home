import { DataService } from '../data.service';

import { Injectable } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import {LocalStorageService} from "ngx-webstorage";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    isLoggingOut : boolean = false;
    isLoggedIn : boolean = false;

    showSidebar : boolean = true;

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(private router: Router,
                private dataService: DataService)
    {
    }

    tokenGet(email, password): Observable<any> {
        return this.dataService.tokenGet(email, password).pipe(
            tap(val => {
                console.log(val);
                this.isLoggedIn = true;
            })
        );
    }

    tokenDel(token): Observable<any> {
        this.isLoggingOut = true;
        return this.dataService.tokenDel(token).pipe(
            tap(val => {
                console.log(val);
                this.isLoggedIn = false;
            })
        );
    }

    putConsent(client_id): Observable<any> {
        return this.dataService.consentPut(client_id).pipe(
            tap(val => {
                console.log(val);
                // this.isLoggedIn = true;
            })
        );
    }

    
    passwordsReset(email): Observable<any> {
        return this.dataService.passwordsReset(email).pipe(
            tap(val => {
                console.log(val);
            })
        );
    }
}



//     .subscribe( (resp) => {
//         console.log(resp);
//         // this.cd.markForCheck();
//         this.isLoggedIn = false;
//         this.router.navigate(["/login"]);
// });