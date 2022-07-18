import React, { useEffect, useState } from "react"

export default function App(){
  const [currentSheet, setCurrentSheet] = useState(undefined)

  useEffect(() =>{
    if(currentSheet === undefined){
      //https://stackoverflow.com/questions/11487045/how-to-use-google-script-run-as-if-it-was-a-function
      google.script.run.withSuccessHandler((result) =>{
        console.log("activeSpreadSheetID", result)
        setCurrentSheet(result)
        localStorage.setItem('gameData', `${result}`) 
      }).initNewGameSession()
    }
  },[currentSheet])

  return( 
    <div>
      <div>Hello World</div>
      <p>Some text</p>
    </div>
  )
}