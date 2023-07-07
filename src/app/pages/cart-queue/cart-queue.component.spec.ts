import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartQueueComponent } from './cart-queue.component';

describe('CartQueueComponent', () => {
  let component: CartQueueComponent;
  let fixture: ComponentFixture<CartQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartQueueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
