import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/app-models/user';
import { AuthService } from 'src/app/services/auth.service';
import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/store/auth-store/auth.actions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-booking',
  templateUrl: './user-booking.component.html',
  styleUrls: ['./user-booking.component.css'],
})
export class UserBookingComponent implements OnInit {
  user: User;
  email: string;
  bookingId: number;
  booking: any = null;
  errorMessage: string;
  isLoading = false;
  passengerFare: number = 0;
  vehicleFare: number = 0;
  taxAndFees: number = 0;
  total: number = 0;
  urlEndpoint = environment.BASE_URL;

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store
      .select('auth')
      .subscribe((authState) => {
        this.user = authState.user;
        this.email = authState.bookingParams.email;
        this.bookingId = authState.bookingParams.bookingId;
        this.booking = authState.bookingsMap.get(this.bookingId);
        if (this.booking) this.calculatePrices();
      })
      .unsubscribe();

    if (!this.booking) {
      this.isLoading = true;
      this.authService
        .getUsersBooking(this.email, this.bookingId)
        .subscribe((response) => {
          this.booking = response;
          this.store.dispatch(
            new AuthActions.UpdateBookingsMap({
              number: this.bookingId,
              object: response,
            })
          );
          this.isLoading = false;
          this.calculatePrices();
        },
        error => {
          this.errorMessage = error;
          this.isLoading = false;
        });
    }
  }

  // Price calculation made by the example of Liknoss. May need to change.
  calculatePrices() {
    this.passengerFare =
      this.booking.trips.reduce(
        (previous, current) =>
          previous +
          current.passengers.reduce(
            (pre, cur) => pre + cur.passengerPrice.total,
            0
          ),
        0
      ) / 100;

    this.vehicleFare =
      this.booking.trips.reduce(
        (previous, current) =>
          previous +
          current.vehicles.reduce(
            (pre, cur) => pre + cur.vehiclePrice.total,
            0
          ),
        0
      ) / 100;

    // this.taxAndFees = this.booking.trips.reduce((previous, current) =>
    //   previous + current.passengers.reduce((pre, cur)=> pre + cur.passengerPrice.tax , 0) ,0) / 100;

    // this.taxAndFees = this.taxAndFees + this.booking.trips.reduce((previous, current) =>
    //   previous + current.vehicles.reduce((pre, cur)=> pre + cur.vehiclePrice.tax , 0) ,0) / 100;
    this.total = this.booking.totalPrice;
  }

  onRequestPdf(){
    const url = this.urlEndpoint + 'api/user/get-user-booking-pdf/' + this.bookingId;
    this.router.navigate([]).then(result => {  window.open(url, '_blank'); });
  }
}
