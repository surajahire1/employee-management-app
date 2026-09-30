import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Employee } from '../../core/models/employee.model';
import * as EmployeeActions from './employee.actions';

export type SearchStatus = 'idle' | 'searching' | 'found' | 'not_found' | 'error';

export interface EmployeeState extends EntityState<Employee> {
  loading: boolean;
  saving: boolean;
  error: string | null;
  selectedEmployeeId: string | null;
  searchQuery: string | null;
  searchResultId: string | null;
  searchStatus: SearchStatus;
  searchMessage: string | null;
}

export const employeeAdapter: EntityAdapter<Employee> = createEntityAdapter<Employee>({
  selectId: (employee: Employee) => employee.id
});

export const initialEmployeeState: EmployeeState = employeeAdapter.getInitialState({
  loading: false,
  saving: false,
  error: null,
  selectedEmployeeId: null,
  searchQuery: null,
  searchResultId: null,
  searchStatus: 'idle',
  searchMessage: null
});

export const employeeReducer = createReducer(
  initialEmployeeState,

  // Load Employees
  on(EmployeeActions.loadEmployees, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(EmployeeActions.loadEmployeesSuccess, (state, { employees }) =>
    employeeAdapter.setAll(employees, {
      ...state,
      loading: false,
      error: null
    })
  ),
  on(EmployeeActions.loadEmployeesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Search Employee By ID
  on(EmployeeActions.searchEmployeeById, (state, { id }) => ({
    ...state,
    searchQuery: id,
    searchStatus: 'searching',
    searchResultId: null,
    searchMessage: null
  })),
  on(EmployeeActions.searchEmployeeByIdSuccess, (state, { employee }) =>
    employeeAdapter.upsertOne(employee, {
      ...state,
      searchResultId: employee.id,
      searchStatus: 'found',
      searchMessage: null
    })
  ),
  on(EmployeeActions.searchEmployeeByIdNotFound, (state, { message }) => ({
    ...state,
    searchResultId: null,
    searchStatus: 'not_found',
    searchMessage: message
  })),
  on(EmployeeActions.searchEmployeeByIdFailure, (state, { error }) => ({
    ...state,
    searchResultId: null,
    searchStatus: 'error',
    searchMessage: error
  })),
  on(EmployeeActions.clearSearch, (state) => ({
    ...state,
    searchQuery: null,
    searchResultId: null,
    searchStatus: 'idle',
    searchMessage: null
  })),

  // Add Employee
  on(EmployeeActions.addEmployee, (state) => ({
    ...state,
    saving: true,
    error: null
  })),
  on(EmployeeActions.addEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.addOne(employee, {
      ...state,
      saving: false,
      error: null
    })
  ),
  on(EmployeeActions.addEmployeeFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error
  })),

  // Update Employee
  on(EmployeeActions.updateEmployee, (state) => ({
    ...state,
    saving: true,
    error: null
  })),
  on(EmployeeActions.updateEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.updateOne(
      { id: employee.id, changes: employee },
      {
        ...state,
        saving: false,
        error: null
      }
    )
  ),
  on(EmployeeActions.updateEmployeeFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error
  })),

  // Delete Employee
  on(EmployeeActions.deleteEmployee, (state) => ({
    ...state,
    saving: true,
    error: null
  })),
  on(EmployeeActions.deleteEmployeeSuccess, (state, { id }) => {
    const updatedState = employeeAdapter.removeOne(id, {
      ...state,
      saving: false,
      selectedEmployeeId: state.selectedEmployeeId === id ? null : state.selectedEmployeeId,
      error: null
    });
    if (state.searchResultId === id) {
      return {
        ...updatedState,
        searchResultId: null,
        searchStatus: 'idle',
        searchQuery: null,
        searchMessage: null
      };
    }
    return updatedState;
  }),
  on(EmployeeActions.deleteEmployeeFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error
  })),

  // Select Employee
  on(EmployeeActions.selectEmployee, (state, { id }) => ({
    ...state,
    selectedEmployeeId: id
  }))
);
