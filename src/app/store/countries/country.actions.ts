import { createAction, props } from '@ngrx/store';
import { Country } from '../../core/models/country.model';

export const loadCountries = createAction('[Countries] Load Countries');

export const loadCountriesSuccess = createAction(
  '[Countries] Load Countries Success',
  props<{ countries: Country[] }>()
);

export const loadCountriesFailure = createAction(
  '[Countries] Load Countries Failure',
  props<{ error: string }>()
);
