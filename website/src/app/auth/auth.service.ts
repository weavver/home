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

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(private router: Router,
                private dataService: DataService)
    {
    }

    getToken(username, password): Observable<any> {
        return this.dataService.getToken("username", "password").pipe(
            tap(val => {
                console.log(val);
                this.isLoggedIn = true;
            })
        );
    }

    delToken(token): Observable<any> {
        this.isLoggingOut = true;
        return this.dataService.delToken(token).pipe(
            tap(val => {
                console.log(val);
                this.isLoggedIn = false;
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