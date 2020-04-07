const fs = require('fs')
const path = require('path')
const axios = require('axios')
const apiGeoJsonAdapter = require('../config/stateGeoJsonAdapter')
const API_URL = 'https://covidtracking.com/api/states'
const OUTPUT_FILENAME = 'stateGeoJson.json'

init()

async function init() {
  try {
    const data = await getData(API_URL)
    const geoJson = apiGeoJsonAdapter(data)
    saveData(geoJson, OUTPUT_FILENAME)
  } catch (err) {
    console.error('There was an error generating the pandemic data. ', err) // eslint-disable-line
  }
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
