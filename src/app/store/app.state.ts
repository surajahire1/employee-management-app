import { EmployeeState } from './employees/employee.reducer';
import { CountryState } from './countries/country.reducer';

export interface AppState {
  employees: EmployeeState;
  countries: CountryState;
}
