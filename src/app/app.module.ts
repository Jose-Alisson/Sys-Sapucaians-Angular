import { FacebookLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AboutComponent } from './pages/about/about.component';

import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxMaskModule } from 'ngx-mask';
import { AccountComponent } from './account/account.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CartComponent } from './pages/cart/cart.component';
import { HomeComponent } from './pages/home/home.component';
import { ProdutoComponent } from './shared/comps/produto/produto.component';
import { EnderecoComponent } from './shared/comps/endereco/endereco.component';
import { ModalCartComponent } from './shared/comps/modal-cart/modal-cart.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, data: { title: 'Casa' } },
      { path: 'cart', component: CartComponent, data: { title: 'Carrinho' } },
      { path: 'about', component: AboutComponent, data: { title: 'Sobre' } },
    ],
  },
  {
    path: 'account',
    component: AccountComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    CartComponent,
    AccountComponent,
    AboutComponent,
    ProdutoComponent,
    EnderecoComponent,
    ModalCartComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    NgxMaskModule.forRoot(),
    SocialLoginModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('443125085585-pfalf6emtb6f25ev32p0vgptkjnuebjp.apps.googleusercontent.com'),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('524447543112076'),
          },
        ],
        onError: (err) => {
         console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
