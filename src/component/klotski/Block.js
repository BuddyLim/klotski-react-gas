import * as PIXI from 'pixi.js'

class Block{
  id = ""
  x = 0
  y = 0
  width = 0
  height = 0
  color = 0
  graphic = null
  dragging = false
  game = null

  constructor(id, x, y, blockType, color, game){
    this.id = id
    this.x = x
    this.y = y
    this.width = blockType.xFactor * game.gridSize
    this.height = blockType.yFactor * game.gridSize
    this.color = color
    this.game = game

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
    this[direction] = pos + newPos < 0 ? 0 : pos + newPos
    this.graphic.position[direction] = graphicPos + newPos < 0 ? 0 : graphicPos + newPos
  }
}

export default Block

