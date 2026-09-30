import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState, employeeAdapter } from './employee.reducer';
import { Employee } from '../../core/models/employee.model';

export const selectEmployeeState = createFeatureSelector<EmployeeState>('employees');

const { selectAll, selectEntities, selectTotal } = employeeAdapter.getSelectors();

export const selectAllEmployees = createSelector(
  selectEmployeeState,
  selectAll
);

export const selectEmployeeEntities = createSelector(
  selectEmployeeState,
  selectEntities
);

export const selectEmployeeTotal = createSelector(
  selectEmployeeState,
  selectTotal
);

export const selectEmployeeLoading = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.loading
);

export const selectEmployeeSaving = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.saving
);

export const selectEmployeeError = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.error
);

export const selectSelectedEmployeeId = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.selectedEmployeeId
);

export const selectSelectedEmployee = createSelector(
  selectEmployeeEntities,
  selectSelectedEmployeeId,
  (entities, id): Employee | null => (id ? entities[id] || null : null)
);

export const selectSearchQuery = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.searchQuery
);

export const selectSearchResultId = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.searchResultId
);

export const selectSearchStatus = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.searchStatus
);

export const selectSearchMessage = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.searchMessage
);

export const selectSearchState = createSelector(
  selectSearchQuery,
  selectSearchStatus,
  selectSearchResultId,
  selectSearchMessage,
  (query, status, resultId, message) => ({
    query,
    status,
    resultId,
    message
  })
);

export const selectDisplayedEmployees = createSelector(
  selectAllEmployees,
  selectEmployeeEntities,
  selectSearchStatus,
  selectSearchResultId,
  (all, entities, searchStatus, searchResultId): Employee[] => {
    if (searchStatus === 'found' && searchResultId) {
      const match = entities[searchResultId];
      return match ? [match] : [];
    }
    if (searchStatus === 'not_found') {
      return [];
    }
    return all;
  }
);
