class Properties {
  public density: number = 0
  public name: string = ''
}

interface IProperties {
  [key: string]: any
}

class Geometry {
  type: string
  coordinates: number[] | number[][] | number[][][] | number[][][][]

  constructor(
    type: string,
    coordinates: number[] | number[][] | number[][][] | number[][][][]
  ) {
    this.type = type
    this.coordinates = coordinates
  }
}

class Feature {
  type: string = 'Feature'
  geometry: Geometry
  properties: IProperties

  constructor(geometry: Geometry, properties: IProperties) {
    this.geometry = geometry
    this.properties = properties
  }
}

class GeoJson {
  type: string
  features: Feature[]

  constructor(type: string, features: Feature[]) {
    this.type = type
    this.features = features
  }
}

export { GeoJson, Feature, Geometry, Properties }
