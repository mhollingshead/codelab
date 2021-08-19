const connections = [];

function connect(id, username, roomname) {
    const user = { id, username, roomname };
    connections.push(user);
    console.log("User connected:", connections);
    return user;
}

function getUser(id) {
    console.log(connections);
    return connections.find(user => user.id === id);
}

function getUsersInRoom(roomname) {
    return connections.filter(user => user.roomname = roomname);
}

function disconnect(id) {
    console.log("disconnecting");
    const index = connections.findIndex(user => user.id === id);
    return connections.splice(index, 1)[0];
}

module.exports = { connect, getUser, getUsersInRoom, disconnect };