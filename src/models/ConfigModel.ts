export interface ConfigModel {
  id: number
  configName: string
  value: any
}

export const configIndexes = ['id', 'configName'];

export type SeverityConfig = {
  name: string
  color: string
}
