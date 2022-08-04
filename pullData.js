const { sheetToData } = require('@newswire/sheet-to-data');
const { google } = require('googleapis');
const os = require('os');
const fs = require('fs');
const path = require('path');
const keyFile = 'key.json';
const spreadsheetId = [
  '1bsA8GRGqkfyDr-tGlvbEkfZS7caNzLaloi_DGri5S5Q',
  '1V8tz9sjYu4KiODuCjcBKBaqEjlf-w-Y8-UxB6a0mYO8'
];
const ranges = ['EditedList-News outlets by county!A1:T', 'CountyForMap+StateWide!A2:E'];
const outFileNames = ['mainstream.json', 'ratings.json'];

// https://github.com/rdmurphy/sheet-to-data/blob/master/index.js
function zipObject(keys, values) {
  const result = {};

  keys.forEach((key, i) => {
    if (values[i]) {
      result[key.trim()] = values[i];
    } else {
      result[key.trim()] = '';
    }
  });

  return result;
}

const ownerType = (t) => {
  const typeDict = {
    '1': 'Privately-owned',
    '2': 'Under Ownership Group Out of State',
    '3': 'Under Ownership Group in Colorado',
    '4': 'Unknown/Other',
  };

  return typeDict[t] || 'Unknown/Other';
};

function processMainData(data) {
  data.forEach(row => {
    row['OWTYPE'] = ownerType(row['OWTYPE'])
    row['REACH (if available)'] = row['REACH (if available)'].length ? +row['REACH (if available)'] : 0;
    row['NON-ENGLISH/ BIPOC-SERVING'] = row['NON-ENGLISH/ BIPOC-SERVING'].length ? row['NON-ENGLISH/ BIPOC-SERVING'] : 'English';
  });
  return data;
}

async function main() {
  // this method looks for the GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS
  // environment variables to establish authentication
  const auth = await google.auth.getClient({
    keyFile: keyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  // create your own Google Sheets API client
  const sheets = google.sheets({
    version: 'v4',
    auth,
  });

  for (let i = 0; i < spreadsheetId.length; i++) {
    console.log(spreadsheetId[i]);
    
    const results = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId[i],
      range: ranges[i],
    });

    const rows = results.data.values;
    const headers = rows[0];
    const records = rows.slice(1)
      .map(values => zipObject(headers, values));
    
    const data = !i ? processMainData(records) : records;
    const fp = 'public/' + outFileNames[i];

    fs.writeFileSync(fp, JSON.stringify({ data }));
  }
}

main().catch(console.error);