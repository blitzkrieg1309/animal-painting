import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product/product-list/product-list.component';
import { CartViewComponent } from './cart/cart-view/cart-view.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { LoginComponent } from './login/login/login.component';
import { authGuard } from './auth.guard';
import { OrderStatusComponent } from './order/order-status/order-status.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './admin.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [authGuard],
  },
  { path: 'cart', component: CartViewComponent, canActivate: [authGuard] },
  {
    path: 'order-status',
    component: OrderStatusComponent,
    canActivate: [authGuard],
  },
  { path: 'regis', component: RegistrationFormComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [adminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
