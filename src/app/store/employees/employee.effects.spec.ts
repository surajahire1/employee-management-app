import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, throwError } from 'rxjs';
import { EmployeeEffects } from './employee.effects';
import { EmployeeService } from '../../core/services/employee.service';
import * as EmployeeActions from './employee.actions';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../../core/models/employee.model';

describe('EmployeeEffects', () => {
  let actions$: Observable<any>;
  let effects: EmployeeEffects;
  let employeeServiceSpy: jasmine.SpyObj<EmployeeService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockEmployee: Employee = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    mobile: '9876543210',
    country: 'India',
    state: 'Maharashtra',
    district: 'Pune'
  };

  beforeEach(() => {
    employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
      'getEmployees',
      'getEmployeeById',
      'createEmployee',
      'updateEmployee',
      'deleteEmployee'
    ]);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        EmployeeEffects,
        provideMockActions(() => actions$),
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    effects = TestBed.inject(EmployeeEffects);
  });

  describe('loadEmployees$', () => {
    it('should return loadEmployeesSuccess on successful fetch', (done) => {
      employeeServiceSpy.getEmployees.and.returnValue(of([mockEmployee]));
      actions$ = of(EmployeeActions.loadEmployees());

      effects.loadEmployees$.subscribe((action) => {
        expect(action).toEqual(EmployeeActions.loadEmployeesSuccess({ employees: [mockEmployee] }));
        expect(employeeServiceSpy.getEmployees).toHaveBeenCalled();
        done();
      });
    });

    it('should return loadEmployeesFailure on fetch error', (done) => {
      employeeServiceSpy.getEmployees.and.returnValue(throwError(() => new Error('Server error')));
      actions$ = of(EmployeeActions.loadEmployees());

      effects.loadEmployees$.subscribe((action) => {
        expect(action).toEqual(EmployeeActions.loadEmployeesFailure({ error: 'Server error' }));
        done();
      });
    });
  });

  describe('searchEmployeeById$', () => {
    it('should return searchEmployeeByIdSuccess when employee is found', (done) => {
      employeeServiceSpy.getEmployeeById.and.returnValue(of(mockEmployee));
      actions$ = of(EmployeeActions.searchEmployeeById({ id: '1' }));

      effects.searchEmployeeById$.subscribe((action) => {
        expect(action).toEqual(EmployeeActions.searchEmployeeByIdSuccess({ employee: mockEmployee }));
        expect(employeeServiceSpy.getEmployeeById).toHaveBeenCalledWith('1');
        done();
      });
    });

    it('should return searchEmployeeByIdNotFound on 404 response', (done) => {
      const err = new Error('Not found');
      (err as any).status = 404;
      employeeServiceSpy.getEmployeeById.and.returnValue(throwError(() => err));
      actions$ = of(EmployeeActions.searchEmployeeById({ id: '99' }));

      effects.searchEmployeeById$.subscribe((action) => {
        expect(action).toEqual(
          EmployeeActions.searchEmployeeByIdNotFound({
            id: '99',
            message: 'No employee found with ID 99'
          })
        );
        done();
      });
    });

    it('should return searchEmployeeByIdFailure on general error', (done) => {
      const err = new Error('Database disconnected');
      (err as any).status = 500;
      employeeServiceSpy.getEmployeeById.and.returnValue(throwError(() => err));
      actions$ = of(EmployeeActions.searchEmployeeById({ id: '1' }));

      effects.searchEmployeeById$.subscribe((action) => {
        expect(action).toEqual(
          EmployeeActions.searchEmployeeByIdFailure({
            error: 'Database disconnected'
          })
        );
        done();
      });
    });
  });

  describe('addEmployee$', () => {
    it('should return addEmployeeSuccess when employee is created', (done) => {
      const dto: CreateEmployeeDto = {
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '9876543210',
        country: 'India',
        state: 'Maharashtra',
        district: 'Pune'
      };

      employeeServiceSpy.createEmployee.and.returnValue(of(mockEmployee));
      actions$ = of(EmployeeActions.addEmployee({ employee: dto }));

      effects.addEmployee$.subscribe((action) => {
        expect(action).toEqual(EmployeeActions.addEmployeeSuccess({ employee: mockEmployee }));
        expect(employeeServiceSpy.createEmployee).toHaveBeenCalledWith(dto);
        done();
      });
    });

    it('should return addEmployeeFailure on error', (done) => {
      employeeServiceSpy.createEmployee.and.returnValue(throwError(() => new Error('Validation error')));
      actions$ = of(EmployeeActions.addEmployee({ employee: {} as any }));

      effects.addEmployee$.subscribe((action) => {
        expect(action).toEqual(EmployeeActions.addEmployeeFailure({ error: 'Validation error' }));
        done();
      });
    });
  });

  describe('updateEmployee$', () => {
    it('should return updateEmployeeSuccess on success', (done) => {
      const dto: UpdateEmployeeDto = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        mobile: '9876543210',
        country: 'India',
        state: 'Maharashtra',
        district: 'Pune'
      };
      const updated = { ...mockEmployee, name: 'John Updated' };

      employeeServiceSpy.updateEmployee.and.returnValue(of(updated));
      actions$ = of(EmployeeActions.updateEmployee({ id: '1', employee: dto }));

      effects.updateEmployee$.subscribe((action) => {
        expect(action).toEqual(EmployeeActions.updateEmployeeSuccess({ employee: updated }));
        expect(employeeServiceSpy.updateEmployee).toHaveBeenCalledWith('1', dto);
        done();
      });
    });

    it('should return updateEmployeeFailure on error', (done) => {
      employeeServiceSpy.updateEmployee.and.returnValue(throwError(() => new Error('Update failed')));
      actions$ = of(EmployeeActions.updateEmployee({ id: '1', employee: {} as any }));

      effects.updateEmployee$.subscribe((action) => {
        expect(action).toEqual(EmployeeActions.updateEmployeeFailure({ error: 'Update failed' }));
        done();
      });
    });
  });

  describe('deleteEmployee$', () => {
    it('should return deleteEmployeeSuccess on success', (done) => {
      employeeServiceSpy.deleteEmployee.and.returnValue(of(mockEmployee));
      actions$ = of(EmployeeActions.deleteEmployee({ id: '1', employeeName: 'John Doe' }));

      effects.deleteEmployee$.subscribe((action) => {
        expect(action).toEqual(EmployeeActions.deleteEmployeeSuccess({ id: '1', employeeName: 'John Doe' }));
        expect(employeeServiceSpy.deleteEmployee).toHaveBeenCalledWith('1');
        done();
      });
    });

    it('should return deleteEmployeeFailure on error', (done) => {
      employeeServiceSpy.deleteEmployee.and.returnValue(throwError(() => new Error('Delete failed')));
      actions$ = of(EmployeeActions.deleteEmployee({ id: '1', employeeName: 'John Doe' }));

      effects.deleteEmployee$.subscribe((action) => {
        expect(action).toEqual(EmployeeActions.deleteEmployeeFailure({ error: 'Delete failed' }));
        done();
      });
    });
  });

  describe('Notifications', () => {
    it('should trigger snackbar on notifySuccess$', (done) => {
      actions$ = of(EmployeeActions.addEmployeeSuccess({ employee: mockEmployee }));

      effects.notifySuccess$.subscribe(() => {
        expect(snackBarSpy.open).toHaveBeenCalledWith(
          jasmine.stringMatching(/created successfully/),
          'Close',
          jasmine.any(Object)
        );
        done();
      });
    });

    it('should trigger snackbar on notifyFailure$', (done) => {
      actions$ = of(EmployeeActions.addEmployeeFailure({ error: 'Invalid data' }));

      effects.notifyFailure$.subscribe(() => {
        expect(snackBarSpy.open).toHaveBeenCalledWith(
          'Invalid data',
          'Close',
          jasmine.any(Object)
        );
        done();
      });
    });
  });
});
