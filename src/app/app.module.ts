import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DropdownDirective } from '../app/shared/dropdown.directive';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchModule } from './booking/search/search.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/moduls/shared.module';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { GetInTouchComponent } from './pages/get-in-touch/get-in-touch.component';
import { ForgetPasswordComponent } from './pages/login/forget-password/forget-password.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import * as fromApp from './store/app.reducer';
import { AuthEffects } from './store/auth-store/auth.effects';
import { BookingEffects } from './store/booking-store/booking.effects';
import { PaymentAgreementModule } from './shared/base-components/payment-agreement/payment-agreement.module';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AboutUsComponent,
    GetInTouchComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    DropdownDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    SearchModule,
    PaymentAgreementModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects, BookingEffects, ])

  ],
  exports: [
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
