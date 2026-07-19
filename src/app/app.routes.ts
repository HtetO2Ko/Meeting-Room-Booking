import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { AdminPortal } from './layout/admin-portal/admin-portal';
import { UserPortal } from './layout/user-portal/user-portal';
import { OwnerPortal } from './layout/owner-portal/owner-portal';

export const routes: Routes = [
  { path: '', component: MainLayout },
  { path: 'admin', component: AdminPortal },
  { path: 'owner', component: OwnerPortal },
  { path: 'user', component: UserPortal },
];
