import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from 'src/app/shared/moduls/shared.module';
import { PassengerCountComponent } from './passenger-count/passenger-count.component';
import { RoutesComponent } from './routes-component/routes.component';
import { SearchComponent } from './search.component';
import { TripKindComponent } from './trip-count/trip-count.component';
import { TripDateComponent } from './trip-date/trip-date.component';


@NgModule({
  declarations: [
    SearchComponent,
    RoutesComponent,
    TripKindComponent,
    PassengerCountComponent,
    TripDateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatNativeDateModule,
    MatRadioModule,
    MatDatepickerModule,
  ],
  exports: [
    SearchComponent,
    RoutesComponent,
    TripKindComponent,
    PassengerCountComponent,
    TripDateComponent,
  ]
})
export class SearchModule { }
