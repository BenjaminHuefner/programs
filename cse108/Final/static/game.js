const board = document.getElementById('game-board');
const gameStatus = document.getElementById('game-status');
const rows = 8;
const cols = 8;
let selectedPiece = null;
let currentPlayer = 'red';
let thisPlayerColor = 'red';
let redPieces = 12;
let blackPieces = 12;
let isMultiCapture = false;
let multiCapturePiece = null;

let lastRow =0;
let lastCol =0;
let nextRow=0;
let nextCol=0;

const socket = io({
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000
});

// Connection gate: 0 = not connected 
let connected = 0;

socket.on('connect', () => {
    console.log('Connected to server');
    connected = true;
});

// Handle connection error
socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    connected = false;
    showError('Failed to connect to server. Please refresh.');
});

// Handle disconnection
socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
    connected = false;
    
    if (reason === 'io server disconnect') {
        showError('Disconnected by server. Reconnecting...');
    }
});

socket.on('joined', (data) => {
    console.log(data);
    if(data[2]==1){
        startGame();
        // updateConnectionUI();
    }
    
});
window.onload = () => {
    // Show connecting screen by default
    // document.getElementById("connecting-screen").style.display = "flex";

        // Handle successful connection
    

    
    socket.emit('join');
    
};


// START GAME (once both players are connected)

function startGame() {
    // Initialize game
    setPlayerNames();

    // Load saved state or create new board
   
    const savedState = (typeof loadBoardState === "function") ? loadBoardState() : null;

    if (typeof createBoard === "function") {
        createBoard(savedState);
        if (isMultiCapture && multiCapturePiece) {
            selectPiece(multiCapturePiece);
        }
    }

    if (typeof updateGameStatus === "function") {
        updateGameStatus();
    }

    // document.getElementById("connecting-screen").style.display = "none";

    connected = 1;
}

// STOP CONNECTING
function stopConnecting() {
    window.location.href = "find_games.html";
}

// BLOCK INPUT IF NOT CONNECTED
// function handleSquareClick(e) {
//     if (connected === 0) return;
// }

// function getConnectedFromURL() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const c = parseInt(urlParams.get('connected'), 10);
//     return Number.isFinite(c) ? c : 0;
// }

// function updateConnectionUI() {
//     const connectingScreen = document.getElementById('connecting-screen');
//     const gameContainer = document.getElementById('game-container');

//     if (connected === 0) {
//         if (connectingScreen) connectingScreen.style.display = 'flex';
//         if (gameContainer) gameContainer.style.display = 'none';
//         if (board) board.style.pointerEvents = 'none';
//     } else {
//         if (connectingScreen) connectingScreen.style.display = 'none';
//         if (gameContainer) gameContainer.style.display = 'block';
//         if (board) board.style.pointerEvents = (connected === 1) ? 'auto' : 'none';
//     // updateConnectionUI();
//     }
// }

// game board creation
function createBoard(boardState = null) {
    board.innerHTML = '';
    
    // creates all squares first
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;
            board.appendChild(square);
            square.addEventListener('click', handleSquareClick);
        }
    }
    
    // restores from board state if provided
    if (boardState) {
        currentPlayer = boardState.currentPlayer;
        redPieces = boardState.redPieces;
        blackPieces = boardState.blackPieces;
        isMultiCapture = boardState.isMultiCapture || false;
        
        boardState.pieces.forEach(pieceData => {
            const square = document.querySelector(`[data-row='${pieceData.row}'][data-col='${pieceData.col}']`);
            const piece = document.createElement('div');
            piece.classList.add('piece');
            piece.classList.add(pieceData.color);
            if (pieceData.isKing) {
                piece.classList.add('king');
            }
            piece.dataset.row = pieceData.row;
            piece.dataset.col = pieceData.col;
            square.appendChild(piece);

            if (isMultiCapture && pieceData.isMultiCapturing) {
                multiCapturePiece = piece;
            }
        });
    } else {
        // Default board setup
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if ((row + col) % 2 !== 0 && (row < 3 || row > 4)) {
                    const square = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
                    const piece = document.createElement('div');
                    piece.classList.add('piece');
                    piece.classList.add(row < 3 ? 'black' : 'red');
                    piece.dataset.row = row;
                    piece.dataset.col = col;
                    square.appendChild(piece);
                }
            }
        }
    }
}

// click event handler
function handleSquareClick(e) {
    if(!connected){
        return;
    }
    const square = e.target.classList.contains('square') ? e.target : e.target.parentElement;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);

    if (selectedPiece) {
        if (selectedPiece === square.firstChild) {
            if (!isMultiCapture) {
                selectedPiece.classList.remove('selected');
                selectedPiece = null;
                clearAvailableMoves();
            }
        } else if (square.firstChild && square.firstChild.classList.contains('piece') && square.firstChild.classList.contains(currentPlayer)) {
            if (!isMultiCapture || square.firstChild === multiCapturePiece) {
                selectPiece(square.firstChild);
            }
        } else if (!square.firstChild && isValidMode(selectedPiece, row, col)) {
            movePiece(selectedPiece, row, col);
        }
    } else if (square.firstChild && square.firstChild.classList.contains('piece') && square.firstChild.classList.contains(currentPlayer)) {
        if (!isMultiCapture || square.firstChild === multiCapturePiece) {
            selectPiece(square.firstChild);
        }
    }
}

