import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { Employee, CreateEmployeeDto } from '../../../../core/models/employee.model';

export interface EmployeeFormDialogData {
  employee: Employee | null;
  countries: string[];
  isEditMode: boolean;
}

@Component({
  selector: 'app-employee-form-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, EmployeeFormComponent],
  template: `
    <div class="dialog-header">
      <div class="header-title">
        <mat-icon color="primary">{{ data.isEditMode ? 'edit' : 'person_add' }}</mat-icon>
        <h2>{{ data.isEditMode ? 'Edit Employee Details' : 'Add New Employee' }}</h2>
      </div>
      <button mat-icon-button (click)="onCancel()" aria-label="Close dialog" class="close-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="dialog-content">
      <app-employee-form
        [employee]="data.employee"
        [countries]="data.countries"
        [isEditMode]="data.isEditMode"
        (save)="onSave($event)"
        (cancel)="onCancel()"
      ></app-employee-form>
    </mat-dialog-content>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid #e2e8f0;

      .header-title {
        display: flex;
        align-items: center;
        gap: 12px;

        h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }
      }

      .close-btn {
        min-height: 44px;
        min-width: 44px;
      }
    }

    .dialog-content {
      padding: 16px 24px 24px;
      max-height: 80vh;
      overflow-y: auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeFormDialogComponent {
  readonly data: EmployeeFormDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<EmployeeFormDialogComponent>);

  onSave(payload: CreateEmployeeDto): void {
    this.dialogRef.close(payload);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
