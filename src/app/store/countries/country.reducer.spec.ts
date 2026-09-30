import { countryReducer, initialCountryState } from './country.reducer';
import * as CountryActions from './country.actions';
import { Country } from '../../core/models/country.model';

describe('Country Reducer', () => {
  it('should return initial state when unknown action is passed', () => {
    const action = { type: 'NOOP' } as any;
    const state = countryReducer(undefined, action);
    expect(state).toEqual(initialCountryState);
  });

  it('should set loading to true on loadCountries', () => {
    const action = CountryActions.loadCountries();
    const state = countryReducer(initialCountryState, action);
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should store countries and set loaded to true on loadCountriesSuccess', () => {
    const mockCountries: Country[] = [
      { id: '1', country: 'Aruba' },
      { id: '2', country: 'India' }
    ];
    const action = CountryActions.loadCountriesSuccess({ countries: mockCountries });
    const state = countryReducer({ ...initialCountryState, loading: true }, action);

    expect(state.loading).toBeFalse();
    expect(state.loaded).toBeTrue();
    expect(state.countries).toEqual(mockCountries);
    expect(state.error).toBeNull();
  });

  it('should set error on loadCountriesFailure', () => {
    const action = CountryActions.loadCountriesFailure({ error: 'Network failure' });
    const state = countryReducer({ ...initialCountryState, loading: true }, action);

    expect(state.loading).toBeFalse();
    expect(state.error).toBe('Network failure');
  });
});
