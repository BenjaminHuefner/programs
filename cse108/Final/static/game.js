const board = document.getElementById('game-board');
const gameStatus = document.getElementById('game-status');
const rows = 8;
const cols = 8;
let selectedPiece = null;
let currentPlayer = 'red';
let redPieces = 12;
let blackPieces = 12;
let isMultiCapture = false;

// game board creation
function createBoard() {
    board.innerHTML = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;
            board.appendChild(square);

            if ((row + col) % 2 !== 0 && (row < 3 || row > 4)) {
                const piece = document.createElement('div');
                piece.classList.add('piece');
                piece.classList.add(row < 3 ? 'black' : 'red');
                piece.dataset.row = row;
                piece.dataset.col = col;

                square.appendChild(piece);
            }

            square.addEventListener('click', handleSquareClick);
        }
    }
}

// click event handler
function handleSquareClick(e) {
    const square = e.target.classList.contains('square') ? e.target : e.target.parentElement;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);

    if (selectedPiece) {
        if (selectedPiece === square.firstChild) {
            selectedPiece.classList.remove('selected');
            selectedPiece = null;
            clearAvailableMoves();
        } else if (square.firstChild && square.firstChild.classList.contains('piece') && square.firstChild.classList.contains(currentPlayer)) {
            selectPiece(square.firstChild);
        } else if (!square.firstChild && isValidMode(selectedPiece, row, col)) {
            movePiece(selectedPiece, row, col);
        }
    } else if (square.firstChild && square.firstChild.classList.contains('piece') && square.firstChild.classList.contains(currentPlayer)) {
            selectPiece(square.firstChild);
    }
}

// piece selection
function selectPiece(piece) {
    if (selectedPiece) {
        selectedPiece.classList.remove('selected');
        clearAvailableMoves();
    }
    piece.classList.add('selected');
    selectedPiece = piece;
    showAvailableMoves(piece);
}

// CSS
function clearAvailableMoves() {
    const highlightedSquares = document.querySelectorAll('.square.available-move');
    highlightedSquares.forEach(square => square.classList.remove('available-move'));
}

// CSS
function showAvailableMoves(piece) {
    const row = parseInt(piece.dataset.row);
    const col = parseInt(piece.dataset.col);
    const captureMoves = getAvailableCaptures(currentPlayer);
    
    const directions = [
        {rowDir: 1, colDir: 1},
        {rowDir: 1, colDir: -1},
        {rowDir: -1, colDir: 1},
        {rowDir: -1, colDir: -1}
    ];
    
    directions.forEach(dir => {
        if (captureMoves.length === 0) {
            const newRow = row + dir.rowDir;
            const newCol = col + dir.colDir;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                if (isValidMode(piece, newRow, newCol)) {
                    const square = document.querySelector(`[data-row='${newRow}'][data-col='${newCol}']`);
                    if (square && !square.firstChild) {
                        square.classList.add('available-move');
                    }
                }
            }
        }
        const captureRow = row + 2 * dir.rowDir;
        const captureCol = col + 2 * dir.colDir;
        if (captureRow >= 0 && captureRow < rows && captureCol >= 0 && captureCol < cols) {
            if (isValidMode(piece, captureRow, captureCol)) {
                const square = document.querySelector(`[data-row='${captureRow}'][data-col='${captureCol}']`);
                if (square && !square.firstChild) {
                    square.classList.add('available-move');
                }
            }
        }
    });
}

// determines whether a move is valid
function isValidMode(piece, row, col) {
    const oldRow = parseInt(piece.dataset.row);
    const oldCol = parseInt(piece.dataset.col);
    const moveRow = row - oldRow;
    const moveCol = col - oldCol;

    const captureMoves = getAvailableCaptures(currentPlayer);
    const isCapture = Math.abs(moveRow) === 2 && Math.abs(moveCol) === 2;

    if (captureMoves.length > 0 && !isCapture) {
        return false;
    }

    if (!piece.classList.contains('king') && !isMultiCapture) {
        if ((currentPlayer === 'red' && moveRow > 0) || (currentPlayer === 'black' && moveRow < 0)) {
            return false;
        }
    }

    if (isCapture) {
        const middleRow = oldRow + moveRow / 2;
        const middleCol = oldCol + moveCol / 2;
        const middleSquare = document.querySelector(`[data-row='${middleRow}'][data-col='${middleCol}']`);

        if (middleSquare.firstChild && middleSquare.firstChild.classList.contains('piece') && !middleSquare.firstChild.classList.contains(currentPlayer)) {
            return true;
        }
    } else if (Math.abs(moveRow) === 1 && Math.abs(moveCol) === 1) {
        return true;
    }

    return false;
}

