interface IDensityPalette {
  getColor(number: number): string
}

class DensityPalette implements IDensityPalette {
  private palette: string[] = []
  constructor(palette: string[]) {
    this.palette = palette
  }

  public getColor(density: number): string {
    return density > 1000
      ? this.palette[0]
      : density > 500
      ? this.palette[1]
      : density > 200
      ? this.palette[2]
      : density > 100
      ? this.palette[3]
      : density > 50
      ? this.palette[4]
      : density > 20
      ? this.palette[5]
      : density > 10
      ? this.palette[6]
      : this.palette[7]
  }
}

const densityPalettes = {
  RED: new DensityPalette([
    '#800026',
    '#BD0026',
    '#E31A1C',
    '#FC4E2A',
    '#FD8D3C',
    '#FEB24C',
    '#FED976',
    '#FFEDA0'
  ]),
  GREEN: new DensityPalette([
    '#009900',
    '#17A10F',
    '#5DB83A',
    '#A2CE66',
    '#D1DE83',
    '#E8E591',
    '#E8E591',
    '#FFEDA0'
  ])
}

export { densityPalettes, DensityPalette }
