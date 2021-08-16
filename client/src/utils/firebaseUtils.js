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