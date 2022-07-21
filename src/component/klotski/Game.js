import Block from "./Block"
import { BlockTypes } from './Block.util'
import * as PIXI from 'pixi.js'
import Wall from "./Wall"
import confetti from "canvas-confetti"

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
  xOffsetFactor = 6
  yOffsetFactor = 1.5
  bounds = {
    //For my sanity to interpolate coordinates to grid indices
    x: this.grid[0].length * this.gridSize + (this.gridSize * this.xOffsetFactor),
    y: this.grid.length * this.gridSize + (this.gridSize * this.yOffsetFactor),
  } 
  
  moveCount = 0
  moveCounterText = ""

  win = false
  reactFnSetResetShown = null
  
  constructor(app, reactFnSetResetShown){
    this.app = app
    this.reactFnSetResetShown = reactFnSetResetShown
    this.initGame()
  }

  initGame = () =>{
    this.spawnBlocks()

    this.app.renderer.view.addEventListener('pointerdown', (e) => {
      this.checkIfWithinBounds(e, this.handleAppMouseDown)
    });

    this.app.renderer.view.addEventListener('pointerup', (e) => {
      this.checkIfWithinBounds(e, this.handleAppMouseUp)
    });
  }

  spawnBlocks = () =>{
    const xDelta = this.xOffsetFactor * this.gridSize
    const yDelta = this.yOffsetFactor * this.gridSize
    const listOfBlocks = []

    const vert1 = new Block(0 + xDelta, 0 + yDelta, BlockTypes.vertical, this)
    const vert2 = new Block(0 + xDelta , 100 + yDelta, BlockTypes.vertical, this)
    const block1 = new Block(0 + xDelta, 200 + yDelta, BlockTypes.block, this)

    const main = new Block(50 + xDelta, 0 + yDelta, BlockTypes.main, this)
    const hori1 = new Block(50 + xDelta, 100 + yDelta, BlockTypes.horizontal, this)
    const block2 = new Block(50 + xDelta, 150 + yDelta, BlockTypes.block, this)
    const block3 = new Block(100 + xDelta, 150 + yDelta, BlockTypes.block, this)

    const vert4 = new Block(150 + xDelta, 0 + yDelta, BlockTypes.vertical, this)
    const vert5 = new Block(150 + xDelta, 100 + yDelta, BlockTypes.vertical, this)
    const block4 = new Block(150 + xDelta, 200 + yDelta, BlockTypes.block, this)

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

    const wall1 = new Wall(300, 59, 200, 15)
    const wall2 = new Wall(285, 59, 15, 266)
    const wall3 = new Wall(500, 59, 15, 266)
    const wall4 = new Wall(285, 325, 65, 15)
    const wall5 = new Wall(450, 325, 65, 15)

    this.app.stage.addChild(wall1.graphic)
    this.app.stage.addChild(wall2.graphic)
    this.app.stage.addChild(wall3.graphic)
    this.app.stage.addChild(wall4.graphic)
    this.app.stage.addChild(wall5.graphic)
    
    this.moveCounterText = new PIXI.Text(
      `Moves made: ${this.moveCount}`,
      {fontFamily : 'Arial', fontSize: 24, fill : 0x00000, align : 'center', }
    )
    this.moveCounterText.position.set(320, 0)
    this.app.stage.addChild(this.moveCounterText)

  }

  updateNewBlockGridPosition = (block, setNull=false) =>{
    for(let i=0; i<block.gridY.length; i++){
      const gridPosY = block.gridY[i]
      for(let j=0; j<block.gridX.length; j++){
        const gridPosX = block.gridX[j]

        this.grid[gridPosY][gridPosX] = setNull ? null : block
      }
    }
  }

  handleAppMouseDown = (e) =>{
    if(!this.win){
      const { offsetX, offsetY } = e
      const gridX = Math.floor((offsetX - (this.xOffsetFactor * this.gridSize)) / this.gridSize)
      const gridY = Math.floor((offsetY - (this.yOffsetFactor * this.gridSize)) / this.gridSize)
      const block = this.grid[gridY][gridX]
  
      this.selected.block = block
      this.selected.grid = {
        x: gridX,
        y: gridY
      }
    }
  }

  handleAppMouseUp = (e) =>{
    const { offsetX, offsetY } = e
    //Get new position relative to the grid indices
    const newGridPosX = Math.floor((offsetX - (this.xOffsetFactor * this.gridSize)) / this.gridSize)
    let newGridPosY = Math.floor((offsetY - (this.yOffsetFactor * this.gridSize)) / this.gridSize)
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

    ++this.moveCount
    this.moveCounterText.text =`Moves made: ${this.moveCount}`
    const isWin = this.checkIfWon()
    if(isWin){
      this.handleWin()
    }
  }

  handleBlockMovement = (startingGrid, endingGrid, delta, direction, neighbourDirection) =>{
    if(this.selected.block){
      const containsBlockInPath = this.selected.block != null && this.checkNeighbours(startingGrid, endingGrid, neighbourDirection)
      if(!containsBlockInPath){
        const existingBlock = this.checkIfOverlapNeighbour(delta, direction)
        if(!existingBlock){
          this.handleUpdateBlockPosition(delta, direction)
        }
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
    const withinXBounds = offsetX - (this.xOffsetFactor * this.gridSize) <= this.bounds.x && offsetX - (this.xOffsetFactor * this.gridSize) >= 0
    const withinYBounds = offsetY - (this.yOffsetFactor * this.gridSize) <= this.bounds.y && offsetY - (this.yOffsetFactor * this.gridSize) >= 0
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

  handleWin = () =>{
    console.log("Won!")
    this.win = true
    this.fireConfetti()
    this.moveCounterText.text =`You Win!\nMoves made: ${this.moveCount}`
    this.reactFnSetResetShown(true)
    // setTimeout(() =>{
    //   location.reload()
    // }, 5000)
  }

  fireConfetti = () =>{
    const count = 200;
    const defaults = {
      origin: { y: 0.8 }
    };

    function fire(particleRatio, opts) {
      confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      }));
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }
}