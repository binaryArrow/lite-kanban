import {Injectable, OnInit} from '@angular/core';
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
    this.containers[this.containers.indexOf(model)].order -= 1
    this.containers[this.containers.indexOf(model) - 1].order += 1;
    this.containers = this.containers.sort((a, b) => a.order - b.order);
    console.log(this.containers)
  }

}
