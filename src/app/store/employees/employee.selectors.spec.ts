import {
  selectAllEmployees,
  selectEmployeeLoading,
  selectEmployeeSaving,
  selectEmployeeError,
  selectSearchState,
  selectDisplayedEmployees,
  selectSelectedEmployee
} from './employee.selectors';
import { EmployeeState, employeeAdapter } from './employee.reducer';
import { Employee } from '../../core/models/employee.model';

describe('Employee Selectors', () => {
  const emp1: Employee = {
    id: '1',
    name: 'Alice',
    email: 'alice@test.com',
    mobile: '1234567890',
    country: 'India',
    state: 'State A',
    district: 'Dist A'
  };

  const emp2: Employee = {
    id: '2',
    name: 'Bob',
    email: 'bob@test.com',
    mobile: '9876543210',
    country: 'Canada',
    state: 'State B',
    district: 'Dist B'
  };

  let mockState: EmployeeState;

  beforeEach(() => {
    mockState = employeeAdapter.setAll([emp1, emp2], {
      ...employeeAdapter.getInitialState(),
      loading: false,
      saving: false,
      error: null,
      selectedEmployeeId: '1',
      searchQuery: null,
      searchResultId: null,
      searchStatus: 'idle',
      searchMessage: null
    });
  });

  it('should select all employees from adapter', () => {
    const employees = selectAllEmployees.projector(mockState);
    expect(employees.length).toBe(2);
    expect(employees).toEqual([emp1, emp2]);
  });

  it('should select loading and saving statuses', () => {
    expect(selectEmployeeLoading.projector(mockState)).toBeFalse();
    expect(selectEmployeeSaving.projector(mockState)).toBeFalse();
    expect(selectEmployeeError.projector(mockState)).toBeNull();
  });

  it('should select currently selected employee entity', () => {
    const selected = selectSelectedEmployee.projector(mockState.entities, '1');
    expect(selected).toEqual(emp1);

    const notSelected = selectSelectedEmployee.projector(mockState.entities, null);
    expect(notSelected).toBeNull();
  });

  it('should select full search state object', () => {
    const searchState = selectSearchState.projector('10', 'found', '10', null);
    expect(searchState).toEqual({
      query: '10',
      status: 'found',
      resultId: '10',
      message: null
    });
  });

  describe('selectDisplayedEmployees', () => {
    it('should return all employees when search status is idle', () => {
      const displayed = selectDisplayedEmployees.projector(
        [emp1, emp2],
        mockState.entities,
        'idle',
        null
      );
      expect(displayed.length).toBe(2);
    });

    it('should return only matched employee when search status is found', () => {
      const displayed = selectDisplayedEmployees.projector(
        [emp1, emp2],
        mockState.entities,
        'found',
        '2'
      );
      expect(displayed.length).toBe(1);
      expect(displayed[0].name).toBe('Bob');
    });

    it('should return empty list when search status is not_found', () => {
      const displayed = selectDisplayedEmployees.projector(
        [emp1, emp2],
        mockState.entities,
        'not_found',
        null
      );
      expect(displayed.length).toBe(0);
    });
  });
});
