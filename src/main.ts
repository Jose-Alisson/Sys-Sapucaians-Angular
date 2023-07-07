import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDX8wyaagvxJfyeh0V5z1PuL54l5ZbttCk",
  authDomain: "sys-sapucaians.firebaseapp.com",
  projectId: "sys-sapucaians",
  storageBucket: "sys-sapucaians.appspot.com",
  messagingSenderId: "443125085585",
  appId: "1:443125085585:web:93565a69a9450bf0269630",
  measurementId: "G-HRHC7BSGJF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
