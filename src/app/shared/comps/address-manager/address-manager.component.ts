import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Endereco } from 'src/app/model/endereco.model';
import { exValoresDaTaxa } from 'src/app/pages/about/about.component';
import { SignService } from '../../services/sign-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AddressService } from '../../services/address.service';

@Component({
  selector: 'app-address-manager',
  templateUrl: './address-manager.component.html',
  styleUrls: ['./address-manager.component.scss'],
})
export class AddressManagerComponent implements OnInit {
  addressForm!: FormGroup;

  @Output()
  CloseModalMain = new EventEmitter<boolean>();
  addressRegisterModal = false;

  allErrorVisibleForm: boolean = false;

  allAddress?: Endereco[];
  addressSelected?: Endereco;

  @Input()
  isAddressEscolhed: boolean = false

  @Output()
  addressEscolhed = new EventEmitter<Endereco>();

  ngOnInit(): void {
    this.addressForm = this.formBuilder.group({
      nameAddress: [null, Validators.required],
      houseNumber: [null, []],
      zipCode: [null, []],
      locality: [null, Validators.required],
      complement: [null, []],
    });

    this.address
      .getAllByUserId(this.sign.auth.user?.id ?? 0)
      .subscribe((data) => {
        this.allAddress = data;
      });
  }

  constructor(
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private sign: SignService,
    private address: AddressService
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

  adicionarEndereco() {
    let form = this.addressForm;
    let selected = this.addressSelected;

    if (this.addressForm.valid) {
      this.allErrorVisibleForm = false;
      let enderecoSelect: Endereco = {
        id: this.addressSelected?.id ?? 0,
        nameAddress: form.get('nameAddress')?.value ?? selected?.nameAddress,
        houseNumber: form.get('houseNumber')?.value ?? selected?.houseNumber,
        zipCode: form.get('zipCode')?.value ?? selected?.zipCode,
        locality: form.get('locality')?.value ?? selected?.locality,
        complement: form.get('complement')?.value ?? selected?.complement,
      };

      this.address
        .save(this.sign.auth.user?.id ?? 0, enderecoSelect)
        .subscribe((address: Endereco) => {
          this.addressRegisterModal = false;
          let index = this.allAddress?.findIndex(
            (endereco) => endereco.id === address.id
          );

          if (index != -1) {
            this.allAddress![index ?? 0] = address;
          } else {
            this.allAddress?.push(address);
          }
        });
    } else {
      this.allErrorVisibleForm = true;
    }
  }

  deletarEndereco(id: number){
    this.address.deleteById(id).subscribe(() => {
      this.allAddress = this.allAddress?.filter(address => address.id != id)
    })
  }

  editarEndereco(endereco: Endereco){
    this.addressSelected = endereco

    this.addressForm.setValue({
      nameAddress: endereco.nameAddress,
      houseNumber: endereco.houseNumber,
      zipCode: endereco.zipCode,
      locality: endereco.locality,
      complement: endereco.complement,
    })

    this.addressRegisterModal = true
  }

  pegarGeoLocalidade() {
    if ('geolocation' in navigator) {
      const watcher = navigator.geolocation.watchPosition(
        function (geo) {
          console.log(geo);
        },
        function (err) {
          console.log(err);

          alert('Deu erro');
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Descupe, não foi possivel obter sua localização.');
    }
  }

  getAddressValues(endereco: Endereco) {
    let addressFormate = '';

    let address = {
      name: endereco.nameAddress,
      houseNumber: endereco.houseNumber,
      locality: endereco.locality,
      cep: endereco.zipCode,
      complement: endereco.complement,
    };

    Object.values(address).forEach((value, index) => {
      if (value != undefined && value != null && value != '') {
        if (index > 0) {
          addressFormate += ', ';
        }

        addressFormate += value;
      }
    });

    return addressFormate;
  }

  getValorLocalitity(locality: string) {
    return exValoresDaTaxa.find((local) => local.localidade === locality)
      ?.preco;
  }

  setLocality(locality: string) {
    this.addressForm.get('locality')?.setValue(locality);
  }

  addressSelect(endereco: Endereco){
    if(this.isAddressEscolhed){
      this.addressEscolhed.emit(endereco)

    }
  }
}
