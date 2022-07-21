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
    console.log(x)
    this.id = uuidv4()
    this.x = x
    this.y = y
    this.width = blockType.xFactor * game.gridSize
    this.height = blockType.yFactor * game.gridSize
    this.type = blockType.type
    this.color = blockType.color
    this.game = game

    this.updateGridPos()
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
    const offsetFactorDirection = `${direction}OffsetFactor`
    const directionDelta = this.game[offsetFactorDirection] * this.game.gridSize

    if(pos + newPos < 0){
      this[direction] = 0 + directionDelta
      this.graphic.position[direction] = 0 + directionDelta
    }
    else if((pos + newPos + this.height) > this.game.bounds.y && direction === 'y'){
      this.y = this.game.bounds.y - this.height + directionDelta
      this.graphic.position.y = this.game.bounds.y - this.height + directionDelta
    }
    else if((pos + newPos + this.width) > this.game.bounds.x && direction === 'x'){
      this.x = this.game.bounds.x - this.width
      this.graphic.position.x = this.game.bounds.x - this.width
    }
    else{
      console.log(newPos)
      this[direction] = pos + newPos
      this.graphic.position[direction] = graphicPos + newPos
    }

    this.updateGridPos()
  }

  updateGridPos = () =>{
    this.gridX = []
    this.gridY = []
    for(let i=0; i<this.width / this.game.gridSize; i++){
      this.gridX.push(((this.x - (this.game.xOffsetFactor * this.game.gridSize)) + (i *  this.game.gridSize))/  this.game.gridSize)
    }
    for(let i=0; i<this.height / this.game.gridSize; i++){
      this.gridY.push(((this.y - (this.game.yOffsetFactor * this.game.gridSize)) + (i *  this.game.gridSize)) /  this.game.gridSize)
    }

    console.log(this.game.grid)
  }
}

export default Block

