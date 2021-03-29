import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Route, SearchForm } from 'src/app/models/app-models/search-form';
import { Location } from 'src/app/models/common/location';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['../search.component.css'],
})
export class RoutesComponent implements OnInit, OnChanges {
  @Output() routSelectEvent = new EventEmitter();
  @Input() searchForm: SearchForm;
  @Input() origins: Location[];
  destinations: Location[] = [];
  @Input() index: number;
  @Input() isSubmitted: boolean;
  origin: FormControl;
  destination: FormControl;
  originInput: string = '';
  destinationInput: string = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    let origin = null, destination = null;
    if (this.searchForm.routes.length && this.searchForm.routes[this.index].origin) {
      origin = this.origins.find(
        (or) =>
          or.idOrCode === this.searchForm.routes[this.index].origin.idOrCode
      );
      this.destinations = this.bookingService.getDestinationOptions(
        origin
      );
      destination = this.destinations.find(
        (des) =>
          des.idOrCode ===
          this.searchForm.routes[this.index].destination.idOrCode
      );
    }
    this.origin = new FormControl(origin, Validators.required);
    this.destination = new FormControl(destination, Validators.required);
  }

  destinationSelected() {
    const code = this.origin.value.idOrCode + '-' + this.destination.value.idOrCode;
    this.bookingService.setRouteFrequencyDictionary(code);
    if (this.searchForm.tripCount === 1) {
      const code = this.destination.value.idOrCode + '-' + this.origin.value.idOrCode;
      this.bookingService.setRouteFrequencyDictionary(code);
    }
    this.emitForm();
  }

  originSelected() {
    this.destination.setValue(null);
    this.destinations = this.bookingService.getDestinationOptions(this.origin.value);
    this.emitForm();
  }

  emitForm() {
    this.routSelectEvent.emit({
      origin: this.origin.value,
      destination: this.destination.value,
      index: this.index,
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.searchForm) return;
    const currentRoutes: Route[] = changes.searchForm.currentValue.routes;
    let previousRoutes: Route[];
    if (changes.searchForm.previousValue){
      previousRoutes = changes.searchForm.previousValue.routes;
    }
    if (
      this.index > 0 && previousRoutes &&
      currentRoutes[this.index - 1].destination &&
      !currentRoutes[this.index].origin
    ) {
      const org = this.origins.find(or => or.idOrCode === currentRoutes[this.index - 1].destination.idOrCode);
      this.origin.setValue(org);
      this.destinations = this.bookingService.getDestinationOptions(this.origin.value);
      this.destination.setValue(null);
    }
  }
}
