import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { EmployeeService } from '../../core/services/employee.service';
import * as EmployeeActions from './employee.actions';

@Injectable()
export class EmployeeEffects {
  private readonly actions$ = inject(Actions);
  private readonly employeeService = inject(EmployeeService);
  private readonly snackBar = inject(MatSnackBar);

  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployees),
      mergeMap(() =>
        this.employeeService.getEmployees().pipe(
          map((employees) => EmployeeActions.loadEmployeesSuccess({ employees })),
          catchError((err) =>
            of(
              EmployeeActions.loadEmployeesFailure({
                error: err?.message || 'Failed to load employees list.'
              })
            )
          )
        )
      )
    )
  );

  searchEmployeeById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.searchEmployeeById),
      mergeMap(({ id }) =>
        this.employeeService.getEmployeeById(id).pipe(
          map((employee) => EmployeeActions.searchEmployeeByIdSuccess({ employee })),
          catchError((err) => {
            const isNotFound =
              err?.status === 404 ||
              (typeof err?.message === 'string' && err.message.toLowerCase().includes('not found')) ||
              err?.originalError?.status === 404;

            if (isNotFound) {
              return of(
                EmployeeActions.searchEmployeeByIdNotFound({
                  id,
                  message: `No employee found with ID ${id}`
                })
              );
            }
            return of(
              EmployeeActions.searchEmployeeByIdFailure({
                error: err?.message || 'Error occurred while searching employee.'
              })
            );
          })
        )
      )
    )
  );

  addEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.addEmployee),
      mergeMap(({ employee }) =>
        this.employeeService.createEmployee(employee).pipe(
          map((created) => EmployeeActions.addEmployeeSuccess({ employee: created })),
          catchError((err) =>
            of(
              EmployeeActions.addEmployeeFailure({
                error: err?.message || 'Failed to create employee.'
              })
            )
          )
        )
      )
    )
  );

  updateEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.updateEmployee),
      mergeMap(({ id, employee }) =>
        this.employeeService.updateEmployee(id, employee).pipe(
          map((updated) => EmployeeActions.updateEmployeeSuccess({ employee: updated })),
          catchError((err) =>
            of(
              EmployeeActions.updateEmployeeFailure({
                error: err?.message || 'Failed to update employee.'
              })
            )
          )
        )
      )
    )
  );

  deleteEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.deleteEmployee),
      mergeMap(({ id, employeeName }) =>
        this.employeeService.deleteEmployee(id).pipe(
          map(() => EmployeeActions.deleteEmployeeSuccess({ id, employeeName })),
          catchError((err) =>
            of(
              EmployeeActions.deleteEmployeeFailure({
                error: err?.message || 'Failed to delete employee.'
              })
            )
          )
        )
      )
    )
  );

  // Snackbar Notification Side Effects
  notifySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          EmployeeActions.addEmployeeSuccess,
          EmployeeActions.updateEmployeeSuccess,
          EmployeeActions.deleteEmployeeSuccess
        ),
        tap((action) => {
          let message = 'Operation completed successfully.';
          if (action.type === EmployeeActions.addEmployeeSuccess.type) {
            message = `Employee "${action.employee.name}" created successfully.`;
          } else if (action.type === EmployeeActions.updateEmployeeSuccess.type) {
            message = `Employee "${action.employee.name}" updated successfully.`;
          } else if (action.type === EmployeeActions.deleteEmployeeSuccess.type) {
            message = `Employee "${action.employeeName}" deleted successfully.`;
          }
          this.snackBar.open(message, 'Close', {
            duration: 3500,
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        })
      ),
    { dispatch: false }
  );

  notifyFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          EmployeeActions.addEmployeeFailure,
          EmployeeActions.updateEmployeeFailure,
          EmployeeActions.deleteEmployeeFailure
        ),
        tap((action) => {
          this.snackBar.open(action.error, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        })
      ),
    { dispatch: false }
  );
}
