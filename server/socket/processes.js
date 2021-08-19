const processes = {};

function removeProcess(processId) {
    delete processes[processId];
}

function writeInput(processId, input) {
    processes[processId] && processes[processId].stdin.write(input + '\n');
}

function killProcess(processId) {
    const child = processes[processId];
    if (child) {
        child.kill();
        removeProcess(processId);
    }
}

function addProcess(processId, child, user, socket, to) {
    child.stdout.on( 'data', data => {
        socket.emit("output", { data: data.toString() });
        (to === "all") && socket.broadcast.to(user.roomname).emit("output", { data: data.toString() });
    });

    child.stderr.on('data', data => {
        socket.emit("output", { data: data.toString(), error: true });
        child.kill();
        removeProcess(processId);
    });

    child.on('error', error => {
        console.log(error);
        child.kill();
        removeProcess(processId);
    });
    processes[processId] = child;
}

module.exports = { addProcess, removeProcess, killProcess, writeInput };