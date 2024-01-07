export interface TicketContainerModel {
  id: number
  title: string
  projectId: number
}

export const indexes = ['id', 'projectId']
