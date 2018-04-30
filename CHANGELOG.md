# Changelog

## 2.0.1 (30-04-2018)

### Fixed

* Angular v4 support. We now use `ngc` version 4 to compile the built assets. The v5 compiler output was not backwards-compatible with v4 apps. v4 compiler assets are compatible with v4 and v5 apps.

## 2.0.0 (29-01-2018)

### Changed

* Restructure the library to work in both Angular's AOT and JIT modes

## 1.0.2 (05-01-2018)

### Bug fixes

* Add `@Injectable` decorator to `BugsnagErrorHandler` to fix DI error

## 1.0.1 (18-12-2017)

### Bug fixes

* Update imports for bugsnag-js@4.0.3
  [#2](https://github.com/bugsnag/bugsnag-angular/pull/2)

## 1.0.0 (04-12-2017)

Initial release
