let gridStore = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
]

let score = 0

const cellValues = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048]

// document.onkeydown = doSomething
document.addEventListener('keydown', doSomething)
function doSomething(e) {
    console.log(e.key)
    console.log(`Called on ${e.target}`)
    // renderGrid(gridStore)
    // createNumber()
    switch(e.key) {
        case 'ArrowLeft':
            gridStore = moveLeft(gridStore)
            clearGrid()
            createNumber(gridStore)
            renderGrid(gridStore)
            break
        case 'ArrowUp':
            gridStore = moveUp(gridStore)
            clearGrid()
            createNumber(gridStore)
            renderGrid(gridStore)
            break
        case 'ArrowRight':
            gridStore = moveRight(gridStore)
            clearGrid()
            // createNumber(gridStore)
            renderGrid(gridStore)
            break
        case 'ArrowDown':
            moveDown(gridStore)
            break
    }
}

const scoreDisplay = document.getElementById('score')
const backGrid = document.getElementById('back-grid')

const clearGrid = function() {
    let gridCellElts = document.getElementsByClassName('grid-cell')
    
    while(gridCellElts.length) {
        // console.log(gridCellElts)
        gridCellElts[0].remove()
    }
}

const canMerge = function(grid, direction) {
    switch(direction) {
        case 'LEFT':

            break
        case 'RIGHT':
            break
        case 'UP':
            break
        case 'DOWN':
            break
    }
}

const createNumber = function(grid, number=2) {
    let emptyPositions = []
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++) {
            if(grid[i][j] === 0) {
                emptyPositions.push([i, j])
            }
        }
    }
    console.log(emptyPositions)
    let chosen = Math.floor(Math.random()*emptyPositions.length)
    console.log(`Selected idx: ${chosen}`)
    grid[emptyPositions[chosen][0]][emptyPositions[chosen][1]] = number
    // console.log(grid)
    return grid
}

const resetGrid = function() {
    clearGrid()
    let grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]
    let nums = []
    for(let i = 0; i < 4; i++) {
        nums.push(cellValues[Math.floor(Math.random()*4)])
        console.log(nums[i])
        grid = createNumber(grid, nums[i])
    }
    renderGrid(grid)
    gridStore = grid
    console.log(grid)
}

const renderGrid = function(grid) {
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++) {
            if(grid[i][j] !== 0) {
                const curId = String.fromCharCode('A'.charCodeAt(0) + 4*i + j)
                console.log(`${curId} for ${i} ${j}`)
                const newGridCell = document.createElement('div')
                newGridCell.className = `grid-cell c-${grid[i][j]}`
                newGridCell.id = `${curId}`
                newGridCell.innerText = grid[i][j]
                document.getElementById('back-grid').appendChild(newGridCell)
            }
        }
    }
}

const updateScore = function(scoreIncrement) {
    score = score+scoreIncrement
    scoreDisplay.innerText = score
}

const moveLeft = function(grid) {
    let newGrid = []
    for(let i = 0; i < 4; i++) {
        console.log(`For i = ${i}`)
        let intermediateGridRow = [], gridRow = []
        for(let j = 0; j < 4; j++) {
            if(grid[i][j] !== 0) {
                // console.log(`Found ${i} ${j}`)
                intermediateGridRow.push(grid[i][j])
            }
        }
        console.log(`IGR: ${intermediateGridRow}, sz: ${intermediateGridRow.length}`)
        while(intermediateGridRow.length > 1) {
            let first = intermediateGridRow.shift()
            let second = intermediateGridRow[0]
            // console.log(`F: ${first} S: ${second}`)
            if(first === second) {
                gridRow.push(first*2)
                updateScore(first*2)
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
        console.log(`Length of row: ${gridRow.length}, gridRow: ${gridRow}`)
        while(gridRow.length < 4)
            gridRow.push(0)
        newGrid.push(gridRow)
        console.log(`\n\n`)
    }
    console.log(newGrid)
    return newGrid
}

function moveRight(grid) {
    let reversedGrid = []
    grid.forEach(row => {
        reversedGrid.push(row.reverse())
        console.log(`Row: ${row}, ${Array.isArray(row)}`)
    })
    reversedGrid = moveLeft(reversedGrid)
    reversedGrid.forEach(row => {
        reversedGrid.push(row.reverse())
        console.log(`Rev2Row: ${row}`)
    })

    // console.log(`Reversed answer: ${reversedGrid}`)
    return reversedGrid
}

function moveUp(grid) {
    
}

const moveDown = function(grid) {
    
}

