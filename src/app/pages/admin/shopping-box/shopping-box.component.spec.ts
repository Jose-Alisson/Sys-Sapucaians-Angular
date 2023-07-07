import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingBoxComponent } from './shopping-box.component';

describe('ShoppingBoxComponent', () => {
  let component: ShoppingBoxComponent;
  let fixture: ComponentFixture<ShoppingBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppingBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
