import {
     Component,
     ContentChildren,
     QueryList,
     AfterContentInit,
     ViewChild,
     ComponentFactoryResolver,
     ViewContainerRef,
} from "@angular/core";

import { WeavverTabComponent } from "./tab.component";

@Component({
     selector: "tabs",
     template: `
          <button 
               *ngFor="let tab of tabs" type="button" class="btn" [class.btn-secondary]="tab.active"
               (click)="selectTab(tab)"
          >{{ tab.title}}</button>
          <ng-content></ng-content>
     `,
     styles: [
     `
     
    `,
  ],
})
export class WeavverTabsComponent implements AfterContentInit {
     @ContentChildren(WeavverTabComponent) tabs: QueryList<WeavverTabComponent>;

     // contentChildren are set
     ngAfterContentInit() {
          let activeTabs = this.tabs.filter((tab) => tab.active);

          if (activeTabs.length === 0) {
               this.selectTab(this.tabs.first);
          }
     }

     selectTab(tab: WeavverTabComponent) {
          this.tabs.toArray().forEach((tab) => (tab.active = false));
          tab.active = true;
     }
}

// 

// <ul class="nav nav-pills">
// <li class="nav-item">
//      <a class="nav-link active" href="#">Dash</a>
// </li>
// <li class="nav-item">
//      <a class="nav-link" href="#">Link</a>
// </li>
// <li class="nav-item">
//      <a class="nav-link" href="#advanced">Advanced</a>
// </li>
// </ul>