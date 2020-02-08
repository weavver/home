import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccountData {
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
     private API_TOKEN        = environment.baseApiUrl + "/tokens";
     private API_ACCOUNT      = environment.baseApiUrl + "/account";
     private API_PROFILE      = environment.baseApiUrl + "/profile";
     private API_ECHO         = environment.baseApiUrl + "/echo";

     constructor(private httpClient: HttpClient) { }

     public getToken(username, password): Observable<any> {
          let params = new HttpParams();
          params.append('username', username);
          params.append('password', password);
          return this.httpClient.get(this.API_TOKEN, { params: params });
     }

     public delToken(token): Observable<any> {
          let params = new HttpParams();
          params.append('token', token);
          return this.httpClient.delete(this.API_TOKEN + "/" + token);
     }

     public accountPut(account: AccountData): Observable<any> {
          console.log("creating account..");
          console.log(account);
          return this.httpClient.put<AccountData>(this.API_ACCOUNT, JSON.stringify(account));
     }

     public profilePut(profile:ProfileData): Observable<any> {
          console.log("setting profile..");
          console.log(profile);
          return this.httpClient.put<any>(this.API_PROFILE, profile);
     }
}