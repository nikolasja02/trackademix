// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// declare const process: any;

// const firebaseConfig = {
//     apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
//     authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
// };

// const app = initializeApp(firebaseConfig);

// // Simple auth init (no react-native persistence submodule)
// export const auth = getAuth(app);

// // Firestore
// export const db = getFirestore(app);



import { initializeApp } from "firebase/app";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

declare const process: any;

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
// Don't forget to install the required package:
// npm install @react-native-async-storage/async-storage