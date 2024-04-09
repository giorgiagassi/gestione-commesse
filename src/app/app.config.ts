import { ApplicationConfig } from '@angular/core';
import {provideRouter, withViewTransitions} from '@angular/router';

import { routes } from './app.routes';

import { initializeApp } from "firebase/app";
import {environment} from "./enviroments/enviroments";
import {getDatabase} from "firebase/database";
import { getAuth } from 'firebase/auth';
import {getStorage} from "firebase/storage";
import {provideAnimations} from "@angular/platform-browser/animations";
const firebaseApp = initializeApp(environment.firebaseConfig);

// Ottenere le istanze per Auth, Database, e Storage
const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideAnimations(),
  ],
};
