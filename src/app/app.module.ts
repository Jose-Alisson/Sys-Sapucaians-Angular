import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, data: { title: 'Casa' }, },
      { path: 'cart', component: CartComponent, data: { title: 'Carrinho' }}
    ],
  },
];

@NgModule({
  declarations: [AppComponent, DashboardComponent, HomeComponent, CartComponent],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes, { useHash: true })],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
