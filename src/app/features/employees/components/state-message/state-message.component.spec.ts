import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateMessageComponent } from './state-message.component';

describe('StateMessageComponent', () => {
  let component: StateMessageComponent;
  let fixture: ComponentFixture<StateMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateMessageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StateMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create state message component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit action on button click', () => {
    spyOn(component.action, 'emit');
    component.type = 'error';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button?.click();

    expect(component.action.emit).toHaveBeenCalled();
  });
});
