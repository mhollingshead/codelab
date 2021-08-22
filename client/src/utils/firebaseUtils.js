export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FB_API_KEY,
    authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FB_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FB_MESSAGE_SENDER_ID,
    appId: process.env.REACT_APP_FB_APP_ID,
    measurementId: process.env.REACT_APP_FB_MEASUREMENT_ID,
    databaseURL: process.env.REACT_APP_FB_DATABASE_URL
};

export function getRef(id) {
    let ref = window.firebase.database().ref();
    if (id) {
        ref = ref.child(id);
    } else {
        ref = ref.push();
        window.location = ref.key.substr(1);
    }
    return ref;
}

export function newUserId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(~~(Math.random() * characters.length));
    }
    return result;
}

export async function makeUnique(id, ref) {
    let i = 0;
    const usersRef = ref.child('users');
    await usersRef.once('value').then(snapshot => {
        while (snapshot.child(!i ? id : `${id} ${i}`).val()) {
            i++;
            console.log(i);
        }
    })
    return !i ? id : `${id} ${i}`;
}

export function copyLink() {
    // Add temporary element to body
    const tmp = document.createElement('input');
    tmp.value = window.location.href;
    document.body.appendChild(tmp);

    // Select + copy it, then remove it
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);

    // Handle aria label
    const idArea = document.querySelector(".logo__whiteboardId");
    idArea.ariaLabel = "Copied to clipboard!";
    const revertAriaLabel = () => idArea.ariaLabel = "Copy sharable link";
    idArea.addEventListener('mouseout', () => setTimeout(revertAriaLabel, 500));
}