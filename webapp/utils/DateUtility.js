class DateUtil {
  static getApiStringFromDate(date) {
    const fullYear = date.getFullYear()
    let month = date.getMonth() + 1 // getMonth is 0 based
    let day = date.getDate().toString()
    month = month.toString()
    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }
    return `${fullYear}${month}${day}`
  }

  static getDateFromApiString(apiDateString) {
    const date = new Date()
    apiDateString = apiDateString.toString()
    const fullYear = apiDateString.substring(0, 4)
    const month = Number(apiDateString.substring(4, 6)) - 1 // needs to be zero based
    const day = apiDateString.substring(6, 8)
    date.setMonth(month)
    date.setDate(day)
    date.setFullYear(fullYear)
    return date
  }
}

module.exports = DateUtil
