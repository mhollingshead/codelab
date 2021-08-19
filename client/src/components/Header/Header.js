import './Header.scss';

export default function Header({ firebaseRef, editor, lang, handleLangChange }) {
    const handleThemeChange = () => {
        const body = document.querySelector('body');
        if (body.classList.contains('dark')) {
            editor.setTheme("ace/theme/textmate");
            body.classList.remove('dark');
        } else {
            editor.setTheme("ace/theme/tomorrow_night");
            body.classList.add('dark');
        }
    }

    return (
        <header className="header">
            <div className="logo">
                <span className="logo__icon">navigate_next</span>
                <h1 className="logo__title">codelab</h1>
                <span className="logo__seperator">/</span>
                {firebaseRef && <span className="logo__whiteboardId" id="whiteboardId" aria-label="Copy sharable link" data-microtip-position="bottom" role="tooltip">{firebaseRef.key}</span>}
            </div>
            <div className="settings">
                <select className="settings__select" value={lang} onChange={handleLangChange}>
                    <option value="sh">Bash</option>
                    <option value="c_cpp" disabled>C/C++</option>
                    <option value="csharp" disabled>C#</option>
                    <option value="java" disabled>Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="lua">Lua</option>
                    <option value="node">Node.js</option>
                    <option value="ocaml">OCaml</option>
                    <option value="python">Python</option>
                </select>
                <div className="settings__toggle" onClick={handleThemeChange}>
                    <div className="settings__option settings__option--active">light_mode</div>
                    <div className="settings__option">dark_mode</div>
                </div>
            </div> 
        </header>
    );
}