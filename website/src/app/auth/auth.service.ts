import { DataService } from '../data.service';

import { OnInit, Injectable } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';

import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { take, first, tap, map, catchError } from 'rxjs/operators';
import { LocalStorageService} from "ngx-webstorage";

import { IGQL, Identity, IQuery } from '../../generated/graphql';

import {Apollo} from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    // I: BehaviorSubject<any> = new BehaviorSubject<any>(this.I_get());
    I : Observable<Identity>;

    isLoggingOut : boolean = false;

    public get isLoggedIn() : boolean {
        return (localStorage.getItem("logged_in") == "true");
    };

    public set isLoggedIn(value : boolean) {
        if (value)
            localStorage.setItem("logged_in", "true");
        else 
            localStorage.setItem("logged_in", "false");
    };

    showSidebar : boolean = true;

    constructor(private router: Router,
                private graph: DataService,
                public I_query : IGQL,
                private apollo: Apollo)
    {
        this.I = this.I_query.watch().valueChanges.pipe(
            map((res) => { return res.data.I as Identity }),
            tap(() => console.log("in I_query.watch()"))
        );
    }

    tokenGet(email, password): Observable<any> {
        return this.graph.tokenGet(email, password).pipe(
            tap(response => {
                console.log("token received...", response);
                this.isLoggedIn = true;
                localStorage.setItem('logged_in', "true");
                return response;
            })
        );
    }

    putConsent(client_id): Observable<any> {
        return this.graph.consentPut(client_id).pipe(
            tap(val => {
                console.log(val);
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
          console.log("logging out...");
          this.isLoggedIn = false;
          localStorage.setItem('logged_in', "false");
          this.graph.tokenDel("this").pipe(
               tap((response) => {
                    this.router.navigate(['/login']);
                    this.apollo.getClient().cache.reset();
                }),
                first()
          ).subscribe();
     }
}