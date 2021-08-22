const connections = {};

function connect(id, username, roomname) {
    const user = { username, roomname };
    connections[id] = user;
    console.log("User connected:", connections);
    return user;
}

function getUser(id) {
    console.log(connections);
    return connections[id];
}

function changeUsername(id, newUsername) {
    connections[id].username = newUsername;
    return connections[id];
}

function disconnect(id) {
    console.log("disconnecting");
    delete connections[id];
}

module.exports = { connect, getUser, changeUsername, disconnect };