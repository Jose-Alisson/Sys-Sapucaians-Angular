import { HomeAdminComponent } from './pages/admin/home-admin/home-admin.component';
import { environment } from './../environments/environment';

import { NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AboutComponent } from './pages/about/about.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CanMatchFn,
  Route,
  RouterModule,
  Routes,
  UrlSegment,
} from '@angular/router';
import { NgxMaskModule } from 'ngx-mask';
import { AccountComponent } from './account/account.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CartComponent } from './pages/cart/cart.component';
import { HomeComponent } from './pages/home/home.component';
import { ModalComponent } from './shared/comps/modal/modal.component';
import { PsAdminGuard } from './guards/ps-admin.guard';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { GoogleMapsModule } from '@angular/google-maps';
import { AuthHeaderInteceptor } from './shared/services/auth-header.interceptor';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ToastrModule } from 'ngx-toastr';
import { CompsSharedModule } from './shared/comps/comps-shared.module';
import { PaymentMyProductComponent } from './pages/payment-my-product/payment-my-product.component';
import { LoadAdmGuard } from './guards/load-adm.guard';
import { CartQueueComponent } from './pages/cart-queue/cart-queue.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'dash-board', pathMatch: 'full' },
  {
    path: 'dash-board',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: 'home', component: HomeComponent, },
      { path: 'menu', component: CartComponent },
      { path: 'about', component: AboutComponent },
      { path: 'cart-queue', component: CartQueueComponent },
      {
        path: 'adm',
        loadChildren: () => import('./pages/admin/admin.module').then((m) => m.AdminModule),
        canMatch: [() => inject(LoadAdmGuard).canActivate()],
      }
    ],
  },
  {
    path: 'checkout',
    component: PaymentMyProductComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    //CartComponent,
    AccountComponent,
    AboutComponent,
    SignInComponent,
    SignUpComponent,
    PaymentMyProductComponent,
    CartQueueComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    NgxMaskModule.forRoot(),
    ReactiveFormsModule,

    FormsModule,
    HttpClientModule,
    AngularFireAuthModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({ positionClass: 'toast-top-right' }),
    CompsSharedModule,
  ],
  exports: [HomeComponent],
  providers: [
    PsAdminGuard,
    LoadAdmGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInteceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
