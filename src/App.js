import React, { useEffect, useState } from "react"
import Klotski from "./component/klotski/index.klotski"
import './App.css'

export default function App(){
  const [activeSpreadSheetID, currentActiveSpreadSheetID] = useState(undefined)

  useEffect(() =>{
    if(activeSpreadSheetID === undefined && typeof google !== 'undefined'){
      //https://stackoverflow.com/questions/11487045/how-to-use-google-script-run-as-if-it-was-a-function
      google.script.run.withSuccessHandler((result) =>{
        console.log("activeSpreadSheetID", result)
        currentActiveSpreadSheetID(result)
        localStorage.setItem('gameData', `${result}`) 
      }).initNewGameSession()
    }
  },[activeSpreadSheetID])

  return( 
    <div style={{ display: "flex", height:"100vh", alignItems:"center", justifyContent:"center" }}>
      <Klotski activeSpreadSheetID={activeSpreadSheetID}/>
    </div>
  )
}