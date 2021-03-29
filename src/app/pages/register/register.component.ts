import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/models/common/country';
import { UserInfo } from 'src/app/models/app-models/user-info';
import { AuthService } from 'src/app/services/auth.service';
import { Countries } from 'src/app/models/app-models/countries';
import { MatDialog } from '@angular/material/dialog';
import { PaymentAgreementDialog } from 'src/app/shared/base-components/payment-agreement/payment-agreement.dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  singUpForm: FormGroup;
  // isAutheticated: boolean;
  isLoading: boolean = false;
  message: string = null;
  isSubmitted = false;
  countries: Country[] = new Countries().countries;

  // approvePassword: boolean = false;

  isRegistrationSuccessful = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.singUpForm = this.fb.group({
      firstName: this.fb.control(null, Validators.required),
      lastName: this.fb.control(null, Validators.required),
      email: this.fb.control(null, [Validators.required, Validators.email]),
      password: this.fb.control(null, [
        Validators.required,
        Validators.min(6),
        Validators.maxLength(30),
      ]),
      confirmPassword: this.fb.control(null, [
        Validators.required,
        Validators.min(6),
        Validators.maxLength(30),
      ]),
      phone: this.fb.control(null),
      address: this.fb.control(null),
      city: this.fb.control(null),
      country: this.fb.control(null),
      zipCode: this.fb.control(null),
      subscribe: this.fb.control(false),
    }, {validators : this.repeatPasswordValidator});
  }

  // sign up ///
  onRegistrationSubmit(): void {
    this.isSubmitted = true;
    if (this.singUpForm.invalid) return;
    this.isLoading = true;
    const userInfo: UserInfo = {
      firstName: this.capitalize(this.singUpForm.value.firstName.trim()),
      lastName: this.capitalize(this.singUpForm.value.lastName.trim()),
      email: this.singUpForm.value.email.trim().toLowerCase(),
      password: this.singUpForm.value.password.trim(),
      phone: this.singUpForm.value.phone ? this.singUpForm.value.phone.trim() : null,
      address: this.singUpForm.value.address
        ? this.singUpForm.value.address.trim().toUpperCase()
        : null,
      city: this.singUpForm.value.city
        ? this.singUpForm.value.city.trim().toUpperCase()
        : null,
      country: this.singUpForm.value.country,
      zipCode: this.singUpForm.value.zipCode ? this.singUpForm.value.zipCode.trim() : null,
      subscribe: this.singUpForm.value.subscribe,
    };

    console.log('userInfo', userInfo);
    this.authService.register(userInfo).subscribe(
      (response) => {
        console.log(response);
        this.isRegistrationSuccessful = true;
        this.message = response.message;
        this.isLoading = false;
      },
      (errRes) => {
        this.message = errRes;
        this.isLoading = false;
      }
    );
  }

  capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

  openAgreementDialog() {
    this.dialog.open(PaymentAgreementDialog, {
      autoFocus: false
    });
  }

  repeatPasswordValidator(group: FormGroup) {
    const password = group.controls.password.value;
    const passwordConfirmation = group.controls.confirmPassword.value;
    return password === passwordConfirmation ? null : { passwordsNotEqual: true }
  }
}
