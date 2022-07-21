import PropTypes from 'prop-types';
import dayjs from 'dayjs'
import * as PIXI from 'pixi.js'
import React, { useEffect, useState } from 'react'
import Game from './Game';

export default function Klotski({ setPrevStats }){
  const canvas = React.useRef();
  const [pixijsApp, setPixijsApp] = useState(null)
  const [game, setGame] = useState(null)
  const [isResetShown, setResetShown] = useState(false)
  const [currentCellIndex, setCurrentCellIndex] = useState(2)

  useEffect(()=>{
    const app = new PIXI.Application({
      backgroundColor: 0xFFFFFF,
      width: 800,
      height: 400,
      view: document.getElementById('canvas'),
      preserveDrawingBuffer: true,
      backgroundAlpha: 1
    });

    const game = new Game(app, setResetShown)
    setPixijsApp(app)
    setGame(game)
  }, [])

  const handleTakePicture = () =>{
    const renderTexture = PIXI.autoDetectRenderer({
      width: pixijsApp.screen.width, 
      height: pixijsApp.screen.height,
      resolution: pixijsApp.renderer.resolution,
      backgroundAlpha: 1,
      backgroundColor: 0xFFFFFF
    });
    renderTexture.render(pixijsApp.stage)
    const imgBase64 = renderTexture.extract.base64()
    const download = document.createElement('a')
    download.download = 'klotski.png'
    download.href = imgBase64
    download.target = '_blank'
    download.click()
  }

  const handleSaveCurrentGameInfo = () =>{
    const spreadSheetID = localStorage.getItem('sheetID')
    const date = dayjs().format('hh:mm:ss a')
    google.script.run.addDataToSheet(spreadSheetID, date, game.moveCount, game.win)
    // setCurrentCellIndex(prevIndex => { return ++prevIndex })
  }

  const handleResetGame = () =>{
    google.script.run.withSuccessHandler(function(url){
      window.open(url,'_top');
    }).getScriptURL();
  }

  const handlePreviousStatsClick = () =>{
    const spreadSheetID = localStorage.getItem('sheetID')
    google.script.run.withSuccessHandler((stats) =>{
      const parsedStats = JSON.parse(stats)
      setPrevStats(parsedStats)
      setTimeout(() =>{
        const ele = document.getElementById(`session-${parsedStats.length}`)
        ele.scrollIntoView({behavior: "smooth", block:"end", inline:"end"});
      }, 500)
    }).getSheetStats(spreadSheetID)
  }
  
  return(
    <div>
      <canvas
        ref={canvas}
        id="canvas"
      />
      <div className='buttons-container'>
        {isResetShown && <button onClick={handleResetGame}>New Game</button>}
        <div className='buttons-container' style={{flexDirection: 'row', gap: "10px"}}>
          <button id="take-picture" onClick={handleTakePicture}>Take a picture</button>
          <button id="take-picture" onClick={handleSaveCurrentGameInfo}>Save game info</button>
          <button onClick={handlePreviousStatsClick}>
            Previous stats
          </button>  
        </div>
      </div>
    </div>
  )
}

Klotski.propTypes = {
  activeSpreadSheetID: PropTypes.string,
  setPrevStats: PropTypes.func
}