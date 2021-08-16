const { connect, getUser, disconnect } = require('./connections');
const { spawn } = require('child_process');
const fs = require('fs');

const socketConnection = socket => {
    socket.on('join', ({ username, roomname }) => {
        const user = connect(socket.id, username, roomname);
        socket.join(user.roomname);
    });

    socket.on('javascript', ({ script }) => {
        const user = getUser(socket.id);
        socket.broadcast.to(user.roomname).emit("output", { data: script, vanillaJS: true });
    })

    socket.on('node', ({ script, to }) => {
        const user = getUser(socket.id);

        fs.writeFileSync(`./engines/node/${user.roomname+socket.id}.js`, script);

        let child = spawn('node', [`./engines/node/${user.roomname+socket.id}.js`]);

        child.stdout.on( "data", (data) => {
            socket.emit("output", { data: data.toString() });
            if (to === "all") {
                socket.broadcast.to(user.roomname).emit("output", { data: data.toString() });
            }
        });

        child.stderr.on('data', (data) => {
            socket.emit("output", { data: data.toString(), error: true });
            clearInterval(kill);
            child.kill();
        });

        child.on('error', (error) => {
            console.log(error);
            clearInterval(kill);
            child.kill();
        });

        child.on('exit', () => {
            clearInterval(kill);
            child.kill();
            fs.unlink(`./engines/node/${user.roomname+socket.id}.js`, () => {console.log(`Successfully deleted file ${user.roomname+socket.id}.js`)});
        });

        const kill = setTimeout(() => {
            child.kill();
            socket.emit("output", { data: "ERROR: 45000ms time limit exceeded.", error: true });
        }, 45000);
    });

    socket.on('lua', ({ script, to }) => {
        const user = getUser(socket.id);

        fs.writeFileSync(`./engines/lua/${user.roomname+socket.id}.lua`, script);

        let child = spawn('lua', [`./engines/lua/${user.roomname+socket.id}.lua`]);

        child.stdout.on( "data", (data) => {
            socket.emit("output", { data: data.toString() });
            if (to === "all") {
                socket.broadcast.to(user.roomname).emit("output", { data: data.toString() });
            }
        });

        child.stderr.on('data', (data) => {
            socket.emit("output", { data: data.toString(), error: true });
            clearInterval(kill);
            child.kill();
        });

        child.on('error', (error) => {
            console.log(error);
            clearInterval(kill);
            child.kill();
        });

        child.on('exit', () => {
            clearInterval(kill);
            child.kill();
            fs.unlink(`./engines/lua/${user.roomname+socket.id}.lua`, () => {console.log(`Successfully deleted file ${user.roomname+socket.id}.lua`)});
        });

        const kill = setTimeout(() => {
            child.kill();
            socket.emit("output", { data: "ERROR: 45000ms time limit exceeded.", error: true });
        }, 45000);
    });
    socket.on('python', ({ script, to }) => {
        const user = getUser(socket.id);

        fs.writeFileSync(`./engines/python/${user.roomname+socket.id}.py`, script);

        let child = spawn('python3', [`./engines/python/${user.roomname+socket.id}.py`]);

        child.stdout.on( "data", (data) => {
            socket.emit("output", { data: data.toString() });
            if (to === "all") {
                socket.broadcast.to(user.roomname).emit("output", { data: data.toString() });
            }
        });

        child.stderr.on('data', (data) => {
            socket.emit("output", { data: data.toString(), error: true });
            clearInterval(kill);
            child.kill();
        });

        child.on('error', (error) => {
            console.log(error);
            clearInterval(kill);
            child.kill();
        });

        child.on('exit', () => {
            clearInterval(kill);
            child.kill();
            fs.unlink(`./engines/python/${user.roomname+socket.id}.py`, () => {console.log(`Successfully deleted file ${user.roomname+socket.id}.py`)});
        });

        const kill = setTimeout(() => {
            child.kill();
            socket.emit("output", { data: "ERROR: 45000ms time limit exceeded.", error: true });
        }, 45000);
    });
    socket.on('disconnect', () => {
        disconnect(socket.id);
    });
}

module.exports = { socketConnection };