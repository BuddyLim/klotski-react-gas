import PropTypes from 'prop-types';

import * as PIXI from 'pixi.js'
import React, { useEffect, useState } from 'react'
import Game from './Game';

export default function Klotski(){
  const canvas = React.useRef();

  useEffect(()=>{
    const app = new PIXI.Application({
      backgroundColor: 0xFFFFFF,
      // width: "100%",
      // height: "100%",
      view: document.getElementById('canvas')
    });
    // The application will create a canvas element for you that you
    // can then insert into the DOM
    const game = new Game(app)
  }, [])
  
  return(
    <canvas
      ref={canvas}
      id="canvas"
      // // width={201}
      // // height={301}
    />
  )
}

Klotski.propTypes = {
  activeSpreadSheetID: PropTypes.string
}