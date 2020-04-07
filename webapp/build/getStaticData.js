const fs = require('fs')
const path = require('path')
const axios = require('axios')
const DateUtils = require('../utils/DateUtility')
const HISTORIC_API_URL = 'https://covidtracking.com/api/v1/states/daily.json'
const CURRENT_API_URL = 'https://covidtracking.com/api/v1/states/current.json'
const OUTPUT_FILENAME = 'statesData.json'

init()

async function init() {
  try {
    const historicalData = await getData(HISTORIC_API_URL)
    let todaysData = await getData(CURRENT_API_URL)
    todaysData = addTodaysDateToProperties(todaysData) // current data does not include a date property
    const data = historicalData.concat(todaysData) // combine all data
    // Store data as a map, the key is the date string, value is the entry
    const dataByDate = data.reduce((acc, apiData) => {
      if (!acc[apiData.date]) {
        acc[apiData.date] = [apiData]
      } else {
        acc[apiData.date].push(apiData)
      }
      return acc
    }, {})
    saveData(dataByDate, OUTPUT_FILENAME)
  } catch (err) {
    console.error('There was an error generating the pandemic data. ', err) // eslint-disable-line
  }
}

function addTodaysDateToProperties(data) {
  return data.map((item) => {
    item.date = DateUtils.getApiStringFromDate(new Date())
    return item
  })
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
