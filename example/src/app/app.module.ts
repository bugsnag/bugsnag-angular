import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
 // import our Angular plugin
import BugsnagErrorHandler from 'bugsnag-angular';
// import the bugsnag-js client you initialized in bugsnag.ts
import bugsnagClient from './bugsnag';

// There are certain errors within Angular that get caught by its own error handler and only logged to the console. These errors will never make it to Bugsnag by themselves and so require a little wiring up.
export function errorHandlerFactory() {
  return new BugsnagErrorHandler(bugsnagClient)
}

import { AppComponent } from './app.component';

// below is a basic manual notification to Bugsnag, akin to logging.
bugsnagClient.notify(new Error('Root module loaded.'), {
  // This notification would be sent with severity: 'warning' by default, but you can modify this (and many other) attribute before sending.
  severity: 'info'
  });

// for an even simpler notification, try:
// bugsnagClient.notify("Something");

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    { provide: ErrorHandler, useFactory: errorHandlerFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
