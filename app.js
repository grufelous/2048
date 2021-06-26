(function() {
    let model = {
        gridStore: [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        _score: 0,
        get score() {
            return this._score
        },
        set score(value) {
            this._score = value
        },
        emptyGrid: function() {
            return [[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],]
        },
        cellValues: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
        gridGS: (function() {
            return {
                ourGrid: [[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],],
                get grid() {
                    // console.log('Called getter')
                    return this.ourGrid
                },
                set grid(newGrid) {
                    console.log('Called setter to set as: ')
                    console.log(this.ourGrid)
                    this.ourGrid = newGrid
                }
            }
        })(),
        transpose: function(grid) {
            let newGrid = this.emptyGrid()
            for(let i = 0; i < 4; i++) {
                for(let j = 0; j < 4; j++) {
                    newGrid[j][i] = grid[i][j]
                }
            }
            return newGrid
        },
        reverse: function(grid) {
            let reversedGrid = JSON.parse(JSON.stringify(grid))
            for(let i = 0; i < 4; i++) {
                for(let j = 0; j < 2; j++) {
                    const x = reversedGrid[i][3-j]
                    reversedGrid[i][3-j] = reversedGrid[i][j]
                    reversedGrid[i][j] = x
                }
            }
            return reversedGrid
        }
    }

    let view = {
        scoreDisplay: document.getElementById('score'),
        backGrid: document.getElementById('back-grid'),
        init: function() {
            // console.log('Grid store: ')
            // console.log(model.gridStore)
            // console.log('Grid getter/setter: ')
            // console.log(model.gridGS.grid)
            document.getElementById('reset-btn').addEventListener('click', octopus.resetGrid)
            // document.getElementById('clear-btn').addEventListener('click', octopus.clearGrid)
            model.score = 0
        },
        clearDOMGrid: function() {
            // console.log('Clearing grid')
            let gridCellElts = document.getElementsByClassName('grid-cell')
            while(gridCellElts.length) {
                gridCellElts[0].remove()
            }
            // console.log('Cleared')
        },
        renderGrid: function() {
            const grid = model.gridGS.grid
            console.log('Rendering this: ')
            console.log(grid)
            for(let i = 0; i < 4; i++) {
                for(let j = 0; j < 4; j++) {
                    if(grid[i][j] !== 0) {
                        const curId = String.fromCharCode('A'.charCodeAt(0) + 4*i + j)
                        console.log(`${curId} for ${i} ${j}`)
                        const newGridCell = document.createElement('div')
                        newGridCell.className = `grid-cell c-${grid[i][j]}`         //2 4 8 0, i = 0, j = 1
                        newGridCell.id = `${curId}`
                        newGridCell.innerText = grid[i][j]
                        view.backGrid.appendChild(newGridCell)
                    }
                }
            }
        },
        keyHandler: function(e) {
            console.log(e.key)
            console.log(`Called on ${e.target}`)
            if(!octopus.canMove(model.gridGS.grid)) {
                alert('Game over')
                return
            }
            let nextGrid = model.emptyGrid()
            const curGrid = model.gridGS.grid
            switch(e.key) {
                case 'ArrowLeft':
                    nextGrid = octopus.moveLeft(model.gridGS.grid)
                    octopus.clearGrid()
                    model.gridGS.grid = nextGrid
                    model.gridGS.grid = (model.gridGS.grid!==curGrid) ? octopus.createNumber(model.gridGS.grid) : curGrid
                    view.renderGrid()
                    break
                case 'ArrowUp':
                    nextGrid = octopus.moveUp(model.gridGS.grid)
                    octopus.clearGrid()
                    model.gridGS.grid = nextGrid
                    model.gridGS.grid = (model.gridGS.grid!==curGrid) ? octopus.createNumber(model.gridGS.grid) : curGrid
                    view.renderGrid()
                    break
                case 'ArrowRight':
                    nextGrid = octopus.moveRight(model.gridGS.grid)
                    octopus.clearGrid()
                    model.gridGS.grid = nextGrid
                    model.gridGS.grid = (model.gridGS.grid!==curGrid) ? octopus.createNumber(model.gridGS.grid) : curGrid
                    view.renderGrid()
                    break
                case 'ArrowDown':
                    nextGrid = octopus.moveDown(model.gridGS.grid)
                    octopus.clearGrid()
                    model.gridGS.grid = nextGrid
                    model.gridGS.grid = (model.gridGS.grid!==curGrid) ? octopus.createNumber(model.gridGS.grid) : curGrid
                    view.renderGrid()
                    break
            }
        },
    }

    let octopus = {
        createNumber: function(grid, number=2) {
            let emptyPositions = []
            for(let i = 0; i < 4; i++) {
                for(let j = 0; j < 4; j++) {
                    if(grid[i][j] === 0) {
                        emptyPositions.push([i, j])
                    }
                }
            }
            if(emptyPositions.length === 0)
                return grid
            let chosen = Math.floor(Math.random()*emptyPositions.length)
            grid[emptyPositions[chosen][0]][emptyPositions[chosen][1]] = number
            return grid
        },
        canMove: function(originalGrid) {
            const grid = JSON.parse(JSON.stringify(originalGrid))
            // console.log('Original: ')
            // console.log(grid)
            // console.log('Left: ')
            // const leftG = octopus.moveLeft(grid)
            // console.log(leftG)
            // console.log('Up: ')
            // const upG = octopus.moveUp(grid)
            // console.log(upG)
            // console.log('Right: ')
            // const rightG = octopus.moveRight(grid)
            // console.log(rightG)
            // console.log('Down: ')
            // const downG = octopus.moveDown(grid)
            // console.log(downG)
            if(grid === this.moveDown(grid) && grid === this.moveLeft(grid) && grid === this.moveRight(grid) && grid === this.moveUp(grid)) {
                console.log('Cant move!')
                return false
            }
            console.log('Can move')
            return true
        },
        setScore: function(newScore) {
            model.score = newScore
            document.getElementById('score').innerText = model.score
        },
        resetGrid: function() {
            console.log('Resetting grid')
            octopus.clearGrid()
            console.log(model.gridGS.grid)
            let grid = model.emptyGrid()
            // ? Why `octopus` here instead of `this`? Because this function is bound to a button before execution and creation of namespace
            octopus.setScore(0)
            let nums = []
            for(let i = 0; i < 16; i++) {
                nums.push(model.cellValues[Math.floor(Math.random()*11)])
                grid = octopus.createNumber(grid, nums[i])
            }
            model.gridGS.grid = grid
            view.renderGrid()
            console.log('Grid reset')
        },
        clearGrid: function() {
            view.clearDOMGrid()
            model.gridGS.grid = model.emptyGrid()
        },
        moveLeft: function(grid) {
            let newGrid = []
            for(let i = 0; i < 4; i++) {
                // console.log(`For i = ${i}`)
                let intermediateGridRow = [], gridRow = []
                for(let j = 0; j < 4; j++) {
                    if(grid[i][j] !== 0) {
                        // console.log(`Found ${i} ${j}`)
                        intermediateGridRow.push(grid[i][j])
                    }
                }
                // console.log(`IGR: ${intermediateGridRow}, sz: ${intermediateGridRow.length}`)
                while(intermediateGridRow.length > 1) {
                    let first = intermediateGridRow.shift()
                    let second = intermediateGridRow[0]
                    // console.log(`F: ${first} S: ${second}`)
                    if(first === second) {
                        gridRow.push(first*2)
                        // ? Why `this` here instead of `octopus`? Because the function has now executed
                        this.setScore(model.score + 2*first)
                        intermediateGridRow.shift()
                    } else {
                        gridRow.push(first)
                    }
                }
                if(intermediateGridRow.length) {
                    // console.log(`Has IGR: ${intermediateGridRow}, sz: ${intermediateGridRow.length}`)
                    gridRow.push(intermediateGridRow[0])
                    intermediateGridRow.shift()
                }
                // console.log(`Length of row: ${gridRow.length}, gridRow: ${gridRow}`)
                while(gridRow.length < 4)
                    gridRow.push(0)
                newGrid.push(gridRow)
                // console.log(`\n\n`)
            }
            // console.log(newGrid)
            return newGrid
        },
        moveLeftExperiment: function(grid) {
            let newGrid = model.emptyGrid()
            grid.forEach((row, rowIdx) => {
                let newRow = newGrid[rowIdx]
                let i = 0, j = 1, k = 0
                while(i < 4 && j < 4 && k < 4) {
                    while(i < 4 && row[i] === 0) {
                        i++
                        j = i+1
                    }
                    if(i === 4) {
                        continue
                    }
                    while(j < 4 && row[j] === 0) {
                        j++
                    }
                    if(j === 4 && k < 4) {
                        newRow[k++] = row[i]
                        continue
                    }
                    if(row[i] === row[j] && k < 4) {
                        newRow[k++] = 2*row[i]
                        row[i] = 0
                        row[j] = 0
                        i = j+1
                        j = i+1
                    } else if(row[i] !== row[j] && k < 4) {
                        newRow[k++] = row[i]
                        row[i] = 0
                        i = j
                        j = j+1
                        if(j >= 4 && k < 4 && row[i] !== 0) {
                            newRow[k++] = row[i]
                        }
                    }
                }
            })
            console.log('New grid of new function: ')
            console.log(newGrid)
            return newGrid
        },
        moveRight: function(grid) {
            let reversedGrid = model.reverse(grid)
            reversedGrid = octopus.moveLeft(reversedGrid)
            reversedGrid = model.reverse(reversedGrid)
            return reversedGrid
        },
        moveUp: function(grid) {
            let transposedGrid = model.transpose(grid)
            transposedGrid = this.moveLeft(transposedGrid)
            transposedGrid = model.transpose(transposedGrid)
            return transposedGrid
        },
        moveDown: function(grid) {
            let transposedGrid = model.transpose(grid)
            transposedGrid = this.moveRight(transposedGrid)
            transposedGrid = model.transpose(transposedGrid)
            return transposedGrid
        }
    }

    view.init()
    
    document.addEventListener('keydown', view.keyHandler)
})();



/***
 * original     //left          //right
 * 2 2 4 0      4 4 0 0         0 0 4 4                 2 2 4
 * 2 0 0 2       40 0 0         0 0 0 4                 2 2
 * 0 2 4 8      2 4 8 0         0 2 4 8                 2 4 8
 * 2 2 2 2
 * 
 * 2 2 2 0
 * 
 * 2 2 4 0  -reverse->  0 4 2 2  -left->   4 4 0 0 -reverse-> 0 0 4 4
 * 0 2 4 8  -reverse->  8 4 2 0  -left->   8 4 2 0 -reverse-> 0 2 4 8
 * 
 *              //up 
 * 2 2 4 0      4 4 8 2         0 0 4 4
 * 2 0 0 2      2 2 2 8         0 0 0 4
 * 0 2 4 8      0 0 0 2         0 2 4 8
 * 2 2 2 2      0 0 0 0
 * 
 * transpose    //left      //transpose
 * 2 2 0 2      4 2 0 0     4 4 8 2
 * 2 0 2 2      4 2 0 0     2 2 2 8
 * 4 0 4 2      8 2 0 0     0 0 0 2
 * 0 2 8 2      2 8 2 0     0 0 0 0
 */
