import { useEffect, useRef, useState } from 'react';
import { formatNewUser, formatMessage } from '../../utils/chatUtils';
import { logUser } from '../../utils/consoleUtils';
import { makeUnique } from '../../utils/firebaseUtils';
import './Users.scss';

export default function Users({ firebaseRef, socket, firepad, usernameRef }) {
    const [users, setUsers] = useState([]);
    const [usernameInput, setUsernameInput] = useState(usernameRef.current);
    const [username, setUsername] = useState(usernameRef.current);
    // Used to access current users array from within socket.ons
    const usersRef = useRef();
    usersRef.current = users;

    const foreignProcess = data => {
        logUser(data, usersRef.current.find(user => user.username === data.user.username).color);
    }

    const handleMessageSend = e => {
        e.preventDefault();
        if (e.target.message.value) {
            // Send username, color, and message
            const message = { ...users.find(_user => _user.username === username), message: e.target.message.value };
            socket.emit("message", message);
            formatMessage(message);
        }
        e.target.reset();
    }

    const handleUserChange = async e => {
        e.preventDefault();
        if (e.target.username) {
            const oldUsername = username, newUsername = e.target.username.value;
            if (oldUsername !== newUsername) {
                // We can save the new username preference in localStorage,
                localStorage.setItem(firebaseRef.key, newUsername);
                // but if the new display name is already taken by an active user on the current whiteboard, 
                // we need to append a number on the end to make it unique in our db and socket data.
                const uniqueNewUsername = await makeUnique(newUsername, firebaseRef);
                firepad.setUserId(uniqueNewUsername);
                setUsername(uniqueNewUsername);
                socket.emit("username change", { oldUsername: oldUsername, newUsername: uniqueNewUsername });
            }
        }
    }

    const handleOnChange = e => setUsernameInput(e.target.value);

    useEffect(() => {
        firebaseRef.child('users').on('value', userRefs => {
            const _users = [];
            userRefs.forEach(user => {
                const _user = {username: user.key, color: user.val().color};
                if (!document.getElementById(_user.username.replaceAll(" ", "")) && _user.username[0] !== "-") {
                    formatNewUser(_user);
                }
                if (document.getElementById(_user.username.replaceAll(" ", ""))) {
                    document.getElementById(_user.username.replaceAll(" ", "")).children[0].style.backgroundColor = _user.color;
                }
                _users.push(_user);
            });
            setUsers(_users);
        });
        socket.on("incoming message", formatMessage);
        socket.on("foreign process", foreignProcess);
        socket.on("update username", ({ oldUsername, newUsername }) => document.querySelectorAll(`.${oldUsername.replaceAll(" ", "")}`).forEach(element => element.innerText = newUsername));
    }, []);

    return (
        <>
            <section className="users">
                <form className="users__form" onSubmit={handleUserChange}>
                    <input className="users__input" name="username" id="username" autoComplete="off" value={usernameInput} onChange={handleOnChange} /><button className="users__button">Change</button>
                </form>
                <ul className="users__list">
                    { users && users.map(user => (
                        <li className="user" key={user.username}>
                            <div className="user__avatar" style={{backgroundColor: user.color}}></div>
                            <p className="user__username">{user.username}</p>
                        </li>
                    )) }
                </ul>
            </section>
            <section className="chat" id="user-chat">
                <div className="chat__body"></div>
                <div className="chat__foot">
                    <form className="chat__form" onSubmit={handleMessageSend}>
                        <input className="chat__input" name="message" id="message" autoComplete="off" placeholder="Say something..." />
                        <button className="chat__button">send</button>
                    </form>
                </div>
            </section>
        </>
    )
}