const csv = require('csv-parser')
const request = require('request')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const url = 'https://help-assets.soundcloud.com/reporting/support_report.csv'

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function sortObjectKeys(unordered) {
  const ordered = {}
  Object.keys(unordered).sort().forEach(function(key) {
    ordered[key] = unordered[key]
  })
  return ordered
}

const time_per_day = {}
const group_data = {}

request(url)
  .pipe(csv({separator: ';'}))
  .on('data', (row) => {
    if (row.country != 'US') {
      // Data from the country code 'US' should be excluded from all these totals.
      const { name, age, group } = row
      const requestTime = parseFloat(row.requestTime)
      const requestLength = parseInt(row.requestLength)
      const date = row.date.replace(/\/(\d)\//, (all, matched) => '/0'+matched+'/')

      if (group_data[group] === undefined) {
        group_data[group] = {
          group,
          sum: requestTime,
          count: 1,
          length: requestLength
        }
      } else {
        group_data[group].length += requestLength
        group_data[group].sum += requestTime
        group_data[group].count ++
      }
      if (time_per_day[date] === undefined) {
        time_per_day[date] = {
          date,
          requestTime
        }
      } else {
        time_per_day[date].requestTime = round(time_per_day[date].requestTime+requestTime, 1)
      }
    }
  })
  .on('end', () => {

    // * Number & time spent on requests per category
    const average_time_per_date = Object.keys(time_per_day).sort().map(key => time_per_day[key])

    createCsvWriter({
      path: 'average_time_per_date.csv',
      header: [
        {id: 'date', title: 'date'},
        {id: 'requestTime', title: 'requestTime'},
      ]
    }).writeRecords(average_time_per_date)
      .then(()=> console.log('The CSV file "average_time_per_date.csv" containing average request time per date was created successfully'));


    // * Average number of interactions per category
    const group_stats = Object.keys(group_data).map(group => {
      return {
        group,
        count: group_data[group].count,
        sum: round(group_data[group].sum, 2)
      }
    })

    const requests_per_category_csvWriter = createCsvWriter({
      path: 'category_request_stats.csv',
      header: [
        {id: 'group', title: 'Group'},
        {id: 'count', title: 'Number of requests'},
        {id: 'sum', title: 'Time spent on requests'},
      ]
    }).writeRecords(group_stats)
      .then(()=> console.log('The CSV file "category_request_stats.csv" containing Number & time spent on requests per category was created successfully'));

    // * Total Time spent per day
    const average_interactions_per_category = Object.keys(group_data).map(group => {
      return {group, average: round(group_data[group].length/group_data[group].count, 2)}
    })

    createCsvWriter({
      path: 'average_interactions_per_category.csv',
      header: [
        {id: 'group', title: 'Group'},
        {id: 'average', title: 'Average number of interactions per category'},
      ]
    }).writeRecords(average_interactions_per_category)
      .then(()=> console.log('The CSV file "average_interactions_per_category.csv" containing average number of interactions per category was created successfully'));
  });
