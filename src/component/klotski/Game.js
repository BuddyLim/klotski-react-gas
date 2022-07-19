import Block from "./Block"
import { BlockTypes } from './Block.util'

export default class Game{
  app = null
  gridSize = 50
  //Grid in this game is [y][x], where row increments y and column increments x
  grid = [ 
    [null, null, null, null], 
    [null, null, null, null], 
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ]
  bounds = {
    //For my sanity to interpolate coordinates to grid indices
    x: (this.grid[0].length) * this.gridSize,
    y: (this.grid.length) * this.gridSize,
  } 
  winningBounds = {
    minX: 100,
    maxX: 150,
    minY: 250,
  }
  listOfBlocks = []
  selected = {
    block: null,
    grid: {
      x: null,
      y: null
    }
  }

  constructor(app){
    this.app = app
    this.initGame()
  }

  initGame = () =>{
    this.spawnBlocks()

    this.app.renderer.view.addEventListener('mousedown', (e) => {
      this.checkIfWithinBounds(e, this.handleAppMouseDown)
    });

    this.app.renderer.view.addEventListener('mouseup', (e) => {
      this.checkIfWithinBounds(e, this.handleAppMouseUp)
    });
  }

  spawnBlocks = () =>{
    const listOfBlocks = []

    const block1 = new Block("1", 50, 50, BlockTypes.vertical, 0x00ff0, this)
    // const block2 = new Block("2", 100, 50, 50, 50, 0x0ffff, this)

    listOfBlocks.push(block1)
    // listOfBlocks.push(block2)

    this.listOfBlocks = listOfBlocks

    listOfBlocks.map(block =>{
      this.updateNewBlockGridPosition(block)
      this.app.stage.addChild(block.graphic)
    })
  }

  updateNewBlockGridPosition = (block, setNull=false) =>{
    const Xfactor = block.width / this.gridSize
    const Yfactor = block.height / this.gridSize

    for(let i=0; i < Yfactor; i++){   
      for(let j=0; j < Xfactor; j++){
        this.grid[(block.y + (i * this.gridSize)) / this.gridSize][(block.x + (j * this.gridSize)) / this.gridSize] = setNull ? null : block
      }
    }
  }

  handleAppMouseDown = (e) =>{
    const { offsetX, offsetY } = e
    const gridX = Math.floor(offsetX / this.gridSize)
    const gridY = Math.floor(offsetY / this.gridSize)
    const block = this.grid[gridY][gridX]

    this.selected.block = block
    this.selected.grid = {
      x: gridX,
      y: gridY
    }
  }

  handleAppMouseUp = (e) =>{
    const { offsetX, offsetY } = e
    //Get new position relative to the grid indices
    const newGridPosX = Math.floor(offsetX / this.gridSize)
    const newGridPosY = Math.floor(offsetY / this.gridSize)
    const { x: blockGridX, y: blockGridY } = this.selected.grid
    const existingBlock = this.grid[newGridPosY][newGridPosX]

    if(existingBlock === null || existingBlock.id === this.selected.block.id){
      const isXMovement = blockGridX !== newGridPosX
      const isYMovement = blockGridY !== newGridPosY

      if(isXMovement && !isYMovement){
        this.handleUpdateBlockPosition(newGridPosX - blockGridX, 'x')
      }
      else if(isYMovement && !isXMovement){
        this.handleUpdateBlockPosition(newGridPosY - blockGridY, 'y')
      }
    }

    this.selected.block = null
    this.selected.grid.x = null
    this.selected.grid.y = null
  }

  handleUpdateBlockPosition = (newGridPos, direction) =>{
    //Remove old position first
    this.updateNewBlockGridPosition(this.selected.block, true)
    this.selected.block.handleBlockMove(newGridPos * this.gridSize, direction)
    //Update new position
    this.updateNewBlockGridPosition(this.selected.block)

    this.checkIfWon()
  }

  checkIfWon = () =>{
    const { x, y } = this.selected.block
    const withinWinningXBounds = this.winningBounds.minX <= x && this.winningBounds.maxX >= x
    const withinWinningYBounds = this.winningBounds.minY === y
    if(withinWinningXBounds && withinWinningYBounds){
      console.log("Won!")
    }
  }

  checkIfWithinBounds = (e, func) =>{
    const { offsetX, offsetY } = e
    const withinXBounds = offsetX <= this.bounds.x && offsetX >= 0
    const withinYBounds = offsetY <= this.bounds.y && offsetY >= 0
    if(withinXBounds && withinYBounds){
      func(e)
    }
  }
}