import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderInteceptor } from 'src/app/shared/services/auth-header.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { ProductManagerComponent } from './product-manager/product-manager.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppModule } from 'src/app/app.module';
import { CompsSharedModule } from 'src/app/shared/comps/comps-shared.module';
import { ShoppingBoxComponent } from './shopping-box/shopping-box.component';
import { HomeComponent } from '../home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { ViewOrderComponent } from './view-order/view-order.component';

const admRoutes: Routes = [
  { path: '', redirectTo: 'product-manager', pathMatch: 'full' },
  {
    path: 'product-manager',
    component: ProductManagerComponent,
  },
  { path: 'order-list', component: OrdersListComponent,
    children: [
      { path: '', redirectTo: 'view-order', pathMatch: 'full'},
      { path: 'shopping-box', component: ShoppingBoxComponent, },
      { path: 'view-order', component: ViewOrderComponent }
    ],
  },
];

@NgModule({
  declarations: [
    ProductManagerComponent,
    HomeAdminComponent,
    ShoppingBoxComponent,
    OrdersListComponent,
    ViewOrderComponent,
  ],
  imports: [
    CommonModule,
    ToastrModule.forRoot({ positionClass: 'toast-top-right' }),
    NgxMaskModule.forRoot(),
    RouterModule.forChild(admRoutes),
    ReactiveFormsModule,
    CompsSharedModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInteceptor,
      multi: true,
    },
  ],
})
export class AdminModule {}
