import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { LoadingSpinnerComponent } from '../base-components/loading-spinner/loading-spinner.component';
import { PaymentAgreementDialog } from '../base-components/payment-agreement/payment-agreement.dialog';
import { LocationPipe } from '../pipes/location.pipe';


@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    LocationPipe,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  exports: [
    LoadingSpinnerComponent,
    LocationPipe,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
 ]
})
export class SharedModule { }
