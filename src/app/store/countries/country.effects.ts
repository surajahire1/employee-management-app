import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom, filter } from 'rxjs/operators';
import { CountryService } from '../../core/services/country.service';
import * as CountryActions from './country.actions';
import { selectCountryLoaded } from './country.selectors';

@Injectable()
export class CountryEffects {
  private readonly actions$ = inject(Actions);
  private readonly countryService = inject(CountryService);
  private readonly store = inject(Store);

  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.loadCountries),
      withLatestFrom(this.store.select(selectCountryLoaded)),
      filter(([, loaded]) => !loaded),
      mergeMap(() =>
        this.countryService.getCountries().pipe(
          map((countries) => CountryActions.loadCountriesSuccess({ countries })),
          catchError((err) =>
            of(
              CountryActions.loadCountriesFailure({
                error: err?.message || 'Failed to load countries'
              })
            )
          )
        )
      )
    )
  );
}
