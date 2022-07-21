const doGet = () =>{
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .addMetaTag("viewport", 'width=device-width, initial-scale=1.0')
}

const checkIfSpreadsheetExists = (sheetID) =>{
  const spreadsheet = SpreadsheetApp.openById(sheetID)
  return spreadsheet != null
}

const initNewSpreadsheet = () =>{
  // const totalStatsSS = SpreadsheetApp.create("Total Stats", 50, 5)
  const spreadsheet = SpreadsheetApp.create("Klotski")
  SpreadsheetApp.setActiveSpreadsheet(spreadsheet)

  spreadsheet.setActiveSheet(spreadsheet.getSheets()[0]);
  spreadsheet.renameActiveSheet('Session 1')
  Logger.log(SpreadsheetApp.getActiveSpreadsheet().getId())
  return spreadsheet.getId()
}

const resumeSpreadsheet = (spreadSheetID) =>{
  // const totalStatsSS = SpreadsheetApp.create("Total Stats", 50, 5)
  const spreadsheet = SpreadsheetApp.openByUrl(`https://docs.google.com/spreadsheets/d/${spreadSheetID}/edit`)
  SpreadsheetApp.setActiveSpreadsheet(spreadsheet);

  const newSheet = spreadsheet.insertSheet(spreadsheet.getSheets().length);
  newSheet.setName(`Session ${spreadsheet.getSheets().length}`);
  Logger.log(SpreadsheetApp.getActiveSpreadsheet().getId())
}