// piece selection
function selectPiece(piece) {
    if(!connected){
        return;
    }
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
                multiCapturePiece = piece;
                selectPiece(piece);
                saveBoardState();
                return;
            } else {
                isMultiCapture = false;
                multiCapturePiece = null;
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

// checks if a player has any valid moves available
function hasValidMoves(player) {
    const pieces = document.querySelectorAll(`.piece.${player}`);
    
    for (let piece of pieces) {
        const row = parseInt(piece.dataset.row);
        const col = parseInt(piece.dataset.col);
        const isKing = piece.classList.contains('king');
    
        const captures = getAvailableCapturesForPieces(piece);
        if (captures.length > 0) {
            return true;
        }
        
        const allCaptures = getAvailableCaptures(player);
        if (allCaptures.length === 0) {
            const directions = [
                {rowDir: 1, colDir: 1},
                {rowDir: 1, colDir: -1},
                {rowDir: -1, colDir: 1},
                {rowDir: -1, colDir: -1}
            ];
            
            for (let dir of directions) {
                if (!isKing) {
                    if ((player === 'red' && dir.rowDir > 0) || (player === 'black' && dir.rowDir < 0)) {
                        continue;
                    }
                }
                
                const newRow = row + dir.rowDir;
                const newCol = col + dir.colDir;
                
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                    const targetSquare = document.querySelector(`[data-row='${newRow}'][data-col='${newCol}']`);
                    if (targetSquare && !targetSquare.firstChild) {
                        return true;
                    }
                }
            }
        }
    }
    
    return false;
}

function checkWinCondition() {
    if (redPieces === 0) {
        const { blackPlayer } = getPlayerNames();
        showGameOverOverlay(blackPlayer, 'black', 'wins!');
        clearBoardState();
        endGame();
        return true;
    } else if (blackPieces === 0) {
        const { redPlayer } = getPlayerNames();
        showGameOverOverlay(redPlayer, 'red', 'wins!');
        clearBoardState();
        endGame();
        return true;
    }
    return false;
}

function endTurn() {
    isMultiCapture = false;
    multiCapturePiece = null;
    currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
    updateGameStatus();

    if (!hasValidMoves(currentPlayer)) {
        const { redPlayer, blackPlayer } = getPlayerNames();
        const winner = currentPlayer === 'red' ? blackPlayer : redPlayer;
        const winnerColor = currentPlayer === 'red' ? 'black' : 'red';
        showGameOverOverlay(winner, winnerColor, `wins! ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} has no valid moves.`);
        clearBoardState();
        endGame();
        return;
    }
    
    autoSelectIfCaptureAvailable();
    saveBoardState();
}

function updateGameStatus() {
    const { redPlayer, blackPlayer } = getPlayerNames();
    const currentPlayerName = currentPlayer === 'red' ? redPlayer : blackPlayer;
    const color = currentPlayer === 'red' ? 'red' : 'black';
    gameStatus.innerHTML = `<span style="color: ${color};">${currentPlayerName}'s</span> Turn`;
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

// Show game over overlay with winner message
function showGameOverOverlay(winnerName, winnerColor, additionalText) {
    const overlay = document.getElementById('game-over-overlay');
    const winnerMessage = document.getElementById('winner-message');
    winnerMessage.innerHTML = `<span style="color: ${winnerColor};">${winnerName}</span> ${additionalText}`;
    overlay.style.display = 'flex';
}

// Get current board state as JSON
function getBoardState() {
    const pieces = [];
    document.querySelectorAll('.piece').forEach(piece => {
        pieces.push({
            row: parseInt(piece.dataset.row),
            col: parseInt(piece.dataset.col),
            color: piece.classList.contains('red') ? 'red' : 'black',
            isKing: piece.classList.contains('king'),
            isMultiCapturing: piece === multiCapturePiece
        });
    });
    
    return {
        pieces: pieces,
        currentPlayer: currentPlayer,
        redPieces: redPieces,
        blackPieces: blackPieces,
        isMultiCapture: isMultiCapture
    };
}

// Save board state to localStorage
function saveBoardState() {
    const state = getBoardState();
    localStorage.setItem('checkersGameState', JSON.stringify(state));
}

// Load board state from localStorage
function loadBoardState() {
    const saved = localStorage.getItem('checkersGameState');
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

// Clear saved board state
function clearBoardState() {
    localStorage.removeItem('checkersGameState');
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

// Get player names from URL parameters
function getPlayerNames() {
    const urlParams = new URLSearchParams(window.location.search);
    const redPlayer = urlParams.get('redPlayer') || 'Red';
    const blackPlayer = urlParams.get('blackPlayer') || 'Black';
    return { redPlayer, blackPlayer };
}

// Set player names in the nav bar
function setPlayerNames() {
    const { redPlayer, blackPlayer } = getPlayerNames();
    const redNameElement = document.getElementById('red-player-name');
    const blackNameElement = document.getElementById('black-player-name');
    if (redNameElement) redNameElement.textContent = redPlayer;
    if (blackNameElement) blackNameElement.textContent = blackPlayer;
}



// Clear saved state when starting a new game
function startNewGame() {
    clearBoardState();
    currentPlayer = 'red';
    redPieces = 12;
    blackPieces = 12;
    isMultiCapture = false;
    multiCapturePiece = null;
    selectedPiece = null;
    board.style.pointerEvents = 'auto';
    createBoard();
    updateGameStatus();
};