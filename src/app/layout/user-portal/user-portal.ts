import { Component, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService, Booking } from '../../core/services/booking.service';
import { Alert } from '../../shared/alert/alert';

@Component({
  selector: 'app-user-portal',
  imports: [CommonModule, FormsModule, Alert],
  templateUrl: './user-portal.html',
  styleUrl: './user-portal.css',
})
export class UserPortal implements OnInit {
  private bookingService = inject(BookingService);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  bookings = signal<Booking[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  alertVisible = signal<boolean>(false);
  alertType = signal<'success' | 'error' | 'warning' | 'info'>('success');
  alertMsg = signal<string>('');

  showCreateForm = signal<boolean>(false);
  showDeleteConfirm = signal<boolean>(false);
  bookingToDelete = signal<Booking | null>(null);
  isSubmitting = signal<boolean>(false);
  formStartTime = '';
  formEndTime = '';

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.bookingService.getBookings().subscribe({
      next: (response) => {
        if (response.success) {
          this.bookings.set(response.data);
        } else {
          this.errorMessage.set(response.message || 'Failed to fetch bookings');
          this.alertMsg.set(this.errorMessage() || 'Failed to fetch bookings');
          this.alertType.set('error');
          this.alertVisible.set(true);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        const msg = err.error?.message || 'An error occurred while fetching bookings.';
        this.errorMessage.set(msg);
        this.alertMsg.set(msg);
        this.alertType.set('error');
        this.alertVisible.set(true);
        this.isLoading.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  openCreateForm() {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const twoHourLater = new Date(now.getTime() + 60 * 120 * 1000);
    this.formStartTime = this.toUtcDatetimeLocal(oneHourLater);
    this.formEndTime = this.toUtcDatetimeLocal(twoHourLater);
    this.showCreateForm.set(true);
  }

  private toUtcDatetimeLocal(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
  }

  closeCreateForm() {
    this.showCreateForm.set(false);
  }

  submitCreateBooking() {
    if (!this.formStartTime || !this.formEndTime) return;
    this.isSubmitting.set(true);

    const startUtc = `${this.formStartTime}:00Z`;
    const endUtc = `${this.formEndTime}:00Z`;

    this.bookingService.createBooking(startUtc, endUtc).subscribe({
      next: (response) => {
        if (response.success) {
          this.alertMsg.set('Booking created successfully.');
          this.alertType.set('success');
          this.alertVisible.set(true);
          this.closeCreateForm();
          this.fetchBookings();
        } else {
          this.alertMsg.set(response.message || 'Failed to create booking.');
          this.alertType.set('error');
          this.alertVisible.set(true);
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        const msg = err.error?.message || 'An error occurred while creating the booking.';
        this.alertMsg.set(msg);
        this.alertType.set('error');
        this.alertVisible.set(true);
        this.isSubmitting.set(false);
      }
    });
  }

  confirmDeleteBooking(booking: Booking) {
    this.bookingToDelete.set(booking);
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm.set(false);
    this.bookingToDelete.set(null);
  }

  submitDeleteBooking() {
    const booking = this.bookingToDelete();
    if (!booking) return;
    this.isSubmitting.set(true);

    this.bookingService.deleteBooking(booking.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.alertMsg.set('Booking deleted successfully.');
          this.alertType.set('success');
          this.alertVisible.set(true);
          this.closeDeleteConfirm();
          this.fetchBookings();
        } else {
          this.alertMsg.set(response.message || 'Failed to delete booking.');
          this.alertType.set('error');
          this.alertVisible.set(true);
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        const msg = err.error?.message || 'An error occurred while deleting the booking.';
        this.alertMsg.set(msg);
        this.alertType.set('error');
        this.alertVisible.set(true);
        this.isSubmitting.set(false);
      }
    });
  }
}
