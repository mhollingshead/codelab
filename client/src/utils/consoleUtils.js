import bash from  '../assets/icons/bash.svg';
import c_cpp from  '../assets/icons/c_cpp.svg';
import csharp from  '../assets/icons/csharp.svg';
import java from  '../assets/icons/java.svg';
import javascript from '../assets/icons/javascript.svg';
import lua from  '../assets/icons/lua.svg';
import node from  '../assets/icons/node.svg';
import ocaml from  '../assets/icons/ocaml.svg';
import python from  '../assets/icons/python.svg';

export const langs = {"c_cpp": {"icon": c_cpp,"display": "C/C++"},"csharp": {"icon": csharp,"display": "C#"},"java": {"icon": java,"display": "Java"},"javascript": {"icon": javascript,"display": "JavaScript"},"lua": {"icon": lua,"display": "Lua"},"node": {"icon": node,"display": "Node.js"},"python": {"icon": python,"display": "Python"},"ocaml": {"icon": ocaml,"display": "OCaml"},"sh": {"icon": bash,"display": "Bash"}};

const legacy = console.log;
export function hijackConsole() {
    const logger = document.querySelector('.console__stdout');
    console.log = function () {
        for (let i = 0; i < arguments.length; i++) {
            legacy(arguments[i]);
            logger.innerHTML += `
                <div class="console__log">
                    <pre>${formatLogItem(arguments[i])}</pre>
                </div>
            `;
            // Scroll to bottom of the console on new logs
            const body = document.querySelector('.console__body');
            body.scrollTo(body.scrollHeight, body.scrollHeight);
        }
    }
}

// Log errors to console with necessary styling
export function logError(e) {
    const logger = document.querySelector('.console__stdout');
    logger.innerHTML += `
        <div class="console__log console__log--error">
            <pre>${e}</pre>
        </div>
    `;
    // Scroll to bottom of the console on new logs
    const body = document.querySelector('.console__body');
    body.scrollTo(body.scrollHeight, body.scrollHeight);
};

export function logUser(data, color) {
    const logger = document.querySelector('.console__stdout');
    logger.innerHTML += `
        <div class="console__log console__log--user">
            <pre><div class="console__avatar" style="background-color: ${color}"></div>${data.user.username} @ ${new Date(data.time).toUTCString()}:</pre>
        </div>
    `;
    // Scroll to bottom of the console on new logs
    const body = document.querySelector('.console__body');
    body.scrollTo(body.scrollHeight, body.scrollHeight);
}

export function giveConsoleBack() {
    console.log = legacy;
}

window.expandArr = (e) => {
    const minifiedArr = e.nextSibling.nextSibling.nextSibling;
    const expandedArr = e.nextSibling.nextSibling.nextSibling.nextSibling;
    minifiedArr.style.display = "none";
    expandedArr.style.display = "inline";
    e.innerText = 'arrow_drop_down';
    e.onclick = () => window.minimizeArr(e, minifiedArr, expandedArr);
}
window.minimizeArr = (e, minifiedArr, expandedArr) => {
    minifiedArr.style.display = "inline";
    expandedArr.style.display = "none";
    e.innerText = 'arrow_right';
    e.onclick = () => window.expandArr(e);
}
window.expandObj  = (e) => {
    const minifiedObj = e.nextSibling.nextSibling;
    const expandedObj = e.nextSibling.nextSibling.nextSibling;
    minifiedObj.style.display = "none";
    expandedObj.style.display = "inline";
    e.innerText = 'arrow_drop_down';
    e.onclick = () => window.minimizeObj(e, minifiedObj, expandedObj);
}
window.minimizeObj = (e, minifiedObj, expandedObj) => {
    minifiedObj.style.display = "inline";
    expandedObj.style.display = "none";
    e.innerText = 'arrow_right';
    e.onclick = () => window.expandObj(e);
}

