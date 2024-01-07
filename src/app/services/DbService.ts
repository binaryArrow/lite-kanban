import {openDB} from "idb";
import {format} from "date-fns";
import {TicketContainerModel} from "../../models/TicketContainerModel";
import {severities, TicketModel} from "../../models/TicketModel";
import {Injectable} from "@angular/core";

@Injectable()
export class DbService {
    db: any
    DB_VERSION = 1
    async initDB() {
        if (!('indexedDB' in window)) {
            alert("This browser doesn't support IndexedDB.");
            return;
        } else {
            this.db = await openDB('Canban', this.DB_VERSION, {
                upgrade(db) {
                    const ticketContainerStore = db.createObjectStore('ticketContainers', {
                        keyPath: 'id',
                        autoIncrement: true
                    })
                    ticketContainerStore.createIndex('id', 'id')

                    const ticketStore = db.createObjectStore('tickets', {
                        keyPath: 'id',
                        autoIncrement: true
                    })
                    ticketStore.createIndex('containerId', 'containerId')
                    ticketStore.createIndex('id', 'id')
                }
            })
        }
        if ((await this.db.transaction('ticketContainers').objectStore('ticketContainers').getAll()).length < 2) {
            await this.db.add('ticketContainers', {
                title: 'TODO'
            } as TicketContainerModel)
            await this.db.add('ticketContainers', {
                title: 'DONE'
            } as TicketContainerModel)
        }
    }

    async addNewTicketContainer() {
        const db = await openDB('Canban', this.DB_VERSION)
        const container = {
            title: 'NEW'
        } as TicketContainerModel
        return await db.add('ticketContainers', container).then(res => {
            return {... container, id: res} as TicketContainerModel
        }).catch(err => {
            console.error('something went wrong saving to IDB: ' + err)
        })
    }

    async putTicketContainer(model: TicketContainerModel) {
        const db = await openDB('Canban', this.DB_VERSION)
        await db.put('ticketContainers', {title: model.title, id: model.id})
    }

    async deleteTicketContainer(containerId: number) {
      const db = await openDB('Canban', 1)
      await db.delete('ticketContainers', containerId)
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
    async getAllTicketContainers(): Promise<TicketContainerModel[]> {
        return await this.db.transaction('ticketContainers').objectStore('ticketContainers').getAll()
    }

    async getTicketContainerById(id: number) {
        return await this.db.getFromIndex('ticketContainers', 'id', id)
    }
    async getTicketById(id: number) {
        const db = await openDB('Canban', this.DB_VERSION)
        return await db.getFromIndex('tickets', 'id', id) as TicketModel
    }

    async addNewTicket(containerId: number) {
        const db = await openDB('Canban', this.DB_VERSION)
        const ticket = {
            title: 'new ticket',
            containerId: containerId,
            description: '',
            index: 0,
            createDate: format(new Date(), 'dd-MM-yyyy HH:mm'),
            severity: severities[0]
        } as TicketModel
        return await db.add('tickets', ticket).then(res => {
            return {... ticket, id: res} as TicketModel
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

}
