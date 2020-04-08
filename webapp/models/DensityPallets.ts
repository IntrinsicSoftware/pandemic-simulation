function redPalette(d: number) {
  return d > 1000
    ? '#800026'
    : d > 500
    ? '#BD0026'
    : d > 200
    ? '#E31A1C'
    : d > 100
    ? '#FC4E2A'
    : d > 50
    ? '#FD8D3C'
    : d > 20
    ? '#FEB24C'
    : d > 10
    ? '#FED976'
    : '#FFEDA0'
}

function greenPalette(d: number) {
  return d > 1000
    ? '#009900'
    : d > 500
    ? '#17A10F'
    : d > 200
    ? '#5DB83A'
    : d > 100
    ? '#A2CE66'
    : d > 50
    ? '#D1DE83'
    : d > 20
    ? '#E8E591'
    : d > 10
    ? '#E8E591'
    : '#FFEDA0'
}

class DensityPallet {
  static RED = redPalette
  static GREEN = greenPalette
}

export { DensityPallet }
