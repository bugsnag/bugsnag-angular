import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import BugsnagErrorHandler from '../../..';
import bugsnag from 'bugsnag-js';

const bugsnagClient = bugsnag('API_KEY')
export function errorHandlerFactory() {
  console.log('factory')
  return new BugsnagErrorHandler(bugsnagClient);
}

import { AppComponent } from './app.component';

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
