import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { httpErrorInterceptor } from './http-error.interceptor';

describe('httpErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should normalize 0 status to network error message', (done) => {
    httpClient.get('/api/test').subscribe({
      next: () => {
        fail('Should fail');
        done();
      },
      error: (err: Error) => {
        expect(err.message).toContain('Network error');
        done();
      }
    });

    const req = httpTesting.expectOne('/api/test');
    req.error(new ProgressEvent('error'), { status: 0 });
  });

  it('should normalize 404 status to resource not found message', (done) => {
    httpClient.get('/api/test').subscribe({
      next: () => {
        fail('Should fail');
        done();
      },
      error: (err: Error) => {
        expect(err.message).toBe('Resource not found.');
        done();
      }
    });

    const req = httpTesting.expectOne('/api/test');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should normalize 500 status to server error message', (done) => {
    httpClient.get('/api/test').subscribe({
      next: () => {
        fail('Should fail');
        done();
      },
      error: (err: Error) => {
        expect(err.message).toContain('Server error');
        done();
      }
    });

    const req = httpTesting.expectOne('/api/test');
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });
});
