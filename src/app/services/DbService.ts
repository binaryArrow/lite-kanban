import {IDBPDatabase, openDB} from "idb";
import {format} from "date-fns";
import {TicketContainerModel} from "../../models/TicketContainerModel";
import {severities, TicketModel} from "../../models/TicketModel";
import {Injectable} from "@angular/core";
import {TableService} from "./TableService";
import {ProjectModel} from "../../models/ProjectModel";

@Injectable()
export class DbService {
  db: any
  DB_VERSION = 2

  async initDB() {
    const createTables = (db: IDBPDatabase) => {
      TableService.createTicketContainerStore(db)
      TableService.createProjectStore(db)
      TableService.createTicketStore(db)
    }
    if (!('indexedDB' in window)) {
      alert("This browser doesn't support IndexedDB.");
    } else {
      let updateVersion1Containers = 0
      this.db = await openDB('Canban', this.DB_VERSION, {
        upgrade(db, oldVersion, newVersion, transaction) {
          updateVersion1Containers = oldVersion
          if (transaction.objectStoreNames.length == 0) {
            createTables(db)
          } else if (transaction.objectStoreNames.length < TableService.DB_TABLES.length && newVersion) {
            switch (true) {
              case (oldVersion < 2): {
                TableService.createProjectStore(db)
              }
            }
          }
          if (newVersion && oldVersion < newVersion) {
            TableService.updateIndexesForTables(transaction)
          }
        }
      })
      if (updateVersion1Containers == 1) {
        this.db.transaction('ticketContainers', 'readwrite').objectStore('ticketContainers').getAll().then((res: TicketContainerModel[]) => {
          console.log(res)
          const newContainers = res.map(container => {
            return {...container, projectId: 0}
          })
          res.forEach((container: TicketContainerModel) => {
            this.db.delete('ticketContainers', container.id)
          })
          newContainers.forEach((container: TicketContainerModel) => {
            this.db.add('ticketContainers', container)
          })
        })
      }
    }
  }

  async addNewTicketContainer(projectId: number) {
    const db = await openDB('Canban', this.DB_VERSION)
    const container = {
      title: 'NEW',
      projectId: projectId
    } as TicketContainerModel
    return await db.add('ticketContainers', container).then(res => {
      return {...container, id: res} as TicketContainerModel
    }).catch(err => {
      console.error('something went wrong saving to IDB: ' + err)
    })
  }

  async putTicketContainer(model: TicketContainerModel) {
    const db = await openDB('Canban', this.DB_VERSION)
    await db.put('ticketContainers', {title: model.title, id: model.id, projectId: model.projectId})
  }

  async deleteTicketContainer(containerId: number) {
    const db = await openDB('Canban', this.DB_VERSION)
    await db.delete('ticketContainers', containerId).then(()=>{
      db.getAllFromIndex('tickets', 'containerId', containerId).then((res: TicketModel[]) => {
        res.forEach(ticket => {
          this.deleteTicket(ticket.id)
        })
      })
    })
  }

  async putTicket(model: TicketModel) {
    const db = await openDB('Canban', this.DB_VERSION)
    await db.put('tickets', {
      title: model.title,
      id: model.id,
      containerId: model.containerId,
      description: model.description,
      index: model.index,
      createDate: model.createDate,
      severity: model.severity
    } as TicketModel)
  }

  async getAllTicketContainers(projectId: number): Promise<TicketContainerModel[]> {
    const db = await openDB('Canban', this.DB_VERSION)
    return await db.getAllFromIndex('ticketContainers', 'projectId', projectId).then((res) => {
      return res as TicketContainerModel[]
    })
  }

  async getAllProjects(): Promise<TicketContainerModel[]> {
    return await this.db.transaction('projects').objectStore('projects').getAll()
  }
  async getTicketContainerById(id: number) {
    return await this.db.getFromIndex('ticketContainers', 'id', id)
  }

  async getTicketById(id: number) {
    const db = await openDB('Canban', this.DB_VERSION)
    return await db.getFromIndex('tickets', 'id', id) as TicketModel
  }

  async addNewTicket(containerId: number, ticketLengths: number) {
    const db = await openDB('Canban', this.DB_VERSION)
    const ticket = {
      title: `New Ticket ${ticketLengths+1}`,
      containerId: containerId,
      description: '',
      index: 0,
      createDate: format(new Date(), 'dd-MM-yyyy HH:mm'),
      severity: severities[0]
    } as TicketModel
    return await db.add('tickets', ticket).then(res => {
      return {...ticket, id: res} as TicketModel
    }).catch(err => {
      console.error('something went wrong saving to IDB: ' + err)
    })
  }

  async deleteTicket(ticketId: number) {
    const db = await openDB('Canban', this.DB_VERSION)
    return await db.delete('tickets', ticketId)
  }

  async getTicketsForContainer(containerId: number) {
    const db = await openDB('Canban', this.DB_VERSION)
    return await db.getAllFromIndex('tickets', 'containerId', containerId).then((res) => {
      return res as TicketModel[]
    })
  }
  async putProject(model: ProjectModel) {
    const db = await openDB('Canban', this.DB_VERSION)
    await db.put('projects', {title: model.title, id: model.id})
  }
  async addNewProject() {
    const db = await openDB('Canban', this.DB_VERSION)
    const project = {
      title: 'New Project'
    } as ProjectModel
    return await db.add('projects', project).then(res => {
      return {...project, id: res} as ProjectModel
    }).catch(err => {
      console.error('something went wrong saving to IDB: ' + err)
    })
  }
  async deleteProject(projectId: number) {
    const db = await openDB('Canban', this.DB_VERSION)
    if ( (await db.getAll('projects')).length == 1) {
      return
    }
    await db.delete('projects', projectId)
    db.getAllFromIndex('ticketContainers', 'projectId', projectId).then((res: TicketContainerModel[]) => {
      res.forEach(container => {
        this.deleteTicketContainer(container.id)
      })
    })
  }
}
