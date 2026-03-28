import {Component, inject} from '@angular/core';
import {TicketContainerComponent} from "../ticket-container/ticket-container.component";
import {CdkDropListGroup} from "@angular/cdk/drag-drop";
import {DbService} from "../services/db.service";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {BoardService} from "../services/board.service";

@Component({
  selector: 'board',
  imports: [
    TicketContainerComponent,
    CdkDropListGroup,
    FontAwesomeModule
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  private dbService = inject(DbService);
  protected boardService = inject(BoardService);
  protected readonly faPlus = faPlus;

  async addNewContainer() {
    const currentContainers = this.boardService.containers();
    const newOrder = currentContainers.length > 0 ? Math.max(...currentContainers.map(container => container.order)) + 1 : 0;
    this.dbService.addNewTicketContainer(this.boardService.selectedProject().id, newOrder).then(res => {
      if (res) {
        this.boardService.containers.update(containers => [...containers, res]);
      }
    })
  }

}
