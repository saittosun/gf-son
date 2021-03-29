import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchForm } from 'src/app/models/app-models/search-form';

@Component({
  selector: 'app-trip-count',
  templateUrl: './trip-count.component.html',
  styleUrls: ['../search.component.css'],
})
export class TripKindComponent implements OnInit {

  @Output() tripKindEvent = new EventEmitter<number>();
  @Input() isSubmitted: boolean;
  @Input() searchForm: SearchForm;
  tripCount: number = 0;

  constructor() { }

  ngOnInit(): void {
    if(this.searchForm.routes.length){
      this.tripCount = this.searchForm.tripCount;
    }
  }

  changeTripKind($event: { value: number; }) {
    this.tripKindEvent.emit($event.value);
  }

}
