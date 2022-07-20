import Block from "./Block"
import { BlockTypes } from './Block.util'

export default class Game{
  app = null
  gridSize = 50
  grid = [ 
    [null, null, null, null], 
    [null, null, null, null], 
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [1, null, null, 1],
  ]
  bounds = {
    //For my sanity to interpolate coordinates to grid indices
    x: (this.grid[0].length) * this.gridSize,
    y: (this.grid.length) * this.gridSize,
  } 
  winningBoundsGrid = {
    minX: 1,
    maxX: 2,
    minY: 5,
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

    const vert1 = new Block(0, 0, BlockTypes.vertical, this)
    const vert2 = new Block(0, 100, BlockTypes.vertical, this)
    const block1 = new Block(0, 200, BlockTypes.block, this)

    const main = new Block(50, 0, BlockTypes.main, this)
    const hori1 = new Block(50, 100, BlockTypes.horizontal, this)
    const block2 = new Block(50, 150, BlockTypes.block, this)
    const block3 = new Block(100, 150, BlockTypes.block, this)

    const vert4 = new Block(150, 0, BlockTypes.vertical, this)
    const vert5 = new Block(150, 100, BlockTypes.vertical, this)
    const block4 = new Block(150, 200, BlockTypes.block, this)

    listOfBlocks.push(vert1)
    listOfBlocks.push(vert2)
    listOfBlocks.push(block1)

    listOfBlocks.push(main)
    listOfBlocks.push(hori1)

    listOfBlocks.push(block2)
    listOfBlocks.push(block3)

    listOfBlocks.push(vert4)
    listOfBlocks.push(vert5)
    listOfBlocks.push(block4)

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
    let newGridPosY = Math.floor(offsetY / this.gridSize)
    const { x: blockGridX, y: blockGridY } = this.selected.grid

    if([1, 2].includes(newGridPosX) && newGridPosY === 5 && this.selected.block.type !== "main"){
      newGridPosY = 4
    }

    const isXMovement = blockGridX !== newGridPosX
    const isYMovement = blockGridY !== newGridPosY
    if(isXMovement && !isYMovement){
      this.handleBlockMovement( Math.min(blockGridX, newGridPosX), Math.max(blockGridX, newGridPosX), newGridPosX - blockGridX, 'x', 'y')
    }
    else if(isYMovement && !isXMovement){
      this.handleBlockMovement(Math.min(blockGridY, newGridPosY),  Math.max(blockGridY, newGridPosY), newGridPosY - blockGridY, 'y', 'x')
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

    const isWin = this.checkIfWon()
    if(isWin){
      console.log("Won!")
    }
  }

  handleBlockMovement = (startingGrid, endingGrid, delta, direction, neighbourDirection) =>{
    const containsBlockInPath = this.checkNeighbours(startingGrid, endingGrid, neighbourDirection)
    if(!containsBlockInPath){
      const existingBlock = this.checkIfOverlapNeighbour(delta, direction)
      if(!existingBlock){
        this.handleUpdateBlockPosition(delta, direction)
      }
    }
  }

  checkIfWon = () =>{
    const { gridX, gridY } = this.selected.block

    if(this.selected.block.type === "main"){
      for(let i=0; i<gridY.length; i++){
        const gridPosY = gridY[i]
        for(let j=0; j<gridX.length; j++){
          const gridPosX = gridX[j]
          if(this.winningBoundsGrid.maxX >= gridPosX && this.winningBoundsGrid.minX <= gridPosX && this.winningBoundsGrid.minY === gridPosY){
            return true
          }
        }
      }
    }

    return false
  }

  checkIfWithinBounds = (e, func) =>{
    //Check if event is within game bounds
    const { offsetX, offsetY } = e
    const withinXBounds = offsetX <= this.bounds.x && offsetX >= 0
    const withinYBounds = offsetY <= this.bounds.y && offsetY >= 0
    if(withinXBounds && withinYBounds){
      func(e)
    }
  }

  checkNeighbours = (startingGrid, endingGrid, direction) =>{
    //Check if block tries to jump over another block during movement
    const gridDirectionName = `grid${direction.toUpperCase()}`
    for(let i=0; i<this.selected.block[gridDirectionName].length; i++){
      const posBlockGridDirection = this.selected.block[gridDirectionName][i]
      for(let j=startingGrid; j<endingGrid; j++){
        let block = null
        if(direction === "y"){
          block = this.grid[posBlockGridDirection][j]
        }
        else if(direction === "x"){
          block = this.grid[j][posBlockGridDirection]
        }

        if(block != null && this.selected.block.id !== block?.id){
          console.log("Stopped from jumping over block")
          return true
        }
      }
    }
  }

  checkIfOverlapNeighbour = (gridDelta, direction) =>{
    //Check if block that has > 1x height or >1x width indirectly overlaps with another block upon placement
    for(let i=0; i<this.selected.block.gridY.length; i++){
      const posBlockGridY = this.selected.block.gridY[i]
      for(let j=0; j<this.selected.block.gridX.length; j++){
        const posBlockGridX = this.selected.block.gridX[j]
        let block = null
        if(direction === "x"){
          block = this.grid[posBlockGridY][posBlockGridX + gridDelta]
        }
        else if(direction ==="y"){
          block = this.grid[posBlockGridY + gridDelta][posBlockGridX]
        }
        if(block != null && this.selected.block.id !== block?.id){
          console.log("Contains overlapping block")
          return true
        }
      }
    }
  }
}