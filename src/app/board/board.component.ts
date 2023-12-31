import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {TicketContainerComponent} from "../ticket-container/ticket-container.component";

@Component({
  selector: 'board',
  standalone: true,
  imports: [
    NgForOf,
    TicketContainerComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  containers: {test: string}[] = []
  addNewContainer() {
    this.containers.push({test: "test"})
    console.log("test")
  }
}
