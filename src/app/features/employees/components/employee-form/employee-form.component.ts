import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Employee, CreateEmployeeDto } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="employee-form" novalidate>
      <div class="form-grid">
        <!-- Name -->
        <mat-form-field appearance="outline" class="form-field full-width">
          <mat-label>Full Name</mat-label>
          <input matInput formControlName="name" placeholder="e.g. John Doe" />
          <mat-icon matPrefix>person</mat-icon>
          @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
            <mat-error>Name is required</mat-error>
          }
          @if (form.get('name')?.hasError('minlength') && form.get('name')?.touched) {
            <mat-error>Name must be at least 2 characters</mat-error>
          }
          @if (form.get('name')?.hasError('maxlength') && form.get('name')?.touched) {
            <mat-error>Name cannot exceed 50 characters</mat-error>
          }
          @if (form.get('name')?.hasError('pattern') && form.get('name')?.touched) {
            <mat-error>Name must contain letters and spaces only</mat-error>
          }
        </mat-form-field>

        <!-- Email -->
        <mat-form-field appearance="outline" class="form-field full-width">
          <mat-label>Email Address</mat-label>
          <input matInput type="email" formControlName="email" placeholder="e.g. john@example.com" />
          <mat-icon matPrefix>email</mat-icon>
          @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
            <mat-error>Email is required</mat-error>
          }
          @if (form.get('email')?.hasError('pattern') && form.get('email')?.touched) {
            <mat-error>Please enter a valid email address (e.g. user&#64;example.com)</mat-error>
          }
          @if (form.get('email')?.hasError('maxlength') && form.get('email')?.touched) {
            <mat-error>Email cannot exceed 100 characters</mat-error>
          }
        </mat-form-field>

        <!-- Mobile -->
        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Mobile (10 digits)</mat-label>
          <input matInput formControlName="mobile" placeholder="e.g. 9876543210" maxlength="10" />
          <mat-icon matPrefix>phone</mat-icon>
          @if (form.get('mobile')?.hasError('required') && form.get('mobile')?.touched) {
            <mat-error>Mobile number is required</mat-error>
          }
          @if (form.get('mobile')?.hasError('pattern') && form.get('mobile')?.touched) {
            <mat-error>Mobile number must be exactly 10 digits</mat-error>
          }
        </mat-form-field>

        <!-- Country -->
        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Country</mat-label>
          <mat-select formControlName="country" placeholder="Select Country">
            @for (country of countries; track country) {
              <mat-option [value]="country">{{ country }}</mat-option>
            }
          </mat-select>
          <mat-icon matPrefix>public</mat-icon>
          @if (form.get('country')?.hasError('required') && form.get('country')?.touched) {
            <mat-error>Please select a country</mat-error>
          }
        </mat-form-field>

        <!-- State -->
        <mat-form-field appearance="outline" class="form-field">
          <mat-label>State</mat-label>
          <input matInput formControlName="state" placeholder="e.g. California" />
          <mat-icon matPrefix>map</mat-icon>
          @if (form.get('state')?.hasError('required') && form.get('state')?.touched) {
            <mat-error>State is required</mat-error>
          }
          @if (form.get('state')?.hasError('minlength') && form.get('state')?.touched) {
            <mat-error>State must be at least 2 characters</mat-error>
          }
          @if (form.get('state')?.hasError('maxlength') && form.get('state')?.touched) {
            <mat-error>State cannot exceed 50 characters</mat-error>
          }
        </mat-form-field>

        <!-- District -->
        <mat-form-field appearance="outline" class="form-field">
          <mat-label>District</mat-label>
          <input matInput formControlName="district" placeholder="e.g. Central District" />
          <mat-icon matPrefix>location_city</mat-icon>
          @if (form.get('district')?.hasError('required') && form.get('district')?.touched) {
            <mat-error>District is required</mat-error>
          }
          @if (form.get('district')?.hasError('minlength') && form.get('district')?.touched) {
            <mat-error>District must be at least 2 characters</mat-error>
          }
          @if (form.get('district')?.hasError('maxlength') && form.get('district')?.touched) {
            <mat-error>District cannot exceed 50 characters</mat-error>
          }
        </mat-form-field>
      </div>

      <div class="form-actions">
        <button
          mat-button
          type="button"
          (click)="onCancel()"
          [disabled]="saving"
          class="cancel-btn"
        >
          Cancel
        </button>
        <button
          mat-flat-button
          color="primary"
          type="submit"
          [disabled]="form.invalid || saving"
          class="save-btn"
        >
          @if (saving) {
            <mat-spinner diameter="18" strokeWidth="2"></mat-spinner>
          } @else {
            <mat-icon>{{ isEditMode ? 'check' : 'person_add' }}</mat-icon>
          }
          <span>{{ isEditMode ? 'Update Employee' : 'Add Employee' }}</span>
        </button>
      </div>
    </form>
  `,
  styles: [`
    .employee-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 8px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 16px;

      .full-width {
        grid-column: 1 / -1;
      }
    }

    .form-field {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 12px;
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;

      button {
        min-height: 44px;
        min-width: 120px;
        gap: 8px;
      }
    }

    // Responsive: Single-column on mobile (<768px)
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;

        .full-width {
          grid-column: 1;
        }
      }

      .form-actions {
        flex-direction: column-reverse;
        align-items: stretch;

        button {
          width: 100%;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeFormComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() employee: Employee | null = null;
  @Input() countries: string[] = [];
  @Input() saving = false;
  @Input() isEditMode = false;

  @Output() save = new EventEmitter<CreateEmployeeDto>();
  @Output() cancel = new EventEmitter<void>();

  // Regex patterns per requirements:
  // Name: letters and spaces only
  private readonly namePattern = /^[a-zA-Z\s]+$/;
  // Email: pattern-based, RFC-compliant format
  private readonly emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // Mobile: digits only, exactly 10 digits
  private readonly mobilePattern = /^[0-9]{10}$/;

  form: FormGroup = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(this.namePattern)
      ]
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(this.emailPattern)
      ]
    ],
    mobile: [
      '',
      [Validators.required, Validators.pattern(this.mobilePattern)]
    ],
    country: ['', [Validators.required]],
    state: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
    ],
    district: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
    ]
  });

  ngOnInit(): void {
    this.populateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] || changes['countries']) {
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (!this.employee) {
      return;
    }

    // Match country case-insensitively with available dropdown options
    let selectedCountry = this.employee.country || '';
    if (this.countries && this.countries.length > 0 && selectedCountry) {
      const match = this.countries.find(
        (c) => c.toLowerCase() === selectedCountry.trim().toLowerCase()
      );
      if (match) {
        selectedCountry = match;
      }
    }

    this.form.patchValue({
      name: this.employee.name ?? '',
      email: this.employee.email ?? '',
      mobile: this.normalizeMobile(this.employee.mobile),
      country: selectedCountry,
      state: this.employee.state ?? '',
      district: this.employee.district ?? ''
    });
  }

  private normalizeMobile(mobile: string | undefined): string {
    if (!mobile) return '';
    // Strip any leading country codes like "+91" to extract 10 digits
    const digitsOnly = mobile.replace(/\D/g, '');
    if (digitsOnly.length > 10) {
      return digitsOnly.slice(-10);
    }
    return digitsOnly;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.saving) {
      return;
    }

    const val = this.form.getRawValue();
    const payload: CreateEmployeeDto = {
      name: (val.name || '').trim(),
      email: (val.email || '').trim(),
      mobile: (val.mobile || '').trim(),
      country: (val.country || '').trim(),
      state: (val.state || '').trim(),
      district: (val.district || '').trim()
    };

    this.save.emit(payload);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
