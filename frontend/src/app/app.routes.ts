import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'chatbot',
    loadChildren: () =>
      import('./features/chatbot/chatbot.routes').then((m) => m.CHATBOT_ROUTES),
    canActivate: [AuthGuard],
  },
  {
    path: 'explore',
    loadChildren: () =>
      import('./features/explore/explore.routes').then((m) => m.EXPLORE_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES
      ),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/home' },
];
