# Bugsnag: Angular Example

This example shows how you can use the Bugsnag JavaScript notifier with
[Angular 2+](https://angular.io/).

Whilst the notifier reports any errors that are uncaught, there are certain errors
within Angular that get caught by its own error handler and only logged to the console.
These errors will never make it to Bugsnag by themselves and so require a little
wiring up. This is where the `bugsnag-angular` plugin steps in…

## Setup

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.3.0. Run `ng serve` for a dev server and navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Try this out with [your own Bugsnag account](https://app.bugsnag.com/user/new)!
You'll be able to see how the errors are reported in the dashboard, how breadcrumbs
are left, how errors are grouped and how they relate to the original source.

To get set up, follow the instructions below. Don't forget to replace the placeholder
API token with your own!

1. Clone the repo and `cd` this this directory:
    ```sh
    git clone git@github.com:bugsnag/bugsnag-angular.git
    cd bugsnag-angular
    ```
1. Install the dependencies (with either npm or yarn):
    ```sh
    npm i
    ```
    ```sh
    yarn
    ```
1. Replace the `API_KEY` placeholder in [app.module.ts](src/app/app.module.ts) with your actual API key.
1. Build the application and start the development web server:
    ```sh
    npm start
    ```
1. View the example page which will (most likely) be served at: http://localhost:4200/
