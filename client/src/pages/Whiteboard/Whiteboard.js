import { useEffect, useRef, useState } from 'react';
import { firebaseConfig, getRef, makeUnique, newUserId } from '../../utils/firebaseUtils';
import { langs } from '../../utils/consoleUtils';
import { io } from 'socket.io-client';
import Console from '../../components/Console';
import './Whiteboard.scss';
import Users from '../../components/Users';
import Header from '../../components/Header';
import { handleInput } from '../../utils/socketUtils';

export default function Whiteboard({ match : { params : { id } } }) {
    const [firebaseRef, setFirebaseRef] = useState(null);
    const [editor, setEditor] = useState(null);
    const [firepad, setFirepad] = useState(null);
    const [socket, setSocket] = useState(null);
    const [lang, setLang] = useState("javascript");
    const [username, setUsername] = useState("");
    const usernameRef = useRef();
    usernameRef.current = username;

    
    const initFirebase = () => {
        window.firebase.initializeApp(firebaseConfig);
        setFirebaseRef(getRef(id));
    }
    const initAce = () => {
        const _editor =  window.ace.edit('editor')
        _editor.session.setMode(`ace/mode/${lang === "node" ? "javascript" : lang}`);
        if (localStorage.getItem('theme') === 'dark') _editor.setTheme("ace/theme/tomorrow_night");
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
        const _socket = io('/');
        _socket.emit('join', { username: id, roomname: firebaseRef.key });
        setSocket(_socket);
    }
    const setListeners = () => {
        if (firebaseRef && firepad) {
            firepad.on('ready', async () => {
                // If a display name is saved in local storage and that display name is already taken by another user, make it unique by adding a number to the end
                const id = (localStorage.getItem(firebaseRef.key)) ? await makeUnique(localStorage.getItem(firebaseRef.key), firebaseRef) : "User " + newUserId(6);
                firepad.setUserId(id);
                initSocket(id);
                setUsername(id);
            });
        }
    }

    const handleLangChange = e => firebaseRef.child('lang').set(e.target.value);

    const handleFileUpload = e => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const ext = file.name.split('.')[1];
            Object.keys(langs).forEach(elang => {
                if (langs[elang].file.toLowerCase() === `main.${ext}`) {
                    const reader = new FileReader();
                    reader.onload = e => {
                        firebaseRef.child('lang').set(elang);
                        setLang(elang);
                        firepad.setText(e.target.result)
                    }
                    reader.readAsText(file);
                }
            })
        }
    }

    useEffect(() => initFirebase(), []);
    useEffect(() => initAce(), [lang]);
    useEffect(() => initFirepad(), [firebaseRef, editor]);
    useEffect(() => setListeners(), [firebaseRef, firepad]);

    return (
        <>
            {firebaseRef && editor && <Header firebaseRef={firebaseRef} editor={editor} lang={lang} handleLangChange={handleLangChange} handleFileUpload={handleFileUpload} />}
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
                    {firebaseRef && firepad && socket && usernameRef.current && <Users firebaseRef={firebaseRef} firepad={firepad} socket={socket} usernameRef={usernameRef} />}
                </section>
                <section className="console-container">
                    {editor && socket && <Console editor={editor} lang={lang} socket={socket} />}
                </section>
            </main>
        </>
    );
}