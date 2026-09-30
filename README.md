# Employee Management Application

A responsive employee management application built with Angular 20, NgRx, and Angular Material. It connects to a REST API to support full CRUD operations, employee search by ID, case-insensitive country deduplication, responsive layouts (table on desktop and cards on mobile), and unit test coverage.

## Features

- **Employee List & Card View**: Responsive layout displaying employee details (Name, Email, Mobile, Country) in a Material table on desktop and compact Material cards on mobile devices (<768px).
- **ID Search & State Restoration**: Direct search by employee ID. Handles 404 responses gracefully with a clear "Not Found" message rather than a generic error. Restores full list upon clearing search.
- **Add & Edit Modal Form**: Reactive form with custom validation (letters-only name, RFC-compliant email regex, 10-digit mobile, country dropdown with case-insensitive matching for existing records, state, and district).
- **Delete Confirmation**: Confirmation dialog protecting against accidental deletion.
- **NgRx State Management**: Normalized entity caching via `@ngrx/entity`, asynchronous side-effects via `@ngrx/effects`, and automatic snackbar notifications.
- **Country Deduplication**: Memoized selector that normalizes casing (e.g., `"india"` vs `"India"`) and sorts countries alphabetically.
- **Unit Tests**: Full test suite across services, reducers, effects, selectors, dumb components, form validation, and smart container.

## Getting Started

### Prerequisites
- Node.js 20 or 22
- npm 10 or 11
- Angular CLI (`npm i -g @angular/cli` optional)

### Installation
```bash
git clone https://github.com/surajahire1/employee-management-app.git
cd employee-management-app
npm install
```

### Running Development Server
```bash
npm start
```
Navigate to `http://localhost:4200/`.

### Running Tests
Run all unit tests in headless Chrome:
```bash
npm test -- --watch=false --browsers=ChromeHeadless
```
Or run the interactive Karma test runner:
```bash
npm test
```

### Production Build
```bash
npm run build
```
Build output is generated in `dist/employee-management-app`.

## Architecture Overview

```
src/app/
├── core/
│   ├── interceptors/    # httpErrorInterceptor (normalizes error messages)
│   ├── models/          # Employee and Country interfaces & DTOs
│   └── services/        # EmployeeService & CountryService
├── store/
│   ├── countries/       # Country actions, reducer, effects, selectors
│   ├── employees/       # Employee actions, reducer, effects, selectors
│   └── app.state.ts     # Root state definition
├── features/
│   └── employees/
│       ├── components/  # Presentation (dumb) components: table, form, search, dialogs
│       ├── containers/  # Smart container: employee-list-page
│       └── employees.routes.ts # Lazy-loaded routes
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

- **Smart Component** (`EmployeeListPageComponent`): Manages state subscriptions, dispatches actions, opens dialogs, and coordinates loading/error states.
- **Dumb Components** (`EmployeeTableComponent`, `EmployeeFormComponent`, etc.): Pure presentation with `ChangeDetectionStrategy.OnPush`, `@Input`, and `@Output`.
- **Environment Config**: API base URL is centralized in `src/environments/environment.ts`.
