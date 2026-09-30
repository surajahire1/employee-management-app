import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-employee-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="search-bar-container">
      <mat-form-field appearance="outline" class="search-input-field" subscriptSizing="dynamic">
        <mat-label>Search by Employee ID</mat-label>
        <mat-icon matPrefix>badge</mat-icon>
        <input
          matInput
          type="text"
          placeholder="e.g. 1, 2, 45"
          [(ngModel)]="currentValue"
          (keydown.enter)="onSearch()"
          [disabled]="searching"
        />
        @if (currentValue) {
          <button
            mat-icon-button
            matSuffix
            type="button"
            (click)="onClear()"
            [disabled]="searching"
            aria-label="Clear search input"
          >
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>

      <div class="action-buttons">
        <button
          mat-flat-button
          color="primary"
          type="button"
          (click)="onSearch()"
          [disabled]="!currentValue.trim() || searching"
          class="search-btn"
        >
          @if (searching) {
            <mat-spinner diameter="18" strokeWidth="2"></mat-spinner>
          } @else {
            <mat-icon>search</mat-icon>
          }
          <span>Search</span>
        </button>

        @if (searchQuery) {
          <button
            mat-stroked-button
            type="button"
            (click)="onClear()"
            [disabled]="searching"
            class="clear-btn"
          >
            <mat-icon>restart_alt</mat-icon>
            <span>Clear</span>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .search-bar-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 12px;
      width: 100%;
      flex-wrap: wrap;
    }

    .search-input-field {
      flex: 1 1 240px;
      min-width: 220px;
    }

    .action-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    button {
      min-height: 44px;
      padding: 0 16px;
      gap: 8px;
    }

    .search-btn {
      display: flex;
      align-items: center;
    }

    @media (max-width: 600px) {
      .search-bar-container {
        flex-direction: column;
        align-items: stretch;
      }
      .action-buttons {
        display: flex;
        justify-content: stretch;
        button {
          flex: 1;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeSearchBarComponent implements OnChanges {
  @Input() searchQuery: string | null = null;
  @Input() searching = false;

  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  currentValue = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery']) {
      this.currentValue = this.searchQuery ?? '';
    }
  }

  onSearch(): void {
    const trimmed = this.currentValue.trim();
    if (trimmed && !this.searching) {
      this.search.emit(trimmed);
    }
  }

  onClear(): void {
    this.currentValue = '';
    this.clear.emit();
  }
}