function formatLogItem(arg, depth) {
    depth = depth || 0;
    if (arg === undefined) {
        // undefined -> string
        return `<span class='hljs-ind'>undefined</span>`;
    } else if (arg === null) {
        // null -> string
        return `<span class='hljs-ind'>null</span>`;
    } else if (arg instanceof Date || arg instanceof Promise || arg instanceof Response) {
        // object instance -> string
        return String(arg);
    }
    else if (arg instanceof Element || arg instanceof HTMLDocument) {
        // html -> highlight
        return window.hljs.highlight(arg.outerHTML, {language: 'html'}).value;
    } else if (typeof arg === 'object') {
        // Recursive formatting for arrays and objects
        if (Array.isArray(arg)) {
            if (arg.length === 0) return `<span class='hljs-info'>(0)</span> <span class='hljs-ind'>[]</span>`;
            // Render 4 elements: the dropdown link, the array length, the single-line display
            // of the array, and the expanded version of the array. Clicking the dropdown link
            // toggles which display is visible.
            return `<span onclick='expandArr(this)' class='expand'>arrow_right</span><span class='hljs-info'>(${arg.length})</span> [<span>${
                arg.reduce((res, obj, ind) => {
                    // Call formatLogItem for each item in the array (with increased depth)
                    return res+`${formatLogItem(obj, depth + 1)}${ind === (arg.length-1) ? ']</span>' : ', '}`;
                }, "")
            }<span style='display: none'>\n${
                arg.reduce((res, obj, ind) => {
                    // Call formatLogItem for each item in the array (with increased depth)
                    return res+`${'  '.repeat(depth+1)}<span class='hljs-ind'>${ind}</span>: ${formatLogItem(obj, depth + 1)}${ind === (arg.length-1) ? '\n' : ',\n'}`;
                }, "")
            }${'  '.repeat(depth)}]</span>`;
        } else {
            if (Object.keys(arg).length === 0) return `<span class='hljs-ind'>{}</span>`
            // Render 3 elements: the dropdown link, the single-line display of the object, and
            // the expanded version of the object. Clicking the dropdown link toggles which 
            // display is visible.
            return `<span onclick='expandObj(this)' class='expand'>arrow_right</span>{<span>${
                Object.values(arg).reduce((res, val, ind, arr) => {
                    // Call formatLogItem for each key/value pair in the object (with increased
                    // depth)
                    return res+`<span class='hljs-ind'>${Object.keys(arg)[ind]}</span>: ${formatLogItem(val, depth + 1)}${ind === (arr.length-1) ? '}' : ', '}`;
                }, "")
            }</span><span style='display: none'>\n${
                Object.values(arg).reduce((res, val, ind, arr) => {
                    // Call formatLogItem for each key/value pair in the object (with increased
                    // depth)
                    return res+`${'  '.repeat(depth+1)}<span class='hljs-ind'>${Object.keys(arg)[ind]}</span>: ${formatLogItem(val, depth + 1)}${ind === (arr.length-1) ? '\n' : ',\n'}`;
                }, "")
            }${'  '.repeat(depth)}}</span>`;
        }
    } else if (typeof arg === 'function') {
        // function -> string -> format object keys -> highlight
        return window.hljs.highlight(arg.toString().replace(/"+\w+":/g, match => match.replace(/\w+/g, "$&").replaceAll('"', "")), {language: 'javascript'}).value;
    } else {
        // highlight strings within objects
        if (depth > 0 && typeof arg === 'string') return window.hljs.highlight(`"${arg.toString()}"`, {language: 'javascript'}).value;
        // value -> highlight booleans / numbers
        return (typeof arg == 'boolean' || typeof arg == 'number') ? window.hljs.highlight(arg.toString(), {language: 'javascript'}).value : arg;
    }
}

export function evaluate(inp) {
    let success = true;
    try {
        eval(inp);
    }
    catch(e) {
        // Handle errors
        logError(e.message);
        return false;
    } finally {
        return success;
    }
}