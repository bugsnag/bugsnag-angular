import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import bugsnagClient from './bugsnag';
import createPlugin from 'bugsnag-angular';

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
