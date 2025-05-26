import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {auth} from "./firebase"; // Adjust the import path as necessary

export function userRegister(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

export function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

export function Logout() {
    return signOut(auth).then(() => {
        localStorage.removeItem("token"); 
    });
}
