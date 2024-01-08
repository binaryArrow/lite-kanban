import {IDBPDatabase, IDBPTransaction} from "idb";
import {indexes as ticketContainerIndexes} from "../../models/TicketContainerModel";
import {indexes as projectIndexes} from "../../models/ProjectModel";
import {indexes as ticketIndexes} from "../../models/TicketModel";

export class TableService {
  static DB_TABLES = ['ticketContainers', 'projects', 'tickets']
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
  }

  static updateIndexesForTables(transaction: IDBPTransaction<unknown, string[], 'versionchange'>) {
  Object.values(transaction.objectStoreNames).forEach(table => {
  console.log(table)
  const store = transaction.objectStore(table)
  // TODO: find better way to update indexes
  switch (table) {
  case 'ticketContainers': {
      // add new indexes
      ticketContainerIndexes.filter(index => !store.indexNames.contains(index)).forEach(index => {
        store.createIndex(index, index)
      })
      // delete if index was delete
      Object.values(store.indexNames).filter(index => !ticketContainerIndexes.includes(index)).forEach(index => {
        store.deleteIndex(index)
      })
    }
    break;
  case 'projects': {
      // add new indexes
      projectIndexes.filter(index => !store.indexNames.contains(index)).forEach(index => {
        store.createIndex(index, index)
      })
      // delete if index was delete
      Object.values(store.indexNames).filter(index => !projectIndexes.includes(index)).forEach(index => {
        store.deleteIndex(index)
      })
    }
    break;
  case 'tickets': {
      // add new indexes
      ticketIndexes.filter(index => !store.indexNames.contains(index)).forEach(index => {
        store.createIndex(index, index)
      })
      // delete if index was delete
      Object.values(store.indexNames).filter(index => !ticketIndexes.includes(index)).forEach(index => {
        store.deleteIndex(index)
      })
    }
    break;
  }
})
}
}
