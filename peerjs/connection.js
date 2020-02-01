let peer = new Peer();

// Get the peer id on connection with the server
peer.on("open", id => document.getElementById("user-peer-id").innerText = id);

// Handle errors when connecting
peer.on("error", err => {
    // Re-enable the connect button
    document.getElementById("connection-connect").disabled = false;

    // Change the status message
    let status = document.getElementById("connection-status");
    status.style.color = "red";
    status.innerText = "Not Connected";

    // Operate on the different error types
    switch (err.type) {
        case "browser-incompatible":
            alert("Your browser does not support some or all WebRTC features that we are trying to use.");
            break;
        case "disconnected":
            alert("You've already disconnected this peer from the server and can no longer make any new connections on it");
            break;
        case "invalid-id":
            alert("The provided ID contains illegal characters");
            break;
        case "network":
            alert("Lost or cannot establish a connection to the signalling server.");
            break;
        case "peer-unavailable":
            alert("The peer you're trying to connect to does not exist.");
            break;
        case "server-error":
            alert("Unable to reach the server.");
            break;
        case "socket-error":
            alert("Error from underlying socket. Reloading the page.");
            window.location.reload();
            break;
        case "socket-closed":
            alert("Underlying socket closed unexpectedly. Reloading the page.");
            window.location.reload();
            break;
        default:
            alert("A fatal error occurred. Reloading the page.");
            window.location.reload();
    }
});

// Stuff to run on a connection initiated by someone else
peer.on("connection", c => {
    // Register event handlers for:
    // Connection opening
    c.on("open", openHandler);
    // Connection closure
    c.on("close", closeHandler);
    // Connection error
    c.on("error", errorHandler);
    // Data from connection
    c.on("data", dataHandler);

    document.getElementById("chat-send").onclick = e => handleSendMessage(e, c);
});

// Handle submission of the other player's id
document.getElementById("connection-connect").onclick = () => {
    // Get id from text box
    let id = document.getElementById("connection-id").value;

    // Ensure exists
    if (id === "") {
        alert("Please enter the other person's Peer ID");
        return;
    }

    // Ensure not connecting to self
    if (id === peer.id) {
        alert("You're not allowed to connect to yourself");
        return;
    }

    // Disable the connect button
    document.getElementById("connection-connect").disabled = true;

    // Change status messsage
    let status = document.getElementById("connection-status");
    status.style.color = "yellow";
    status.innerText = "Connecting...";

    // Connect to the other peer
    let c = peer.connect(id);

    // Register event handlers for:
    // Connection opening
    c.on("open", openHandler);
    // Connection closure
    c.on("close", closeHandler);
    // Connection error
    c.on("error", errorHandler);
    // Data from connection
    c.on("data", dataHandler);

    document.getElementById("chat-send").onclick = e => handleSendMessage(e, c);
};
