import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactData {
     name_first: string;
     name_last: string;
     phone: string;
     email: string;
     address_line_1: string;
     address_line_2: string;
     city: string;
     state: string;
     country: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
     private REST_API_GEN_SIGNED_URL         = "https://api.accounts.weavver.com/dev/signedupload";
     private REST_API_ORDER_PUT              = "https://api.accounts.weavver.com/dev/order";

     constructor(private httpClient: HttpClient) { }

     // public getOrder(orderId): Observable<any> {
     //      let params = new HttpParams().set('id', orderId);
     //      return this.httpClient.get(this.REST_API_ORDERS,  { params: params });
     // }

     // public getOrders(): Observable<any> {
     //      return this.httpClient.get(this.REST_API_ORDERS);
     // }

     // public getGroups(): Observable<any> {
     //      return this.httpClient.get(this.REST_API_GROUPS);
     // }

     // public getUploadURL(name:string) {
     //      // console.log(name);
     //      return this.httpClient.post<any>(this.REST_API_GEN_SIGNED_URL, "{ \"key\": \""+ name + "\"}");
     //      //    .pipe(
     //      //       catchError(this.handleError('addHero', "error"))
     //      //    );
     // }
     
     
     // public orderPut(order:OrderData): Observable<any> {
     //      console.log("submitting order..");
     //      console.log(order);
     //      return this.httpClient.put<any>(this.REST_API_ORDER_PUT, order);
     // }
     
}