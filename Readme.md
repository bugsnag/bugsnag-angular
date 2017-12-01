# Bugsnag: Angular

A [bugsnag-js](https://github.com/bugsnag/bugsnag-js) plugin for [Angular](https://angular.io/).

This package enables you to integrate Bugsnag's error reporting with an Angular (v2+) application at a detailed level. It provides an implementation of the `@angular/core` `ErrorHandler` which you can use to capture and report unhandled errors in your app.

Reported errors will contain useful debugging info from Angular's internals, such as the component and context.

## Installation

```sh
npm i --save bugsnag-js bugsnag-angular
# or
yarn add bugsnag-js bugsnag-angular
```

## Usage

In your the root of your angular app, typically `app.module.ts`:

```typescript
// Import bugsnag-js and bugsnag-angular
import bugsnag from 'bugsnag-js';
import createPlugin from 'bugsnag-angular';

// configure Bugsnag ASAP, before any other imports
const bugsnagClient = bugsnag('api_key');
const BugsnagErrorHandler = bugsnagClient.use(createPlugin());

// ... other imports omitted for brevity

@NgModule({
  // Pass the BugsnagErrorHandler class along to the providers for your module
  providers: [ { provide: ErrorHandler, useClass: BugsnagErrorHandler } ]
  /* other properties passed to the decorator omitted for brevity */
})
```
