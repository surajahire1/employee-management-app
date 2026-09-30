import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type StateMessageType = 'loading' | 'error' | 'empty' | 'not-found';

@Component({
  selector: 'app-state-message',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule],
  template: `
    <div class="state-container" [ngClass]="type">
      @if (type === 'loading') {
        <mat-spinner diameter="48" strokeWidth="4"></mat-spinner>
        <p class="state-text">{{ message || 'Loading, please wait...' }}</p>
      } @else if (type === 'error') {
        <div class="icon-circle error">
          <mat-icon>error_outline</mat-icon>
        </div>
        <h3 class="state-heading">Something went wrong</h3>
        <p class="state-text">{{ message || 'Failed to load data. Please try again.' }}</p>
        <button mat-flat-button color="primary" type="button" (click)="action.emit()">
          <mat-icon>refresh</mat-icon>
          <span>{{ actionText || 'Retry' }}</span>
        </button>
      } @else if (type === 'empty') {
        <div class="icon-circle empty">
          <mat-icon>people_outline</mat-icon>
        </div>
        <h3 class="state-heading">No employees yet</h3>
        <p class="state-text">{{ message || 'Start building your team by adding the first employee.' }}</p>
        <button mat-flat-button color="primary" type="button" (click)="action.emit()">
          <mat-icon>person_add</mat-icon>
          <span>{{ actionText || 'Add Employee' }}</span>
        </button>
      } @else if (type === 'not-found') {
        <div class="icon-circle not-found">
          <mat-icon>search_off</mat-icon>
        </div>
        <h3 class="state-heading">No Results</h3>
        <p class="state-text">{{ message || 'No employee found matching your search criteria.' }}</p>
        <button mat-stroked-button color="primary" type="button" (click)="action.emit()">
          <mat-icon>arrow_back</mat-icon>
          <span>{{ actionText || 'Restore Full List' }}</span>
        </button>
      }
    </div>
  `,
  styles: [`
    .state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 16px;
      text-align: center;
      background: #ffffff;
      border-radius: 12px;
      margin: 16px 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      min-height: 260px;
    }

    .icon-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin-bottom: 16px;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }

      &.error {
        background-color: #fee2e2;
        color: #dc2626;
      }

      &.empty {
        background-color: #e0f2fe;
        color: #0284c7;
      }

      &.not-found {
        background-color: #fef3c7;
        color: #d97706;
      }
    }

    .state-heading {
      font-size: 1.25rem;
      font-weight: 600;
      color: #0f172a;
      margin: 0 0 8px 0;
    }

    .state-text {
      font-size: 0.95rem;
      color: #64748b;
      max-width: 440px;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }

    button {
      min-height: 44px;
      min-width: 140px;
      gap: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMessageComponent {
  @Input() type: StateMessageType = 'empty';
  @Input() message?: string | null;
  @Input() actionText?: string;
  @Output() action = new EventEmitter<void>();
}
