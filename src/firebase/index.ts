console.warn('🔥 REAL FIREBASE BEING USED!')

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBdKYAgR7eg7AsDWvZZTzKcq0xn5Su465E',
  authDomain: 'spoons-15e03.firebaseapp.com',
  projectId: 'spoons-15e03',
  storageBucket: 'spoons-15e03.firebasestorage.app',
  messagingSenderId: '650443293688',
  appId: '1:650443293688:web:3b017d299ffe7efe458c0d',
  measurementId: 'G-XTM7RJ233M',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)
