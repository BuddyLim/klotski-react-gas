import PropTypes from 'prop-types';

import * as PIXI from 'pixi.js'
import React, { useEffect } from 'react'
import Game from './Game';

export default function Klotski(){
  useEffect(()=>{
    const app = new PIXI.Application({
      backgroundColor: 0xFFFFFF
    });
    // The application will create a canvas element for you that you
    // can then insert into the DOM
    document.body.appendChild(app.view);

    // const listOfBlocks = []
    
    // const block1 = new Block(50, 50, 50, 100, 0x00ff0)

    // listOfBlocks.push(block1)
    // const block2 = new Block(50, 150, 50, 100, 0x0f0f0)
    // const block3 = new Block(50, 250, 50, 50, 0x00ff0)

    // const mainBlock = new Block(100, 50, 100, 100, 0xffff0)
    // const block4 = new Block(100, 150, 100, 50, 0xffff0)
    // const block5 = new Block(100, 200, 50, 50, 0xffff0)
    // const block6 = new Block(150, 200, 50, 50, 0xffff0)

    // const block7 = new Block(200, 50, 50, 100, 0xffff0)
    // const block8 = new Block(200, 150, 50, 100, 0xffff0)
    // const block9 = new Block(200, 250, 50, 50, 0xffff0)
    // app.stage.addChild(block1.graphic)
    // app.stage.addChild(block2.graphic)
    // app.stage.addChild(block3.graphic)
    // app.stage.addChild(mainBlock.graphic)
    // app.stage.addChild(block4.graphic)
    // app.stage.addChild(block5.graphic)
    // app.stage.addChild(block6.graphic)
    // app.stage.addChild(block7.graphic)
    // app.stage.addChild(block8.graphic)
    // app.stage.addChild(block9.graphic)

    const game = new Game(app)
    console.log(game)
    
  }, [])
  
  return(
    <div></div>
  )
}

Klotski.propTypes = {
  activeSpreadSheetID: PropTypes.string
}