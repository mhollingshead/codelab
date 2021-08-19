const { connect, getUser, getUsersInRoom, disconnect } = require('./connections');
const { killProcess, addProcess, removeProcess, writeInput } = require('./processes');
const { spawn, exec } = require('child_process');
const fs = require('fs');

const handleConnection = socket => {
    socket.on('join', ({ username, roomname }) => {
        const user = connect(socket.id, username, roomname);
        socket.join(user.roomname);
    });

    socket.on('kill process', () => {
        const user = getUser(socket.id);
        killProcess(user.roomname + socket.id);
    });

    socket.on('javascript', ({ script }) => {
        const user = getUser(socket.id);
        socket.broadcast.to(user.roomname).emit("output", { data: script, vanillaJS: true });
    })

    socket.on('node', ({ script, to }) => {
        const user = getUser(socket.id);
        const processId = user.roomname + socket.id;

        fs.writeFileSync(`./engines/node/${processId}.js`, script);
        const child = spawn('node', [`./engines/node/${processId}.js`]);

        addProcess(processId, child, user, socket, to);
        (to === "all") && socket.broadcast.to(user.roomname).emit("foreign process", {user: user, time: new Date()});

        child.on('exit', () => {
            child.kill();
            removeProcess(processId);
            fs.unlink(`./engines/node/${processId}.js`, () => {console.log(`Successfully deleted file ${processId}.js`)});
            socket.emit("process finished");
            (to === "all") && socket.broadcast.to(user.roomname).emit("process finished");
        });
    });

    socket.on('lua', ({ script, to }) => {
        const user = getUser(socket.id);
        const processId = user.roomname + socket.id;

        fs.writeFileSync(`./engines/lua/${processId}.lua`, script);
        const child = spawn('lua', [`./engines/lua/${processId}.lua`]);

        addProcess(processId, child, user, socket, to);
        (to === "all") && socket.broadcast.to(user.roomname).emit("foreign process", {user: user, time: new Date()});

        child.on('exit', () => {
            child.kill();
            removeProcess(processId);
            fs.unlink(`./engines/lua/${processId}.lua`, () => {console.log(`Successfully deleted file ${processId}.lua`)});
            socket.emit("process finished");
            (to === "all") && socket.broadcast.to(user.roomname).emit("process finished");
        });
    });

    socket.on('python', ({ script, to }) => {
        const user = getUser(socket.id);
        const processId = user.roomname + socket.id;

        fs.writeFileSync(`./engines/python/${processId}.py`, script);
        const child = spawn('python3', [`./engines/python/${processId}.py`]);

        addProcess(processId, child, user, socket, to);
        (to === "all") && socket.broadcast.to(user.roomname).emit("foreign process", {user: user, time: new Date()});

        child.on('exit', () => {
            child.kill();
            removeProcess(processId);
            fs.unlink(`./engines/python/${processId}.py`, () => {console.log(`Successfully deleted file ${processId}.py`)});
            socket.emit("process finished");
            (to === "all") && socket.broadcast.to(user.roomname).emit("process finished");
        });
    });

    socket.on('ocaml', ({ script, to }) => {
        const user = getUser(socket.id);
        const processId = user.roomname + socket.id;

        fs.writeFileSync(`./engines/ocaml/${user.roomname+socket.id}.ml`, script);
        const child = spawn('ocaml', [`./engines/ocaml/${user.roomname+socket.id}.ml`]);

        addProcess(processId, child, user, socket, to);
        (to === "all") && socket.broadcast.to(user.roomname).emit("foreign process", {user: user, time: new Date()});

        child.on('exit', () => {
            child.kill();
            removeProcess(processId);
            fs.unlink(`./engines/ocaml/${processId}.ml`, () => {console.log(`Successfully deleted file ${processId}.ml`)});
            socket.emit("process finished");
            (to === "all") && socket.broadcast.to(user.roomname).emit("process finished");
        });
    });

    socket.on('sh', ({ script, to }) => {
        const user = getUser(socket.id);
        const processId = user.roomname + socket.id;

        fs.writeFileSync(`./engines/sh/${processId}.sh`, script);

        exec('chmod', ['-x', `./engines/sh/${processId}.sh`]);
        const child = spawn('sh', [`./engines/sh/${processId}.sh`]);

        addProcess(processId, child, user, socket, to);
        (to === "all") && socket.broadcast.to(user.roomname).emit("foreign process", {user: user, time: new Date()});

        child.on('exit', () => {
            child.kill();
            removeProcess(processId);
            fs.unlink(`./engines/sh/${processId}.sh`, () => {console.log(`Successfully deleted file ${processId}.ml`)});
            socket.emit("process finished");
            (to === "all") && socket.broadcast.to(user.roomname).emit("process finished");
        });
    });

    socket.on('input', ({ input, toAll }) => {
        const user = getUser(socket.id);
        const processId = user.roomname + socket.id;
        socket.emit("output", { data: input })
        toAll && socket.broadcast.to(user.roomname).emit("output", { data: input });
        writeInput(processId, input);
    })

    socket.on('message', message => {
        socket.broadcast.to(getUser(socket.id).roomname).emit("incoming message", message);
    });

    socket.on('disconnect', () => {
        disconnect(socket.id);
    });
}

module.exports = { handleConnection };