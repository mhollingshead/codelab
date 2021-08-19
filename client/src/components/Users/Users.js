import { useEffect, useRef, useState } from 'react';
import { formatNewUser, formatMessage } from '../../utils/chatUtils';
import { logUser } from '../../utils/consoleUtils';
import './Users.scss';

export default function Users({ firebaseRef, socket }) {
    const [users, setUsers] = useState([]);
    const usersRef = useRef();
    usersRef.current = users;

    const foreignProcess = data => {
        logUser(data, usersRef.current.find(user => user.username === data.user.username).color);
    }

    useEffect(() => {
        firebaseRef.child('users').on('value', userRefs => {
            const _users = [];
            userRefs.forEach(user => {
                const _user = {username: user.key, color: user.val().color};
                if (!document.getElementById(user.key.replaceAll(" ", "_")) && user.key[0] !== "-") {
                    formatNewUser(_user);
                }
                _users.push(_user);
            });
            setUsers(_users);
        });
        socket.on("incoming message", message => formatMessage(message));
        socket.on("foreign process", foreignProcess);
    }, []);

    const handleMessageSend = e => {
        e.preventDefault();
        if (e.target.message.value) {
            const message = { ...users.find(user => user.username === document.getElementById("displayname").value), message: e.target.message.value };
            socket.emit("message", message);
            formatMessage(message);
        }
        e.target.reset();
    }

    return (
        <>
            <section className="users">
                <form className="users__form">
                    <input className="users__input" name="displayname" id="displayname" autoComplete="off" /><button className="users__button">Change</button>
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