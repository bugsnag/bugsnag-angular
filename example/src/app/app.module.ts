import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import bugsnag from 'bugsnag-js';
import createPlugin from 'bugsnag-angular';

const bugsnagClient = bugsnag('api_key');
const BugsnagErrorHandler = bugsnagClient.use(createPlugin());

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ { provide: ErrorHandler, useClass: BugsnagErrorHandler } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
