const legacy = console.log;
export function hijackConsole() {
    const logger = document.querySelector('.console__output');
    console.log = function () {
        for (let i = 0; i < arguments.length; i++) {
            legacy(arguments[i]);
            const pre = document.createElement('pre')
            pre.classList.add('output');
            pre.id = `log_${document.querySelectorAll('.output').length}`;
            pre.innerHTML = formatLogItem(arguments[i]);
            logger.innerHTML += `
                <div class="op">
                    <div class="carrot">
                        <span class="m-i">
                            navigate_before
                        </span>
                    </div>
                    ${pre.outerHTML}
                </div>
            `;
            // Scroll to bottom of the console on new logs
            logger.scrollTop = logger.scrollHeight;
        }
    }
}
export function giveConsoleBack() {
    console.log = legacy;
}

// Log errors to console with necessary styling
export function logError(e) {
    const logger = document.querySelector('.console__output');
    logger.innerHTML += `
        <div class="op error">
            <div class="carrot error">
                <span class="m-i">
                    error
                </span>
            </div>
            <pre class="output error">${e}</pre>
        </div>
    `;
    logger.scrollTop = logger.scrollHeight;
};

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
        // Evaluate code
        eval(inp);
    } catch(e) {
        // Handle errors
        logError(e.message);
        return false;
    } finally {
        return success;
    }
}