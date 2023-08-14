import { Component, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-delivery-manager',
  templateUrl: './delivery-manager.component.html',
  styleUrls: ['./delivery-manager.component.scss'],
})
export class DeliveryManagerComponent implements AfterViewInit {


  totalEntregas = 0
  arrecadado = 0

  pageIndex = 1

  @ViewChild('concluit', {static: true})
  concluit!:TemplateRef<any>

  @ViewChild('delivery', {static: true})
  delivery!:TemplateRef<any>



  ngAfterViewInit(): void {
    let sliderTabtn = document.querySelector('.tabs-slider');
    sliderTabtn?.querySelectorAll('.tab_btn').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        sliderTabtn?.querySelectorAll('.tab_btn').forEach((fbtn) => {
          fbtn.classList.remove('active');
        });

        btn.classList.add('active');
        this.pageIndex = i
      });
    });
  }
}
