(function () {
    let model = {
        gridStore: [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        score: 0,
        emptyGrid: function () {
            return [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],];
        },
        cellValues: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
        gridGS: (function () {
            return {
                ourGrid: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],],
                get grid() {
                    // console.log('Called getter')
                    return this.ourGrid;
                },
                set grid(newGrid) {
                    console.log('Called setter to set as: ');
                    console.log(this.ourGrid);
                    this.ourGrid = newGrid;
                }
            };
        })(),
        transpose: function (grid) {
            let newGrid = this.emptyGrid();
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    newGrid[j][i] = grid[i][j];
                }
            }
            return newGrid;
        },
        reverse: function (grid) {
            /**
             * TODO: find out the issue in this function
             *  */
            let reversedGrid = [...grid];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 2; j++) {
                    const x = reversedGrid[i][3 - j];
                    reversedGrid[i][3 - j] = reversedGrid[i][j];
                    reversedGrid[i][j] = x;
                }
            }
            return reversedGrid;
        }
    };
    let view = {
        scoreDisplay: document.getElementById('score'),
        backGrid: document.getElementById('back-grid'),
        init: function () {
            console.log('Grid store: ');
            console.log(model.gridStore);
            console.log('Grid getter/setter: ');
            console.log(model.gridGS.grid);
            document.getElementById('reset-btn').addEventListener('click', octopus.resetGrid);
            document.getElementById('clear-btn').addEventListener('click', octopus.clearGrid);
        },
        clearDOMGrid: function () {
            // console.log('Clearing grid')
            let gridCellElts = document.getElementsByClassName('grid-cell');
            while (gridCellElts.length) {
                gridCellElts[0].remove();
            }
            // console.log('Cleared')
        },
        renderGrid: function () {
            const grid = model.gridGS.grid;
            console.log('Rendering this: ');
            console.log(grid);
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (grid[i][j] !== 0) {
                        const curId = String.fromCharCode('A'.charCodeAt(0) + 4 * i + j);
                        console.log(`${curId} for ${i} ${j}`);
                        const newGridCell = document.createElement('div');
                        newGridCell.className = `grid-cell c-${grid[i][j]}`;
                        newGridCell.id = `${curId}`;
                        newGridCell.innerText = grid[i][j].toString();
                        view.backGrid.appendChild(newGridCell);
                    }
                }
            }
        },
        keyHandler: function (e) {
            // console.log(e)
            // console.log(`Called on ${e.target}`)
            let nextGrid = model.emptyGrid();
            switch (e.key) {
                case 'ArrowLeft':
                    nextGrid = octopus.moveLeft(model.gridGS.grid);
                    octopus.clearGrid();
                    model.gridGS.grid = nextGrid;
                    view.renderGrid();
                    break;
                case 'ArrowUp':
                    nextGrid = octopus.moveUp(model.gridGS.grid);
                    octopus.clearGrid();
                    model.gridGS.grid = nextGrid;
                    view.renderGrid();
                    break;
                case 'ArrowRight':
                    nextGrid = octopus.moveRight(model.gridGS.grid);
                    octopus.clearGrid();
                    model.gridGS.grid = nextGrid;
                    view.renderGrid();
                    break;
                case 'ArrowDown':
                    nextGrid = octopus.moveDown(model.gridGS.grid);
                    octopus.clearGrid();
                    model.gridGS.grid = nextGrid;
                    view.renderGrid();
                    break;
            }
        },
    };
    let octopus = {
        createNumber: function (grid, newNumber = 2) {
            let emptyPositions = [];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (grid[i][j] === 0) {
                        emptyPositions.push([i, j]);
                    }
                }
            }
            let chosen = Math.floor(Math.random() * emptyPositions.length);
            grid[emptyPositions[chosen][0]][emptyPositions[chosen][1]] = newNumber;
            return grid;
        },
        resetGrid: function () {
            console.log('Resetting grid');
            octopus.clearGrid();
            console.log(model.gridGS.grid);
            let grid = model.emptyGrid();
            let nums = [];
            for (let i = 0; i < 4; i++) {
                nums.push(model.cellValues[Math.floor(Math.random() * 4)]);
                grid = octopus.createNumber(grid, nums[i]);
            }
            model.gridGS.grid = grid;
            view.renderGrid();
            console.log('Grid reset');
        },
        clearGrid: function () {
            view.clearDOMGrid();
            model.gridGS.grid = model.emptyGrid();
        },
        moveLeft: function (grid) {
            let newGrid = [];
            for (let i = 0; i < 4; i++) {
                console.log(`For i = ${i}`);
                let intermediateGridRow = [], gridRow = [];
                for (let j = 0; j < 4; j++) {
                    if (grid[i][j] !== 0) {
                        // console.log(`Found ${i} ${j}`)
                        intermediateGridRow.push(grid[i][j]);
                    }
                }
                console.log(`IGR: ${intermediateGridRow}, sz: ${intermediateGridRow.length}`);
                while (intermediateGridRow.length > 1) {
                    let first = intermediateGridRow.shift();
                    let second = intermediateGridRow[0];
                    // console.log(`F: ${first} S: ${second}`)
                    if (first === second) {
                        gridRow.push(first * 2);
                        // updateScore(first*2)
                        intermediateGridRow.shift();
                    }
                    else {
                        gridRow.push(first);
                    }
                }
                if (intermediateGridRow.length) {
                    // console.log(`Has IGR: ${intermediateGridRow}, sz: ${intermediateGridRow.length}`)
                    gridRow.push(intermediateGridRow[0]);
                    intermediateGridRow.shift();
                }
                console.log(`Length of row: ${gridRow.length}, gridRow: ${gridRow}`);
                while (gridRow.length < 4)
                    gridRow.push(0);
                newGrid.push(gridRow);
                console.log(`\n\n`);
            }
            console.log(newGrid);
            return newGrid;
        },
        moveLeftExperiment: function (grid) {
            let newGrid = model.emptyGrid();
            grid.forEach((row, rowIdx) => {
                let newRow = newGrid[rowIdx];
                let i = 0, j = 1, k = 0;
                while (i < 4 && j < 4 && k < 4) {
                    while (i < 4 && row[i] === 0) {
                        i++;
                        j = i + 1;
                    }
                    if (i === 4) {
                        continue;
                    }
                    while (j < 4 && row[j] === 0) {
                        j++;
                    }
                    if (j === 4 && k < 4) {
                        newRow[k++] = row[i];
                        continue;
                    }
                    if (row[i] === row[j] && k < 4) {
                        newRow[k++] = 2 * row[i];
                        row[i] = 0;
                        row[j] = 0;
                        i = j + 1;
                        j = i + 1;
                    }
                    else if (row[i] !== row[j] && k < 4) {
                        newRow[k++] = row[i];
                        row[i] = 0;
                        i = j;
                        j = j + 1;
                        if (j >= 4 && k < 4 && row[i] !== 0) {
                            newRow[k++] = row[i];
                        }
                    }
                }
            });
            console.log('New grid of new function: ');
            console.log(newGrid);
            return newGrid;
        },
        moveRight: function (grid) {
            let reversedGrid = [...grid];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 2; j++) {
                    const x = reversedGrid[i][3 - j];
                    reversedGrid[i][3 - j] = reversedGrid[i][j];
                    reversedGrid[i][j] = x;
                }
            }
            reversedGrid = octopus.moveLeft(reversedGrid);
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 2; j++) {
                    const x = reversedGrid[i][3 - j];
                    reversedGrid[i][3 - j] = reversedGrid[i][j];
                    reversedGrid[i][j] = x;
                }
            }
            return reversedGrid;
        },
        moveUp: function (grid) {
            let transposedGrid = model.transpose(grid);
            transposedGrid = this.moveLeft(transposedGrid);
            transposedGrid = model.transpose(transposedGrid);
            return transposedGrid;
        },
        moveDown: function (grid) {
            let transposedGrid = model.transpose(grid);
            transposedGrid = this.moveRight(transposedGrid);
            transposedGrid = model.transpose(transposedGrid);
            return transposedGrid;
        }
    };
    view.init();
    document.addEventListener('keydown', view.keyHandler);
})();
