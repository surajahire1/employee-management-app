import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { EmployeeFormComponent } from './employee-form.component';
import { Employee, CreateEmployeeDto } from '../../../../core/models/employee.model';

describe('EmployeeFormComponent', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeFormComponent],
      providers: [provideNoopAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the form component and initialize invalid form', () => {
    expect(component).toBeTruthy();
    expect(component.form.valid).toBeFalse();
  });

  describe('Form Validation Rules', () => {
    it('should validate Name: required, min 2, max 50, letters and spaces only', () => {
      const nameControl = component.form.get('name')!;

      // Required
      nameControl.setValue('');
      expect(nameControl.hasError('required')).toBeTrue();

      // Minlength 2
      nameControl.setValue('A');
      expect(nameControl.hasError('minlength')).toBeTrue();

      // Maxlength 50
      nameControl.setValue('A'.repeat(51));
      expect(nameControl.hasError('maxlength')).toBeTrue();

      // Pattern: letters & spaces only
      nameControl.setValue('John Doe 123');
      expect(nameControl.hasError('pattern')).toBeTrue();

      nameControl.setValue('John Doe');
      expect(nameControl.valid).toBeTrue();
    });

    it('should validate Email: required, max 100, pattern-based RFC check', () => {
      const emailControl = component.form.get('email')!;

      // Required
      emailControl.setValue('');
      expect(emailControl.hasError('required')).toBeTrue();

      // Invalid patterns
      emailControl.setValue('invalid-email');
      expect(emailControl.hasError('pattern')).toBeTrue();

      emailControl.setValue('test@');
      expect(emailControl.hasError('pattern')).toBeTrue();

      emailControl.setValue('test@domain');
      expect(emailControl.hasError('pattern')).toBeTrue();

      // Maxlength 100
      emailControl.setValue('a'.repeat(95) + '@test.com');
      expect(emailControl.hasError('maxlength')).toBeTrue();

      // Valid
      emailControl.setValue('john.doe@example.com');
      expect(emailControl.valid).toBeTrue();
    });

    it('should validate Mobile: required, exactly 10 digits', () => {
      const mobileControl = component.form.get('mobile')!;

      // Required
      mobileControl.setValue('');
      expect(mobileControl.hasError('required')).toBeTrue();

      // Letters/symbols
      mobileControl.setValue('98765abcde');
      expect(mobileControl.hasError('pattern')).toBeTrue();

      // Less than 10 digits
      mobileControl.setValue('12345');
      expect(mobileControl.hasError('pattern')).toBeTrue();

      // Exactly 10 digits
      mobileControl.setValue('9876543210');
      expect(mobileControl.valid).toBeTrue();
    });

    it('should validate Country: required', () => {
      const countryControl = component.form.get('country')!;
      countryControl.setValue('');
      expect(countryControl.hasError('required')).toBeTrue();

      countryControl.setValue('India');
      expect(countryControl.valid).toBeTrue();
    });

    it('should validate State and District: required, min 2, max 50', () => {
      const stateControl = component.form.get('state')!;
      const districtControl = component.form.get('district')!;

      stateControl.setValue('A');
      expect(stateControl.hasError('minlength')).toBeTrue();

      districtControl.setValue('');
      expect(districtControl.hasError('required')).toBeTrue();

      stateControl.setValue('California');
      districtControl.setValue('Orange County');
      expect(stateControl.valid).toBeTrue();
      expect(districtControl.valid).toBeTrue();
    });
  });

  describe('Form Submissions and Trimming', () => {
    it('should mark all controls as touched if submitted when invalid', () => {
      spyOn(component.save, 'emit');
      component.onSubmit();

      expect(component.form.get('name')!.touched).toBeTrue();
      expect(component.form.get('email')!.touched).toBeTrue();
      expect(component.form.get('mobile')!.touched).toBeTrue();
      expect(component.save.emit).not.toHaveBeenCalled();
    });

    it('should trim whitespace before emitting payload', () => {
      spyOn(component.save, 'emit');

      component.form.setValue({
        name: '   John Doe   ',
        email: 'john@example.com',
        mobile: '9876543210',
        country: 'India',
        state: '  Maharashtra  ',
        district: '  Pune  '
      });

      expect(component.form.valid).toBeTrue();
      component.onSubmit();

      expect(component.save.emit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '9876543210',
        country: 'India',
        state: 'Maharashtra',
        district: 'Pune'
      });
    });

    it('should emit cancel event on onCancel()', () => {
      spyOn(component.cancel, 'emit');
      component.onCancel();
      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });

  describe('Edit Mode and Case-Insensitive Country Matching', () => {
    it('should match country case-insensitively when pre-populating edit form', () => {
      component.countries = ['Aruba', 'Belgium', 'India', 'United States'];
      const mockEmployee: Employee = {
        id: '1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        mobile: '+919876543210',
        country: 'india', // Inconsistent lowercase casing in API data
        state: 'Maharashtra',
        district: 'Pune'
      };

      component.employee = mockEmployee;
      component.isEditMode = true;
      component.ngOnChanges({
        employee: {
          currentValue: mockEmployee,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // Should match "India" from countries list
      expect(component.form.get('country')!.value).toBe('India');
      expect(component.form.get('name')!.value).toBe('Jane Doe');
      // Stripped mobile code
      expect(component.form.get('mobile')!.value).toBe('9876543210');
    });
  });
});
