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
    document.getElementById("game").style.display = "block";

    console.log("Starting game on diff:", difficulty);

    createBoard("player-board");
    createBoard("ai-board");
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