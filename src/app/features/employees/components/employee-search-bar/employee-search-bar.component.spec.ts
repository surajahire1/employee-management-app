import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { EmployeeSearchBarComponent } from './employee-search-bar.component';

describe('EmployeeSearchBarComponent', () => {
  let component: EmployeeSearchBarComponent;
  let fixture: ComponentFixture<EmployeeSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSearchBarComponent],
      providers: [provideNoopAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create search bar', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search when input has value and onSearch() is called', () => {
    spyOn(component.search, 'emit');
    component.currentValue = '  42  ';

    component.onSearch();
    expect(component.search.emit).toHaveBeenCalledWith('42');
  });

  it('should not emit search if input is empty or contains only whitespace', () => {
    spyOn(component.search, 'emit');
    component.currentValue = '   ';

    component.onSearch();
    expect(component.search.emit).not.toHaveBeenCalled();
  });

  it('should not emit search if already searching', () => {
    spyOn(component.search, 'emit');
    component.currentValue = '42';
    component.searching = true;

    component.onSearch();
    expect(component.search.emit).not.toHaveBeenCalled();
  });

  it('should clear value and emit clear on onClear()', () => {
    spyOn(component.clear, 'emit');
    component.currentValue = '42';

    component.onClear();
    expect(component.currentValue).toBe('');
    expect(component.clear.emit).toHaveBeenCalled();
  });

  it('should update currentValue when searchQuery input changes', () => {
    component.searchQuery = '100';
    component.ngOnChanges({
      searchQuery: {
        currentValue: '100',
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.currentValue).toBe('100');
  });
});
