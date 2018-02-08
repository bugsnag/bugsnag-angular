import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import BugsnagErrorHandler from 'bugsnag-angular';
import bugsnagClient from './bugsnag';

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
