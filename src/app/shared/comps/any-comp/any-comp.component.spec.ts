import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnyCompComponent } from './any-comp.component';

describe('AnyCompComponent', () => {
  let component: AnyCompComponent;
  let fixture: ComponentFixture<AnyCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnyCompComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnyCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
