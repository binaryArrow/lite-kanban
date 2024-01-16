export interface TicketModel {
    id: number
    containerId: number
    title: string
    description: string
    index: number
    createDate: string
    severity: string
}

export const severities = [
    '',
    'Lowest',
    'Low',
    'Medium',
    'High',
    'Highest'
]

export const indexes = ['id', 'containerId']
