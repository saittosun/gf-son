import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqComponent } from './faq.component';
import { RouterModule, Routes } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from 'src/app/shared/moduls/shared.module';

const routes: Routes = [
  { path: '', component: FaqComponent },
];

@NgModule({
  declarations: [
    FaqComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDividerModule,
    SharedModule
  ]
})
export class FaqModule { }


