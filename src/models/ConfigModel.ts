export interface ConfigModel {
  id: number
  configName: string
  value: any
}

export const configIndexes = ['id', 'configName'];
