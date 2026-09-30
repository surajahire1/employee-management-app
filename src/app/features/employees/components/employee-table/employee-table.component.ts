import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Employee } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <!-- Desktop Table View (>768px) -->
    <div class="table-container desktop-only">
      <table mat-table [dataSource]="employees" class="mat-elevation-z1 employee-mat-table">
        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let emp" class="name-cell">
            <div class="user-info">
              <div class="avatar-badge">{{ getInitials(emp.name) }}</div>
              <div>
                <span class="user-name">{{ emp.name }}</span>
                <span class="user-id">ID: {{ emp.id }}</span>
              </div>
            </div>
          </td>
        </ng-container>

        <!-- Email Column -->
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let emp">
            <span class="cell-text email-text">{{ emp.email }}</span>
          </td>
        </ng-container>

        <!-- Mobile Column -->
        <ng-container matColumnDef="mobile">
          <th mat-header-cell *matHeaderCellDef>Mobile</th>
          <td mat-cell *matCellDef="let emp">
            <span class="cell-text">{{ emp.mobile }}</span>
          </td>
        </ng-container>

        <!-- Country Column -->
        <ng-container matColumnDef="country">
          <th mat-header-cell *matHeaderCellDef>Country</th>
          <td mat-cell *matCellDef="let emp">
            <span class="country-pill">{{ emp.country }}</span>
          </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef class="actions-header">Actions</th>
          <td mat-cell *matCellDef="let emp" class="actions-cell">
            <button
              mat-icon-button
              color="primary"
              (click)="onEdit(emp)"
              [disabled]="loading"
              matTooltip="Edit employee"
              aria-label="Edit employee"
              class="action-btn"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              (click)="onDelete(emp)"
              [disabled]="loading"
              matTooltip="Delete employee"
              aria-label="Delete employee"
              class="action-btn"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns" class="table-row"></tr>
      </table>
    </div>

    <!-- Mobile Card View (<=768px) -->
    <div class="mobile-only card-list">
      @for (emp of employees; track emp.id) {
        <mat-card class="employee-card">
          <mat-card-header>
            <div mat-card-avatar class="avatar-badge">{{ getInitials(emp.name) }}</div>
            <mat-card-title class="card-title">{{ emp.name }}</mat-card-title>
            <mat-card-subtitle class="card-subtitle">ID: {{ emp.id }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content class="card-content">
            <div class="info-row">
              <mat-icon class="info-icon">email</mat-icon>
              <span class="info-text">{{ emp.email }}</span>
            </div>
            <div class="info-row">
              <mat-icon class="info-icon">phone</mat-icon>
              <span class="info-text">{{ emp.mobile }}</span>
            </div>
            <div class="info-row">
              <mat-icon class="info-icon">public</mat-icon>
              <span class="country-pill">{{ emp.country }}</span>
            </div>
            @if (emp.state || emp.district) {
              <div class="info-row">
                <mat-icon class="info-icon">location_on</mat-icon>
                <span class="info-text">{{ emp.district ? emp.district + ', ' : '' }}{{ emp.state }}</span>
              </div>
            }
          </mat-card-content>

          <mat-card-actions align="end" class="card-actions">
            <button
              mat-stroked-button
              color="primary"
              type="button"
              (click)="onEdit(emp)"
              [disabled]="loading"
              aria-label="Edit employee"
            >
              <mat-icon>edit</mat-icon>
              <span>Edit</span>
            </button>
            <button
              mat-flat-button
              color="warn"
              type="button"
              (click)="onDelete(emp)"
              [disabled]="loading"
              aria-label="Delete employee"
            >
              <mat-icon>delete</mat-icon>
              <span>Delete</span>
            </button>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .table-container {
      width: 100%;
      overflow-x: auto;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .employee-mat-table {
      width: 100%;
      background: transparent;

      th.mat-mdc-header-cell {
        font-weight: 600;
        color: #475569;
        font-size: 0.875rem;
        background-color: #f8fafc;
        border-bottom: 2px solid #e2e8f0;
        padding: 14px 16px;
      }

      td.mat-mdc-cell {
        padding: 12px 16px;
        color: #1e293b;
        border-bottom: 1px solid #f1f5f9;
      }

      tr.table-row:hover {
        background-color: #f8fafc;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar-badge {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: #ffffff;
      font-weight: 600;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
      flex-shrink: 0;
    }

    .user-name {
      display: block;
      font-weight: 500;
      color: #0f172a;
    }

    .user-id {
      display: block;
      font-size: 0.75rem;
      color: #64748b;
    }

    .cell-text {
      font-size: 0.9rem;
      color: #334155;
    }

    .country-pill {
      display: inline-block;
      padding: 4px 10px;
      background-color: #e0f2fe;
      color: #0369a1;
      font-size: 0.8125rem;
      font-weight: 500;
      border-radius: 9999px;
    }

    .actions-header {
      text-align: right !important;
    }

    .actions-cell {
      text-align: right;
      white-space: nowrap;
    }

    .action-btn {
      min-width: 44px;
      min-height: 44px;
    }

    // Responsive Breakpoint Handling
    .desktop-only {
      display: block;
    }
    .mobile-only {
      display: none;
    }

    @media (max-width: 768px) {
      .desktop-only {
        display: none;
      }
      .mobile-only {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    }

    // Mobile Card Styles
    .card-list {
      width: 100%;
    }

    .employee-card {
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      background: #ffffff;

      .card-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #0f172a;
      }

      .card-subtitle {
        color: #64748b;
        font-size: 0.8rem;
      }

      .card-content {
        padding: 12px 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .info-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
        color: #334155;

        .info-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: #64748b;
        }

        .info-text {
          word-break: break-all;
        }
      }

      .card-actions {
        padding: 8px 16px 12px;
        gap: 8px;

        button {
          min-height: 44px;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeTableComponent {
  @Input() employees: Employee[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<Employee>();
  @Output() delete = new EventEmitter<Employee>();

  displayedColumns: string[] = ['name', 'email', 'mobile', 'country', 'actions'];

  onEdit(employee: Employee): void {
    this.edit.emit(employee);
  }

  onDelete(employee: Employee): void {
    this.delete.emit(employee);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
}
