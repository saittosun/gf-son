import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { AllBookingsComponent } from './all-bookings/all-bookings.component';
import { SettingsComponent } from './settings/settings.component';
import { UserBookingComponent } from './user-booking/user-booking.component';

const routes: Routes = [
  { path: '',  canActivate: [AuthGuard], children: [
    { path: 'settings', component: SettingsComponent },
    { path: 'all-bookings', component: AllBookingsComponent },
    { path: 'booking', component: UserBookingComponent },
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
