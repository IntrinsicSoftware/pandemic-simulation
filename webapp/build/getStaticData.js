const fs = require('fs')
const path = require('path')
const axios = require('axios')
const stateAbbreviations = require('./stateAbbreviations')
const baseStateGeoJson = require('./baseStateGeoJson')
const API_URL = 'https://covidtracking.com/api/states'
const OUTPUT_FILENAME = 'stateGeoJson.json'

init()

async function init() {
  try {
    const data = await getData(API_URL)
    const mappedStateData = mapStateData(data)
    const stateGeoJson = mapGeoJsonStateData(mappedStateData)
    saveData(stateGeoJson, OUTPUT_FILENAME)
  } catch (err) {
    console.error('There was an error generating the pandemic data. ', err) // eslint-disable-line
  }
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

async function getData(url) {
  try {
    const { data } = await axios.get(url)
    return data
  } catch (err) {
    return err
  }
}

function saveData(data, fileName) {
  try {
    const outPath = path.join(__dirname, '../static/data', fileName)
    const json = JSON.stringify(data)
    const result = fs.writeFileSync(outPath, json)
    return result
  } catch (err) {
    return err
  }
}
