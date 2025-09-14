import { boardRowTileCount, boardColumnTileCount, captains } from './constants.js';
import { gameStarted } from './dev.js';

let draggingShip = null;            // currently dragged ship element
let lastHoverIndex = null;          // last hovered cell index while dragging
let lastHoverValid = false;         // whether last hover placement was valid
let playerBoard = null;             // reference to player board element

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

document.addEventListener('keydown', (e) => {
    if (!draggingShip) return;
    if (e.key.toLowerCase() === 'r') {
        toggleOrientation(draggingShip);
        if (lastHoverIndex !== null)
            updatePreviewFromIndex(playerBoard, lastHoverIndex, draggingShip);
    }
});

function startGame(difficulty) {
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "flex";

    createBoard("player-board");
    createBoard("ai-board");

    playerBoard = document.getElementById("player-board");

    createShips();
}

function createBoard(boardId) {
    const board = document.getElementById(boardId);
    board.innerHTML = "";

    for (let i = 0; i < 100; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i.toString();
        cell.dataset.row = Math.floor(i / 10).toString();
        cell.dataset.col = (i % 10).toString();
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
        ship.dataset.size = String(shipData.size);
        ship.dataset.name = shipData.name;
        ship.dataset.id = `ship-${index}`;
        ship.dataset.orientation = "horizontal";

        for (let i = 0; i < shipData.size; i++) { //ship cells
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

        ship.addEventListener('click', (ev) => {
            ev.preventDefault();
            toggleOrientation(ship);
        });

        ship.style.touchAction = "none"; // prevent touch scrolling while dragging

        ship.addEventListener('pointerdown', (e) => {
            draggingShip = ship;
            ship.classList.add('dragging');
            ship.classList.toggle('vertical', ship.dataset.orientation === 'vertical');

            try { ship.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }

            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);

            lastHoverIndex = null;
            lastHoverValid = false;
            updateOrientationIndicator(ship.dataset.orientation);
        });
    });
}

function toggleOrientation(ship) {
    const cur = ship.dataset.orientation === 'vertical' ? 'vertical' : 'horizontal';
    const next = cur === 'horizontal' ? 'vertical' : 'horizontal';
    ship.dataset.orientation = next;
    ship.classList.toggle('vertical', next === 'vertical');
    updateOrientationIndicator(next);
}

function updateOrientationIndicator(orientation) {
    const el = document.getElementById('orientationIndicator');
    if (!el) return;
    if (orientation) el.textContent = (orientation === 'horizontal') ? 'H' : 'V';
    else el.textContent = 'H';
}

function onPointerMove(e) {
    if (!draggingShip || !playerBoard) return;
    e.preventDefault();

    const el = document.elementFromPoint(e.clientX, e.clientY);
    const cell = el ? el.closest('.cell') : null;
    if (!cell || !playerBoard.contains(cell)) {
        clearPreview(playerBoard);
        lastHoverIndex = null;
        lastHoverValid = false;
        return;
    }

    const index = parseInt(cell.dataset.index, 10);
    if (index === lastHoverIndex) return;

    lastHoverIndex = index;
    updatePreviewFromIndex(playerBoard, index, draggingShip);
}

function onPointerUp(e) {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

    if (!draggingShip || !playerBoard) {
        draggingShip = null;
        lastHoverIndex = null;
        lastHoverValid = false;
        updateOrientationIndicator('horizontal');
        return;
    }

    if (lastHoverIndex === null || !lastHoverValid) {
        clearPreview(playerBoard);
        draggingShip.classList.remove('dragging');
        draggingShip = null;
        lastHoverIndex = null;
        lastHoverValid = false;
        updateOrientationIndicator('horizontal');
        return;
    }

    const size = parseInt(draggingShip.dataset.size, 10);
    const orientation = draggingShip.dataset.orientation || 'horizontal';
    const { cells, valid } = computeTargetCells(playerBoard, lastHoverIndex, size, orientation);

    if (!valid || !cells || cells.length === 0) {
        alert("Can't place ship here!");
        clearPreview(playerBoard);
        draggingShip.classList.remove('dragging');
        draggingShip = null;
        lastHoverIndex = null;
        lastHoverValid = false;
        updateOrientationIndicator('horizontal');
        return;
    }

    const shipId = draggingShip.dataset.id;
    cells.forEach(c => {
        c.classList.add('occupied');
        c.dataset.shipId = shipId;
        const block = document.createElement('div');
        block.classList.add('placed-block');
        c.appendChild(block);
    });

    draggingShip.remove();

    clearPreview(playerBoard);
    draggingShip = null;
    lastHoverIndex = null;
    lastHoverValid = false;
    updateOrientationIndicator('horizontal');
}

function computeTargetCells(board, startIndex, size, orientation) {
    const row = Math.floor(startIndex / 10);
    const col = startIndex % 10;
    const cells = [];
    let valid = true;

    if (orientation === 'horizontal') {
        if (col + size > 10) valid = false;
        for (let i = 0; i < size; i++) {
        const idx = row * 10 + (col + i);
        const c = board.children[idx];
        if (!c) { valid = false; break; }
        if (c.classList.contains('occupied')) valid = false;
        cells.push(c);
        }
    } else { // vertical
        if (row + size > 10) valid = false;
        for (let i = 0; i < size; i++) {
        const idx = (row + i) * 10 + col;
        const c = board.children[idx];
        if (!c) { valid = false; break; }
        if (c.classList.contains('occupied')) valid = false;
        cells.push(c);
        }
    }

    return { cells, valid };
}

function updatePreviewFromIndex(board, startIndex, ship) {
    clearPreview(board);
    const size = parseInt(ship.dataset.size, 10);
    const orientation = ship.dataset.orientation || 'horizontal';
    const { cells, valid } = computeTargetCells(board, startIndex, size, orientation);
    if (!cells || cells.length === 0) {
        lastHoverValid = false;
        return;
    }
    cells.forEach(c => c.classList.add('preview'));
    if (!valid) cells.forEach(c => c.classList.add('invalid'));
    lastHoverValid = valid;
}

function clearPreview(board) {
    board.querySelectorAll(".preview").forEach(cell => {
        cell.classList.remove("preview", "invalid");
    });
}
