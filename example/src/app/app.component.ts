import { Component } from '@angular/core';
import bugsnagClient from './bugsnag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  doARenderError = false;
  doAHandledError = false;

  // this function is triggered by the 'unhandled' button in app.component.html
  triggerRenderError() {
    // the below line causes an unhandled exception in the html itself, which will then be reported to your dashboard automatically.
    this.doARenderError = true;
    // resets the button
    setTimeout(function () {
      this.doARenderError = false;
    }.bind(this), 1000);
  }

  // this function is triggered by the 'handled' button in app.component.html
  triggerHandledError() {
    this.doAHandledError = true;

    try {
      // potentially buggy code goes here
      //for this example, we're just throwing an error explicitly, but you do not need this syntax in your try clause.
      throw("Bad thing!");
    } catch (e) {
      // below modifies the handled error, and then sends it to your dashboard.

      bugsnagClient.notify(e, {
        context: 'Don\'t worry - I handled it.'
      });
    }
    // resets the button
    setTimeout(function () {
    this.doAHandledError = false;
    }.bind(this), 1000);
  }
}
