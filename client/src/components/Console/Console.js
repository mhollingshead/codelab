import './Console.scss';
import { hijackConsole, evaluate, logError, giveConsoleBack } from '../../utils/consoleUtils';
import { evaluateLua, evaluatePython } from '../../utils/evaluateUtils';
import { useEffect } from 'react';

export default function Console({ editor, lang, socket }) {
    useEffect(() => {
        hijackConsole();
        socket.on("output", output => {
            if (output.vanillaJS) evaluate(output.data);
            else {
                output.error ? logError(output.data) : output.data.split('\n').forEach((log, ind, arr) => {
                    if (log === '') {
                        if (arr[ind+1]) console.log(log);
                    } else {
                        console.log(log);
                    }
                })
            }
        }); 
    }, []);

    const handleEval = to => {
        if (lang === "javascript") {
            if (evaluate(editor.getValue()) && to === "all") {
                socket.emit(lang, { script: editor.getValue() });
            }
        } else {
            socket.emit(lang, { script: editor.getValue(), to: to })
        }
    }

    const handleConsoleClear = () => {
        document.querySelector('.console__output').innerHTML = '';
    }

    return (
        <div className="console">
            <div className="console__drag"></div>
            <div className="console__head">
                <h4 className="console__title">Console</h4>
                <button className="button button--primary" onClick={() => handleEval("self")}>
                    <span className="button__icon">sync</span>
                    <span className="button__text">Run</span>
                </button>
                <button className="button button--primary" onClick={() => handleEval("all")}>
                    <span className="button__icon">sync_problem</span>
                    <span className="button__text">Run for All</span>
                </button>
                <button className="button button--secondary" onClick={handleConsoleClear}>
                    <span className="button__icon">do_not_disturb</span>
                    <span className="button__text">Clear</span>
                </button>
            </div>
            <div className="console__output"></div>
        </div>
    );
}