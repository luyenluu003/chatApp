import {getApp , getApps, initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAxJAKJVO9pU2zv7imHfUO2YoKLSqHVIZY",
    authDomain: "chatapp-77a17.firebaseapp.com",
    projectId: "chatapp-77a17",
    storageBucket: "chatapp-77a17.appspot.com",
    messagingSenderId: "305428350973",
    appId: "1:305428350973:web:0caac9228b195134207b94"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig)

const firebaseAuth = getAuth(app)
const firestoreDB = getFirestore(app)

export {app , firebaseAuth , firestoreDB}