import { useEffect, useState } from 'react';
import { firebaseConfig, getRef, newUserId } from '../../utils/firebaseUtils';
import { langs } from '../../utils/consoleUtils';
import { io } from 'socket.io-client';
import Console from '../../components/Console';
import './Whiteboard.scss';
import Users from '../../components/Users';
import Header from '../../components/Header';

export default function Whiteboard({ match : { params : { id } } }) {
    const [firebaseRef, setFirebaseRef] = useState(null);
    const [editor, setEditor] = useState(null);
    const [firepad, setFirepad] = useState(null);
    const [socket, setSocket] = useState(null);
    const [lang, setLang] = useState("javascript");
    
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
        const _socket = io('http://localhost:8080');
        _socket.emit('join', { username: id, roomname: firebaseRef.key });
        setSocket(_socket);
    }
    const setListeners = () => {
        if (firebaseRef && firepad) {
            firepad.on('ready', () => {
                const id = "User " + newUserId(6);
                firepad.setUserId(id);
                initSocket(id);
                document.querySelector("#displayname").value = id;
            });
        }
    }

    const handleLangChange = e => firebaseRef.child('lang').set(e.target.value);

    useEffect(() => initFirebase(), []);
    useEffect(() => initAce(), [lang]);
    useEffect(() => initFirepad(), [firebaseRef, editor]);
    useEffect(() => setListeners(), [firebaseRef, firepad]);

    return (
        <>
            {firebaseRef && editor && <Header firebaseRef={firebaseRef} editor={editor} lang={lang} handleLangChange={handleLangChange} />}
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
                    {firebaseRef && socket && <Users firebaseRef={firebaseRef} socket={socket} />}
                </section>
                <section className="console-container">
                    {editor && socket && <Console editor={editor} lang={lang} socket={socket} />}
                </section>
            </main>
        </>
    );
}