import { gameStarted } from './dev.js';

document.addEventListener("DOMContentLoaded", () => {
    switch (gameStarted) {
        case 1:
            startGame('easy');
            break;
        case 2:
            startGame('medium');
            break;
        case 3:
            startGame('hard');
            break;
        default:
            break;
    }
});

function startGame(difficulty) {
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "flex";

    console.log("Starting game on diff:", difficulty);

    createBoard("player-board");
    createBoard("ai-board");
    createShips();
}

function createBoard(boardId) {
    const board = document.getElementById(boardId);

    board.innerHTML = "";
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        board.appendChild(cell);
    }
}

function createShips() {
    const shipsPanel = document.querySelector(".ships");
    shipsPanel.innerHTML = "";

    const shipSizes = [5, 4, 3, 3, 2];

    shipSizes.forEach(size => {
        const ship = document.createElement("div");
        ship.classList.add("ship");

        for (let i = 0; i < size; i++) {
            const cell = document.createElement("div");
            cell.classList.add("ship-cell");
            ship.appendChild(cell);
        }

        shipsPanel.appendChild(ship);
    });
}