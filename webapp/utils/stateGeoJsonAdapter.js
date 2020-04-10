const baseStateGeoJson = require('./geoJson')
const stateAbbreviations = require('./stateAbbreviations')

function statesToGeoJson(stateApiData) {
  const mappedStateData = mapStateData(stateApiData)
  const stateGeoJson = mapGeoJsonStateData(mappedStateData)
  return stateGeoJson
}

// Takes the base geoJSON schema and adds the properties from the API
function mapGeoJsonStateData(mappedStateData) {
  const geoJson = JSON.parse(JSON.stringify(baseStateGeoJson)) // make a deep copy
  geoJson.features = geoJson.features.map((feature) => {
    feature.properties = Object.assign(
      feature.properties,
      mappedStateData[feature.properties.name]
    )
    feature.properties.density = 0
    return feature
  })
  return geoJson
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
