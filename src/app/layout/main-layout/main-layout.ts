import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthContextService } from '../../core/services/auth-context.service';

export interface PortalRole {
  id: number;
  name: string;
  description: string;
  route: string;
}

@Component({
  selector: 'app-main-layout',
  imports: [],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {
  private router = inject(Router);
  private authCtx = inject(AuthContextService);

  portals: PortalRole[] = [
    {
      id: 1,
      name: 'Admin',
      description:
        'System account administration portal. Manage user profiles, create or delete accounts, modify system roles, and cancel any conflicting room reservation. Booking creation is restricted.',
      route: '/admin',
    },
    {
      id: 2,
      name: 'Owner',
      description:
        'Property analytics and scheduling operations dashboard. View comprehensive system schedules grouped by client matrices, track room usage metrics, and cancel any room reservation.',
      route: '/owner',
    },
    {
      id: 3,
      name: 'User',
      description:
        'Self-service reservation workspace. View the master booking schedule list, select your target start and end date-times, create new reservations, and cancel your own entries.',
      route: '/user',
    },
  ];

  ngOnInit() {
    this.authCtx.setUserId(0);
  }

  navigateTo(portal: PortalRole) {
    this.authCtx.setUserId(portal.id);
    this.router.navigate([portal.route]);
  }
}
