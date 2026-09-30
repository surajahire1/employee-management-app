import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { map, take } from 'rxjs/operators';

import { Employee, CreateEmployeeDto } from '../../../../core/models/employee.model';
import * as EmployeeActions from '../../../../store/employees/employee.actions';
import * as CountryActions from '../../../../store/countries/country.actions';
import {
  selectAllEmployees,
  selectDisplayedEmployees,
  selectEmployeeError,
  selectEmployeeLoading,
  selectEmployeeSaving,
  selectSearchState
} from '../../../../store/employees/employee.selectors';
import { selectUniqueSortedCountries } from '../../../../store/countries/country.selectors';

import { EmployeeTableComponent } from '../../components/employee-table/employee-table.component';
import { EmployeeSearchBarComponent } from '../../components/employee-search-bar/employee-search-bar.component';
import { StateMessageComponent } from '../../components/state-message/state-message.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog.component';
import { EmployeeFormDialogComponent, EmployeeFormDialogData } from '../../components/employee-form-dialog/employee-form-dialog.component';

@Component({
  selector: 'app-employee-list-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    EmployeeTableComponent,
    EmployeeSearchBarComponent,
    StateMessageComponent
  ],
  template: `
    <div class="page-container">
      @let searchState = (searchState$ | async);
      @let loading = (loading$ | async);
      @let error = (error$ | async);
      @let employees = (employees$ | async) ?? [];
      @let totalEmployees = (totalCount$ | async) ?? 0;

      <!-- Top Action Toolbar -->
      <header class="page-header">
        <div class="header-titles">
          <h1 class="page-title">Employee Directory</h1>
          <p class="page-subtitle">
            Manage your team members, update contact details, and search records.
          </p>
        </div>

        <div class="header-actions">
          <button
            mat-flat-button
            color="primary"
            type="button"
            (click)="onAddEmployee()"
            [disabled]="(saving$ | async) ?? false"
            class="add-btn"
          >
            <mat-icon>person_add</mat-icon>
            <span>Add Employee</span>
          </button>
        </div>
      </header>

      <!-- Global Saving Progress -->
      @if (saving$ | async) {
        <mat-progress-bar mode="indeterminate" class="saving-progress-bar"></mat-progress-bar>
      }

      <!-- Search Section -->
      <section class="search-section">
        <app-employee-search-bar
          [searchQuery]="searchState?.query ?? null"
          [searching]="searchState?.status === 'searching'"
          (search)="onSearch($event)"
          (clear)="onClearSearch()"
        ></app-employee-search-bar>
      </section>

      <!-- Content Section (Reactive States) -->
      <main class="content-section">

        @if (loading && employees.length === 0) {
          <!-- Initial Loading State -->
          <app-state-message
            type="loading"
            message="Loading employee records..."
          ></app-state-message>
        } @else if (error && employees.length === 0) {
          <!-- Initial Load Error State -->
          <app-state-message
            type="error"
            [message]="error"
            actionText="Retry"
            (action)="onRetry()"
          ></app-state-message>
        } @else if (searchState?.status === 'not_found') {
          <!-- Search 404 / Not Found State -->
          <app-state-message
            type="not-found"
            [message]="searchState?.message || 'No employee found with the requested ID'"
            actionText="Restore Full List"
            (action)="onClearSearch()"
          ></app-state-message>
        } @else if (totalEmployees === 0 && !loading && !error) {
          <!-- Empty Database State -->
          <app-state-message
            type="empty"
            message="No employees found in the directory. Start by adding a team member."
            actionText="Add Employee"
            (action)="onAddEmployee()"
          ></app-state-message>
        } @else {
          <!-- Data List State -->
          @if (searchState?.status === 'found') {
            <div class="search-filter-banner">
              <span>Showing search result for Employee ID: <strong>{{ searchState?.query }}</strong></span>
              <button mat-button color="primary" type="button" (click)="onClearSearch()">
                Clear search filter
              </button>
            </div>
          }

          <app-employee-table
            [employees]="employees"
            [loading]="loading ?? false"
            (edit)="onEditEmployee($event)"
            (delete)="onDeleteEmployee($event)"
          ></app-employee-table>
        }
      </main>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 16px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;

      .header-titles {
        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
          letter-spacing: -0.02em;
        }

        .page-subtitle {
          font-size: 0.95rem;
          color: #64748b;
          margin: 0;
        }
      }

      .header-actions {
        .add-btn {
          min-height: 44px;
          padding: 0 20px;
          gap: 8px;
          font-weight: 500;
        }
      }
    }

    .saving-progress-bar {
      margin-bottom: 16px;
      border-radius: 4px;
    }

    .search-section {
      margin-bottom: 20px;
      background: #ffffff;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }

    .search-filter-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e40af;
      padding: 8px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 0.9rem;
    }

    .content-section {
      width: 100%;
    }

    @media (max-width: 600px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;

        .header-actions .add-btn {
          width: 100%;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListPageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  readonly employees$ = this.store.select(selectDisplayedEmployees);
  readonly totalCount$ = this.store.select(selectAllEmployees).pipe(map((list) => list.length));
  readonly loading$ = this.store.select(selectEmployeeLoading);
  readonly saving$ = this.store.select(selectEmployeeSaving);
  readonly error$ = this.store.select(selectEmployeeError);
  readonly searchState$ = this.store.select(selectSearchState);
  readonly countries$ = this.store.select(selectUniqueSortedCountries);

  ngOnInit(): void {
    this.store.dispatch(EmployeeActions.loadEmployees());
    this.store.dispatch(CountryActions.loadCountries());
  }

  onSearch(id: string): void {
    this.store.dispatch(EmployeeActions.searchEmployeeById({ id }));
  }

  onClearSearch(): void {
    this.store.dispatch(EmployeeActions.clearSearch());
  }

  onRetry(): void {
    this.store.dispatch(EmployeeActions.loadEmployees());
  }

  onAddEmployee(): void {
    this.countries$.pipe(take(1)).subscribe((countries) => {
      const dialogRef = this.dialog.open(EmployeeFormDialogComponent, {
        width: '640px',
        maxWidth: '95vw',
        disableClose: true,
        data: {
          employee: null,
          countries,
          isEditMode: false
        } satisfies EmployeeFormDialogData
      });

      dialogRef.afterClosed().subscribe((result: CreateEmployeeDto | null) => {
        if (result) {
          this.store.dispatch(EmployeeActions.addEmployee({ employee: result }));
        }
      });
    });
  }

  onEditEmployee(employee: Employee): void {
    this.countries$.pipe(take(1)).subscribe((countries) => {
      const dialogRef = this.dialog.open(EmployeeFormDialogComponent, {
        width: '640px',
        maxWidth: '95vw',
        disableClose: true,
        data: {
          employee,
          countries,
          isEditMode: true
        } satisfies EmployeeFormDialogData
      });

      dialogRef.afterClosed().subscribe((result: CreateEmployeeDto | null) => {
        if (result) {
          this.store.dispatch(
            EmployeeActions.updateEmployee({
              id: employee.id,
              employee: result
            })
          );
        }
      });
    });
  }

  onDeleteEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      maxWidth: '90vw',
      disableClose: true,
      data: {
        title: 'Delete Employee',
        message: `Delete ${employee.name}? This cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDestructive: true
      } satisfies ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(
          EmployeeActions.deleteEmployee({
            id: employee.id,
            employeeName: employee.name
          })
        );
      }
    });
  }
}
