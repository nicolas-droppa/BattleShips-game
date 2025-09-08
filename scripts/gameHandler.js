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

        cell.addEventListener("dragover", e => {
            e.preventDefault();
            cell.classList.add("drop-target");
        });

        cell.addEventListener("dragleave", () => {
            cell.classList.remove("drop-target");
        });

        cell.addEventListener("drop", e => {
            e.preventDefault();
            cell.classList.remove("drop-target");

            const shipId = e.dataTransfer.getData("text/plain");
            const ship = document.querySelector(`[data-id="${shipId}"]`);

            if (ship) {
                cell.appendChild(ship);
                console.log(`Placed ${ship.dataset.name} at cell ${i}`);
            }
        });
    }
}

function createShips() {
    const shipsPanel = document.querySelector(".ships");
    shipsPanel.innerHTML = "";

    const shipsData = [
        { name: "Carrier", size: 5 },
        { name: "Battleship", size: 4 },
        { name: "Cruiser", size: 3 },
        { name: "Submarine", size: 3 },
        { name: "Destroyer", size: 2 }
    ];

    shipsData.forEach((shipData, index) => {
        const ship = document.createElement("div");
        ship.classList.add("ship");
        ship.setAttribute("draggable", "true");
        ship.dataset.size = shipData.size;
        ship.dataset.name = shipData.name;
        ship.dataset.id = `ship-${index}`;

        for (let i = 0; i < shipData.size; i++) {
            const cell = document.createElement("div");
            cell.classList.add("ship-cell");
            ship.appendChild(cell);
        }

        shipsPanel.appendChild(ship);

        ship.addEventListener("dragstart", e => {
            ship.classList.add("dragging");
            e.dataTransfer.setData("text/plain", ship.dataset.id);
        });

        ship.addEventListener("dragend", () => {
            ship.classList.remove("dragging");
        });
    });
}
