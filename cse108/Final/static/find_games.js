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

    // Placeholder behavior (wire this to Ben's backend later)
    displayMessage('message-display-findgames', `Joining ${hostName}'s game... (code: ${code || 'none'})`, 'success');
}

function refreshGames(){
    // Placeholder: later you can fetch /api/games and rebuild the tbody
    displayMessage('message-display-findgames', 'Refreshing game list... (placeholder)', 'success');
}
