import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FetchResult } from 'apollo-link';

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

declare var api_url:any;

@Injectable({
  providedIn: 'root'
})
export class DataService {
     private API_IDENTITY     = api_url + "/identities";
     private API_TOKENS       = api_url + "/tokens";
     private API_PASSWORDS    = api_url + "/passwords";
     private API_PROFILE      = api_url + "/profile";
     private API_ECHO         = api_url + "/echo";

     login_params: any;

     constructor(private apollo: Apollo, private httpClient: HttpClient) {
     }

     public tokenGet(email, password): Observable<any> {
          const params = new HttpParams()
               .set('email', email)
               .set('password', password);

          return this.httpClient.get(this.API_TOKENS, { params: params, withCredentials: true });
     }

     public tokenDel(token): Observable<any> {
          return this.httpClient.delete(this.API_TOKENS, { withCredentials: true });
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

     public centers() {
          return this.apollo.watchQuery<any>({ query: gql`{ centers { name } }` }).valueChanges;
     }

     I_query = {
               query: gql`{
                         I {
                              id,
                              email,
                              name,
                              name_given,
                              name_family
                         }
                     }`,
               variables: {}
          };

     public I() {
          return this.apollo.watchQuery<any>(this.I_query).valueChanges;
     }

     public identities(idarg? : [Number]) {
          return this.apollo.watchQuery<any>({
               query: gql`query identities($id: [Int!]) { identities(id: $id) { id, email, name_given, name_family } }`,
               variables: { id: idarg}
          }).valueChanges;
     }

     public identity_property_set(property : string, value : string) : Observable<any> {
          const identity_property_set = gql`mutation identity_property_set($value: String!, $property: String!) {
               identity_property_set(property: $property, value: $value)
                         }`;

          return this.apollo.mutate({
                    mutation: identity_property_set,
                    variables: {
                         property: property,
                         value: value
                    },
                    refetchQueries: [ this.I_query ]
               });
     }

     public center_set(property : string, value : string) : Observable<any> {
          const identity_property_set = gql`mutation center_set($id: Number!, $name: String!) {
                    center_set(id: $id, name: $name)
               }`;

          return this.apollo.mutate({
                    mutation: identity_property_set,
                    variables: {
                         property: property,
                         value: value
                    },
                    refetchQueries: [ this.I_query ]
               });
     }

     public identity_password_set(password_current : string, password_new : string) {
          const identity_password_set = gql`
                    mutation identity_password_set($password_current: String!, $password_new: String!) {
                              identity_password_set(password_current: $password_current, password_new: $password_new)
                         }
                    `;

          this.apollo.mutate({
                    mutation: identity_password_set,
                    variables: {
                         password_current: password_current,
                         password_new: password_new
                    }
               })
               .subscribe(({ data }) => {
                         console.log('got data', data);
                    },
                    (error) => {
                         console.log('there was an error sending the query', error);
                    });
     }

     public getApplications() {
          return this.apollo.watchQuery<any>({ query: gql`{ applications { id, name } }` }).valueChanges;
     }

     public getApplication(idarg : [Number]) {
          return this.apollo.watchQuery<any>({
               query: gql`
                    query applications($id: [Int!]) {
                         applications(id: $id) { id, name, client_id, host_name, host_email, host_url } 
                    }`,
               variables: { id: idarg }
          }).valueChanges;
     }

     public application_add(name, client_id, host_email, host_url) {
          const mutation = gql`mutation application_add($name: String, client_id: Int, host_email: String, host_url: String) {
                    application_add(name: $name, client_id: $client_id, $host_email, $host_url)
               }`;
          this.apollo.mutate({
               mutation: mutation,
               variables: {
                    name: name,
                    client_id: client_id,
                    host_email: host_email,
                    host_url: host_url
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