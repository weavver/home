import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

export interface IdentityData {
     email: string,
     password: string
}

export interface ProfileData {
     id: string;
     name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
     private API_IDENTITY     = environment.baseApiUrl + "/identities";
     private API_TOKEN        = environment.baseApiUrl + "/tokens";
     private API_PASSWORDS    = environment.baseApiUrl + "/passwords";
     private API_PROFILE      = environment.baseApiUrl + "/profile";
     private API_ECHO         = environment.baseApiUrl + "/echo";

     login_params: any;

     constructor(private apollo: Apollo, private httpClient: HttpClient) {
     }

     public tokenGet(email, password): Observable<any> {
          const params = new HttpParams()
               .set('email', email)
               .set('password', password);

          return this.httpClient.get(this.API_TOKEN, { params: params, withCredentials: true });
     }

     public tokenDel(token): Observable<any> {
          return this.httpClient.delete(this.API_TOKEN, { withCredentials: true });
     }

     // difficulties implementing it so set aside now and using a redirect instead.
     // public delToken(token): Observable<any> {
     //      let params = new HttpParams();
     //      return this.httpClient.delete(this.API_TOKEN, { withCredentials: true });
     // }

     public identityPut(account: IdentityData): Observable<any> {
          console.log("creating identity.." + account);
          return this.httpClient.put<IdentityData>(this.API_IDENTITY, JSON.stringify(account));
     }

     public identityVerifyCodePut(code: string) : Observable<any> {
          console.log("identity verifcation.. " + code);
          return this.httpClient.put<any>(this.API_IDENTITY + "/verify", JSON.stringify(code));
     }

     public profilePut(profile:ProfileData): Observable<any> {
          console.log("setting profile.. " + profile);
          return this.httpClient.put<any>(this.API_PROFILE, profile);
     }

     public consentPut(client_id:string): Observable<any> {
          const params = new HttpParams()
               .set('client_id', client_id);

          console.log("giving consent to an app.. ", client_id);
          return this.httpClient.put<any>(this.API_PROFILE, { params: params });
     }


     public I() {
          return this.apollo.watchQuery<any>({
               query: gql`{
                              I {
                                   email,
                                   name_given,
                                   name_family
                              }
                          }`            
                    })
               .valueChanges;
     }

     public identity_update(property : string, value : string) {
          const identity_update = gql`mutation identity_update($value: String!, $property: String!) {
                              identity_update(property: $property, value: $value)
                         }`;

          this.apollo.mutate({
                    mutation: identity_update,
                    variables: {
                         property: property,
                         value: value,
                         value2: value
                    }
               }).subscribe(({ data }) => {
                    console.log('got data', data);
               },(error) => {
                    console.log('there was an error sending the query', error);
               });
     }

     public getApplications() {
          return this.apollo.watchQuery<any>({
               query: gql`
                    {
                         centers
                    }
                    `
                    })
               .valueChanges;
     }

     public Application_add() {
          const mutation = gql`mutation($text: String) {
                    Application_add(text: $text)
               }`;
          this.apollo.mutate({
               mutation: mutation,
               variables: {
                    text: 'apollographql/apollo-client'
               }
          })
          .subscribe(
               ({ data }) => {
                    console.log('got data', data);
                    // console.log(data.Application_add);
               },
               (error) => {
                    console.log('there was an error sending the query', error);
               }
          );
     }

     public passwordsReset(email): Observable<any> {
          const params = new HttpParams()
               .set('email', email);

          return this.httpClient.get(this.API_PASSWORDS, { params: params });
     }
}