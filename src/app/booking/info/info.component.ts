import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Store } from '@ngrx/store';
import * as lodash from 'lodash';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { InformationForm } from 'src/app/models/app-models/information-form';
import { SearchForm } from 'src/app/models/app-models/search-form';
import { SelectedTrip } from 'src/app/models/app-models/selected-trip';
import { Country } from 'src/app/models/common/country';
import { BookingService } from 'src/app/services/booking.service';
import { BookingRequest } from 'src/app/models/requests/booking-request';
import * as fromApp from 'src/app/store/app.reducer';
import * as BookingActions from 'src/app/store/booking-store/booking.actions';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent, AlertData } from 'src/app/shared/base-components/alert/alert.component';
import { Countries } from 'src/app/models/app-models/countries';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'DD MMMM YYYY',
  },
};

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
  providers:  [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class InfoComponent implements OnInit {

  passengerCount: number;
  vehicleCount: number;
  tripsCount: number;
  searchForm: SearchForm;
  bookingRequest: BookingRequest;
  selectedTrips: SelectedTrip[];
  infoForm: FormGroup;
  countries: Country [] = new Countries().countries;
  startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 20));
  expirationStartDate = new Date(new Date().setFullYear(new Date().getFullYear() + 3));
  isTripToAbroad: boolean = false;
  isFormSubmitted: boolean = false;
  prices: number[];

  constructor(private bookingService: BookingService,
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    public alertDialog: MatDialog) { }

  ngOnInit() {
    this.store.select('bookingModel')
      .pipe(take(1), map(state=>{
        return {
          serachForm: state.searchPhaseModel.searchForm,
          bookingRequest: state.selectPhaseModel.pricingRequest,
          selectedTrips: state.selectPhaseModel.selectedTrips,
          prices: state.selectPhaseModel.prices
        }
      }))
      .subscribe(state=>{
        this.searchForm = state.serachForm;
        this.passengerCount = state.serachForm.passengerCount;
        this.vehicleCount = state.serachForm.vehicleCount;
        this.tripsCount = state.serachForm.routes.length;
        this.bookingRequest = state.bookingRequest;
        this.selectedTrips = state.selectedTrips;
        this.prices = state.prices;
      });
    for (let rout of this.searchForm.routes){
      if (this.bookingService.isTripToAbroad(rout.origin.idOrCode, rout.destination.idOrCode)){
        this.isTripToAbroad = true;
      }
    }
    this.infoForm = this.fb.group({
      contactPhoneNumber: this.fb.control(null, [Validators.required, Validators.minLength(7), Validators.maxLength(18)]),
      contactEmail: this.fb.control(null, [Validators.required, Validators.email]),
      subscribe: this.fb.control(null),
      passengers : this.fb.array([]),
      vehicles: this.fb.array([])
    });
    this.addPassengerAndVehiclesToForm();
  }

  onSubmit(){
    this.isFormSubmitted = true;
    if (this.infoForm.invalid) return;
    this.store.dispatch(new BookingActions.ResetBookingPhasesParams({
      isSelectEnabled: true,
      isInfoEnabled: true,
      isPaymentEnabled: false
    }))
    this.store.dispatch(new BookingActions.ResetBookingPhasesParams({
      isSelectEnabled: true,
      isInfoEnabled: true,
      isPaymentEnabled: false
    }));
    const informationForm: InformationForm = this.infoForm.value;
    console.log('Information Form', informationForm);
    console.log(this.bookingRequest, this.infoForm);
    // this.bookingRequest.addInformation(this.prices, informationForm);
    this.bookingRequest = lodash.cloneDeep(this.bookingRequest);
    this.bookingRequest.addInformation(this.prices, informationForm);
    console.log(this.bookingRequest);
    this.store.dispatch(new BookingActions.UpdateInfoPhaseModel({
      bookingRequest: this.bookingRequest,
      informationForm: informationForm
    }));
  }

  addPassengerAndVehiclesToForm() {
    const greece = this.countries.find(country=> country.idOrCode === 'GR')
    for(let i=0 ; i<this.passengerCount ; i++) {
      const passFormGroup: FormGroup = this.fb.group({
        firstName: this.fb.control(null, Validators.required),
        lastName: this.fb.control(null, Validators.required),
        nationality: this.fb.control(greece, Validators.required),
        birthDate: this.fb.control(null, Validators.required),
        nationalityInput: this.fb.control(null)
      });
      if(this.isTripToAbroad){
        passFormGroup.addControl('documentType', this.fb.control('Passport'));
        passFormGroup.addControl('documentNumber', this.fb.control(null, Validators.required));
        passFormGroup.addControl('documentExpirationDate', this.fb.control(null, Validators.required));
      }
      (<FormArray>this.infoForm.get('passengers')).push(passFormGroup);
    }
    for(let i=0 ; i<this.vehicleCount ; i++) {
      (<FormArray>this.infoForm.get('vehicles')).push(this.fb.group({
        plateNumber: this.fb.control(null, Validators.required)
      }));
    }
  }

  chosenDateHandler($event: number, passengerIndex:number, isPassenger: boolean){
    // console.log(passengerIndex, $event);
    const lastTripDate = new Date(this.searchForm.routes[this.searchForm.routes.length-1].date).getTime();
    if (!isPassenger){
      if ($event < lastTripDate){
        this.openAlert({title: 'Invalid Date',text: ['Document is expired on the trip date.']});
        (<FormArray>this.infoForm.get('passengers')).at(passengerIndex).patchValue({'documentExpirationDate': null});
      } else if ($event > 630720000000 +  lastTripDate) { // 20 years later
        this.openAlert({title: 'Invalid Date',text: ['Expiration date is too late. Please select 10 years later.']});
        (<FormArray>this.infoForm.get('passengers')).at(passengerIndex).patchValue({'documentExpirationDate': null});
      }
      return;
    }
    let minAge = 99;
    let maxAge = 0;
    for (let model of this.selectedTrips){
      if (minAge > model.passengers[passengerIndex].passengerType.minAge){
        minAge = model.passengers[passengerIndex].passengerType.minAge;
      }
      if (maxAge < model.passengers[passengerIndex].passengerType.maxAge){
        maxAge = model.passengers[passengerIndex].passengerType.maxAge;
      }
    }
    console.log('min age', minAge, 'max age', maxAge);
    const year =  lastTripDate - $event;
    console.log(year);
    if (year > 31536000000 * maxAge + environment.AGE_FLEXIBILITY){
      this.openAlert({title: 'Invalid Date',text: ['Passenger must be younger.']});
      (<FormArray>this.infoForm.get('passengers')).at(passengerIndex).patchValue({'birthDate': null});
    } else if (year < 31536000000 * minAge - environment.AGE_FLEXIBILITY) {
      this.openAlert({title: 'Invalid Date',text: ['Passenger must be older.']});
      (<FormArray>this.infoForm.get('passengers')).at(passengerIndex).patchValue({'birthDate': null});
    }
  }

  getPassengers(){
    return (<FormArray>this.infoForm.get('passengers')).controls;
  }

  getVehicles(){
    return (<FormArray>this.infoForm.get('vehicles')).controls;
  }

  isControlInvalid(controlName:string, arrayName:string, index: number): boolean {
    let control: AbstractControl;
    control = arrayName ?  (<FormArray>this.infoForm.get(arrayName)).at(index).get(controlName) : this.infoForm.get(controlName);
    return this.isFormSubmitted && control.invalid;
  }

  openAlert(alertData: AlertData) {
    this.alertDialog.open(AlertComponent, {
      width: '400px',
      data:  alertData
    });
  }
}
