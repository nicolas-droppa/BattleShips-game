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

    enableBoardDrops("player-board");

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

    const shipSizes = [
        { name: "Carrier", size: 5 },
        { name: "Battleship", size: 4 },
        { name: "Cruiser", size: 3 },
        { name: "Submarine", size: 3 },
        { name: "Destroyer", size: 2 }
    ];

    shipSizes.forEach(shipData => {
        const ship = document.createElement("div");
        ship.classList.add("ship");
        ship.setAttribute("draggable", "true");
        ship.dataset.size = shipData.size;

        for (let i = 0; i < shipData.size; i++) {
            const cell = document.createElement("div");
            cell.classList.add("ship-cell");
            ship.appendChild(cell);
        }

        const label = document.createElement("span");
        label.textContent = shipData.name;
        label.style.marginLeft = "10px";

        const wrapper = document.createElement("div");
        wrapper.appendChild(ship);
        wrapper.appendChild(label);

        shipsPanel.appendChild(wrapper);

        ship.addEventListener("dragstart", e => {
            e.dataTransfer.setData("size", shipData.size);
            e.dataTransfer.setData("shipId", Math.random());
        });
    });
}

function enableBoardDrops(boardId) {
    const board = document.getElementById(boardId);

    board.querySelectorAll(".cell").forEach((cell, index) => {
        cell.addEventListener("dragover", e => {
            e.preventDefault();
            const size = parseInt(e.dataTransfer.getData("size"), 10);

            const row = Math.floor(index / 10);
            const col = index % 10;

            clearPreview(board);

            if (col + size <= 10) {
                for (let i = 0; i < size; i++) {
                    const idx = row * 10 + (col + i);
                    board.children[idx].classList.add("preview");
                }
            }
        });

        cell.addEventListener("dragleave", () => {
            clearPreview(board);
        });

        cell.addEventListener("drop", e => {
            e.preventDefault();
            const size = parseInt(e.dataTransfer.getData("size"), 10);

            const row = Math.floor(index / 10);
            const col = index % 10;

            clearPreview(board);

            if (col + size <= 10) {
                for (let i = 0; i < size; i++) {
                    const idx = row * 10 + (col + i);
                    board.children[idx].classList.add("occupied");
                }
            } else {
                alert("Not enough space to place ship here!");
            }
        });
    });
}

function clearPreview(board) {
    board.querySelectorAll(".preview").forEach(cell =>
        cell.classList.remove("preview")
    );
}

