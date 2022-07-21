import PropTypes from 'prop-types';

import * as PIXI from 'pixi.js'
import React, { useEffect, useState } from 'react'
import Game from './Game';

export default function Klotski(){
  const canvas = React.useRef();
  const [pixijsApp, setPixijsApp] = useState(null)
  useEffect(()=>{
    const app = new PIXI.Application({
      backgroundColor: 0xFFFFFF,
      width: 800,
      height: 400,
      view: document.getElementById('canvas'),
      preserveDrawingBuffer: true,
      backgroundAlpha: 1
    });

    new Game(app)
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
  
  return(
    <div>
      <canvas
        ref={canvas}
        id="canvas"
      />
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center"}}>
        <button id="take-picture" onClick={handleTakePicture}>Take a picture</button>  
      </div>
    </div>
  )
}

Klotski.propTypes = {
  activeSpreadSheetID: PropTypes.string
}