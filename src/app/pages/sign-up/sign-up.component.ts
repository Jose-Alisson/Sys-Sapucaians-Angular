import { data } from 'jquery';
import { SignService } from 'src/app/shared/services/sign-service.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injectable,
  OnInit,
  Output,
  Type,
} from '@angular/core';
import { AuthPsModel } from 'src/app/model/auth-ps.model';
import { Usuario } from 'src/app/model/usuario.model';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountComponent } from 'src/app/account/account.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, AfterViewInit {
  count: number = 0;
  confirm: string = '';
  contatoMask = '(00) 0000-0000';
  cSv = false;
  contatoClass = 'fa-solid fa-square-phone';
  typeContato = 'Telefone';

  step1Form!: FormGroup;
  step2Form!: FormGroup;
  step3Form!: FormGroup;

  allErrorVisibleForm = false;

  codeLength: number[] = [1, 2, 3, 4, 5];
  chars: string[] = ['', '', '', '', ''];

  token?: { token: '' };
  codeInvalid = false;

  logged = true;

  @Output()
  showModalCode = new EventEmitter<boolean>();

  constructor(
    private sign: SignService,
    private router: Router,
    private formBuilder: FormBuilder,
    private show: showViewDarken,
    private elementRef: ElementRef,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit(): void {
    document.querySelectorAll('.step-group input').forEach((input, index) => {
      let element = input as HTMLInputElement;

      if (element.checked) {
        this.count = index;
      }
    });
  }

  ngOnInit(): void {
    this.step1Form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [Validators.required, Validators.minLength(6), this.confirmPassword],
      ],
      //confirmPassword: [null, [Validators.required, this.confirmPassword]],
    });

    this.step2Form = this.formBuilder.group({
      nome: [
        null,
        [Validators.required, Validators.minLength(2), this.sepebnc],
      ],
    });

    this.step3Form = this.formBuilder.group({
      contato: [null, [Validators.required, this.constatoValidation]],
    });
  }

  prosseguir() {
    this.count += 1;
    (document.getElementById('stp-' + this.count) as HTMLInputElement).checked =
      true;
    this.allErrorVisibleForm = false;
  }

  prosseguirIsValidForm1() {
    if (this.step1Form.valid) {
      this.sign
        .isExist(this.step1Form.get('email')?.value)
        .subscribe((data) => {

          if (!data) {
            this.prosseguir();
          } else {
            this.step1Form.get('email')?.setErrors({ alreadyExists: true });
          }
        });
      return;
    }

    this.allErrorVisibleForm = true;
  }

  prosseguirIsValidForm2() {
    if (this.step2Form.valid) {
      this.prosseguir();
      return;
    }
    this.allErrorVisibleForm = true;
  }

  prosseguirIsValidForm3() {
    if (this.step3Form.valid) {
      this.prosseguir();
      return;
    }
    this.allErrorVisibleForm = true;
  }

  enviarCode() {
    this.show.show = true;
    this.sign
      .sendCodeNumber(this.step3Form.get('contato')?.value, this.typeContato)
      .subscribe((data) => {
        //console.log(data)
        this.token = data;
      });
  }

  verificarCode() {
    let code: string = '';

    this.chars.forEach((c) => {
      code += c;
    });
    this.prosseguir();

    // this.sign.verifyCodeNumber(code, this.token?.token ?? '').subscribe({

    //   next: () => {
    //     // this.show.show = false;
    //     // this.sign.salvar(this.getAuth()).subscribe({
    //     //   next: (data) => {
    //     //     this.toastr.success('Conta criada com êxito.', 'Sucesso');
    //     //     (
    //     //       document.getElementById('img-status-create') as HTMLImageElement
    //     //     ).src = 'assets//accept.png';

    //     //     console.log(data)
    //     //     this.sign
    //     //       .login({ tokenAccess: data.tokenAccess })
    //     //       .subscribe((data) => {
    //     //         this.router.navigate(['dashboard']);
    //     //       });
    //     //   },
    //     //   error: () => {
    //     //     (
    //     //       document.getElementById('img-status-create') as HTMLImageElement
    //     //     ).src = 'assets//close.png';
    //     //     this.toastr.success('Erro na criação de sua conta', 'Error');
    //     //   },
    //     // });

    //     // this.toastr.success('Código de verificação validado.', 'Sucesso');
    //     this.prosseguir();
    //   },
    //   error: (err: HttpErrorResponse) => {
    //     if (err.status === 401) {
    //       this.codeInvalid = true;
    //       this.toastr.error('Código invalido.', 'Error');
    //     }
    //   },
    // });

    this.sign.salvar(this.getAuth()).subscribe({
            next: (data) => {
              this.toastr.success('Conta criada com êxito.', 'Sucesso');
              (
                document.getElementById('img-status-create') as HTMLImageElement
              ).src = 'assets//accept.png';

              console.log(data)
              this.sign
                .login({ tokenAccess: data.tokenAccess })
                .subscribe((data) => {
                  this.router.navigate(['dash-board', 'home']);
                });
            },
            error: () => {
              (
                document.getElementById('img-status-create') as HTMLImageElement
              ).src = 'assets//close.png';
              this.toastr.success('Erro na criação de sua conta', 'Error');
            },
      });
  }

  voltar() {
    this.count -= 1;
    (document.getElementById('stp-' + this.count) as HTMLInputElement).checked =
      true;
  }

  passwordVisible(element1: HTMLInputElement, icon: HTMLElement) {
    if (element1.type === 'text') {
      element1.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    } else {
      element1.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }
  }

  showSelectionContato() {
    this.cSv = true;
  }

  setTypeContatoPhone() {
    this.cSv = false;
    this.contatoClass = 'fa-solid fa-square-phone';
    this.contatoMask = '99 9 9999-9999';
    this.typeContato = 'Telefone';
  }

  setTypeContatoWhatsapp() {
    this.cSv = false;
    this.contatoClass = 'fa-brands fa-square-whatsapp';
    this.contatoMask = '99 9999-9999';
    this.typeContato = 'Whatsapp';
  }

  getRotate() {
    if (this.cSv) {
      return 'rotate(180deg)';
    } else {
      return 'rotate(0deg)';
    }
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

  sepebnc: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (control.value != null && (control.value as string).indexOf(' ') != -1) {
      return { blank: true };
    }
    return null;
  };

  confirmPassword: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    let password = this.step1Form?.get('password');
    let confirm = this.step1Form?.get('confirmPassword');

    if ((password?.value ?? '') != (confirm?.value ?? '')) {
      if (control == confirm) {
        return { confirmPasswordInvalid: true };
      }
      this.step1Form
        .get('confirmPassword')
        ?.setErrors({ confirmPasswordInvalid: true });
    }
    return null;
  };

  constatoValidation: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    let length = this.contatoMask.match(/\d/g)?.join('');
    let regex = new RegExp(`[0-9]{${length?.length}}`);

    if (regex.test(control.value)) {
      return null;
    }

    return { invalidInput: true };
  };

  getLengthMask() {
    let length = this.contatoMask.match(/\d/g)?.join('');
    //console.log(length?.length);
    return length?.length;
  }

  getAuth() {
    let form1 = this.step1Form;
    let form2 = this.step2Form;
    let form3 = this.step3Form;

    let auth: AuthPsModel = {
      user: {
        name: form2.get('nome')?.value,
        lastName: form2.get('sobrenome')?.value,
        contact: form3.get('contato')?.value,
      },
      email: form1.get('email')?.value,
      password: form1.get('password')?.value,
      typeRule: 'USER',
    };
    return auth;
  }

  moveFocus(event: KeyboardEvent, index: number) {
    this.codeInvalid = false;
    let allInputs = document.querySelectorAll('.code-fields input');

    if (allInputs[index - 1] && event.key === 'Backspace') {
      (allInputs[index] as HTMLInputElement).value = '';
      (allInputs[index - 1] as HTMLInputElement).focus();
      return;
    }

    if ((allInputs[index] as HTMLInputElement).value != '') {
      const nextInput = allInputs[index + 1] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  getFilled(index: number) {
    let input = document.querySelectorAll('.code-fields input')[
      index
    ] as HTMLInputElement;
    return input.value != '';
  }

  getShowViewDarken() {
    return this.show.show;
  }

  @HostListener('document:click', ['$event.target'])
  clickOutside(targetElement: HTMLElement) {
    let comp = this.elementRef.nativeElement
      .querySelector('.selection-contato')
      .contains(targetElement);
    if (!comp) {
      this.cSv = false;
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class showViewDarken {
  public show: boolean = false;
}
