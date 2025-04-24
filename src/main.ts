import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http'; // ✅ modern HttpClient provider

import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { environment } from './environments/environment';
import { importProvidersFrom } from '@angular/core';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),                          // ✅ fixes HttpClient injection error
    importProvidersFrom(AppRoutingModule),        // ✅ keep your routing
    provideAnimations()                           // ✅ animations
  ]
}).catch((err) => console.error(err));
