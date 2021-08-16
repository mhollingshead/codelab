const connections = [];

function connect(id, username, roomname) {
    const user = { id, username, roomname };
    connections.push(user);
    return user;
}

function getUser(id) {
    return connections.find(user => user.id === id);
}

function disconnect(id) {
    const index = connections.findIndex(user => user.id === id);
    return connections.splice(index, 1)[0];
}

module.exports = { connect, getUser, disconnect };