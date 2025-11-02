import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

// --- ADD THIS LINE AT THE TOP ---
import 'zone.js';
// ------------------------------------

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));