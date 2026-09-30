import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { EmployeeTableComponent } from './employee-table.component';
import { Employee } from '../../../../core/models/employee.model';

describe('EmployeeTableComponent', () => {
  let component: EmployeeTableComponent;
  let fixture: ComponentFixture<EmployeeTableComponent>;

  const mockEmployees: Employee[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'Maharashtra',
      district: 'Pune'
    },
    {
      id: '2',
      name: 'Alice',
      email: 'alice@example.com',
      mobile: '1234567890',
      country: 'USA',
      state: 'NY',
      district: 'Brooklyn'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTableComponent],
      providers: [provideNoopAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeTableComponent);
    component = fixture.componentInstance;
    component.employees = mockEmployees;
    fixture.detectChanges();
  });

  it('should create the table component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate initials correctly', () => {
    expect(component.getInitials('John Doe')).toBe('JD');
    expect(component.getInitials('Alice')).toBe('AL');
    expect(component.getInitials('')).toBe('?');
  });

  it('should emit edit output when edit action is triggered', () => {
    spyOn(component.edit, 'emit');
    component.onEdit(mockEmployees[0]);
    expect(component.edit.emit).toHaveBeenCalledWith(mockEmployees[0]);
  });

  it('should emit delete output when delete action is triggered', () => {
    spyOn(component.delete, 'emit');
    component.onDelete(mockEmployees[0]);
    expect(component.delete.emit).toHaveBeenCalledWith(mockEmployees[0]);
  });
});
