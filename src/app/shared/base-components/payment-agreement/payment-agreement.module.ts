import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { PaymentAgreementDialog } from "./payment-agreement.dialog";



@NgModule({
  declarations: [
    PaymentAgreementDialog
  ],
  imports: [
    MatDialogModule
  ],
  providers: [],
  exports: [
    PaymentAgreementDialog,
    MatDialogModule
 ]
})
export class PaymentAgreementModule { }
