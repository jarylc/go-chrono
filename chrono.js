var chrono = require('chrono-node')

function parseDate (expression, date) {
  return chrono.parseDate(expression, date ? new Date(date) : new Date())
}

module.exports = parseDate
