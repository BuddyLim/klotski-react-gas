import PropTypes from 'prop-types';

import * as PIXI from 'pixi.js'
import React, { useEffect, useState } from 'react'
import Game from './Game';

export default function Klotski(){
  const canvas = React.useRef();
  const [pixijsApp, setPixijsApp] = useState(null)
  const [isResetShown, setResetShown] = useState(false)

  useEffect(()=>{
    const app = new PIXI.Application({
      backgroundColor: 0xFFFFFF,
      width: 800,
      height: 400,
      view: document.getElementById('canvas'),
      preserveDrawingBuffer: true,
      backgroundAlpha: 1
    });

    new Game(app, setResetShown)
    setPixijsApp(app)
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

  }

  const handleResetGame = () =>{
    location.reload()
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
        </div>
      </div>
    </div>
  )
}

Klotski.propTypes = {
  activeSpreadSheetID: PropTypes.string
}