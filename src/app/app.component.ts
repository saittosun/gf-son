import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as AuthActions from 'src/app/store/auth-store/auth.actions';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  title = 'GreeceFerries';

  constructor(private store: Store,    public dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(new AuthActions.AutoLogin());
  }

}
