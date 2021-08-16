import { useEffect, useState } from 'react';
import { firebaseConfig, getRef, newUserId } from '../../utils/firebaseUtils';
import { io } from 'socket.io-client';
import c_cpp from  '../../assets/icons/c_cpp.svg';
import csharp from  '../../assets/icons/csharp.svg';
import java from  '../../assets/icons/java.svg';
import javascript from '../../assets/icons/javascript.svg';
import lua from  '../../assets/icons/lua.svg';
import node from  '../../assets/icons/node.svg';
import python from  '../../assets/icons/python.svg';
import './Whiteboard.scss';
import Console from '../../components/Console';

const langs = {"c_cpp": {"icon": c_cpp,"display": "C/C++"},"csharp": {"icon": csharp,"display": "C#"},"java": {"icon": java,"display": "Java"},"javascript": {"icon": javascript,"display": "JavaScript"},"lua": {"icon": lua,"display": "Lua"},"node": {"icon": node,"display": "Node.js"},"python": {"icon": python,"display": "Python"}};

export default function Whiteboard({ match : { params : { id } } }) {
    const [firebaseRef, setFirebaseRef] = useState(null);
    const [editor, setEditor] = useState(null);
    const [firepad, setFirepad] = useState(null);
    const [socket, setSocket] = useState(null);
    const [lang, setLang] = useState("javascript");
    const [users, setUsers] = useState([]);
    
    const initFirebase = () => {
        window.firebase.initializeApp(firebaseConfig);
        setFirebaseRef(getRef(id));
    }
    const initAce = () => {
        const _editor =  window.ace.edit('editor')
        _editor.session.setMode(`ace/mode/${lang === "node" ? "javascript" : lang}`);
        _editor.setOption("showPrintMargin", false);
        _editor.setOption("wrap", true);
        setEditor(_editor);
    }
    const initFirepad = () => {
        if (firebaseRef && editor)  {
            const _firepad = window.Firepad.fromACE(firebaseRef, editor);
            document.querySelector('.powered-by-firepad').remove();
            setFirepad(_firepad);
            firebaseRef.child('lang').on('value', snapshot => {
                const _lang = snapshot.val();
                _lang ? setLang(_lang) : firebaseRef.child('lang').set("javascript");
            });
        }
    }
    const initSocket = id => {
        const _socket = io('http://localhost:8000');
        _socket.emit('join', { username: id, roomname: firebaseRef.key });
        setSocket(_socket);
    }
    const setListeners = () => {
        if (firebaseRef && firepad) {
            firepad.on('ready', () => {
                const id = "User " + newUserId(6);
                document.querySelector("#displayname").value = id;
                firepad.setUserId(id);
                initSocket(id);
            });
            firebaseRef.child('users').on('value', userRefs => {
                let _users = [], i = 0;
                userRefs.forEach(user => {_users.push({
                    "username": Object.keys(userRefs.val())[i], 
                    "val": user.val()
                }); i++});
                setUsers(_users);
            })
        }
    }

    const handleLangChange = e => {
        firebaseRef.child('lang').set(e.target.value);
    }

    useEffect(() => initFirebase(), []);
    useEffect(() => initAce(), [lang]);
    useEffect(() => initFirepad(), [firebaseRef, editor]);
    useEffect(() => setListeners(), [firebaseRef, firepad]);

    return (
        <>
            <header className="header">
                <div className="logo">
                    <span className="logo__icon">navigate_next</span>
                    <h1 className="logo__title">codelab</h1>
                    <span className="logo__seperator">/</span>
                    {firebaseRef && <span className="logo__whiteboardId" id="whiteboardId" aria-label="Copy sharable link" data-microtip-position="bottom" role="tooltip">{firebaseRef.key}</span>}
                </div>
                <div className="settings">
                    <select className="settings__select" value={lang} onChange={handleLangChange}>
                        <option value="c_cpp" disabled>C/C++</option>
                        <option value="csharp" disabled>C#</option>
                        <option value="java" disabled>Java</option>
                        <option value="javascript">JavaScript</option>
                        <option value="lua">Lua</option>
                        <option value="node">Node.js</option>
                        <option value="python">Python</option>
                    </select>
                </div> 
            </header>
            <main className="whiteboard">
                <section className="editor-container">
                    <div className="editor" id="editor"></div>
                    <div className="lang">
                        <div aria-label={langs[lang].display} data-microtip-position="left" role="tooltip">
                            <img src={langs[lang].icon} />
                        </div>
                    </div>
                </section>
                <section className="users-container">
                    <div className="users">
                        <form className="users__form">
                            <input className="users__input" name="displayname" id="displayname" autoComplete="off" /><button className="users__button">Change</button>
                        </form>
                        { users && <ul className="users__list">
                            { users.map(user => (
                                <li className="user" key={user.username}>
                                    <div className="user__avatar" style={{backgroundColor: user.val.color}}></div>
                                    <p className="user__username">{user.username}</p>
                                </li>
                            )) }
                        </ul> } 
                    </div>
                    <div className="chat" id="user-chat"></div>
                </section>
                <section className="console-container">
                    {editor && lang && socket && <Console editor={editor} lang={lang} socket={socket} />}
                </section>
            </main>
        </>
    );
}