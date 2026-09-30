import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CountryService } from './country.service';
import { Country } from '../models/country.model';
import { environment } from '../../../environments/environment';

describe('CountryService', () => {
  let service: CountryService;
  let httpTesting: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/country`;

  const mockCountries: Country[] = [
    { id: '1', country: 'Aruba' },
    { id: '2', country: 'india' },
    { id: '3', country: 'Aruba' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CountryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CountryService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch list of countries via GET', () => {
    service.getCountries().subscribe((countries) => {
      expect(countries.length).toBe(3);
      expect(countries).toEqual(mockCountries);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCountries);
  });

  it('should propagate errors when request fails', () => {
    service.getCountries().subscribe({
      next: () => fail('Should have failed with error'),
      error: (err) => {
        expect(err.status).toBe(500);
      }
    });

    const req = httpTesting.expectOne(baseUrl);
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });
});
