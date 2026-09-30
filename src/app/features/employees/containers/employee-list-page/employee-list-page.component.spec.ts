import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { EmployeeListPageComponent } from './employee-list-page.component';
import * as EmployeeActions from '../../../../store/employees/employee.actions';
import * as CountryActions from '../../../../store/countries/country.actions';
import {
  selectAllEmployees,
  selectDisplayedEmployees,
  selectEmployeeError,
  selectEmployeeLoading,
  selectEmployeeSaving,
  selectSearchState
} from '../../../../store/employees/employee.selectors';
import { selectUniqueSortedCountries } from '../../../../store/countries/country.selectors';
import { Employee, CreateEmployeeDto } from '../../../../core/models/employee.model';

describe('EmployeeListPageComponent', () => {
  let component: EmployeeListPageComponent;
  let fixture: ComponentFixture<EmployeeListPageComponent>;
  let store: MockStore;
  let dialogSpyObj: jasmine.SpyObj<MatDialog>;

  const mockEmployee: Employee = {
    id: '1',
    name: 'Alice Wonder',
    email: 'alice@example.com',
    mobile: '9876543210',
    country: 'India',
    state: 'Maharashtra',
    district: 'Pune'
  };

  const initialSelectors = [
    { selector: selectDisplayedEmployees, value: [mockEmployee] },
    { selector: selectAllEmployees, value: [mockEmployee] },
    { selector: selectEmployeeLoading, value: false },
    { selector: selectEmployeeSaving, value: false },
    { selector: selectEmployeeError, value: null },
    {
      selector: selectSearchState,
      value: { query: null, status: 'idle', resultId: null, message: null }
    },
    { selector: selectUniqueSortedCountries, value: ['India', 'USA'] }
  ];

  beforeEach(async () => {
    dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpyObj.open.and.returnValue({
      afterClosed: () => of(null)
    } as any);

    await TestBed.configureTestingModule({
      imports: [EmployeeListPageComponent],
      providers: [
        provideMockStore({ selectors: initialSelectors }),
        provideNoopAnimations(),
        { provide: MatDialog, useValue: dialogSpyObj }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(EmployeeListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create employee list page container', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadEmployees and loadCountries on ngOnInit', () => {
    expect(store.dispatch).toHaveBeenCalledWith(EmployeeActions.loadEmployees());
    expect(store.dispatch).toHaveBeenCalledWith(CountryActions.loadCountries());
  });

  it('should dispatch searchEmployeeById on onSearch()', () => {
    component.onSearch('42');
    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.searchEmployeeById({ id: '42' })
    );
  });

  it('should dispatch clearSearch on onClearSearch()', () => {
    component.onClearSearch();
    expect(store.dispatch).toHaveBeenCalledWith(EmployeeActions.clearSearch());
  });

  it('should dispatch loadEmployees on onRetry()', () => {
    component.onRetry();
    expect(store.dispatch).toHaveBeenCalledWith(EmployeeActions.loadEmployees());
  });

  describe('Delete Dialog Confirmation Flow', () => {
    it('should open confirm dialog and dispatch deleteEmployee ONLY when confirmed', () => {
      dialogSpyObj.open.and.returnValue({
        afterClosed: () => of(true)
      } as any);

      component.onDeleteEmployee(mockEmployee);

      expect(dialogSpyObj.open).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        EmployeeActions.deleteEmployee({
          id: '1',
          employeeName: 'Alice Wonder'
        })
      );
    });

    it('should NOT dispatch deleteEmployee when cancel is clicked in confirm dialog', () => {
      dialogSpyObj.open.and.returnValue({
        afterClosed: () => of(false)
      } as any);

      component.onDeleteEmployee(mockEmployee);

      expect(dialogSpyObj.open).toHaveBeenCalled();
      expect(store.dispatch).not.toHaveBeenCalledWith(
        EmployeeActions.deleteEmployee({
          id: '1',
          employeeName: 'Alice Wonder'
        })
      );
    });
  });

  describe('Add / Edit Dialog Flow', () => {
    it('should open add dialog and dispatch addEmployee on save', () => {
      const newDto: CreateEmployeeDto = {
        name: 'Bob',
        email: 'bob@example.com',
        mobile: '1234567890',
        country: 'India',
        state: 'State',
        district: 'Dist'
      };

      dialogSpyObj.open.and.returnValue({
        afterClosed: () => of(newDto)
      } as any);

      component.onAddEmployee();

      expect(dialogSpyObj.open).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        EmployeeActions.addEmployee({ employee: newDto })
      );
    });

    it('should open edit dialog and dispatch updateEmployee on save', () => {
      const updateDto: CreateEmployeeDto = {
        name: 'Alice Updated',
        email: 'alice.updated@example.com',
        mobile: '9876543210',
        country: 'India',
        state: 'Maharashtra',
        district: 'Pune'
      };

      dialogSpyObj.open.and.returnValue({
        afterClosed: () => of(updateDto)
      } as any);

      component.onEditEmployee(mockEmployee);

      expect(dialogSpyObj.open).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        EmployeeActions.updateEmployee({
          id: '1',
          employee: updateDto
        })
      );
    });
  });

  describe('Reactive States', () => {
    it('should render loading state when loading is true and list is empty', () => {
      store.overrideSelector(selectEmployeeLoading, true);
      store.overrideSelector(selectDisplayedEmployees, []);
      store.refreshState();
      fixture.detectChanges();

      const stateMsg = fixture.nativeElement.querySelector('app-state-message');
      expect(stateMsg).toBeTruthy();
    });

    it('should render not-found state when search status is not_found', () => {
      store.overrideSelector(selectSearchState, {
        query: '99',
        status: 'not_found',
        resultId: null,
        message: 'No employee found with ID 99'
      });
      store.refreshState();
      fixture.detectChanges();

      const stateMsg = fixture.nativeElement.querySelector('app-state-message');
      expect(stateMsg).toBeTruthy();
    });
  });
});
