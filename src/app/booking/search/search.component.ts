import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { Route, SearchForm } from 'src/app/models/app-models/search-form';
import { Location } from 'src/app/models/common/location';
import { BookingService } from 'src/app/services/booking.service';
import { DatabaseHandlerService } from 'src/app/services/database-handler.service';
import * as fromApp from 'src/app/store/app.reducer';
import * as BookingActions from 'src/app/store/booking-store/booking.actions';
import * as clone from 'clone';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {

  searchForm: SearchForm;
  isLoading = false;
  isSubmitted = false;
  origins: Location[] = [];
  errorMessage: string;

  constructor(
    private databaseHandlerService: DatabaseHandlerService,
    private bookingService: BookingService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store.select('bookingModel')
      .pipe(take(1), map(state=> state.searchPhaseModel.searchForm))
      .subscribe(searchForm => {
        if(searchForm.routes.length){
          this.searchForm = clone(searchForm);
          this.origins = [...this.bookingService.origins];
          this.isSubmitted = true;
        } else {
          this.searchForm = new SearchForm();
          this.searchForm.routes.push(new Route());
          this.searchForm.routes = [...Array(1).fill(new Route())];
          if (!this.bookingService.routeDictionary.length) {
            this.isLoading = true;
            this.databaseHandlerService.getLocations().subscribe(
              response => {
                this.bookingService.locations = response;
                this.bookingService.setRoutes().subscribe(origins=> this.origins = origins);
                this.isLoading = false;
              },
              error => {
                this.errorMessage = error;
                this.isLoading = false;
              }
            );
          } else {
            this.origins = this.bookingService.locations;
            console.log(this.origins);
          }
        }
      });
  }

  submit() {
    this.isSubmitted = true;
    if (!this.isFormValid()) return;
    this.store.dispatch(new BookingActions.ResetBookingPhasesParams({
      isSelectEnabled : false,
      isInfoEnabled: false,
      isPaymentEnabled: false
    }));
    this.isLoading = true;
    this.databaseHandlerService.postSearchRequest(this.searchForm).subscribe(
      searchResponse => {
        console.log(this.searchForm);
        this.isLoading = false;
        this.store.dispatch(new BookingActions.UpdateSearchPhaseModel({
          searchForm: clone(this.searchForm),
          searchResponse: clone(searchResponse)
        }));
      },
      errorRes => {
        this.isLoading = false;
        return this.errorMessage = errorRes}
    );
    this.bookingService.setRouteDateAlternatives(this.searchForm)
  }

  isFormValid(): boolean {
    let isFormValid = true;
    if ( this.searchForm.tripCount == 1 &&
        this.searchForm.routes[0].origin &&
        this.searchForm.routes[0].destination &&
        this.searchForm.routes[0].date &&
        this.searchForm.routes[1].date ){
      this.searchForm.routes[1].origin = this.searchForm.routes[0].destination;
      this.searchForm.routes[1].destination = this.searchForm.routes[0].origin;
    } else {
      this.searchForm.routes.forEach(
        (route) => (isFormValid = route.origin && route.destination && route.date ? true : false)
      );
    }
    return isFormValid;
  }

  changeTripCount = (kind: number) => {
    const diff = kind - this.searchForm.tripCount;
    for (let i = 0; i < Math.abs(diff); i++) {
      diff < 0
        ? this.searchForm.routes.pop()
        : this.searchForm.routes.push(new Route());
    }
    this.searchForm.tripCount = kind;
    this.isSubmitted = false;
    console.log('out');
    if (kind === 1 && this.searchForm.routes[0].origin && this.searchForm.routes[0].destination){
      console.log('in');
      this.searchForm.routes[1].origin =  this.searchForm.routes[0].destination;
      this.searchForm.routes[1].destination = this.searchForm.routes[0].origin;
      const code = this.searchForm.routes[0].destination.idOrCode + '-' + this.searchForm.routes[0].origin.idOrCode;
      this.bookingService.setRouteFrequencyDictionary(code);
    }
    this.searchForm = Object.assign({}, this.searchForm);
  };

  changeCounts = (counts) => {
    this.searchForm.passengerCount = counts.passengerCount;
    this.searchForm.vehicleCount = counts.vehicleCount;
  };

  changeRoutes(route) {
    this.searchForm.routes[route.index].origin = route.origin;
    this.searchForm.routes[route.index].destination = route.destination;
    if (this.searchForm.tripCount === 1){
      this.searchForm.routes[1].origin = route.destination;
      this.searchForm.routes[1].destination = route.origin;
    }
    this.searchForm = Object.assign({}, this.searchForm);
  }

  changeDates(route) {
    this.searchForm.routes[route.index].date = route.date;
    this.searchForm = Object.assign({}, this.searchForm);
  }
}
