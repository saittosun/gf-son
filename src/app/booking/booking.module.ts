import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, Routes } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxStripeModule } from 'ngx-stripe';
import { SharedModule } from '../shared/moduls/shared.module';
import { AlertComponent } from '../shared/base-components/alert/alert.component';
import { BookingComponent } from './booking.component';
import { InfoComponent } from './info/info.component';
import { PaymentComponent } from './payment/payment.component';
import { StripeComponent } from './payment/stripe/stripe.component';
import { SearchModule } from './search/search.module';
import { AccommodationSelectComponent } from './select/passenger-select/accommodation-select/accommodation-select.component';
import { PassengerDiscountSelectComponent } from './select/passenger-select/passenger-discount-select/passenger-discount-select.component';
import { PassengerSelectComponent } from './select/passenger-select/passenger-select.component';
import { SelectComponent } from './select/select.component';
import { SelectedTripComponent } from './select/selected-trip/selected-trip.component';
import { VehicleSelectComponent } from './select/vehicle-select/vehicle-select.component';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  { path: '', component: BookingComponent },
];

@NgModule({
  declarations: [
    BookingComponent,
    SelectComponent,
    InfoComponent,
    SelectedTripComponent,
    PaymentComponent,
    VehicleSelectComponent,
    AccommodationSelectComponent,
    PassengerSelectComponent,
    PassengerDiscountSelectComponent,
    StripeComponent,
    AlertComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    SearchModule,
    NgxMatSelectSearchModule,
    NgxPayPalModule,
    NgxStripeModule.forRoot('pk_test_51I85NNAJV9TUrw8POSQFKdVfVIae8qQguHer5YzeJT5QXxiOJizepSNTr2GeiZ82FhNgG7y2xZcB8UQ2yeQF1u8j00jHRZvv6O'),
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule
  ],
  exports: []
})
export class BookingModule {}
