import {
     Component,
     OnInit,
     ChangeDetectionStrategy,
     Input,
     ContentChild,
     AfterContentInit,
     ContentChildren,
     Directive,
     EventEmitter,
     Output,
     QueryList} from '@angular/core';


@Directive({ selector: 'card-buttons' })
export class WeavverCardButtons { }

@Directive({ selector: 'card-body' })
export class WeavverCardBody { }

@Component({
  selector: 'card',
  template: `
     <div class="card" [style.max-width.px]="maxWidth" style="padding: 0px; margin: auto;">
          <div class="overlay" *ngIf="loading"></div>
          <div class="loader" *ngIf="loading"></div>
          <div *ngIf="title" class="card-header pt-1 pb-2 pl-3 pr-3" style="padding-bottom: 5px; margin-bottom: 15px; background-color: #FFFFFF">
               <div class="d-flex align-items-center">
                    <span class="mr-auto pt-1" style="font-size: 22px;" *ngIf="title">
                         <i *ngIf="icon" class="material-icons" style="vertical-align: middle !important; padding-right: 6px; padding-bottom: 5px;">{{ icon }}</i>
                         {{ title }}
                    </span>
                    <div *ngIf="menu" class="btn-group" role="group">
                         <button *ngFor="let button of menu.buttons"
                              class="btn btn-primary" (click)="click(button)">{{ button.text }} </button>
                    </div>
               </div>
          </div>
          <div class="pl-3 pr-3">
               <ng-content select="card-body"></ng-content>
          </div>
     </div>`,
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

     @Input() title : String = null;
     @Input() icon : String = null;
     @Input() maxWidth : any = 500;

     @Input() menu : any = null;

     @Output() menuitem_clicked = new EventEmitter();

     click(item) {
          this.menuitem_clicked.emit(item);
     }
}
