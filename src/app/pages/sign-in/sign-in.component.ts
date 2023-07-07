import { HttpErrorResponse } from '@angular/common/http';
import { SignService } from './../../shared/services/sign-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthPsModel } from 'src/app/model/auth-ps.model';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

  authForm!: FormGroup;
  allErrorVisibleForm: boolean | undefined;

  constructor(
    private router: Router,
    private sign: SignService,
    private formBuild: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authForm = this.formBuild.group({
      email: [null, [Validators.required, Validators.email, this.isExistEmailViewErrorValidator]],
      password: [null, [Validators.required, this.passwordNoUnauthoredValidator]],
    });
  }

  private getAuth(): AuthPsModel {
    let group = this.authForm;
    return {
      email: group.get('email')?.value,
      password: group.get('password')?.value,
    };
  }

  login() {
    this.allErrorVisibleForm = true
    if(this.authForm.valid){
      this.sign.login(this.getAuth()).subscribe({
        next: (res) => {
          let user = res?.['auth']?.['typeRule'];
          this.router.navigate(['dash-board']);
          console.log(res)
        },
        error: (err: HttpErrorResponse) => {
          if(err.status === 404) {
            this.authForm.get('email')?.setErrors({isExistEmailViewError: true})
          }

          if(err.status === 403){
            this.authForm.get('password')?.setErrors({passwordNoUnauthored: true})
          }
        },
      });
    }
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

  isExistEmailViewError = false
  passwordNoUnauthored = false

  isExistEmailViewErrorValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if(this.isExistEmailViewError){
      return {isExistEmailViewError: true}
    }
    return null;
  };

  passwordNoUnauthoredValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if(this.passwordNoUnauthored){
      return {passwordNoUnauthored : true }
    }
    return null;
  };
}
