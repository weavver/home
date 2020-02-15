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

     login_params: any;

     constructor(private httpClient: HttpClient) { }

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

     public consentPut(client_id:string): Observable<any> {
          const params = new HttpParams()
               .set('client_id', client_id);

          console.log("giving consent to an app.. ", client_id);
          return this.httpClient.put<any>(this.API_PROFILE, { params: params });
     }
}