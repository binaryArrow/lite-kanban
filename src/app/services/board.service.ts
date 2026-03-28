import {inject, Injectable, signal} from '@angular/core';
import {TicketContainerModel} from "../../models/TicketContainerModel";
import {DbService} from "./db.service";
import {ProjectModel} from "../../models/ProjectModel";

type MoveDirection = 'left' | 'right';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  containers = signal<TicketContainerModel[]>([]);
  projects = signal<ProjectModel[]>([]);
  selectedProject = signal<ProjectModel>({id: 0, title: ''});

  private dbService = inject(DbService);

  moveContainer(model: TicketContainerModel, moveDirection: MoveDirection = 'left') {
    const containers = this.containers().map((container, index) => {
      container.order = index;
      return container;
    });
    const modelIndex = containers.findIndex(container => container.id === model.id);
    if (modelIndex === -1) return;
    if (moveDirection === 'right') {
      if (containers[modelIndex].order >= containers.length - 1) return;
      containers[modelIndex].order += 1;
      containers[modelIndex + 1].order -= 1;
    } else {
      if (containers[modelIndex].order <= 0) return;
      containers[modelIndex].order -= 1;
      containers[modelIndex - 1].order += 1;
    }
    this.dbService.putTicketContainer(containers[modelIndex]);
    if (moveDirection === 'left')
      this.dbService.putTicketContainer(containers[modelIndex - 1]);
    else
      this.dbService.putTicketContainer(containers[modelIndex + 1]);
    this.containers.set([...containers].sort((a, b) => a.order - b.order));
  }
}
