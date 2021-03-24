/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const HISTORIC_API_URL = 'https://covidtracking.com/api/v1/states/daily.json'
const DATA_DIRECTORY = '../static/data/'
const OUTPUT_FILE_PATH = 'statesData.json'
const META_OUTPUT_FILE_PATH = 'metaData.json'

init()

async function init() {
  try {
    const now = new Date()
    // Fetch all historical data
    const historicalData = await getData(HISTORIC_API_URL)
    // Store data as a map, the key is the date string, value is the entry
    const dateMap = mapDataByDate(historicalData)
    const totalDays = Object.keys(dateMap).length
    // Save the data as JSON
    saveData(dateMap, OUTPUT_FILE_PATH)
    // Meta data
    saveData(
      {
        updated: now.toString(),
        totalDays,
      },
      META_OUTPUT_FILE_PATH
    )
    console.log(
      'Finished processing COVID data,',
      +totalDays + ' days of data. date:',
      now.toString()
    )
  } catch (err) {
    console.error('There was an error generating the pandemic data. ', err)
    process.exit(1)
  }
}

function mapDataByDate(data) {
  return data.reduce((acc, apiData) => {
    if (!acc[apiData.date]) {
      acc[apiData.date] = [apiData]
    } else {
      acc[apiData.date].push(apiData)
    }
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

function createDataDirectory() {
  const dir = path.join(__dirname, DATA_DIRECTORY)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

function saveData(data, filePath) {
  try {
    createDataDirectory()
    const outPath = path.join(__dirname, DATA_DIRECTORY, filePath)
    const json = JSON.stringify(data)
    const result = fs.writeFileSync(outPath, json)
    return result
  } catch (err) {
    return err
  }
}
