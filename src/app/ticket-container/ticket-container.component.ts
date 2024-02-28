import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {TicketContainerModel} from "../../models/TicketContainerModel";
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {severities, TicketModel} from "../../models/TicketModel";
import {DbService} from "../services/DbService";
import {faEllipsisV, faPlus, faTrash, faX} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {TicketComponent} from "../ticket/ticket.component";
import {NgForOf, NgIf} from "@angular/common";
import {MatMenuModule} from "@angular/material/menu";

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
    NgIf,
    NgForOf,
    MatMenuModule,
    NgOptimizedImage
  ],
  templateUrl: './ticket-container.component.html',
  styleUrl: './ticket-container.component.scss',
  providers: [
    DbService
  ]
})
export class TicketContainerComponent implements OnInit {
  @Input() model: TicketContainerModel = {title: 'NEW', id: 0, projectId: 0}
  @Input() ticketContainers: TicketContainerModel[] = []
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>
  @ViewChild('deleteConfirmationDialog') deleteConfirmationDialog!: ElementRef<HTMLDialogElement>
  @ViewChild('ticketTitleInput') ticketTitleInput!: ElementRef<HTMLInputElement>
  @ViewChild('imageUpload') fileUpload!: ElementRef<HTMLInputElement>

  protected readonly faPlus = faPlus;
  protected readonly severities = severities;
  protected readonly faEllipsisV = faEllipsisV;
  protected readonly faTrash = faTrash;
  protected readonly faFileUpload = faFileUpload;
  private dbService: DbService;
  protected showConfirmation = false;
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
  pictureData: string = ''

  constructor(dbService: DbService) {
    this.dbService = dbService
  }

  async ngOnInit() {
    this.tickets = await this.dbService.getTicketsForContainer(this.model.id)
    this.tickets.sort((a, b) => a.index - b.index)
  }

  showModal(event: { show: boolean; ticketId: number }) {
    if (event.show) {
      this.openTicket = this.tickets.find(ticket => ticket.id === event.ticketId)
      this.dialog.nativeElement.showModal()
      this.ticketTitleInput.nativeElement.blur()
    }
  }

  drop(event: CdkDragDrop<TicketModel[], any>) {
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
    this.tickets.forEach(async (ticket, index) => {
      ticket.index = index
      ticket.containerId = this.model.id
      await this.dbService.putTicket(ticket)
    })
  }

  addNewTicket() {
    this.dbService.addNewTicket(this.model.id, this.tickets.length).then(async response => {
      this.tickets.unshift(response as TicketModel)
      for (let i = 1; i < this.tickets.length; i++) {
        this.tickets[i].index = i
        await this.dbService.putTicket(this.tickets[i])
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

  closeModal() {
    this.dialog.nativeElement.close()
    this.showConfirmation = false
  }


  deleteTicket() {
    if (this.openTicket) {
      const foundInTickets = this.tickets.find(ticket => ticket.id === this.openTicket!!.id)
      if (foundInTickets) {
        this.dbService.deleteTicket(this.openTicket.id).then(() => {
          this.tickets?.splice(this.tickets.indexOf(foundInTickets), 1)
          this.dialog.nativeElement.close()
          this.showConfirmation = false
        })
      }
    }
  }

  showContainerDeleteConfirmation() {
    this.deleteConfirmationDialog.nativeElement.showModal()
  }

  async deleteContainer() {
      this.dbService.deleteTicketContainer(this.model.id).then(() => {
        this.ticketContainers.splice(this.ticketContainers.indexOf(this.model), 1)
      })
      this.deleteConfirmationDialog.nativeElement.close()
  }

  closeDialogWithClickOutside(event: MouseEvent, element: HTMLDialogElement) {
    if(event.target === element) {
      element.close()
    }
  }

  triggerImageUpload() {
    this.fileUpload.nativeElement.click()
  }

  // TODO: add imagedata to tickets and display uploaded images in ticket
  uploadImage() {
    const files = this.fileUpload.nativeElement.files
    if (files) {
      const reader = new FileReader()
      reader.readAsDataURL(files[0])
      reader.onload = () => {
        console.log(reader.result)
        this.pictureData = URL.createObjectURL(files[0])
      }
    }
  }
}
