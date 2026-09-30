import { Routes } from '@angular/router';
import { EmployeeListPageComponent } from './containers/employee-list-page/employee-list-page.component';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    component: EmployeeListPageComponent
  }
];
