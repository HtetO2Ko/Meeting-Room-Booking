import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../env/environment';
import { AuthContextService } from './auth-context.service';

export interface Booking {
  id: number;
  userId: number;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface GroupedBooking {
  userId: number;
  userName?: string;
  bookings: Booking[];
}

export interface BookingSummary {
  userId: number;
  name: string;
  totalBookings: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: any;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private authCtx = inject(AuthContextService);
  private apiUrl = `${environment.baseUrl}api/booking`;

  private get headers() {
    return new HttpHeaders({ 'x-user-id': this.authCtx.userId().toString() });
  }

  getBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(this.apiUrl, { headers: this.headers });
  }

  createBooking(startTime: string, endTime: string): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(this.apiUrl, { startTime, endTime }, { headers: this.headers });
  }

  deleteBooking(id: number): Observable<ApiResponse<Booking[]>> {
    return this.http.delete<ApiResponse<Booking[]>>(`${this.apiUrl}/${id}`, {
      headers: this.headers,
    });
  }

  getBookingsGrouped(): Observable<ApiResponse<GroupedBooking[]>> {
    return this.http.get<ApiResponse<GroupedBooking[]>>(`${this.apiUrl}/grouped`, { headers: this.headers });
  }

  getBookingsSummary(): Observable<ApiResponse<BookingSummary[]>> {
    return this.http.get<ApiResponse<BookingSummary[]>>(`${this.apiUrl}/summary`, { headers: this.headers });
  }
}
