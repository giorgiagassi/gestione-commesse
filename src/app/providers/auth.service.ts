import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from 'firebase/database';
import {environment} from "../enviroments/enviroments";


const firebaseApp = initializeApp(environment.firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user'); // È più sicuro rimuovere l'elemento se l'utente non è loggato
      }
    });
  }

  async SignIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        const userRef = ref(database, 'users/' + user.uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = {
            email: user.email,
            uid: user.uid,
            ...snapshot.val() // presupponendo che snapshot.val() ritorni un oggetto con name e surname
          };
          localStorage.setItem('user', JSON.stringify(userData));
        }

        Swal.fire({title: 'Login avvenuto con successo', icon: "success"});
        this.router.navigate(['/lista-commesse']);
      }
    } catch (error: any) {
      console.error("Errore di login:", error);
      this.errorMessage(error.code);
    }
  }

  async ForgotPassword(passwordResetEmail: string) {
    try {
      await sendPasswordResetEmail(auth, passwordResetEmail);
      Swal.fire({title: 'Cambio password avvenuto con successo! Controlla la tua mail', icon: "success"});
    } catch (error: any) {
      console.error("Errore nel reset della password:", error);
      this.errorMessage(error.code);
    }
  }

  async SignOut() {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      Swal.fire({title: 'Logout avvenuto con successo', icon: "success"});
      this.router.navigate(['login']);
    } catch (error: any) {
      console.error("Errore nel logout:", error);
      this.errorMessage(error.code);
    }
  }

  async createUser(name: string, surname: string, email: string, password: string, role: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        // Non salvare la password; Firebase gestisce già la sicurezza delle credenziali
        await set(ref(database, 'users/' + user.uid), {
          name: name,
          surname: surname,
          email: user.email, // Utilizza l'email dall'oggetto user per assicurarti che sia quella verificata
          role: role,
        });

        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      console.error("Errore nella creazione dell'utente:", error);
      this.errorMessage(error.code);
    }
  }

  errorMessage(code: string) {
    let message = '';
    switch (code) {
      case 'auth/wrong-password':
        message = 'La password inserita non è valida.';
        break;
      case 'auth/user-not-found':
        message = 'Non è stato trovato nessun utente con queste credenziali.';
        break;
      case 'auth/missing-email':
        message = 'Non è stata inserita nessuna mail.';
        break;
      case 'auth/missing-password':
        message = 'Non è stata inserita nessuna password.';
        break;
      case 'auth/invalid-login-credentials':
        message = 'Le credenziali non sono valide.';
        break;
      default:
        message = 'Si è verificato un errore sconosciuto.';
        break;
    }
    Swal.fire('Errore', message, 'error');
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user !== null;
  }
  getUserDetails() {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user ? { name: user.name, surname: user.surname } : null;
  }

}
