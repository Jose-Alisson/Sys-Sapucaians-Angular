import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Endereco } from 'src/app/model/endereco.model';
import { exValoresDaTaxa } from 'src/app/pages/about/about.component';
import { SignService } from '../../services/sign-service.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-address-manager',
  templateUrl: './address-manager.component.html',
  styleUrls: ['./address-manager.component.scss'],
})
export class AddressManagerComponent implements OnInit {
  addressForm!: FormGroup;

  @Input()
  addressModalActive = false;
  addressRegisterModal = false;

  allErrorVisibleForm: boolean = false;

  allAddress?: Endereco[];
  addressSelected?: Endereco;

  ngOnInit(): void {
    this.addressForm = this.formBuilder.group({
      nameAddress: [null, Validators.required],
      houseNumber: [null, []],
      zipCode: [null, []],
      locality: [null, Validators.required],
      complement: [null, []],
    });
  }

  constructor(
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private sign: SignService
  ) {}

  getAddress() {
    let auth = this.sign.auth;

    if (auth.user) {
      return auth.user.addresses ?? [];
    }

    return [];
  }

  getInteractionForm(formGrop: FormGroup, controlName: string) {
    let control = formGrop.get(controlName);
    return control?.touched || control?.dirty || this.allErrorVisibleForm;
  }

  isValidControlForm(formGrop: FormGroup, controlName: string) {
    if (formGrop?.get(controlName)) {
      let control = formGrop.get(controlName);
      if (control?.errors === null) {
        return false;
      }
      return control?.errors && this.getInteractionForm(formGrop, controlName);
    }
    return false;
  }

  getLocalidades() {
    return exValoresDaTaxa;
  }
}
