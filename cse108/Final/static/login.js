

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
        displayMessage('message-display-login', 'Please enter username and password.', 'error')
        return;
    }
    else {
        const loginForm = document.getElementById('loginForm');
        loginForm.submit();
        console.log("submitted form");
        
    }
}

function signup(){
    const signupForm = document.getElementById('signupForm');
    const name = document.getElementById('newusername').value;
    const password = document.getElementById('newpassword').value;
    const confirmpassword = document.getElementById('confirmpassword').value;
    if (!name || !password){
        displayMessage('message-display-signup', 'Please enter a username and password', 'error')
        return
    }
    else if (password != confirmpassword){
        displayMessage('message-display-signup', 'Passwords do not match!', 'error')
        return
    }
    // else if (name in database) {
    //     displayMessage('message-display-signup', 'Username already exists!', 'error')
    //     return
    // }
    else {
    signupForm.submit();
    console.log("submitted form");        
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    if (form) {
        form.addEventListener('submit', (e) => { 
            e.preventDefault();
            const name = document.getElementById('newusername').value;
            const password = document.getElementById('newpassword').value;
            const confirmpassword = document.getElementById('confirmpassword').value;
            if (!name || !password){
                displayMessage('message-display-signup', 'Please enter a username and password', 'error')
                return
            }
            else if (password != confirmpassword){
                displayMessage('message-display-signup', 'Passwords do not match!', 'error')
                return
            }
            // else if (name in database) {
            //     displayMessage('message-display-signup', 'Username already exists!', 'error')
            //     return
            // }
            else {
            form.submit();
            console.log("submitted form");
            }
        });
    }
});


function invalidLogin(){
    displayMessage('message-display-login', 'Invalid username or password.', 'error')
        return;
}