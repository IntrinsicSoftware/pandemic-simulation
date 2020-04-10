import { DensityPalette, densityPalettes } from './DensityPalette'

interface IPandemicMetric {
  value: string
  label: string
  palette: DensityPalette
}

class PandemicMetric implements IPandemicMetric {
  public value: string
  public label: string
  public palette: DensityPalette
  constructor(value: string, label: string, palette: DensityPalette) {
    this.value = value
    this.label = label
    this.palette = palette
  }
}

const pandemicMetrics: IPandemicMetric[] = [
  new PandemicMetric('death', 'COVID-19 Deaths', densityPalettes.RED),
  new PandemicMetric('positive', 'COVID-19 Positive', densityPalettes.RED),
  new PandemicMetric('negative', 'COVID-19 Negative', densityPalettes.GREEN),
  new PandemicMetric('hospitalized', 'Hospitalized', densityPalettes.RED),
  new PandemicMetric(
    'totalTestResults',
    'COVID-19 Total Tests',
    densityPalettes.GREEN
  )
]

export { PandemicMetric, pandemicMetrics }
