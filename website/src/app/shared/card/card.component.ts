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
import { Subject } from 'rxjs';


import { PipeTransform, Pipe } from '@angular/core';

@Directive({ selector: 'card-buttons' })
export class WeavverCardButtons { }

@Component({ selector: 'card-body', template: `
     <div [class.pl-3]="!padding || padding==true" [class.pr-3]="padding==true" [class.mt-3]="padding==true">
          <ng-content></ng-content>
     </div>
` })
// @Input() title : String = null; })
export class WeavverCardBody {
     @Input() padding : Boolean = true;
}

// <tab title="Advanced" *ngIf="this._state=='view' && model.let.delete">
// <div style="text-align: center;">
//      <button type="button" class="btn btn-danger" style="min-width: 200px; margin: 15px;" (click)="delete_click()">
//           <i class="material-icons">delete</i>
//           Delete
//      </button>
// </div>
// </tab>     
@Component({
  selector: 'card',
  template: `
     <div class="card" [style.max-width.px]="maxWidth" style="padding: 0px; margin: auto;">
          <div class="overlay" *ngIf="loading"></div>
          <div class="loader" *ngIf="loading"></div>
          <div *ngIf="title" class="card-header pt-1 pb-2 pl-3 pr-3" style="padding-bottom: 5px; background-color: #FFFFFF">
               <div class="d-flex align-items-center">
                    <span class="mr-auto pt-1" style="font-size: 22px;" *ngIf="title">
                         <i *ngIf="icon" class="material-icons" style="vertical-align: middle !important; padding-right: 6px; padding-bottom: 5px;">{{ icon }}</i>
                         {{ title }}
                    </span>
                    <div *ngIf="menu" class="btn-group" role="group">
                         <button *ngFor="let button of menu.buttons | callback: filterVisible"
                              type="button"
                              class="btn"
                              style="min-width: 75px;"
                              [title]="button.title"
                              [class.btn-secondary]="button.warn!=true"
                              [class.btn-danger]="button.warn==true"
                              (click)="click(button)">
                              <span [ngSwitch]="button.text">
                                   <i *ngSwitchCase="'Edit'" class="material-icons">edit</i>
                                   <i *ngSwitchCase="'Delete'" class="material-icons">delete</i>
                                   <span *ngSwitchDefault>
                                        {{ button.text }}
                                   </span>
                              </span>
                         </button>
                    </div>
               </div>
          </div>
          <ng-content select="card-body"></ng-content>
     </div>`,
  styleUrls: ["./card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeavverCardComponent {
     @Input() loading : any;

     @Input() title : String = null;
     @Input() icon : String = null;
     @Input() maxWidth : any = 500;

     @Input() state : Subject<string> = new Subject();

     @Input() menu : any = null;

     @Output() menuitem_clicked = new EventEmitter();

     filterVisible(button: { visible: true}) {
          return button.visible;
        }

     click(item) {
          this.menuitem_clicked.emit(item);
     }
}


@Pipe({
    name: 'callback',
    pure: false
})
export class CallbackPipe implements PipeTransform {
    transform(items: any[], callback: (item: any) => boolean): any {
        if (!items || !callback) {
            return items;
        }
        return items.filter(item => callback(item));
    }
}