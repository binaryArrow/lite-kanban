import {IDBPDatabase} from "idb";
import {indexes as ticketContainerIndexes} from "../../models/TicketContainerModel";

export class TableService {
  static createTicketStore(db: IDBPDatabase) {
    const ticketStore = db.createObjectStore('tickets', {
      keyPath: 'id',
      autoIncrement: true
    })
    ticketStore.createIndex('containerId', 'containerId')
    ticketStore.createIndex('id', 'id')
  }
  static createProjectStore(db: IDBPDatabase) {
    const projectStore = db.createObjectStore('projects', {
      keyPath: 'id',
      autoIncrement: true
    })
    projectStore.createIndex('id', 'id')
  }

  static createTicketContainerStore(db: IDBPDatabase) {
    const ticketContainerStore = db.createObjectStore('ticketContainers', {
      keyPath: 'id',
      autoIncrement: true
    })
    ticketContainerIndexes.forEach(index => {
      ticketContainerStore.createIndex(index, index)
    })
    TableService.createProjectStore(db)
    TableService.createTicketStore(db)
  }
}
