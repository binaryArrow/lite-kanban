import {IDBPDatabase, IDBPTransaction} from "idb";
import {indexes as ticketContainerIndexes, TicketContainerModel} from "../../models/TicketContainerModel";
import {indexes as projectIndexes, ProjectModel} from "../../models/ProjectModel";
import {indexes as ticketIndexes} from "../../models/TicketModel";
import {indexes as imageIndexes} from "../../models/ImageModel";

export class TableService {
  static DB_TABLES = ['ticketContainers', 'projects', 'tickets', 'images']

  static createTicketStore(db: IDBPDatabase) {
    const ticketStore = db.createObjectStore('tickets', {
      keyPath: 'id',
      autoIncrement: true
    })
    ticketStore.createIndex('containerId', 'containerId')
    ticketStore.createIndex('id', 'id')
  }

  static async createProjectStore(db: IDBPDatabase) {
    const projectStore = db.createObjectStore('projects', {
      keyPath: 'id',
      autoIncrement: true
    })
    projectStore.createIndex('id', 'id')
    projectStore.put({title: 'New Project', id: 0})

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

  static createImageStore(db: IDBPDatabase) {
    const imageStore = db.createObjectStore('images', {
      keyPath: 'id',
      autoIncrement: true
    })
    imageStore.createIndex('id', 'id')
    imageStore.createIndex('ticketId', 'ticketId')
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
        case 'images': {
          // add new indexes
          imageIndexes.filter(index => !store.indexNames.contains(index)).forEach(index => {
            store.createIndex(index, index)
          })
          // delete if index was delete
          Object.values(store.indexNames).filter(index => !imageIndexes.includes(index)).forEach(index => {
            store.deleteIndex(index)
          })
        }
          break;
      }
    })
  }
// UPDATE: add orders to ticket containers
  static async addOrdersToTicketContainers(transaction: IDBPTransaction<unknown, string[], 'versionchange'>) {
    const projects: ProjectModel[] = await transaction.objectStore('projects').getAll()
    for (const project of projects) {
      const ticketContainers: TicketContainerModel[] = await transaction.objectStore('ticketContainers').index('projectId').getAll(project.id)
      ticketContainers.forEach((container, index) => {
        if (!container.order) {
          container.order = index
          transaction.objectStore('ticketContainers').put(container)
        }
      })
    }
  }
}
