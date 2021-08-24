# codelab
*Codelab is a simple IDE / whiteboarding tool that allows users to write, debug, and execute programs collaboratively in 9 supported languages including Bash, C, C++, Java, JavaScript, Lua, Node.js, OCaml, & Python.*

## Live Demo
*Deployment hopefully coming soon!*
## Install & Run Locally
***Note:** to achieve full functionality locally, you'll need to have the necessary compilers and/or interpreters to be able to compile and run `*.sh`, `*.cpp`, `*.java`, `*.js`, `*.lua`, `*.ml`, and `*.py` scripts.*

#### Server:
* Download the project directory `codelab-main.zip` [here](https://github.com/mhollingshead/codelab/archive/refs/heads/main.zip), unzip and `cd` into `codelab-main`. 
* In the `/server` directory, rename `.env.sample` to `.env`. Here you can set the `PORT` variable, which is the port that the server will be listening on. If no value is provided, the server will default to `8080`. 
***Note:** if you set `PORT` to something other than `8080`, be sure to update the `"proxy"` in `/client/package.json` accordingly.*

* Finally, in the `/server` directory, run `npm install` to install the necessary dependencies, then `npm start` to start the server.

#### Client:
* In a new window, navigate to the `/client` directory.
* Rename `.env.sample` to `.env`. Here you'll need to supply the necessary [Firebase realtime database](https://firebase.google.com/products/realtime-database) config information as the collaborative editor uses Firebase to manage state.
* Finally, run `npm install` to install the necessary dependencies and `npm start` to start the application.
* If you followed the steps above, a new tab should open to http://localhost:3000 where you should see an empty whiteboard instance.

#### Additional Language Support:
The default language for the editor is vanilla JavaScript, which should always work as long as you're using a browser that supports JavaScript.

However, in order to edit, compile, and run code in other languages, you'll need to make sure you have the necessary compilers and/or interpreters installed on your machine for the following languages:
* [Bash](https://www.gnu.org/software/bash/)
* [C++](https://www.cplusplus.com/)
* [Java](https://www.java.com/en/)
* [Node.js](https://nodejs.org/en/)
* [Lua](https://www.lua.org/)
* [OCaml](https://ocaml.org/)
* [Python](https://www.python.org/) `3.*`

The application is untested on machines without these languages installed.

## Features & UI
![enter image description here](/client/public/UI-01.png)

 1. **Sharable whiteboard link**

    The whiteboard's unique ID, clicking the ID will copy the whiteboard's link to your clipboard in order to share with other collaborators.

 2. **Language select** 

    Use this dropdown to change the whiteboard's language. Any language changes will be updated for other active users in real time.

 3. **Download file**

    Download the current editor contents as `main.sh`, `main.cpp`, `Main.java`, `main.js`, `main.lua`, `main.ml`, or `main.py` for use on your own machine.

 4. **Upload file**

    Upload a `*.sh`, `*.cpp`, `*.java`, `*.js`, `*.lua`, `*.ml`, or `*.py` script from your local filesystem. The editor language and contents will automatically update for all active users.

 5. **Theme toggle**

    Toggle the light & dark mode themes (shown above).

 6. **Collaborative editor**

    Other users' edits, cursors, and highlighted text will be shown in real time. Cursors and highlighted text will be displayed in that user's color (shown in the user list).

 7. **Change display name**

    By default, users will receive a randomly generated display name. If the user changes their display name, their preference will be saved in local storage for that particular whiteboard only. If the display name is already taken by another user, the preference will still be saved, but the display name used throughout the whiteboard will have a number appended to it.

8. **Send message**

    Send a message to the whiteboard chatroom. The message will be received by all active users. Messages are not saved, so chat history will be cleared on refresh. 

9. **Run / Stop program**

    Compile (if necessary) and run the editor's contents.  While a program is running, you can kill the process by pressing the **Stop** button.

10. **Run / Stop program for all**

    Compile (if necessary) and run the editor's contents. All inputs and outputs are piped to any active user. Active users are unable to **Run** or **Run for All** while a foreign process is running. Only the user who clicked **Run for All** can kill the process.

11. **Clear console**

    Clears the contents of the console. Console logs are not saved so this cannot be undone.

12. **Command line arguments**

    A space-separated argument list to be supplied to the program via the command line (if the language supports command line arguments).

13. **Language version information**

    The current language's version information. If running locally, the information displayed will be the version you have installed. If blank, you may be missing necessary language dependencies.

14. **Errors**

    Can be either compile-time errors received from the process or run-time errors received from the process's `stderr`.

15. **stdout**

    The outputs of the program, received from the process's `stdout`

16. **stdin**

    Supply input to a process. All inputs are piped to the process's `stdin` buffer. `stdin` is only available to the user who ran the process and is only visible while the process is ongoing. 

17. **Foreign process label**

    Shows who ran the process whose inputs & outputs are being piped to your console and when they ran that process.

## Tech Stack
codelab uses:
* **[Firepad](https://firepad.io/)** for collaboration
* **[Ace](https://ace.c9.io/)** for the code editor
* **[Firebase](https://firebase.google.com/)** for data storage & management
* **[Socket.io](https://socket.io/)** for user communication and process communication
* **[React](https://reactjs.org/)** & **[Express](https://expressjs.com/)** for the application framework
* **[Sass](https://sass-lang.com/)** for CSS preprocessing
* **[Highlight.js](https://highlightjs.org/)** for additional syntax highlighting
* **[Material Icons](https://google.github.io/material-design-icons/)** & **[Devicon](https://devicon.dev/)** for iconography
* and **[Microtip](https://microtip.vercel.app/)** for tooltips