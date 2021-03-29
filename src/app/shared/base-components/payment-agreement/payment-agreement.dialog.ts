import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-agreement',
  templateUrl: './payment-agreement.dialog.html',
  styleUrls: ['./payment-agreement.dialog.css']
})
export class PaymentAgreementDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<PaymentAgreementDialog>) {}

  ngOnInit(): void {
  }
  close = () => this.dialogRef.close();
}
