import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { CartComponent } from 'src/app/pages/cart/cart.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { RadioListComponent } from './radio-list/radio-list.component';
import { RadioComponent } from './radio/radio.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { AnyCompComponent } from './any-comp/any-comp.component';
import { AutoConcluitComponent } from './auto-concluit/auto-concluit.component';
import { AddressManagerComponent } from './address-manager/address-manager.component';

@NgModule({
  declarations: [
    ModalComponent,
    CartComponent,
    RadioListComponent,
    RadioComponent,
    DropdownComponent,
    AnyCompComponent,
    AutoConcluitComponent,
    AddressManagerComponent
  ],
  exports: [
    ModalComponent,
    CartComponent,
    RadioListComponent,
    RadioComponent,
    DropdownComponent,
    AutoConcluitComponent,
    AddressManagerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forChild()
  ]
})
export class CompsSharedModule { }
