import {Injectable} from '@angular/core';
import {TicketContainerModel} from "../../models/TicketContainerModel";
import {DbService} from "./db.service";
import {ProjectModel} from "../../models/ProjectModel";

type MoveDirection = 'left' | 'right';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  containers: TicketContainerModel[] = [];
  projects: ProjectModel[] = []
  selectedProject: ProjectModel = {id: 0, title: ''}

  constructor(
    private dbService: DbService,
  ) {
  }

  moveContainer(model: TicketContainerModel, moveDirection: MoveDirection = 'left') {
    this.containers = this.containers.map((container, index) => {
      container.order = index;
      return container
    })
    if (moveDirection === 'right') {
      if (this.containers[this.containers.indexOf(model)].order >= this.containers.length - 1) return;
      this.containers[this.containers.indexOf(model)].order += 1
      this.containers[this.containers.indexOf(model) + 1].order -= 1;
    } else {
      if (this.containers[this.containers.indexOf(model)].order <= 0) return;
      this.containers[this.containers.indexOf(model)].order -= 1
      this.containers[this.containers.indexOf(model) - 1].order += 1;
    }
    this.dbService.putTicketContainer(this.containers[this.containers.indexOf(model)])
    if (moveDirection === 'left')
      this.dbService.putTicketContainer(this.containers[this.containers.indexOf(model) - 1])
    else
      this.dbService.putTicketContainer(this.containers[this.containers.indexOf(model) + 1])
    this.containers = this.containers.sort((a, b) => a.order - b.order);
  }
}
