import {
     Component,
     ContentChildren,
     QueryList,
     AfterContentInit,
     ViewChild,
     ComponentFactoryResolver,
     ViewContainerRef,
     Input
} from "@angular/core";

import { WeavverTabComponent } from "./tab.component";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
     selector: "tabs",
     template: `
               <button *ngFor="let tab of tabs"
                         type="button" class="btn"
                         [class.btn-secondary]="tab.active"
                         (click)="selectTab(tab)"
                         style="padding-left: 30px; padding-right: 30px; margin-left: 10px;margin-right: 10px;"
                         >
                    {{ tab.title}}
               </button>
               <ng-content></ng-content>
     `,
     styles: [
     `
     
    `,
  ],
})
export class WeavverTabsComponent implements AfterContentInit {
     @ContentChildren(WeavverTabComponent) tabs: QueryList<WeavverTabComponent>;

     constructor(private route : ActivatedRoute) {
     }

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