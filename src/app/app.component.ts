import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MenuSidebarComponent} from "./menu-sidebar/menu-sidebar.component";
import {UpdatesService} from "./services/updates.service";

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, MenuSidebarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'canban2';

  constructor(
    private updateService: UpdatesService
  ) {
    navigator.storage.persist().then(r => {
      if (r) {
        console.info('Storage is persisted')
      } else {
        console.error('Storage is best effort only')
      }
    })
  }
}
