import React, { useEffect } from 'react';
import { useState } from 'react';
import "./App.css";
import ScoreBoard from './ScoreBoard';

const weight = 8;
const candyColors = [
    'green',
    "blue",
    "purple",
    "orange",
    "red",
    "yellow"
]

function App() {
    const [currentColorArrangement, setCurrentColorArrangement] = useState([])
    const [squareBeingDragged, setSquareBeingDragged] = useState(null)
    const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
    const [score, setscore] = useState(0)


    const checkForColumnThree = () => {
        for (let i = 0; i <= 47; i++) {
            const columnOfThree = [i, i + weight, i + 2 * weight]
            const decidedColor = currentColorArrangement[i]
            const isBlank = currentColorArrangement[i] === ''
            if (columnOfThree.every(square >= currentColorArrangement[square] === decidedColor) && !isBlank) {
                setscore((score) => score + 3)
                columnOfThree.forEach(square => currentColorArrangement[square] = "")
                return true
            }
        }
        const checkForColumnFour = () => {
            for (let i = 0; i <= 39; i++) {
                const crowOfFour = [i, i + weight, i + 2 * weight, i + 3 * weight]
                const decidedColor = currentColorArrangement[i]
                const isBlank = currentColorArrangement[i] === ''
                if (crowOfFour.every(square >= currentColorArrangement[square] === decidedColor) && !isBlank) {
                    setscore((score) => score + 4)
                    crowOfFour.forEach(square => currentColorArrangement[square] = "")
                    return true
                }
            }
        }
        const checkForRowThree = () => {
            for (let i = 0; i <= 47; i++) {
                const rowOfThree = [i, i + 1, i + 2]
                const decidedColor = currentColorArrangement[i]
                const notVaild = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
                if (notVaild.includes(i)) continue
                if (rowOfThree.every(square >= currentColorArrangement[square] === decidedColor)) {
                    setscore((score) => score + 3)
                    rowOfThree.forEach(square => currentColorArrangement[square] = "")
                    return true
                }
            }
        }
        const checkForRowFour = () => {
            for (let i = 0; i <= 39; i++) {
                const rowOfFour = [i, i + 1, i + 2, i + 3]
                const decidedColor = currentColorArrangement[i]
                const notVaild = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
                if (notVaild.includes(i)) continue
                if (rowOfFour.every(square >= currentColorArrangement[square] === decidedColor)) {
                    setscore((score) => score + 4)
                    rowOfFour.forEach(square => currentColorArrangement[square] = "")
                    return true
                }
            }
        }

        const moveBelow = () => {
            for (let i = 0; i < 55 - weight; i++) {
                const firstRow = [1, 2, 3, 4, 5, 6, 7, 8]
                if (firstRow.includes(i) && currentColorArrangement[i] === '') {
                    currentColorArrangement[i] = candyColors[Math.floor(Math.random() * candyColors.length)]
                }
                if ((currentColorArrangement[i + weight]) === '') {
                    currentColorArrangement[i + weight] = currentColorArrangement[i]
                    currentColorArrangement[i] = ""
                }
            }
        }

        const dragStart = (e) => {
            setSquareBeingDragged(e.target)
        }
        const drop = (e) => {
            setSquareBeingReplaced(e.target)
        }
        const dragEnd = () => {
            const squareBeingReplacedID = parseInt(squareBeingReplaced.getAttribute('data-id'))
            const squareBeingDraggedID = parseInt(squareBeingDragged.getAttribute('data-id'))

            const vaildMoves = [
                squareBeingDraggedID - 1,
                squareBeingDraggedID + 1,
                squareBeingDraggedID - weight,
                squareBeingDraggedID + weight
            ]
            const isColumnThree = checkForColumnThree()
            const isColumnFour = checkForColumnFour()
            const isRowThree = checkForRowThree()
            const isRowFour = checkForRowFour()
            const validMove = vaildMoves.includes(squareBeingReplacedID)
            if (squareBeingReplacedID && validMove && (isColumnFour || isColumnThree || isRowFour || isRowThree)) {
                setSquareBeingDragged(null)
                setSquareBeingReplaced(null)
            } else {
                currentColorArrangement[squareBeingReplacedID] = squareBeingDragged.style.backgroundColor
                currentColorArrangement[squareBeingDraggedID] = squareBeingReplaced.style.backgroundColor
                setCurrentColorArrangement([...currentColorArrangement])
            }

        }


        const createBoard = () => {
            const randomColorArrangement = []
            for (let i = 0; i < weight * weight; i++) {
                const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
                randomColorArrangement.push(randomColor)
            }
            setCurrentColorArrangement(randomColorArrangement)
        }

        useEffect(() => {
            createBoard()
        }, [])

        useEffect(() => {
            const timer = setInterval(() => {
                checkForColumnThree()
                checkForColumnFour()
                checkForRowThree()
                checkForRowFour()
                moveBelow()
                setCurrentColorArrangement([...currentColorArrangement])
            }, 100)
            return () => clearInterval(timer)

        }, [moveBelow, checkForColumnThree, checkForColumnFour, checkForRowThree, checkForRowFour, currentColorArrangement])
        return (
            <div className="app">
                <div className="game">
                    {currentColorArrangement.map((color, index) => {
                        <img key={index}
                            style={{ backgroundColor: color }}
                            alt={color}
                            data-id={index}
                            onDragStart={dragStart}
                            draggable={true}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={(e) => e.preventDefault()}
                            onDragLeave={(e) => e.preventDefault()}
                            onDrop={drop}
                            onDragEnd={dragEnd}
                        />
                    })}
                </div>
                <ScoreBoard score={score} />

            </div>
        )
    }
}

export default App
