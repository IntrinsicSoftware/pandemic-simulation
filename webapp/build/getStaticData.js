const fs = require('fs')
const path = require('path')
const axios = require('axios')

getAndSave('https://covidtracking.com/api/states', 'states.json')

async function getAndSave(url, fileName) {
  try {
    const { data } = await axios.get(url)
    return saveData(data, fileName)
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
