import {Component, Input} from '@angular/core';
import {TicketContainerComponent} from "../ticket-container/ticket-container.component";
import {TicketContainerModel} from "../../models/TicketContainerModel";
import {CdkDropListGroup} from "@angular/cdk/drag-drop";
import {DbService} from "../services/db.service";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'board',
  imports: [
    TicketContainerComponent,
    CdkDropListGroup,
    FontAwesomeModule
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  @Input() containers: TicketContainerModel[] = []
  @Input() projectId: number = 0;
  private dbService: DbService;
  protected readonly faPlus = faPlus;

  constructor(dbService: DbService) {
    this.dbService = dbService
  }

  async addNewContainer(projectId: number) {
    const newOrder = this.containers.length > 0 ? Math.max(...this.containers.map(container => container.order)) + 1 : 0;
    this.dbService.addNewTicketContainer(projectId, newOrder).then(res => {
      if (res) {
        this.containers.push(res)
      }
    })
  }

}
