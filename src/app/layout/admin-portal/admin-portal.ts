import { Component, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../core/services/user.service';
import { BookingService, Booking } from '../../core/services/booking.service';
import { Router } from '@angular/router';
import { Alert } from '../../shared/alert/alert';

type Tab = 'users' | 'bookings';
type Role = 'admin' | 'owner' | 'user';

@Component({
  selector: 'app-admin-portal',
  imports: [CommonModule, FormsModule, Alert],
  templateUrl: './admin-portal.html',
  styleUrl: './admin-portal.css',
})
export class AdminPortal implements OnInit {
  private userService = inject(UserService);
  private bookingService = inject(BookingService);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  activeTab = signal<Tab>('users');
  users = signal<User[]>([]);
  bookings = signal<Booking[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  alertVisible = signal<boolean>(false);
  alertType = signal<'success' | 'error' | 'warning' | 'info'>('success');
  alertMsg = signal<string>('');

  showCreateForm = signal<boolean>(false);
  showEditForm = signal<boolean>(false);
  showDeleteConfirm = signal<boolean>(false);
  showDeleteBookingConfirm = signal<boolean>(false);
  userToEdit = signal<User | null>(null);
  userToDelete = signal<User | null>(null);
  bookingToDelete = signal<Booking | null>(null);
  isSubmitting = signal<boolean>(false);
  formName = '';
  formRole: Role = 'user';
  editFormName = '';
  editFormRole: Role = 'user';
  readonly roles: Role[] = ['admin', 'owner', 'user'];

  ngOnInit() {
    this.fetchUsers();
  }

  setTab(tab: Tab) {
    this.activeTab.set(tab);
    if (tab === 'users') {
      this.fetchUsers();
    } else if (tab === 'bookings') {
      this.fetchBookings();
    }
  }

  openCreateForm() {
    this.formName = '';
    this.formRole = 'user';
    this.showCreateForm.set(true);
  }

  closeCreateForm() {
    this.showCreateForm.set(false);
  }

  submitCreateUser() {
    if (!this.formName.trim()) return;
    this.isSubmitting.set(true);

    this.userService.createUser(this.formName.trim(), this.formRole).subscribe({
      next: (response) => {
        if (response.success) {
          this.alertMsg.set(`User "${response.data?.name ?? this.formName}" created successfully.`);
          this.alertType.set('success');
          this.alertVisible.set(true);
          this.closeCreateForm();
          this.fetchUsers();
        } else {
          this.alertMsg.set(response.message || 'Failed to create user.');
          this.alertType.set('error');
          this.alertVisible.set(true);
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        const msg = err.error?.message || 'An error occurred while creating the user.';
        this.alertMsg.set(msg);
        this.alertType.set('error');
        this.alertVisible.set(true);
        this.isSubmitting.set(false);
      }
    });
  }

  fetchUsers() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.userService.getUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users.set(response.data);
          this.alertMsg.set('User fetched successfully.');
          this.alertType.set('success');
          this.alertVisible.set(true);
        } else {
          this.errorMessage.set(response.message || 'Failed to fetch users');
          this.alertMsg.set(this.errorMessage() || 'Failed to fetch users');
          this.alertType.set('error');
          this.alertVisible.set(true);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        const msg = err.error?.message || 'An error occurred while connecting to the server.';
        this.errorMessage.set(msg);
        this.alertMsg.set(msg);
        this.alertType.set('error');
        this.alertVisible.set(true);
        this.isLoading.set(false);
      }
    });
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

  openEditForm(user: User) {
    this.userToEdit.set(user);
    this.editFormName = user.name;
    this.editFormRole = user.role.toLowerCase() as Role;
    this.showEditForm.set(true);
  }

  closeEditForm() {
    this.showEditForm.set(false);
    this.userToEdit.set(null);
  }

  submitEditUser() {
    const user = this.userToEdit();
    if (!user) return;
    this.isSubmitting.set(true);

    this.userService.updateUserRole(user.id, this.editFormRole).subscribe({
      next: (response) => {
        if (response.success) {
          this.alertMsg.set(`User "${user.name}" role updated to "${this.editFormRole}" successfully.`);
          this.alertType.set('success');
          this.alertVisible.set(true);
          this.closeEditForm();
          this.fetchUsers();
        } else {
          this.alertMsg.set(response.message || 'Failed to update user role.');
          this.alertType.set('error');
          this.alertVisible.set(true);
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        const msg = err.error?.message || 'An error occurred while updating the role.';
        this.alertMsg.set(msg);
        this.alertType.set('error');
        this.alertVisible.set(true);
        this.isSubmitting.set(false);
      }
    });
  }

  confirmDeleteUser(user: User) {
    this.userToDelete.set(user);
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm.set(false);
    this.userToDelete.set(null);
  }

  submitDeleteUser() {
    const user = this.userToDelete();
    if (!user) return;
    this.isSubmitting.set(true);

    this.userService.deleteUser(user.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.alertMsg.set(`User "${user.name}" deleted successfully.`);
          this.alertType.set('success');
          this.alertVisible.set(true);
          this.closeDeleteConfirm();
          this.fetchUsers();
        } else {
          this.alertMsg.set(response.message || 'Failed to delete user.');
          this.alertType.set('error');
          this.alertVisible.set(true);
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        const msg = err.error?.message || 'An error occurred while deleting the user.';
        this.alertMsg.set(msg);
        this.alertType.set('error');
        this.alertVisible.set(true);
        this.isSubmitting.set(false);
      }
    });
  }

  confirmDeleteBooking(booking: Booking) {
    this.bookingToDelete.set(booking);
    this.showDeleteBookingConfirm.set(true);
  }

  closeDeleteBookingConfirm() {
    this.showDeleteBookingConfirm.set(false);
    this.bookingToDelete.set(null);
  }

  submitDeleteBooking() {
    const booking = this.bookingToDelete();
    if (!booking) return;
    this.isSubmitting.set(true);

    this.bookingService.deleteBooking(booking.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.alertMsg.set(`Booking deleted successfully.`);
          this.alertType.set('success');
          this.alertVisible.set(true);
          this.closeDeleteBookingConfirm();
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

  goBack() {
    this.router.navigate(['/']);
  }
}
