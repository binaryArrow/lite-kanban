import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MenuSidebarComponent} from "./menu-sidebar/menu-sidebar.component";
import {UpdatesService} from "./services/updates.service";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MenuSidebarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  readonly title = 'canban2';
  private updateService = inject(UpdatesService);

  constructor() {
    navigator.storage.persist().then(r => {
      if (r) {
        console.info('Storage is persisted')
      } else {
        console.error('Storage is best effort only')
      }
    })
  }
}
