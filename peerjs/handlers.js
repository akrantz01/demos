// Handle a connection getting opened
function openHandler() {
    // Disable the id input
    document.getElementById("connection-id").disabled = true;

    // Enable the chat bar and send button
    document.getElementById("chat-message").disabled = false;
    document.getElementById("chat-send").disabled = false;

    // Change the status message
    let status = document.getElementById("connection-status");
    status.style.color = "green";
    status.innerText = "Connected";
}

// Handle any incoming data
function dataHandler(data) {
    // Operate on different message types
    switch (data.type) {
        case "chat":
            // Add message to the log
            let log = document.getElementById("chat-log");
            log.innerHTML = `<p class="chat-message"><span class="from-other-person">Other Person:</span> ${data.message}</p><hr/>` + log.innerHTML;
            break;

        default:
            console.error(`Invalid data type '${data.type}': ${JSON.stringify(data)}`)
    }
}

// Handle the closure of the connection
function closeHandler() {
    alert("The other person has quit. The page will be refreshed.");
    window.location.reload();
}

// Handle any error occurring in the connection
function errorHandler(e) {
    alert(`An error occurred while playing: ${e}. The page will be refreshed.`);
    window.location.reload();
}

// Handle sending a chat message
function handleSendMessage(e, c) {
    // Disable chat if disconnected
    if (peer.disconnected) {
        e.target.disabled = true;
        document.getElementById("chat-message").disabled = true;
    }

    // Ensure message present
    let message = document.getElementById("chat-message").value;
    if (message === "") return;

    // Escape html in message
    message = message.replace(">", "&gt").replace("<", "&lt");

    // Send the message
    c.send({"type": "chat", "message": message});

    // Add message to self log
    let log = document.getElementById("chat-log");
    log.innerHTML = `<p class="chat-message"><span class="from-self">You:</span> ${message}</p><hr/>` + log.innerHTML;
}
