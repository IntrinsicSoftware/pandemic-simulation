interface IStateProperties {
  [key: string]: any
}

interface IStateApiData {
  [key: string]: IStateProperties[]
}

export { IStateApiData, IStateProperties }
