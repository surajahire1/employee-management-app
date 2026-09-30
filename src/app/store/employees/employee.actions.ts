import { createAction, props } from '@ngrx/store';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../../core/models/employee.model';

// Load Employees
export const loadEmployees = createAction('[Employees] Load Employees');

export const loadEmployeesSuccess = createAction(
  '[Employees] Load Employees Success',
  props<{ employees: Employee[] }>()
);

export const loadEmployeesFailure = createAction(
  '[Employees] Load Employees Failure',
  props<{ error: string }>()
);

// Search Employee by ID
export const searchEmployeeById = createAction(
  '[Employees] Search Employee By Id',
  props<{ id: string }>()
);

export const searchEmployeeByIdSuccess = createAction(
  '[Employees] Search Employee By Id Success',
  props<{ employee: Employee }>()
);

export const searchEmployeeByIdNotFound = createAction(
  '[Employees] Search Employee By Id Not Found',
  props<{ id: string; message: string }>()
);

export const searchEmployeeByIdFailure = createAction(
  '[Employees] Search Employee By Id Failure',
  props<{ error: string }>()
);

export const clearSearch = createAction('[Employees] Clear Search');

// Add Employee
export const addEmployee = createAction(
  '[Employees] Add Employee',
  props<{ employee: CreateEmployeeDto }>()
);

export const addEmployeeSuccess = createAction(
  '[Employees] Add Employee Success',
  props<{ employee: Employee }>()
);

export const addEmployeeFailure = createAction(
  '[Employees] Add Employee Failure',
  props<{ error: string }>()
);

// Update Employee
export const updateEmployee = createAction(
  '[Employees] Update Employee',
  props<{ id: string; employee: UpdateEmployeeDto }>()
);

export const updateEmployeeSuccess = createAction(
  '[Employees] Update Employee Success',
  props<{ employee: Employee }>()
);

export const updateEmployeeFailure = createAction(
  '[Employees] Update Employee Failure',
  props<{ error: string }>()
);

// Delete Employee
export const deleteEmployee = createAction(
  '[Employees] Delete Employee',
  props<{ id: string; employeeName: string }>()
);

export const deleteEmployeeSuccess = createAction(
  '[Employees] Delete Employee Success',
  props<{ id: string; employeeName: string }>()
);

export const deleteEmployeeFailure = createAction(
  '[Employees] Delete Employee Failure',
  props<{ error: string }>()
);

// Select Employee for View/Edit
export const selectEmployee = createAction(
  '[Employees] Select Employee',
  props<{ id: string | null }>()
);
