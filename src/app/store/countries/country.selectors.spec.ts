import {
  selectUniqueSortedCountries,
  selectCountryLoading,
  selectCountryLoaded,
  selectCountryError
} from './country.selectors';
import { CountryState } from './country.reducer';
import { Country } from '../../core/models/country.model';

describe('Country Selectors', () => {
  const mockCountryState: CountryState = {
    countries: [
      { id: '1', country: 'Aruba' },
      { id: '2', country: 'india' },
      { id: '3', country: 'Aruba' },
      { id: '4', country: 'India' },
      { id: '5', country: 'Belgium' },
      { id: '6', country: ' united states ' }
    ],
    loading: false,
    loaded: true,
    error: null
  };

  it('should select country loading, loaded, and error flags', () => {
    expect(selectCountryLoading.projector(mockCountryState)).toBeFalse();
    expect(selectCountryLoaded.projector(mockCountryState)).toBeTrue();
    expect(selectCountryError.projector(mockCountryState)).toBeNull();
  });

  it('should deduplicate case-insensitively, normalize to title case, and sort alphabetically', () => {
    const result = selectUniqueSortedCountries.projector(mockCountryState.countries);

    // Expected deduplicated countries: Aruba, Belgium, India, United States
    expect(result).toEqual(['Aruba', 'Belgium', 'India', 'United States']);
    expect(result.length).toBe(4);
  });

  it('should handle empty or null country values gracefully', () => {
    const dirtyCountries: Country[] = [
      { id: '1', country: '' },
      { id: '2', country: '   ' },
      { id: '3', country: 'Canada' }
    ];

    const result = selectUniqueSortedCountries.projector(dirtyCountries);
    expect(result).toEqual(['Canada']);
  });
});
