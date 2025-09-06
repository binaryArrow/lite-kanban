import {Injectable} from '@angular/core';
import {TicketContainerModel} from "../../models/TicketContainerModel";
import {DbService} from "./db.service";
import {ProjectModel} from "../../models/ProjectModel";

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

  moveContainerLeft(model: TicketContainerModel) {
    this.containers = this.containers.map((container, index) => {
      container.order = index;
      return container
    })
    if (this.containers[this.containers.indexOf(model)].order <= 0) return;
    this.containers[this.containers.indexOf(model)].order -= 1
    this.containers[this.containers.indexOf(model) - 1].order += 1;
    this.dbService.putTicketContainer(this.containers[this.containers.indexOf(model)])
    this.dbService.putTicketContainer(this.containers[this.containers.indexOf(model) - 1])
    this.containers = this.containers.sort((a, b) => a.order - b.order);
  }

}
