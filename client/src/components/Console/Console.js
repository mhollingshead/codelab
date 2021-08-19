import './Console.scss';
import { hijackConsole, evaluate, giveConsoleBack, logUser } from '../../utils/consoleUtils';
import { handleOutput } from '../../utils/socketUtils';
import { getVersion } from '../../utils/engineUtils';
import { useEffect, useRef, useState } from 'react';

export default function Console({ editor, lang, socket }) {
    const [header, setHeader] = useState(null);
    const [running, setRunning] = useState(false);
    const [runningAll, setRunningAll] = useState(false);
    const [foreignProcess, setForeignProcess] = useState(false);
    const runningAllRef = useRef();
    runningAllRef.current = runningAll;
    
    useEffect(() => {
        hijackConsole();
        return () => giveConsoleBack();
    }, []);

    useEffect(() => {
        socket.on("output", handleOutput);
        socket.on("process finished", () => {
            setRunning(false);
            setRunningAll(false);
            setForeignProcess(false);
            document.querySelector('.console__stdin').style.display = "none";
        });
        socket.on("foreign process", () => {
            setForeignProcess(true);
        })
    }, []);

    useEffect(() => {
        if (lang === "javascript") {
            setHeader("JavaScript v1.7");
        } else if (lang === "python") {
            setHeader("Python 2.7.16");
        } else {
            getVersion(lang).then(res => setHeader(`${lang === "node" ? "Node" : ""} ${res.data.split("Copyright")[0]}`));
        }
    }, [lang]);

    const handleEval = to => {
        if (lang === "javascript") {
            if (evaluate(editor.getValue()) && to === "all") {
                socket.emit(lang, { script: editor.getValue() });
            }
        } else {
            socket.emit(lang, { script: editor.getValue(), to: to });
            document.querySelector('.console__stdin').style.display = "flex";
            document.querySelector('.console__input').focus();
            to === "self" ? setRunning(true) : setRunningAll(true);
        }
    }

    const handleSTDIN = e => {
        e.preventDefault();
        (e.target.stdin.value) && socket.emit("input", { input: e.target.stdin.value, toAll: runningAllRef.current });
        e.target.reset();
    }

    const handleKillProcess = () => socket.emit("kill process");
    const handleConsoleClear = () => document.querySelector('.console__stdout').innerHTML = "";

    return (
        <section className="console">
            <div className="console__drag"></div>
            <div className="console__head">
                <h4 className="console__title">Console</h4>
                <button className={`button button--${!running ? "primary" : "stop"}`} onClick={!running ? () => handleEval("self") : handleKillProcess} disabled={runningAll || foreignProcess}>
                    <span className="button__icon">{!running? "sync" : "stop"}</span>
                    <span className="button__text">{!running ? "Run" : "Stop"}</span>
                </button>
                <button className={`button button--${!runningAll ? "primary" : "stop"}`} onClick={!runningAll ? () => handleEval("all") : handleKillProcess} disabled={running || foreignProcess}>
                    <span className="button__icon">{!runningAll ? "sync_problem" : "stop"}</span>
                    <span className="button__text">{!runningAll ? "Run for All" : "Stop"}</span>
                </button>
                <button className="button button--secondary" onClick={handleConsoleClear}>
                    <span className="button__icon">do_not_disturb</span>
                    <span className="button__text">Clear</span>
                </button>
            </div>
            <div className="console__body">
                <div className="console__header"><pre>{header}</pre></div>
                <div className="console__output">
                    <div className="console__stdout"></div>
                    <form className="console__stdin" onSubmit={handleSTDIN}>
                        <input className="console__input" name="stdin" id="stdn" autoComplete="off" />
                    </form>
                </div>
            </div>
        </section>
    );
}