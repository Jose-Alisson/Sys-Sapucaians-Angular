import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMyProductComponent } from './payment-my-product.component';

describe('PaymentMyProductComponent', () => {
  let component: PaymentMyProductComponent;
  let fixture: ComponentFixture<PaymentMyProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentMyProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMyProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
