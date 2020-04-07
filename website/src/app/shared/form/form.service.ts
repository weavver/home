import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormService {

  constructor() { }

     public Test() {
          console.log("test service");
     }
}