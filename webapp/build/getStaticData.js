const axios = require('axios');
const fs = require('fs');
const path = require('path');

getAndSave('https://covidtracking.com/api/states', 'states.json')

async function getAndSave(url, fileName){
  try{
    const { data } = await axios.get(url);
    return saveData(data, fileName)
  } catch (err) {
    console.log('getAndSave::err: ', err)
    return err;
  }
}

async function saveData(data, fileName) {
  try{
    const outPath = path.join(__dirname, '../static/data', fileName)
    const json = JSON.stringify(data);
    const result = fs.writeFileSync(outPath, json);
    return result;
  } catch(err) {
    console.log('saveData::err: ', err)
    return err;
  }
}