// detects whether movement is a capture or regular move
function movePiece(piece, row, col) {
    const oldRow = parseInt(piece.dataset.row);
    const oldCol = parseInt(piece.dataset.col);
    const targetSquare = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    const moveRow = row - oldRow;
    const moveCol = col - oldCol;

    const isCapture = Math.abs(moveRow) === 2 && Math.abs(moveCol) === 2;

    if (isCapture) {
        const middleRow = oldRow + moveRow / 2;
        const middleCol = oldCol + moveCol / 2;
        const middleSquare = document.querySelector(`[data-row='${middleRow}'][data-col='${middleCol}']`);
        if (middleSquare.firstChild && middleSquare.firstChild.classList.contains('piece') && !middleSquare.firstChild.classList.contains(currentPlayer)) {
            middleSquare.removeChild(middleSquare.firstChild);
            currentPlayer === 'red' ? blackPieces-- : redPieces--;
            performMove(piece, targetSquare, row, col);

            const furtherCaptures = getAvailableCapturesForPieces(piece);
            if (furtherCaptures.length > 0) {
                isMultiCapture = true;
                selectPiece(piece);
                return;
            } else {
                isMultiCapture = false;
            }
        }
    } else {
        performMove(piece, targetSquare, row, col);
    }
    
    if (!checkWinCondition()) {
        endTurn();
    }
}

// moves target piece to square and saves position
function performMove(piece, targetSquare, row, col) {
    targetSquare.appendChild(piece);
    piece.dataset.row = row;
    piece.dataset.col = col;
    piece.classList.remove('selected');
    selectedPiece = null;
    clearAvailableMoves();

    if ((row === 0 && currentPlayer === 'red') || (row === 7 && currentPlayer === 'black')) {
        piece.classList.add('king');
    }

    checkWinCondition();
}

// detects all possible capture moves for a specific player
function getAvailableCaptures(player) {
    let captures = [];
    const pieces = document.querySelectorAll(`.piece.${player}`);
    pieces.forEach(piece => {captures = captures.concat(getAvailableCapturesForPieces(piece));});
    return captures;
}

// finds all possible capture moves for a specific piece
function getAvailableCapturesForPieces(piece) {
    const row = parseInt(piece.dataset.row);
    const col = parseInt(piece.dataset.col);
    const isKing = piece.classList.contains('king');
    const pieceColor = piece.classList.contains('red') ? 'red' : 'black';
    
    const directions = [
        {rowDir: 1, colDir: 1},
        {rowDir: 1, colDir: -1},
        {rowDir: -1, colDir: 1},
        {rowDir: -1, colDir: -1}
    ];
    const captures = [];
    directions.forEach(direction => {
        if (!isKing) {
            if ((pieceColor === 'red' && direction.rowDir > 0) || 
                (pieceColor === 'black' && direction.rowDir < 0)) {
                return;
            }
        }
        
        const targetRow = row + 2 * direction.rowDir;
        const targetCol = col + 2 * direction.colDir;
        const middleRow = row + direction.rowDir;
        const middleCol = col + direction.colDir;
        const targetSquare = document.querySelector(`[data-row='${targetRow}'][data-col='${targetCol}']`);
        const middleSquare = document.querySelector(`[data-row='${middleRow}'][data-col='${middleCol}']`);

        if (targetSquare && middleSquare && !targetSquare.firstChild && middleSquare.firstChild && middleSquare.firstChild.classList.contains('piece') && !middleSquare.firstChild.classList.contains(pieceColor)) {
            captures.push({piece, targetRow, targetCol});
        }
    });
    return captures;
}

function checkWinCondition() {
    if (redPieces === 0) {
        gameStatus.innerText = "Black wins!";
        endGame();
        return true;
    } else if (blackPieces === 0) {
        gameStatus.innerText = "Red wins!";
        endGame();
        return true;
    }
    return false;
}

function endTurn() {
    currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
    updateGameStatus();
    autoSelectIfCaptureAvailable();
}

function updateGameStatus() {
    gameStatus.innerText = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`;
}

function autoSelectIfCaptureAvailable() {
    const captureMoves = getAvailableCaptures(currentPlayer);
    if (captureMoves.length > 0) {
        const firstCapturePiece = captureMoves[0].piece;
        selectPiece(firstCapturePiece);
    }
}

function endGame() {
    board.style.pointerEvents = 'none';
}

// Asks confirmation from user before logging out the page
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to leave this game? This will result in a loss.')) {
                e.preventDefault();
            }
        });
    });
});

createBoard();
updateGameStatus();