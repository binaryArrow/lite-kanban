export interface ImageModel {
  id: number
  ticketId: number
  imageBase64String: string
  imageURL: string
}

export const indexes = ['id', 'ticketId']
