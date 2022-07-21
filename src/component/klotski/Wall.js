import * as PIXI from 'pixi.js'

export default class Wall{
  graphic = null

  constructor(x, y, width, height){
    this.graphic = new PIXI.Graphics();
    // this.graphic.line.width = 0x0000
    this.graphic.lineStyle(1.2, 0x00000)
    this.graphic.beginFill(0x00000);
    this.graphic.drawRect(0, 0, width, height);
    this.graphic.endFill();
    this.graphic.position.set(x, y)
  }
}