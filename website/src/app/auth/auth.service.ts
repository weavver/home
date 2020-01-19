import { Injectable } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import {LocalStorageService} from "ngx-webstorage";
import {DataService} from "../data.service";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    isLoggedIn = false;

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(private router: Router)
    {
    }

    login(): Observable < boolean > {
        return of(true).pipe(
            delay(300),
            tap(val => this.isLoggedIn = true)
        );
    }

    logout(): void {
        this.isLoggedIn = false;
        this.router.navigate(["/login"]);
    }
}