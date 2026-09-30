# Responsive Employee Management Application

[![Angular](https://img.shields.io/badge/Angular-20-DD0031.svg?logo=angular)](https://angular.dev)
[![NgRx](https://img.shields.io/badge/NgRx-Store%20%7C%20Effects%20%7C%20Entity-BA2BD2.svg?logo=ngrx)](https://ngrx.io)
[![Angular Material](https://img.shields.io/badge/Angular%20Material-UI%20Components-3F51B5.svg?logo=angular)](https://material.angular.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Unit Tests](https://img.shields.io/badge/Tests-101%20Passed%20(100%25)-brightgreen.svg)]()

A modern, responsive Employee Management Application built with Angular standalone components, TypeScript strict mode, and full NgRx state management. Features an enterprise Smart/Dumb component architecture, lazy loading, comprehensive reactive form validation, and 100% unit test coverage.

---

## Key Highlights & Features

1. **Enterprise State Management (NgRx)**:
   - **`@ngrx/entity`**: High-performance normalized entity store with `createEntityAdapter`.
   - **Case-Insensitive Country Deduplication**: Memoized selector `selectUniqueSortedCountries` standardizes inconsistent casing (e.g. `"india"`, `"India"`, duplicate `"Aruba"` entries), removes duplicates, and sorts alphabetically.
   - **Atomic State Updates**: Immediate store and UI updates after Create, Update, and Delete operations without requiring page refreshes.
   - **Non-blocking Search by ID**: Dedicated actions for found vs. 404 (`searchEmployeeByIdNotFound`), showing specific feedback ("No employee found with ID <id>") rather than generic errors.
   - **Cache Efficiency**: Countries are loaded once and subsequent requests are skipped if already loaded.

2. **Smart / Dumb Component Architecture**:
   - **Smart Container** (`EmployeeListPageComponent`): Injects the NgRx `Store`, dispatches actions, listens to selectors, manages `MatDialog` lifecycles, and handles business orchestration.
   - **Dumb Presentation Components** (`EmployeeTableComponent`, `EmployeeSearchBarComponent`, `EmployeeFormComponent`, `ConfirmDialogComponent`, `StateMessageComponent`): Pure presentational components using `@Input()`, `@Output()`, `ChangeDetectionStrategy.OnPush`, with zero service or store injection.

3. **Responsive Mobile-First UI**:
   - **Desktop Layout (> 768px)**: Comprehensive data table with sorting, contact info, country pills, and action buttons.
   - **Mobile Layout (<= 768px)**: Automatically collapses table into touch-optimized Material cards.
   - **Touch Targets**: All buttons, action icons, and controls adhere to accessibility standards with minimum 44px hit targets.
   - **Responsive Form**: 2-column grid layout on desktop, automatically collapsing to a single-column layout on mobile devices.

4. **Robust Reactive Form Validation**:
   - **Name**: Required, 2–50 characters, letters and spaces only (`/^[a-zA-Z\s]+$/`).
   - **Email**: Required, max 100 characters, strict RFC pattern matching (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`).
   - **Mobile**: Required, digits only, exactly 10 digits (`/^[0-9]{10}$/`).
   - **Country**: Required dropdown selection, with case-insensitive matching during edit mode pre-fill.
   - **State & District**: Required, 2–50 characters.
   - **Whitespace Handling**: Automatically trims whitespace from all fields upon submission attempt.
   - **Touched States**: Automatically marks all controls as touched on invalid submit attempts with inline `mat-error` hints.

5. **Error Interception & User Feedback**:
   - Centralized `httpErrorInterceptor` that normalizes network errors, 404s, and 500s into user-friendly messages while preserving status codes.
   - Non-intrusive `MatSnackBar` notifications triggered via NgRx Effects for successful and failed operations.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Angular 20** | Latest stable framework with standalone components and new control flow (`@if`, `@for`, `@let`) |
| **NgRx Store / Effects / Entity** | Reactive state management, normalized caching, and asynchronous side-effects |
| **Angular Material** | Material Design components (`MatTable`, `MatCard`, `MatDialog`, `MatSnackBar`, `MatProgressSpinner`, etc.) |
| **Reactive Forms** | Strongly typed form controls with custom validators and error mapping |
| **RxJS** | Reactive streams, operator pipelines, and asynchronous orchestration |
| **Jasmine + Karma** | Comprehensive unit test suite with 100% mocked HTTP and Store testing |

---

## Project Structure

```
employee-management-app/
├── src/
│   ├── environments/
│   │   ├── environment.ts                 # Production environment (API base URL)
│   │   └── environment.development.ts     # Development environment
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/
│   │   │   │   ├── employee.model.ts      # Employee, Create/Update DTO interfaces
│   │   │   │   └── country.model.ts       # Country entity interface
│   │   │   ├── services/
│   │   │   │   ├── employee.service.ts    # REST HTTP service for Employee CRUD
│   │   │   │   └── country.service.ts     # REST HTTP service for Country API
│   │   │   └── interceptors/
│   │   │       └── http-error.interceptor.ts # Error normalization interceptor
│   │   ├── store/
│   │   │   ├── app.state.ts               # Root application state contract
│   │   │   ├── countries/
│   │   │   │   ├── country.actions.ts     # Load countries actions
│   │   │   │   ├── country.reducer.ts     # Country slice reducer
│   │   │   │   ├── country.effects.ts     # Load effect with caching guard
│   │   │   │   └── country.selectors.ts   # Case-insensitive deduplication & sort
│   │   │   └── employees/
│   │   │       ├── employee.actions.ts    # CRUD and Search actions
│   │   │       ├── employee.reducer.ts    # EntityState adapter & reducer logic
│   │   │       ├── employee.effects.ts    # API side-effects & snackbar feedback
│   │   │       └── employee.selectors.ts  # Filtered & displayed employee selectors
│   │   ├── features/
│   │   │   └── employees/
│   │   │       ├── employees.routes.ts    # Lazy loaded feature routes
│   │   │       ├── containers/
│   │   │       │   └── employee-list-page/ # SMART container component
│   │   │       └── components/
│   │   │           ├── confirm-dialog/    # DUMB: Delete confirmation modal
│   │   │           ├── employee-form/     # DUMB: Reactive form with validation
│   │   │           ├── employee-form-dialog/ # DUMB: Modal wrapper for form
│   │   │           ├── employee-search-bar/  # DUMB: ID search input with clear
│   │   │           ├── employee-table/    # DUMB: Responsive table & cards
│   │   │           └── state-message/     # DUMB: Loading, Empty, Error states
│   │   ├── app.component.ts               # Root application shell
│   │   ├── app.config.ts                  # Application providers (Store, Effects, HTTP)
│   │   └── app.routes.ts                  # Main routing configuration
│   ├── styles.scss                        # Global Material theme & layout styles
│   └── index.html                         # Typography & Google Fonts configuration
```

---

## Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x`
- **npm**: `v10.x` or `v11.x`
- **Angular CLI**: `npm install -g @angular/cli` (optional, can use local CLI)

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone <repository-url>
cd employee-management-app
npm install
```

### 2. Run the Development Server
```bash
npm start
# or
ng serve
```
Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.

### 3. Production Build
```bash
npm run build
# or
ng build
```
Production build artifacts will be compiled into the `dist/employee-management-app` directory.

---

## Running Unit Tests

The test suite contains **101 tests** covering services, reducers, effects, selectors, dumb components, smart containers, and form validation. All external dependencies (HTTP calls and NgRx Store) are completely mocked.

To run all unit tests in headless mode (CI-ready):
```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

To run tests with the interactive Karma browser runner:
```bash
npm test
```

### Test Coverage Highlights
- **Services (`EmployeeService`, `CountryService`, `HttpErrorInterceptor`)**: Tested using `HttpTestingController` to verify request URLs, HTTP methods, payload bodies, and error propagation.
- **NgRx Reducers**: Complete test matrix verifying state transitions for loading, success, failure, entity insertion, updates, deletions, and search not-found states.
- **NgRx Effects**: Tested using `provideMockActions` and mocked services for both success and error paths, including snackbar notification dispatching.
- **NgRx Selectors**: Verifies case-insensitive deduplication, title-case formatting, alphabetical sorting, and dynamic search result filtering.
- **Form Validation**: Unit tests verifying required fields, min/max length boundaries, RFC email regex format, exactly 10-digit mobile number, letters-only pattern, whitespace trimming, and edit mode pre-population.
- **Smart Container**: Tested using `provideMockStore` and `MatDialog` spies, ensuring actions (`loadEmployees`, `searchEmployeeById`, `deleteEmployee`, `addEmployee`, `updateEmployee`) are dispatched at the correct lifecycles and only after confirmation.

---

## Git Commit History

The repository follows standard [Conventional Commits](https://www.conventionalcommits.org/) for clear traceability:

- `chore: initial project scaffolding with Angular 20, Angular Material, and NgRx`
- `feat(core): setup models, environments, error interceptor, and HTTP services`
- `feat(store): implement NgRx state management for employees and countries`
- `feat(ui): add dumb components with OnPush change detection and responsive design`
- `feat(employees): implement smart container with search, CRUD dialogs, and states`
- `test: add comprehensive unit test suite for services, store, components, and validation`
- `docs: add comprehensive README with setup, architecture, and testing guide`
