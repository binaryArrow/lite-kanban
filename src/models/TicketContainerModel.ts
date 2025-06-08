export interface TicketContainerModel {
  id: number
  title: string
  projectId: number
  order: number
}

export const indexes = ['id', 'projectId']
