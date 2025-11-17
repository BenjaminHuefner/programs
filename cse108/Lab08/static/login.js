function displayMessage(elementID, message, type){
    const element = document.getElementById(elementID);
    element.innerHTML = `<div class="message ${type}">${message}</div>`;
    const messageDiv = element.firstElementChild;
    messageDiv.style.opacity = '1';
    setTimeout(() => {
        messageDiv.style.opacity = '0';
    }, 100);
}

function signin(){
    const name = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!name || !password){
        displayMessage('message-display', 'Please enter username and password.', 'error')
        return;
    }
    else {
        const loginForm = document.getElementById('loginForm');
        loginForm.submit();
        console.log("submitted form");
        
    }
}

function invalidLogin(){
    displayMessage('message-display', 'Invalid username or password.', 'error')
        return;
}