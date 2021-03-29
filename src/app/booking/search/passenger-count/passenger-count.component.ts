import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchForm } from 'src/app/models/app-models/search-form';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-passenger-count',
  templateUrl: './passenger-count.component.html',
  styleUrls: ['../search.component.css']
})
export class PassengerCountComponent implements OnInit {

  @Output() passengerOrVehicleSelectEvent = new EventEmitter();
  @Input() isSubmitted: boolean;
  @Input() searchForm: SearchForm;
  passengerCount: number = 1;
  vehicleCount: number = 0;
  passengerCountArray: number[] = Array.from({length: environment.MAX_PASSENGER_COUNT}, (v, k) => k+1);
  vehicleCountArray: number[] = [...Array(environment.MAX_VEHICLE_COUNT).keys()];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if(this.searchForm.routes.length){
      this.passengerCount = this.searchForm.passengerCount;
      this.vehicleCount = this.searchForm.vehicleCount;
    }
  }

  selected = () => this.passengerOrVehicleSelectEvent.emit({
    passengerCount: this.passengerCount,
    vehicleCount : this.vehicleCount
  });
}
