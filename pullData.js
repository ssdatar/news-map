const { sheetToData } = require('@newswire/sheet-to-data');
const { google } = require('googleapis');
const os = require('os');
const fs = require('fs');
const path = require('path');
const keyFile = 'key.json';
const spreadsheetId = '17bTnDwGfGngsipW-fyQdOAFRkLdtc1_BI9DeLivstoY';

// https://github.com/rdmurphy/sheet-to-data/blob/master/index.js
function zipObject(keys, values) {
  const result = {};

  keys.forEach((key, i) => {
    if (values) {
      result[key] = values[i];
    } else {
      result[key[0]] = key[1];
    }
  });

  return result;
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

  const results = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'EditedList-News outlets by county!A1:Q',
  });

  const rows = results.data.values;
  const headers = rows[0];
  const data = rows.slice(1).map(values => zipObject(headers, values));

  fs.writeFileSync('public/test.json', JSON.stringify({ data }));
  
}

main().catch(console.error);