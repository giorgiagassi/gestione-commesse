import {ApplicationConfig, LOCALE_ID} from '@angular/core';
import {provideRouter, withViewTransitions} from '@angular/router';

import { routes } from './app.routes';

import { initializeApp } from "firebase/app";
import {environment} from "./enviroments/enviroments";
import {getDatabase} from "firebase/database";
import { getAuth } from 'firebase/auth';
import {getStorage} from "firebase/storage";
import {provideAnimations} from "@angular/platform-browser/animations";
import {registerLocaleData} from "@angular/common";
import localeIt                                from "@angular/common/locales/it";
const firebaseApp = initializeApp(environment.firebaseConfig);

// Ottenere le istanze per Auth, Database, e Storage
const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
registerLocaleData ( localeIt );
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'it' }
  ],
};
