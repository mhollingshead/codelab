const { connect, getUser, disconnect, changeUsername } = require('./connections');
const { killProcess, addProcess, removeProcess, writeInput } = require('./processes');
const { spawn, exec } = require('child_process');
const fs = require('fs');

const handleConnection = socket => {
    socket.on('join', ({ username, roomname }) => {
        const user = connect(socket.id, username, roomname);
        socket.join(user.roomname);
    });

    socket.on('username change', ({ oldUsername, newUsername }) => {
        const user = changeUsername(socket.id, newUsername);
        socket.emit("update username", { oldUsername, newUsername });
        socket.broadcast.to(user.roomname).emit("update username", { oldUsername, newUsername });
    })

    socket.on('kill process', () => {
        const user = getUser(socket.id);
        killProcess(user.roomname + socket.id);
    });

    socket.on('javascript', ({ script }) => {
        const user = getUser(socket.id);
        socket.broadcast.to(user.roomname).emit("foreign process", {user: user, time: new Date()});
        socket.broadcast.to(user.roomname).emit("output", { data: script, vanillaJS: true });
    })

    socket.on('node', ({ script, to, args }) => {
        const user = getUser(socket.id);
        const processId = user.roomname + socket.id;
        const dir = `./engines/node/${user.roomname}/${socket.id}`;

        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}/main.js`, script);
        const child = spawn('node', [`main.js`, ...args], { cwd: dir });

        addProcess(processId, child, user, socket, to);
        (to === "all") && socket.broadcast.to(user.roomname).emit("foreign process", {user: user, time: new Date()});

        child.on('exit', () => {
            child.kill();
            removeProcess(processId);
            fs.rmdir(`./engines/node/${user.roomname}`, { recursive: true, force: true }, () => console.log(`Successfully deleted dir: ${dir}`));
            socket.emit("process finished");
            (to === "all") && socket.broadcast.to(user.roomname).emit("process finished");
        });
    });

    socket.on('lua', ({ script, to, args }) => {
        const user = getUser(socket.id);
        const processId = user.roomname + socket.id;
        const dir = `./engines/lua/${user.roomname}/${socket.id}`;

        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}/main.lua`, script);
        const child = spawn('lua', [`main.lua`, ...args], { cwd: dir });

        addProcess(processId, child, user, socket, to);
        (to === "all") && socket.broadcast.to(user.roomname).emit("foreign process", {user: user, time: new Date()});

        child.on('exit', () => {
            child.kill();
            removeProcess(processId);
            fs.rmdir(`./engines/lua/${user.roomname}`, { recursive: true, force: true }, () => console.log(`Successfully deleted dir: ${dir}`));
            socket.emit("process finished");
            (to === "all") && socket.broadcast.to(user.roomname).emit("process finished");
        });
    });

    socket.on('python', ({ script, to, args }) => {
        const user = getUser(socket.id);
        const processId = user.roomname + socket.id;
        const dir = `./engines/python/${user.roomname}/${socket.id}`;

        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}/main.py`, script);
        const child = spawn('python3', [`main.py`, ...args], { cwd: dir });

        addProcess(processId, child, user, socket, to);
        (to === "all") && socket.broadcast.to(user.roomname).emit("foreign process", {user: user, time: new Date()});

        child.on('exit', () => {
            child.kill();
            removeProcess(processId);
            fs.rmdir(`./engines/python/${user.roomname}`, { recursive: true, force: true }, () => console.log(`Successfully deleted dir: ${dir}`));
            socket.emit("process finished");
            (to === "all") && socket.broadcast.to(user.roomname).emit("process finished");
        });
    });

    socket.on('ocaml', ({ script, to, args }) => {
        const user = getUser(socket.id);
        const processId = user.roomname + socket.id;
        const dir = `./engines/ocaml/${user.roomname}/${socket.id}`;

        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}/main.ml`, script);
        const child = spawn('ocaml', [`main.ml`, ...args], { cwd: dir });

        addProcess(processId, child, user, socket, to);
        (to === "all") && socket.broadcast.to(user.roomname).emit("foreign process", {user: user, time: new Date()});

        child.on('exit', () => {
            child.kill();
            removeProcess(processId);
            fs.rmdir(`./engines/ocaml/${user.roomname}`, { recursive: true, force: true }, () => console.log(`Successfully deleted dir: ${dir}`));
            socket.emit("process finished");
            (to === "all") && socket.broadcast.to(user.roomname).emit("process finished");
        });
    });

    socket.on('sh', ({ script, to, args }) => {
        const user = getUser(socket.id);
        const processId = user.roomname + socket.id;
        const dir = `./engines/sh/${user.roomname}/${socket.id}`;

        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}/main.sh`, script);

        exec('chmod', ['-x', `${dir}/main.sh`]);
        const child = spawn('sh', [`main.sh`, ...args], { cwd: dir });

        addProcess(processId, child, user, socket, to);
        (to === "all") && socket.broadcast.to(user.roomname).emit("foreign process", {user: user, time: new Date()});

        child.on('exit', () => {
            child.kill();
            removeProcess(processId);
            fs.rmdir(`./engines/sh/${user.roomname}`, { recursive: true, force: true }, () => console.log(`Successfully deleted dir: ${dir}`));
            socket.emit("process finished");
            (to === "all") && socket.broadcast.to(user.roomname).emit("process finished");
        });
    });

    socket.on('c_cpp', ({ script, to, args }) => {
        const user = getUser(socket.id);
        const processId = user.roomname + socket.id;
        const dir = `./engines/c_cpp/${user.roomname}/${socket.id}`;

        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}/main.cpp`, script);

        exec(`g++ main.cpp`, { cwd: dir }, (error, stderr) => {
            if (error) {
                socket.emit("output", { data: error.toString(), error: true });
                fs.rmdir(`./engines/c_cpp/${user.roomname}`, { recursive: true, force: true }, () => console.log(`Successfully deleted dir: ${dir}`));
                socket.emit("process finished");
            } else if (stderr) {
                socket.emit("output", { data: stderr.toString(), error: true });
                fs.rmdir(`./engines/c_cpp/${user.roomname}`, { recursive: true, force: true }, () => console.log(`Successfully deleted dir: ${dir}`));
                socket.emit("process finished");
            } else {
                const child = spawn(`./a.out`, [...args], { cwd: dir });

                addProcess(processId, child, user, socket, to);
                (to === "all") && socket.broadcast.to(user.roomname).emit("foreign process", {user: user, time: new Date()});

                child.on('exit', () => {
                    child.kill();
                    removeProcess(processId);
                    fs.rmdir(`./engines/c_cpp/${user.roomname}`, { recursive: true, force: true }, () => console.log(`Successfully deleted dir: ${dir}`));
                    socket.emit("process finished");
                    (to === "all") && socket.broadcast.to(user.roomname).emit("process finished");
                });
            }
        });
    });

    socket.on('java', ({ script, to, args }) => {
        const user = getUser(socket.id);
        const processId = user.roomname + socket.id;
        const dir = `./engines/java/${user.roomname}/${socket.id}`;

        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}/Main.java`, script);

        exec(`javac Main.java`, { cwd: dir }, (error, stderr) => {
            if (error) {
                socket.emit("output", { data: error.toString(), error: true });
                fs.rmdir(`./engines/java/${user.roomname}`, { recursive: true, force: true }, () => console.log(`Successfully deleted dir: ${dir}`));
                socket.emit("process finished");
            } else if (stderr) {
                socket.emit("output", { data: stderr.toString(), error: true });
                fs.rmdir(`./engines/java/${user.roomname}`, { recursive: true, force: true }, () => console.log(`Successfully deleted dir: ${dir}`));
                socket.emit("process finished");
            } else {
                const child = spawn('java', ['Main', ...args], { cwd: dir });

                addProcess(processId, child, user, socket, to);
                (to === "all") && socket.broadcast.to(user.roomname).emit("foreign process", {user: user, time: new Date()});

                child.on('exit', () => {
                    child.kill();
                    removeProcess(processId);
                    fs.rmdir(`./engines/java/${user.roomname}`, { recursive: true, force: true }, () => console.log(`Successfully deleted dir: ${dir}`));
                    socket.emit("process finished");
                    (to === "all") && socket.broadcast.to(user.roomname).emit("process finished");
                });
            }
        });
    });

    socket.on('input', ({ input, toAll }) => {
        const user = getUser(socket.id);
        const processId = user.roomname + socket.id;
        socket.emit("write input", { data: input })
        toAll && socket.broadcast.to(user.roomname).emit("write input", { data: input });
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