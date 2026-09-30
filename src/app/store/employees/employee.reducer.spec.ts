import { employeeReducer, initialEmployeeState, employeeAdapter } from './employee.reducer';
import * as EmployeeActions from './employee.actions';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../../core/models/employee.model';

describe('Employee Reducer', () => {
  const mockEmployee1: Employee = {
    id: '1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    mobile: '9876543210',
    country: 'India',
    state: 'Maharashtra',
    district: 'Pune'
  };

  const mockEmployee2: Employee = {
    id: '2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    mobile: '9123456780',
    country: 'USA',
    state: 'California',
    district: 'Bay Area'
  };

  it('should return initial state when unknown action is provided', () => {
    const action = { type: 'UNKNOWN' } as any;
    const state = employeeReducer(undefined, action);
    expect(state).toEqual(initialEmployeeState);
  });

  describe('Load Employees', () => {
    it('should set loading to true on loadEmployees', () => {
      const state = employeeReducer(initialEmployeeState, EmployeeActions.loadEmployees());
      expect(state.loading).toBeTrue();
      expect(state.error).toBeNull();
    });

    it('should populate employees and clear loading on loadEmployeesSuccess', () => {
      const state = employeeReducer(
        { ...initialEmployeeState, loading: true },
        EmployeeActions.loadEmployeesSuccess({ employees: [mockEmployee1, mockEmployee2] })
      );
      expect(state.loading).toBeFalse();
      expect(state.ids).toEqual(['1', '2']);
      expect(state.entities['1']).toEqual(mockEmployee1);
    });

    it('should set error message on loadEmployeesFailure', () => {
      const state = employeeReducer(
        { ...initialEmployeeState, loading: true },
        EmployeeActions.loadEmployeesFailure({ error: 'Failed to fetch' })
      );
      expect(state.loading).toBeFalse();
      expect(state.error).toBe('Failed to fetch');
    });
  });

  describe('Search Employee By ID', () => {
    it('should update search query and status to searching', () => {
      const state = employeeReducer(
        initialEmployeeState,
        EmployeeActions.searchEmployeeById({ id: '1' })
      );
      expect(state.searchQuery).toBe('1');
      expect(state.searchStatus).toBe('searching');
      expect(state.searchResultId).toBeNull();
      expect(state.searchMessage).toBeNull();
    });

    it('should upsert employee and set status to found on searchEmployeeByIdSuccess', () => {
      const state = employeeReducer(
        { ...initialEmployeeState, searchStatus: 'searching', searchQuery: '1' },
        EmployeeActions.searchEmployeeByIdSuccess({ employee: mockEmployee1 })
      );
      expect(state.searchStatus).toBe('found');
      expect(state.searchResultId).toBe('1');
      expect(state.entities['1']).toEqual(mockEmployee1);
    });

    it('should update status to not_found with message on searchEmployeeByIdNotFound', () => {
      const state = employeeReducer(
        { ...initialEmployeeState, searchStatus: 'searching', searchQuery: '99' },
        EmployeeActions.searchEmployeeByIdNotFound({
          id: '99',
          message: 'No employee found with ID 99'
        })
      );
      expect(state.searchStatus).toBe('not_found');
      expect(state.searchResultId).toBeNull();
      expect(state.searchMessage).toBe('No employee found with ID 99');
    });

    it('should update status to error on searchEmployeeByIdFailure', () => {
      const state = employeeReducer(
        { ...initialEmployeeState, searchStatus: 'searching', searchQuery: '1' },
        EmployeeActions.searchEmployeeByIdFailure({ error: 'Server timeout' })
      );
      expect(state.searchStatus).toBe('error');
      expect(state.searchMessage).toBe('Server timeout');
    });

    it('should reset search fields on clearSearch', () => {
      const searchingState = {
        ...initialEmployeeState,
        searchQuery: '1',
        searchResultId: '1',
        searchStatus: 'found' as const,
        searchMessage: null
      };
      const state = employeeReducer(searchingState, EmployeeActions.clearSearch());
      expect(state.searchQuery).toBeNull();
      expect(state.searchResultId).toBeNull();
      expect(state.searchStatus).toBe('idle');
      expect(state.searchMessage).toBeNull();
    });
  });

  describe('Add Employee', () => {
    it('should set saving to true on addEmployee', () => {
      const dto: CreateEmployeeDto = {
        name: 'Jane',
        email: 'jane@example.com',
        mobile: '9876543210',
        country: 'India',
        state: 'Maharashtra',
        district: 'Pune'
      };
      const state = employeeReducer(initialEmployeeState, EmployeeActions.addEmployee({ employee: dto }));
      expect(state.saving).toBeTrue();
      expect(state.error).toBeNull();
    });

    it('should add entity to state on addEmployeeSuccess', () => {
      const state = employeeReducer(
        { ...initialEmployeeState, saving: true },
        EmployeeActions.addEmployeeSuccess({ employee: mockEmployee1 })
      );
      expect(state.saving).toBeFalse();
      expect(state.ids).toContain('1');
      expect(state.entities['1']).toEqual(mockEmployee1);
    });

    it('should set error on addEmployeeFailure', () => {
      const state = employeeReducer(
        { ...initialEmployeeState, saving: true },
        EmployeeActions.addEmployeeFailure({ error: 'Validation failed' })
      );
      expect(state.saving).toBeFalse();
      expect(state.error).toBe('Validation failed');
    });
  });

  describe('Update Employee', () => {
    it('should set saving to true on updateEmployee', () => {
      const state = employeeReducer(
        initialEmployeeState,
        EmployeeActions.updateEmployee({ id: '1', employee: { name: 'Alice M.' } as any })
      );
      expect(state.saving).toBeTrue();
    });

    it('should update entity in state on updateEmployeeSuccess', () => {
      const baseState = employeeAdapter.addOne(mockEmployee1, initialEmployeeState);
      const updated = { ...mockEmployee1, name: 'Alice Modified' };
      const state = employeeReducer(
        { ...baseState, saving: true },
        EmployeeActions.updateEmployeeSuccess({ employee: updated })
      );

      expect(state.saving).toBeFalse();
      expect(state.entities['1']?.name).toBe('Alice Modified');
    });

    it('should set error on updateEmployeeFailure', () => {
      const state = employeeReducer(
        { ...initialEmployeeState, saving: true },
        EmployeeActions.updateEmployeeFailure({ error: 'Update rejected' })
      );
      expect(state.saving).toBeFalse();
      expect(state.error).toBe('Update rejected');
    });
  });

  describe('Delete Employee', () => {
    it('should set saving to true on deleteEmployee', () => {
      const state = employeeReducer(
        initialEmployeeState,
        EmployeeActions.deleteEmployee({ id: '1', employeeName: 'Alice' })
      );
      expect(state.saving).toBeTrue();
    });

    it('should remove entity from state on deleteEmployeeSuccess', () => {
      const baseState = employeeAdapter.addOne(mockEmployee1, initialEmployeeState);
      const state = employeeReducer(
        { ...baseState, saving: true },
        EmployeeActions.deleteEmployeeSuccess({ id: '1', employeeName: 'Alice' })
      );

      expect(state.saving).toBeFalse();
      expect(state.ids).not.toContain('1');
      expect(state.entities['1']).toBeUndefined();
    });

    it('should set error on deleteEmployeeFailure', () => {
      const state = employeeReducer(
        { ...initialEmployeeState, saving: true },
        EmployeeActions.deleteEmployeeFailure({ error: 'Could not delete' })
      );
      expect(state.saving).toBeFalse();
      expect(state.error).toBe('Could not delete');
    });
  });

  describe('Select Employee', () => {
    it('should set selectedEmployeeId', () => {
      const state = employeeReducer(initialEmployeeState, EmployeeActions.selectEmployee({ id: '1' }));
      expect(state.selectedEmployeeId).toBe('1');
    });
  });
});
