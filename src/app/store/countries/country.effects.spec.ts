import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { CountryEffects } from './country.effects';
import { CountryService } from '../../core/services/country.service';
import * as CountryActions from './country.actions';
import { selectCountryLoaded } from './country.selectors';
import { Country } from '../../core/models/country.model';

describe('CountryEffects', () => {
  let actions$: Observable<any>;
  let effects: CountryEffects;
  let countryServiceSpy: jasmine.SpyObj<CountryService>;
  let store: MockStore;

  const mockCountries: Country[] = [
    { id: '1', country: 'Aruba' },
    { id: '2', country: 'India' }
  ];

  beforeEach(() => {
    countryServiceSpy = jasmine.createSpyObj('CountryService', ['getCountries']);

    TestBed.configureTestingModule({
      providers: [
        CountryEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            { selector: selectCountryLoaded, value: false }
          ]
        }),
        { provide: CountryService, useValue: countryServiceSpy }
      ]
    });

    effects = TestBed.inject(CountryEffects);
    store = TestBed.inject(MockStore);
  });

  it('should dispatch loadCountriesSuccess when countries are loaded successfully', (done) => {
    countryServiceSpy.getCountries.and.returnValue(of(mockCountries));
    actions$ = of(CountryActions.loadCountries());

    effects.loadCountries$.subscribe((action) => {
      expect(action).toEqual(CountryActions.loadCountriesSuccess({ countries: mockCountries }));
      expect(countryServiceSpy.getCountries).toHaveBeenCalled();
      done();
    });
  });

  it('should dispatch loadCountriesFailure when country loading fails', (done) => {
    countryServiceSpy.getCountries.and.returnValue(throwError(() => new Error('API failure')));
    actions$ = of(CountryActions.loadCountries());

    effects.loadCountries$.subscribe((action) => {
      expect(action).toEqual(
        CountryActions.loadCountriesFailure({ error: 'API failure' })
      );
      done();
    });
  });

  it('should not call service if countries are already loaded', (done) => {
    store.overrideSelector(selectCountryLoaded, true);
    store.refreshState();

    countryServiceSpy.getCountries.and.returnValue(of(mockCountries));
    actions$ = of(CountryActions.loadCountries());

    let dispatched = false;
    effects.loadCountries$.subscribe(() => {
      dispatched = true;
    });

    setTimeout(() => {
      expect(dispatched).toBeFalse();
      expect(countryServiceSpy.getCountries).not.toHaveBeenCalled();
      done();
    }, 50);
  });
});
