import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CountryState } from './country.reducer';

export const selectCountryState = createFeatureSelector<CountryState>('countries');

export const selectRawCountries = createSelector(
  selectCountryState,
  (state: CountryState) => state.countries
);

export const selectCountryLoading = createSelector(
  selectCountryState,
  (state: CountryState) => state.loading
);

export const selectCountryLoaded = createSelector(
  selectCountryState,
  (state: CountryState) => state.loaded
);

export const selectCountryError = createSelector(
  selectCountryState,
  (state: CountryState) => state.error
);

export const selectUniqueSortedCountries = createSelector(
  selectRawCountries,
  (countries): string[] => {
    const map = new Map<string, string>();
    for (const item of countries) {
      if (!item || !item.country) continue;
      const trimmed = item.country.trim();
      if (!trimmed) continue;
      const key = trimmed.toLowerCase();
      if (!map.has(key)) {
        // Normalize casing to Title Case (e.g. "india" -> "India")
        const formatted = trimmed
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
        map.set(key, formatted);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
  }
);
