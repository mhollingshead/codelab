import { download } from '../../utils/engineUtils';
import { langs } from '../../utils/consoleUtils';
import './Header.scss';
import { copyLink } from '../../utils/firebaseUtils';

export default function Header({ firebaseRef, editor, lang, handleLangChange, handleFileUpload }) {
    const handleThemeChange = () => {
        const body = document.querySelector('body');
        if (body.classList.contains('dark')) {
            editor.setTheme("ace/theme/textmate");
            body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            editor.setTheme("ace/theme/tomorrow_night");
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    const handleDownload = () =>  download(lang, editor.getValue());
    const triggerUploadPrompt = () => document.querySelector("#upload-file").click();

    return (
        <header className="header">
            <div className="logo">
                <span className="logo__icon">navigate_next</span>
                <h1 className="logo__title">codelab</h1>
                <span className="logo__seperator">/</span>
                {firebaseRef && <span className="logo__whiteboardId" id="whiteboardId" aria-label="Copy sharable link" data-microtip-position="bottom" role="tooltip" onClick={copyLink}>{firebaseRef.key}</span>}
            </div>
            <div className="settings">
                <select className="settings__select" value={lang} onChange={handleLangChange}>
                    <option value="sh">Bash</option>
                    <option value="c_cpp">C/C++</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="lua">Lua</option>
                    <option value="node">Node.js</option>
                    <option value="ocaml">OCaml</option>
                    <option value="python">Python</option>
                </select>
                <div className="settings__button-group">
                    <button className="settings__button" onClick={handleDownload} role="tooltip" data-microtip-position="bottom" aria-label={`Download ${langs[lang].file}`}>file_download</button>
                    <button className="settings__button" onClick={triggerUploadPrompt} role="tooltip" data-microtip-position="bottom" aria-label="Upload file">file_upload</button>
                </div>
                <div className="settings__toggle" onClick={handleThemeChange}>
                    <div className="settings__option settings__option--active">light_mode</div>
                    <div className="settings__option">dark_mode</div>
                </div>
                <input className="hidden" id="upload-file" type="file" accept=".sh,.c,.cpp,.java,.js,.lua,.ml,.py" onChange={handleFileUpload}/>
            </div> 
        </header>
    );
}