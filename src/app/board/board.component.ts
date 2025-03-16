import {Component, Input} from '@angular/core';
import {NgForOf} from "@angular/common";
import {TicketContainerComponent} from "../ticket-container/ticket-container.component";
import {TicketContainerModel} from "../../models/TicketContainerModel";
import {CdkDropListGroup} from "@angular/cdk/drag-drop";
import {DbService} from "../services/DbService";
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
    styleUrl: './board.component.scss',
    providers: [DbService]
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
    this.dbService.addNewTicketContainer(projectId).then(res => {
      if (res) {
        this.containers.push(res)
      }
    })
  }

}
