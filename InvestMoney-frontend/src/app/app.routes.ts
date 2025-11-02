import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { publicGuard } from './guards/public-guard';

export const routes: Routes = [
  {
    path: '',
    title: 'MyPortfolio | Modern Investment Tracking',
    canActivate: [publicGuard],
  loadComponent: () => import('./landing/landing').then(c => c.LandingComponent),
  },
  {
    path: 'dashboard',
    title: 'Portfolio Dashboard',
    canActivate: [authGuard],
  loadComponent: () => import('./portfolio-dashboard/portfolio-dashboard').then(c => c.PortfolioDashboardComponent),
  },
  {
    path: 'add',
    title: 'Add New Stock',
    canActivate: [authGuard],
  loadComponent: () => import('./add-stock-form/add-stock-form').then(c => c.AddStockComponent),
  },
  {
    path: 'sell',
    title: 'Sell Stock',
    canActivate: [authGuard],
  loadComponent: () => import('./sell-stock/sell-stock').then(c => c.SellStockComponent),
  },
  {
    path: 'profile',
    title: 'My Profile',
    canActivate: [authGuard],
  loadComponent: () => import('./profile/profile').then(c => c.ProfileComponent),
  },
  {
    path: 'login',
    title: 'Login',
    canActivate: [publicGuard],
  loadComponent: () => import('./login/login').then(c => c.LoginComponent),
  },
  {
    path: 'forgot-password',
    title: 'Forgot Password',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./forgot-password/forgot-password').then(c => c.ForgotPasswordComponent),
  },
  {
    path: 'register',
    title: 'Register',
    canActivate: [publicGuard],
  loadComponent: () => import('./register/register').then(c => c.RegisterComponent),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];