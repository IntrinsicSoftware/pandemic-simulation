/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const DateUtils = require('../utils/DateUtility')
const HISTORIC_API_URL = 'https://covidtracking.com/api/v1/states/daily.json'
const CURRENT_API_URL = 'https://covidtracking.com/api/v1/states/current.json'
const OUTPUT_FILE_PATH = '../static/data/statesData.json'

init()

async function init() {
  try {
    const date = getETDate()
    const todaysDateString = DateUtils.getApiStringFromDate(date)
    // Fetch all historical data
    const historicalData = await getData(HISTORIC_API_URL)
    // Fetch the latest daily data
    let todaysData = await getData(CURRENT_API_URL)
    // The daily data does not contain a date property since its assumed its today
    todaysData = addDateProperty(todaysData, todaysDateString)
    // Store data as a map, the key is the date string, value is the entry
    const dateMap = mapDataByDate(historicalData)
    // Map todays data to the historical data
    dateMap[todaysDateString] = todaysData
    // Save the data as JSON
    saveData(dateMap, OUTPUT_FILE_PATH)
    console.log(
      'Finished processing COVID data,',
      +Object.keys(dateMap).length + ' days of data'
    )
  } catch (err) {
    console.error('There was an error generating the pandemic data. ', err)
  }
}

function getETDate() {
  const localDate = new Date()
  const hourOffset = -4 // UTC and ET have a 4 hour difference
  const utcInMS = localDate.getTime() + localDate.getTimezoneOffset() * 60000
  return new Date(utcInMS + 3600000 * hourOffset)
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

function addDateProperty(data, dateString) {
  return data.map((item) => {
    item.date = dateString
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

function saveData(data, filePath) {
  try {
    const outPath = path.join(__dirname, filePath)
    const json = JSON.stringify(data)
    const result = fs.writeFileSync(outPath, json)
    return result
  } catch (err) {
    return err
  }
}
