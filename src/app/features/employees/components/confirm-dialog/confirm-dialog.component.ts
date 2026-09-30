import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon color="warn">warning</mat-icon>
      <span>{{ data.title || 'Confirm Action' }}</span>
    </h2>

    <mat-dialog-content class="dialog-content">
      <p>{{ data.message }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button type="button" (click)="onCancel()">
        {{ data.cancelText || 'Cancel' }}
      </button>
      <button
        mat-flat-button
        [color]="data.isDestructive !== false ? 'warn' : 'primary'"
        type="button"
        (click)="onConfirm()"
      >
        {{ data.confirmText || 'Delete' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.25rem;
      margin-bottom: 8px;
    }
    .dialog-content {
      font-size: 1rem;
      color: #334155;
      line-height: 1.5;
      padding-top: 8px;
    }
    .dialog-actions {
      padding: 12px 16px;
      gap: 8px;
    }
    button {
      min-height: 44px;
      min-width: 80px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  readonly data: ConfirmDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
