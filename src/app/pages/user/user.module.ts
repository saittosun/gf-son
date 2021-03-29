import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserBookingComponent } from './user-booking/user-booking.component';
import { AllBookingsComponent } from './all-bookings/all-bookings.component';
import { SettingsComponent } from './settings/settings.component';
import { SharedModule } from 'src/app/shared/moduls/shared.module';


@NgModule({
  declarations: [
    SettingsComponent,
    AllBookingsComponent,
    UserBookingComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
