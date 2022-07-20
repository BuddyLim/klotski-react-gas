import * as PIXI from 'pixi.js'
import { v4 as uuidv4 } from 'uuid';
class Block{
  id = null
  x = 0
  y = 0
  gridX = []
  gridY = []
  width = 0
  height = 0
  color = 0
  graphic = null
  dragging = false
  game = null
  type = ""

  constructor(x, y, blockType, game){
    this.id = uuidv4()
    this.x = x
    this.y = y
    this.width = blockType.xFactor * game.gridSize
    this.height = blockType.yFactor * game.gridSize
    this.type = blockType.type
    this.color = blockType.color
    this.game = game

    for(let i=0; i<this.width / 50; i++){
      this.gridX.push((this.x + (i * 50))/ 50)
    }
    for(let i=0; i<this.height / 50; i++){
      this.gridY.push((this.y + (i * 50)) / 50)
    }
    
    this.initGraphics(x, y, blockType.color)
  }

  initGraphics = (x, y, color) =>{
    this.graphic = new PIXI.Graphics();
    // this.graphic.line.width = 0x0000
    this.graphic.lineStyle(1.2, 0x00000)
    this.graphic.beginFill(color);
    this.graphic.drawRect(0, 0, this.width, this.height);
    this.graphic.endFill();
    this.graphic.position.set(x, y)

    this.graphic.buttonMode = true
  }

  handleBlockMove = (newPos, direction) =>{
    const pos =  this[direction]
    const graphicPos = this.graphic.position[direction]
    if(pos + newPos < 0){
      this[direction] = 0 
      this.graphic.position[direction] = 0 
    }
      else if((pos + newPos + this.height) > this.game.bounds.y && direction === 'y'){
      this.y = this.game.bounds.y - this.height
      this.graphic.position.y = this.game.bounds.y - this.height
    }
    else if((pos + newPos + this.width) > this.game.bounds.x && direction === 'x'){
      this.x = this.game.bounds.x - this.width
      this.graphic.position.x = this.game.bounds.x - this.width
    }

    else{
      this[direction] = pos + newPos
      this.graphic.position[direction] = graphicPos + newPos
    }

    this.gridX = []
    this.gridY = []
    for(let i=0; i<this.width / 50; i++){
      this.gridX.push((this.x + (i * 50))/ 50)
    }
    for(let i=0; i<this.height / 50; i++){
      this.gridY.push((this.y + (i * 50)) / 50)
    }
  }
}

export default Block

