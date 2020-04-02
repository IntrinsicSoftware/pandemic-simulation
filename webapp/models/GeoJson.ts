class Properties {
  test: string

  constructor(test: string) {
    this.test = test
  }
}

class Geometry {
  type: string
  coordinates: number[]

  constructor(type: string, coordinates: number[]) {
    this.type = type
    this.coordinates = coordinates
  }
}

class Feature {
  type: string = 'Feature'
  geometry: Geometry
  properties: Properties

  constructor(geometry: Geometry, properties: Properties) {
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
