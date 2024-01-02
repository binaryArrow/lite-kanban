import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {TicketContainerModel} from "../../models/TicketContainerModel";
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {severities, TicketModel} from "../../models/TicketModel";
import {DbService} from "../services/DbService";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {TicketComponent} from "../ticket/ticket.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'ticket-container',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    FaIconComponent,
    FormsModule,
    MatInputModule,
    TicketComponent,
    NgIf
  ],
  templateUrl: './ticket-container.component.html',
  styleUrl: './ticket-container.component.scss',
  providers: [
    DbService
  ]
})
export class TicketContainerComponent implements OnInit {
  @Input() model: TicketContainerModel = {title: 'NEW', id: 0}
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>
  @ViewChild('ticketTitleInput') ticketTitleInput!: ElementRef<HTMLInputElement>
  private dbService: DbService;
  protected readonly faPlus = faPlus;
  tickets: TicketModel[] = []
  openTicket: TicketModel | undefined = {
    id: 0,
    containerId: 0,
    title: '',
    description: '',
    index: 0,
    createDate: '',
    severity: severities[0]
  }

  constructor(dbService: DbService) {
    this.dbService = dbService
  }

  async ngOnInit() {
    await this.dbService.initDB()
    this.tickets = await this.dbService.getTicketsForContainer(this.model.id)
  }

  showModal(event: { show: boolean; ticketId: number }) {
    if (event.show) {
      this.openTicket = this.tickets.find(ticket => ticket.id === event.ticketId)
      this.dialog.nativeElement.showModal()
      this.ticketTitleInput.nativeElement.blur()
    }
  }

  drop(event: CdkDragDrop<TicketModel[], any>) {
    {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
    }
    console.log(event)
    console.log(this.model.id)
  }

  addNewTicket() {
    this.dbService.addNewTicket(this.model.id).then(res => {
      if (res) {
        this.tickets.push(res)
      }
    })
  }

  modelChanged() {
    this.dbService.putTicketContainer(this.model).then()
    this.titleInput.nativeElement.blur()
  }

  saveTicket() {
    if (this.openTicket) {
      this.dbService.putTicket(this.openTicket).then()
    }
  }
}
