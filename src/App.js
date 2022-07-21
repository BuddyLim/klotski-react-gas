import React, { useEffect, useState } from "react"
import Klotski from "./component/klotski/index.klotski"
// import './App.css'

export default function App(){
  const [activeSpreadSheetID, currentActiveSpreadSheetID] = useState(undefined)

  useEffect(() =>{
    if(activeSpreadSheetID === undefined && typeof google !== 'undefined'){
      //https://stackoverflow.com/questions/22898501/create-a-new-sheet-in-a-google-sheets-with-google-apps-script
      const spreadSheetID = localStorage.getItem('sheetID')
      if(spreadSheetID != null && spreadSheetID.length > 0){
        handleExistingSpreedsheet(spreadSheetID)
        return
      }

      //https://stackoverflow.com/questions/11487045/how-to-use-google-script-run-as-if-it-was-a-function
      handleNewSpreadsheet()
    }
  },[activeSpreadSheetID])

  const handleExistingSpreedsheet = (spreadSheetID) =>{
    google.script.run.withSuccessHandler((spreadsheetExists) =>{
      console.log(spreadsheetExists)
      if(spreadsheetExists){
        currentActiveSpreadSheetID(spreadSheetID)
        google.script.run.resumeSpreadsheet(spreadSheetID)
        return
      }
      handleNewSpreadsheet()
    }).checkIfSpreadsheetExists(spreadSheetID)
  }

  const handleNewSpreadsheet = () =>{
    google.script.run.withSuccessHandler((spreadSheetID) =>{
      currentActiveSpreadSheetID(spreadSheetID)
      localStorage.setItem('sheetID', `${spreadSheetID}`) 
    }).initNewSpreadsheet()
  }

  return( 
    <div style={{ display: "flex", height:"100vh", alignItems:"center", justifyContent:"center" }}>
      <Klotski activeSpreadSheetID={activeSpreadSheetID}/>
    </div>
  )
}