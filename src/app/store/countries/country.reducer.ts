import { createReducer, on } from '@ngrx/store';
import { Country } from '../../core/models/country.model';
import * as CountryActions from './country.actions';

export interface CountryState {
  countries: Country[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const initialCountryState: CountryState = {
  countries: [],
  loading: false,
  loaded: false,
  error: null
};

export const countryReducer = createReducer(
  initialCountryState,
  on(CountryActions.loadCountries, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CountryActions.loadCountriesSuccess, (state, { countries }) => ({
    ...state,
    loading: false,
    loaded: true,
    countries,
    error: null
  })),
  on(CountryActions.loadCountriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
