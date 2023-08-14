import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoConcluitComponent } from './auto-concluit.component';

describe('AutoConcluitComponent', () => {
  let component: AutoConcluitComponent;
  let fixture: ComponentFixture<AutoConcluitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoConcluitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoConcluitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
