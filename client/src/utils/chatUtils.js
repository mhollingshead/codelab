export function formatNewUser(user) {
    const chat = document.querySelector('.chat__body');
    chat.innerHTML += `
        <div class="chat__user" id="${user.username.replaceAll(" ", "")}">
            <div class="message__avatar" style="background-color: ${user.color};"></div>
            <div><span class="${user.username.replaceAll(" ", "")}">${user.username}</span> joined the room</div>
        </div>
    `;
    chat.scrollTo(chat.scrollHeight, chat.scrollHeight);
}

export function formatMessage(message) {
    const chat = document.querySelector('.chat__body');
    chat.innerHTML += `
        <div class="message">
            <div class="message__head">
                <div class="message__avatar" style="background-color: ${message.color};"></div>
                <div class="${message.username.replaceAll(" ", "")}">${message.username}</div>
            </div>
            <div class="message__body">${message.message}</div>
        </div>
    `;
    chat.scrollTo(chat.scrollHeight, chat.scrollHeight);
}