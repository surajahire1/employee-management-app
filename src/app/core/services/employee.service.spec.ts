import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../models/employee.model';
import { environment } from '../../../environments/environment';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpTesting: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/employee`;

  const mockEmployee: Employee = {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    mobile: '9876543210',
    country: 'India',
    state: 'Maharashtra',
    district: 'Pune'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(EmployeeService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve list of employees (GET)', () => {
    const mockList: Employee[] = [mockEmployee];

    service.getEmployees().subscribe((employees) => {
      expect(employees.length).toBe(1);
      expect(employees).toEqual(mockList);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
  });

  it('should retrieve a single employee by ID (GET)', () => {
    service.getEmployeeById('1').subscribe((employee) => {
      expect(employee).toEqual(mockEmployee);
    });

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployee);
  });

  it('should handle 404 when employee is not found (GET)', () => {
    service.getEmployeeById('999').subscribe({
      next: () => fail('Should have failed with 404 error'),
      error: (err) => {
        expect(err.status).toBe(404);
      }
    });

    const req = httpTesting.expectOne(`${baseUrl}/999`);
    expect(req.request.method).toBe('GET');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should create a new employee (POST)', () => {
    const newDto: CreateEmployeeDto = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'Maharashtra',
      district: 'Pune'
    };

    service.createEmployee(newDto).subscribe((created) => {
      expect(created.id).toBe('1');
      expect(created.name).toBe(newDto.name);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newDto);
    req.flush(mockEmployee);
  });

  it('should update an existing employee (PUT)', () => {
    const updateDto: UpdateEmployeeDto = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'Maharashtra',
      district: 'Pune'
    };

    service.updateEmployee('1', updateDto).subscribe((updated) => {
      expect(updated.name).toBe('Jane Smith');
    });

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateDto);
    req.flush({ ...mockEmployee, name: 'Jane Smith', email: 'jane.smith@example.com' });
  });

  it('should delete an employee by ID (DELETE)', () => {
    service.deleteEmployee('1').subscribe((deleted) => {
      expect(deleted.id).toBe('1');
    });

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockEmployee);
  });

  it('should propagate server errors (500)', () => {
    service.getEmployees().subscribe({
      next: () => fail('Should have failed with 500 error'),
      error: (err) => {
        expect(err.status).toBe(500);
      }
    });

    const req = httpTesting.expectOne(baseUrl);
    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
