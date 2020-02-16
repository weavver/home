import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'card',
  template: `
     <div class="card" [style.max-width.px]="maxWidth">
          <div class="overlay" *ngIf="loading"></div>
          <div class="loader" *ngIf="loading"></div>
          <ng-content></ng-content>
     </div>
  `,
  styles: [`
     .card {
          padding: 10px;
          // max-width: 500px;
          margin: auto;
     }
     .overlay {
          background: rgba(0, 0, 0, .15);
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0px;
          top: 0px;
     }
     .loader {
          border: 16px solid #f3f3f3;
          border-top: 16px solid #3498db;
          border-radius: 50%;
          animation: spin 2s linear infinite;
     
          margin: auto;
          width: 60px;
          height: 60px;
          // border: solid black;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0
     }
     @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
     }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeavverCardComponent {
     @Input() loading : any;

     @Input() maxWidth : any = 500;
}