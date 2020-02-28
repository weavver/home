import { DataService } from '../data.service';

import { OnInit, Injectable } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';

import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { take, tap, map, catchError } from 'rxjs/operators';
import {LocalStorageService} from "ngx-webstorage";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    isLoggingOut : boolean = false;
    isLoggedIn : boolean = false;


    // query : Observable = null;
    currentISubject: BehaviorSubject<any> = new BehaviorSubject<any>(this.I_get());
    // I : Observable<any> = null;

    showSidebar : boolean = true;

    // store the URL so we can redirect after logging in
    redirectUrl: string;


    constructor(private router: Router,
                private graph: DataService)
    {
        this.currentISubject = new BehaviorSubject<any>({"email": "test"});

        console.log(localStorage.getItem("logged_in"));
        if (localStorage.getItem("logged_in") == "true") {
            console.log("identity seems to be logged in... attempting to confirm with server...");
            this.I_get();
        }            
    }

    I_get() : Observable<boolean> {
        console.log("trying to load I query...");
        return this.graph.I().pipe(
            map(data => {
                console.log("in getI(): ", data);
                this.currentISubject.next(data.data.I);
                this.isLoggedIn = true;
                console.log("identity confirmed!");
                
                return true;
            })
            // catchError(error => {
            //     console.log(error.status);
            //     console.log("I_get() error: ", error);
            //     return throwError(error);
            // })
        );
    }
    
    public get I_getValue(): any {
        return this.currentISubject.value;
    }

    tokenGet(email, password): Observable<any> {
        return this.graph.tokenGet(email, password).pipe(
            tap(response => {
                console.log("token received...", response);
                this.currentISubject.next(response);
                this.isLoggedIn = true;
                localStorage.setItem('logged_in', "true");
                return response;
            })
        );
    }

    // tokenDel(token): Observable<any> {
    //     console.log("logging out...");
    //     localStorage.setItem('logged_in', "false");
    //     this.isLoggingOut = true;
    //     return this.graph.tokenDel(token).pipe(
    //         tap(val => {
    //             console.log(val);
    //             this.isLoggedIn = false;
    //         })
    //     );
    // }

    putConsent(client_id): Observable<any> {
        return this.graph.consentPut(client_id).pipe(
            tap(val => {
                console.log(val);
                // this.isLoggedIn = true;
            })
        );
    }

    
    passwordsReset(email): Observable<any> {
        return this.graph.passwordsReset(email).pipe(
            tap(val => {
                console.log(val);
            })
        );
    }

    logOut() : any {
        this.currentISubject.next(null);
    }
}



//     .subscribe( (resp) => {
//         console.log(resp);
//         // this.cd.markForCheck();
//         this.isLoggedIn = false;
//         this.router.navigate(["/login"]);
// });