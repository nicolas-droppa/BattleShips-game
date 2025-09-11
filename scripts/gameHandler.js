import { gameStarted } from './dev.js';

let currentOrientation = 'horizontal';
let draggingShip = null;

document.addEventListener("DOMContentLoaded", () => {
    updateOrientationIndicator();

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

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') {
        currentOrientation = currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
        if (draggingShip) {
            draggingShip.classList.toggle('vertical', currentOrientation === 'vertical');
        }
        updateOrientationIndicator();
    }
});

function updateOrientationIndicator() {
    const el = document.getElementById('orientationIndicator');
    if (el) el.textContent = currentOrientation === 'horizontal' ? 'H' : 'V';
}

function startGame(difficulty) {
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "flex";

    console.log("Starting game on diff:", difficulty);

    createBoard("player-board");
    createBoard("ai-board");

    createShips();
    enableBoardDrops("player-board");
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

    const shipsData = [
        { name: "Carrier", size: 5 },
        { name: "Battleship", size: 4 },
        { name: "Cruiser", size: 3 },
        { name: "Submarine", size: 3 },
        { name: "Destroyer", size: 2 }
    ];

    shipsData.forEach((shipData, index) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("ship-wrapper");

        const ship = document.createElement("div");
        ship.classList.add("ship");
        ship.setAttribute("draggable", "true");
        ship.dataset.size = shipData.size;
        ship.dataset.name = shipData.name;
        ship.dataset.id = `ship-${index}`;

        for (let i = 0; i < shipData.size; i++) {
            const c = document.createElement("div");
            c.classList.add("ship-cell");
            ship.appendChild(c);
        }

        const label = document.createElement("span");
        label.classList.add("ship-label");
        label.textContent = shipData.name;

        wrapper.appendChild(ship);
        wrapper.appendChild(label);
        shipsPanel.appendChild(wrapper);

        ship.addEventListener("dragstart", (e) => {
            draggingShip = ship;
            ship.classList.add("dragging");
            e.dataTransfer.setData("text/plain", ship.dataset.id);
            e.dataTransfer.effectAllowed = 'move';
        });

        ship.addEventListener("dragend", () => {
            if (draggingShip) {
                draggingShip.classList.remove("dragging", "vertical");
            }
            draggingShip = null;
            document.querySelectorAll(".board").forEach(b => clearPreview(b));
        });
    });
}

function enableBoardDrops(boardId) {
    const board = document.getElementById(boardId);

    board.querySelectorAll(".cell").forEach((cell, index) => {
        cell.addEventListener("dragover", (e) => {
            e.preventDefault();
            if (!draggingShip) return;

            const size = parseInt(draggingShip.dataset.size, 10);
            const row = Math.floor(index / 10);
            const col = index % 10;

            clearPreview(board);

            const targetCells = [];
            let valid = true;

            if (currentOrientation === 'horizontal') {
                if (col + size > 10) valid = false;
                for (let i = 0; i < size; i++) {
                    const idx = row * 10 + (col + i);
                    const c = board.children[idx];
                    if (!c) { valid = false; break; }
                    if (c.classList.contains('occupied')) valid = false;
                    targetCells.push(c);
                }
            } else {
                if (row + size > 10) valid = false;
                for (let i = 0; i < size; i++) {
                    const idx = (row + i) * 10 + col;
                    const c = board.children[idx];
                    if (!c) { valid = false; break; }
                    if (c.classList.contains('occupied')) valid = false;
                    targetCells.push(c);
                }
            }

            targetCells.forEach(c => c.classList.add('preview'));
            if (!valid) targetCells.forEach(c => c.classList.add('invalid'));
        });

        cell.addEventListener("dragleave", () => {
            if (!draggingShip) clearPreview(board);
            else
                clearPreview(board);
        });

        cell.addEventListener("drop", (e) => {
            e.preventDefault();
            if (!draggingShip) return;

            const size = parseInt(draggingShip.dataset.size, 10);
            const shipId = draggingShip.dataset.id;
            const row = Math.floor(index / 10);
            const col = index % 10;

            clearPreview(board);

            const targetCells = [];
            let valid = true;

            if (currentOrientation === 'horizontal') {
                if (col + size > 10) valid = false;
                for (let i = 0; i < size; i++) {
                    const idx = row * 10 + (col + i);
                    const c = board.children[idx];
                    if (!c) { valid = false; break; }
                    if (c.classList.contains('occupied')) valid = false;
                    targetCells.push(c);
                }
            } else {
                if (row + size > 10) valid = false;
                for (let i = 0; i < size; i++) {
                    const idx = (row + i) * 10 + col;
                    const c = board.children[idx];
                    if (!c) { valid = false; break; }
                    if (c.classList.contains('occupied')) valid = false;
                    targetCells.push(c);
                }
            }

            if (!valid) {
                alert("Can't place ship here!");
                return;
            }

            targetCells.forEach(c => {
                c.classList.add('occupied');
                c.dataset.shipId = shipId;
                const block = document.createElement('div');
                block.classList.add('placed-block');
                c.appendChild(block);
            });

            draggingShip.remove();
            draggingShip = null;
        });
    });
}

function clearPreview(board) {
    board.querySelectorAll(".preview").forEach(cell => {
        cell.classList.remove("preview", "invalid");
    });
}
