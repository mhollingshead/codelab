import axios from 'axios';

export const getVersion = lang => axios.get(`http://localhost:8080/version/${lang}`);

export function download(lang, script) {
    let filename;
    if (lang === "javascript" || lang === "node") {
        filename = "main.js";
    } else if (lang === "bash") {
        filename = "main.sh";
    } else if (lang === "c_cpp") {
        filename = "main.cpp";
    } else if (lang === "java") {
        filename = "Main.java";
    } else if (lang === "lua") {
        filename = "main.lua";
    } else if (lang === "ocaml") {
        filename = "main.ml";
    } else {
        filename = "main.py";
    }
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(script));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  