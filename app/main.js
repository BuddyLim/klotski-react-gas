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

  const sheet = spreadsheet.setActiveSheet(spreadsheet.getSheets()[0]);
  spreadsheet.renameActiveSheet('Session 1')
  prepareSheet(sheet)
  Logger.log(SpreadsheetApp.getActiveSpreadsheet().getId())
  return spreadsheet.getId()
}

const resumeSpreadsheet = (spreadSheetID) =>{
  // const totalStatsSS = SpreadsheetApp.create("Total Stats", 50, 5)
  const spreadsheet = SpreadsheetApp.openByUrl(`https://docs.google.com/spreadsheets/d/${spreadSheetID}/edit`)
  SpreadsheetApp.setActiveSpreadsheet(spreadsheet);

  const newSheet = spreadsheet.insertSheet(spreadsheet.getSheets().length);
  newSheet.setName(`Session ${spreadsheet.getSheets().length}`);
  prepareSheet(newSheet)
  Logger.log(SpreadsheetApp.getActiveSpreadsheet().getId())
}

const prepareSheet = (sheet) =>{
  const range = sheet.getRange("A1:C1")
  const bold = SpreadsheetApp.newTextStyle().setBold(true).build()

  const richTextA1 = SpreadsheetApp.newRichTextValue()
    .setText("Time")
    .setTextStyle(bold)
    .build();
  const richTextB1 = SpreadsheetApp.newRichTextValue()
    .setText("Moves made")
    .setTextStyle(bold)
    .build();
  const richTextC1 = SpreadsheetApp.newRichTextValue()
    .setText("Won")
    .setTextStyle(bold)
    .build();

  range.setRichTextValues([[richTextA1, richTextB1, richTextC1]]);
}

const addDataToSheet = (spreadSheetId, time, moveCount, win) =>{
  const spreadSheet = SpreadsheetApp.openById(spreadSheetId)
  SpreadsheetApp.setActiveSpreadsheet(spreadSheet)
  const sheet = spreadSheet.setActiveSheet(spreadSheet.getSheets()[spreadSheet.getNumSheets() - 1]);
  const latestRow = sheet.getLastRow() + 1
  const rangeString = win === true ? `A${latestRow}:C${latestRow}` : `A${latestRow}:B${latestRow}`
  const valuesArr =  win === true ? [time, moveCount, win ] : [time, moveCount ]
  
  const range = sheet.getRange(rangeString)
  range.activate();
  range.setValues([
    [...valuesArr]
  ]);
}

const getScriptURL = () => {
  return ScriptApp.getService().getUrl();
}