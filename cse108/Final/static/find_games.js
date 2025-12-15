// Track if user has an active game
// let userHasActiveGame = false;
let userGameRow = null;
const url = "http://127.0.0.1:5000/"

let games = [{
        username: 'test1',
        codeReq: true
    },{
        username: 'test2',
        codeReq: false
    },{
        username: 'test3',
        codeReq: true
    }
];

function displayMessage(elementID, message, type){
    const element = document.getElementById(elementID);
    element.innerHTML = `<div class="message ${type}">${message}</div>`;
    const messageDiv = element.firstElementChild;
    messageDiv.style.opacity = '1';
    setTimeout(() => {
        messageDiv.style.opacity = '0';
    }, 100);
}

function joinGame(hostName, btn){
    // Grab the code input from the same row as the clicked button
    const row = btn.closest('tr');
    const codeInput = row ? row.querySelector('.code-input') : null;
    const code = codeInput ? codeInput.value.trim() : '';
    
    const requiresCode = codeInput !== null;
    
    if (requiresCode && !code) {
        displayMessage('message-display-findgames', 'A code is required to join this game', 'error');
        return;
    }
    
    // if (requiresCode && code) {
        // const correctCode ="1"; //row.dataset.gameCode;
        // if (correctCode && code !== correctCode) {
        //     displayMessage('message-display-findgames', 'The code you inputted is incorrect', 'error');
        //     return;
        // }
        fetch(url+"joinGame", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({hostName:hostName,gameCode: code})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP Error: "+response.status);
            }
            return response.text();
        })
        .then(data => {
            if(data && data!="0" && data!="1"){
                displayMessage('message-display-findgames', `Joining ${hostName}'s game... (code: ${code || 'none'})`, 'success');
                window.location.href = url+"game_redirect";
            }
            if(data && data=="0"){
                displayMessage('message-display-findgames', 'Incorrect code', 'error');
            }
            if(data && data=="1"){
                displayMessage('message-display-findgames', 'Game not found', 'error');
            }
            console.log("Success:", data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    // }

    // Placeholder behavior (wire this to Ben's backend later)
}

function refreshGames(){
    // Placeholder: later you can fetch /api/games and rebuild the tbody
    // displayMessage('message-display-findgames', 'Refreshing game list... (placeholder)', 'success');
    fetch(url+"getGames", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP Error: "+response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log("Success:", data);
        if(data && data!="0"){
            games = data;
                
            deleteTable();
            games.forEach(game => {
                addGameToTable(game.username, game.codeReq);
            });

        }else{
            games = [];
        }
      })
    .catch((error) => {
        console.error("Error:", error);
    });
}

// GAME CREATION
function createGame() {
    // Check if user already has an active game
    // if (userHasActiveGame) {
    //     displayMessage('message-display-findgames', 'You already have an active game. Delete it before creating a new one.', 'error');
    //     return;
    // }
    
    const overlay = document.getElementById('create-game-overlay');
    overlay.style.display = 'flex';
}

function closeCreateGameOverlay() {
    const overlay = document.getElementById('create-game-overlay');
    overlay.style.display = 'none';

    document.getElementById('require-code-checkbox').checked = false;
    document.getElementById('game-code-input').value = '';
    document.getElementById('code-input-container').style.display = 'none';
}

function toggleCodeInput() {
    const checkbox = document.getElementById('require-code-checkbox');
    const codeContainer = document.getElementById('code-input-container');
    codeContainer.style.display = checkbox.checked ? 'flex' : 'none';
}


// Game creation


function handleCreateGame() {
    const requiresCode = document.getElementById('require-code-checkbox').checked;
    const gameCode = document.getElementById('game-code-input').value.trim();
    
    if (requiresCode && !gameCode) {
        displayMessage('message-display-creategame', 'Please enter a code for your game', 'error');
        return;
    }
    
    closeCreateGameOverlay();
    
    // Get username (placeholder - replace with actual logged-in user)
    // const username = 'You';
    
    // Add game to table
    // addGameToTable(username, requiresCode, gameCode, true);
    // games.push({
    //     username: username,
    //     codeReq: requiresCode
    // });
    fetch(url+"createGame", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({codeRequired: requiresCode, gameCode: gameCode})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP Error: "+response.status);
        }
        return response.text();
      })
      .then(data => {
        if(data && data!="0"){
            window.location.href = url+"game_redirect";
        }
        console.log("Success:", data);
      })
    .catch((error) => {
        console.error("Error:", error);
    });

    // refreshGames();
    
    // Mark that user has an active game
    // userHasActiveGame = true;
    
    const codeMessage = requiresCode ? 'with code required' : 'open to all';
    displayMessage('message-display-findgames', `Game created ${codeMessage}!`, 'success');
    
    // TODO: Make API call to create game on backend with requiresCode and gameCode parameters
}

function deleteTable(){
    
    const tbody = document.getElementById('find-games-body');
    tbody.innerHTML = '';
}

function addGameToTable(hostName, requiresCode) {
    const tbody = document.getElementById('find-games-body');
    const row = document.createElement('tr');
    
    // // Store game code in data attribute for validation
    // if (requiresCode && gameCode) {
    //     row.dataset.gameCode = gameCode;
    // }
    
    // // Store reference if this is user's game
    // if (isUserGame) {
    //     userGameRow = row;
    // }
    
    // Host name column
    const hostCell = document.createElement('td');
    hostCell.textContent = hostName;
    row.appendChild(hostCell);
    
    // Code column
    const codeCell = document.createElement('td');
    if (requiresCode) {
        const codeInput = document.createElement('input');
        codeInput.type = 'text';
        codeInput.className = 'code-input';
        codeInput.placeholder = 'Enter code...';
        codeCell.appendChild(codeInput);
    }
    row.appendChild(codeCell);
    
    // Join column
    const joinCell = document.createElement('td');
    const actionButton = document.createElement('button');
    actionButton.className = 'button';
    
    // if (isUserGame) {
    //     // Delete button for user's own game
    //     actionButton.textContent = 'X';
    //     actionButton.classList.add('delete-button');
    //     actionButton.onclick = function() {
    //         deleteGame(row);
    //     };
    // } else {

        actionButton.textContent = 'Join';
        actionButton.onclick = function() {
            joinGame(hostName, this);
        };
    // }
    
    joinCell.appendChild(actionButton);
    row.appendChild(joinCell);
    
    // Adds this game to the top of the table
    tbody.insertBefore(row, tbody.firstChild);
}

// function deleteGame(row) {
//     // Remove the row from the table
//     row.remove();
    
//     // Reset user's active game status
//     userHasActiveGame = false;
//     userGameRow = null;
    
//     displayMessage('message-display-findgames', 'Game deleted successfully', 'success');
    
//     // TODO: Make API call to delete game from backend
// }