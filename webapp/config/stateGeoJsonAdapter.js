const stateAbbreviations = require('./stateAbbreviations')
const baseStateGeoJson = require('./baseStateGeoJson')

function statesToGeoJson(stateApiData) {
  const mappedStateData = mapStateData(stateApiData)
  const stateGeoJson = mapGeoJsonStateData(mappedStateData)
  return stateGeoJson
}

function mapGeoJsonStateData(mappedStateData) {
  baseStateGeoJson.features = baseStateGeoJson.features.map((feature) => {
    feature.properties = Object.assign(
      feature.properties,
      mappedStateData[feature.properties.name]
    )
    feature.properties.density = 0
    return feature
  })
  return baseStateGeoJson
}

// convert state data to a map. key = full state name, value is the pandemic state data
function mapStateData(stateData) {
  return stateData.reduce((acc, item) => {
    const fullStateName = stateAbbreviations[item.state]
    acc[fullStateName] = item
    return acc
  }, {})
}

module.exports = statesToGeoJson
