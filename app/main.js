const doGet = () =>{
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .addMetaTag("viewport", 'width=device-width, initial-scale=1.0')
}

const initNewGameSession = () =>{
  // const totalStatsSS = SpreadsheetApp.create("Total Stats", 50, 5)
  const spreadsheet = SpreadsheetApp.create("Klotski")
  SpreadsheetApp.setActiveSpreadsheet(spreadsheet)

  spreadsheet.setActiveSheet(spreadsheet.getSheets()[0]);
  spreadsheet.renameActiveSheet('Session 1')
  Logger.log(SpreadsheetApp.getActiveSpreadsheet().getId())
  return spreadsheet.getId()
}